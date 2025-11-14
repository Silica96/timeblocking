pub mod app;
pub mod models;

#[cfg(feature = "ssr")]
pub mod api;
#[cfg(feature = "ssr")]
pub mod db;

mod components;
mod pages;

#[cfg(feature = "hydrate")]
#[wasm_bindgen::prelude::wasm_bindgen]
pub fn hydrate() {
    use app::*;

    console_error_panic_hook::set_once();

    leptos::mount_to_body(App);
}
