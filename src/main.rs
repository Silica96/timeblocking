#[cfg(feature = "ssr")]
#[tokio::main]
async fn main() {
    use axum::{routing::{get, post}, Router};
    use leptos::*;
    use leptos_axum::{generate_route_list_with_ssg, LeptosRoutes};
    use timeblocking::app::*;
    use timeblocking::api;
    use timeblocking::db;
    use tower_http::services::ServeDir;

    // Load environment variables
    dotenvy::dotenv().ok();

    // Set up tracing
    tracing_subscriber::fmt::init();

    // Create database pool
    let pool = db::create_pool()
        .await
        .expect("Failed to create database pool");

    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    // Leptos configuration
    let conf = get_configuration(None).await.unwrap();
    let leptos_options = conf.leptos_options;
    let addr = leptos_options.site_addr;
    let (routes, _static_data_map) = generate_route_list_with_ssg(App);

    // Build application router with context
    let app = Router::new()
        // API routes
        .route("/api/polls", post(api::create_poll))
        .route("/api/polls/:id", get(api::get_poll))
        .route("/api/polls/:id/vote", post(api::submit_vote))
        // Static assets
        .nest_service("/pkg", ServeDir::new("target/site/pkg"))
        .leptos_routes_with_context(
            &leptos_options,
            routes,
            move || provide_context(pool.clone()),
            || view! { <App/> }
        )
        .with_state(leptos_options);

    tracing::info!("listening on http://{}", &addr);

    // Serve the application
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}

#[cfg(not(feature = "ssr"))]
pub fn main() {
    // This is required when building for the browser
}
