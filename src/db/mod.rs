#[cfg(feature = "ssr")]
pub mod polls;

#[cfg(feature = "ssr")]
pub use polls::*;

#[cfg(feature = "ssr")]
use sqlx::PgPool;

#[cfg(feature = "ssr")]
pub async fn create_pool() -> Result<PgPool, sqlx::Error> {
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    PgPool::connect(&database_url).await
}
