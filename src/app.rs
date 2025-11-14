use leptos::*;
use leptos_meta::*;
use leptos_router::*;

mod pages;
use pages::*;

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    view! {
        <Stylesheet id="leptos" href="/pkg/timeblocking.css"/>
        <Title text="Timeblocking - 날짜 투표"/>
        <Meta name="description" content="그룹 일정 조율을 위한 날짜 투표 서비스"/>

        <Router>
            <main class="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Routes>
                    <Route path="/" view=HomePage/>
                    <Route path="/create" view=CreatePollPage/>
                    <Route path="/poll/:id" view=PollPage/>
                    <Route path="/*any" view=NotFound/>
                </Routes>
            </main>
        </Router>
    }
}

#[component]
fn NotFound() -> impl IntoView {
    view! {
        <div class="container mx-auto px-4 py-16 text-center">
            <h1 class="text-4xl font-bold mb-4">"404 - 페이지를 찾을 수 없습니다"</h1>
            <p class="text-gray-600 mb-8">"요청하신 페이지가 존재하지 않습니다."</p>
            <a href="/" class="text-blue-600 hover:underline">"홈으로 돌아가기"</a>
        </div>
    }
}
