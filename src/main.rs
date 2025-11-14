#[cfg(feature = "ssr")]
#[tokio::main]
async fn main() {
    use axum::{
        routing::{get, post},
        Router,
    };
    use leptos::*;
    use leptos_axum::{generate_route_list, LeptosRoutes};
    use timeblocking::app::*;
    use timeblocking::{api, db};
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
    let routes = generate_route_list(App);

    // Build app
    let app = Router::new()
        // API routes
        .route("/api/polls", post(api::create_poll))
        .route("/api/polls/:id", get(api::get_poll))
        .route("/api/polls/:id/vote", post(api::submit_vote))
        // Leptos routes
        .leptos_routes(&leptos_options, routes, App)
        .fallback(leptos_axum::file_and_error_handler(App))
        // Static files
        .nest_service("/pkg", ServeDir::new("./target/site/pkg"))
        .with_state(pool);

    tracing::info!("listening on http://{}", &addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}

#[cfg(not(feature = "ssr"))]
pub fn main() {
    // This is required when building for the browser
}
