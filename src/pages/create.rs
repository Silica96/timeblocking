use crate::models::*;
use leptos::*;
use leptos_router::*;

#[component]
pub fn CreatePollPage() -> impl IntoView {
    let (title, set_title) = create_signal(String::new());
    let (description, set_description) = create_signal(String::new());
    let (start_date, set_start_date) = create_signal(String::new());
    let (end_date, set_end_date) = create_signal(String::new());
    let (vote_type, set_vote_type) = create_signal(VoteType::Available);
    let (error, set_error) = create_signal(None::<String>);
    let (creating, set_creating) = create_signal(false);

    let navigate = use_navigate();

    let day_count = move || {
        if start_date.get().is_empty() || end_date.get().is_empty() {
            return 0;
        }

        let start = start_date.get().parse::<chrono::NaiveDate>();
        let end = end_date.get().parse::<chrono::NaiveDate>();

        if let (Ok(start), Ok(end)) = (start, end) {
            (end - start).num_days() + 1
        } else {
            0
        }
    };

    let on_submit = move |ev: leptos::ev::SubmitEvent| {
        ev.prevent_default();
        set_error.set(None);

        let title_val = title.get();
        let desc_val = description.get();
        let start_val = start_date.get();
        let end_val = end_date.get();
        let vote_type_val = vote_type.get();

        // Validation
        if title_val.trim().is_empty() {
            set_error.set(Some("제목을 입력해주세요".to_string()));
            return;
        }

        if start_val.is_empty() || end_val.is_empty() {
            set_error.set(Some("날짜를 선택해주세요".to_string()));
            return;
        }

        set_creating.set(true);
        let navigate = navigate.clone();

        spawn_local(async move {
            let request = CreatePollRequest {
                title: title_val,
                description: if desc_val.is_empty() {
                    None
                } else {
                    Some(desc_val)
                },
                start_date: format!("{}T00:00:00Z", start_val)
                    .parse()
                    .unwrap(),
                end_date: format!("{}T00:00:00Z", end_val)
                    .parse()
                    .unwrap(),
                vote_type: vote_type_val,
            };

            match create_poll_request(request).await {
                Ok(response) => {
                    navigate(&format!("/poll/{}", response.poll_id), Default::default());
                }
                Err(e) => {
                    set_error.set(Some(format!("투표 생성 실패: {}", e)));
                    set_creating.set(false);
                }
            }
        });
    };

    view! {
        <div class="container mx-auto px-4 py-16 max-w-2xl">
            <h1 class="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                "새 투표 만들기"
            </h1>

            <form on:submit=on_submit class="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
                <div class="mb-6">
                    <label class="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                        "제목 *"
                    </label>
                    <input
                        type="text"
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="예: 팀 회식 날짜 투표"
                        prop:value=title
                        on:input=move |ev| set_title.set(event_target_value(&ev))
                    />
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                        "설명 (선택사항)"
                    </label>
                    <textarea
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows="3"
                        placeholder="투표에 대한 추가 설명"
                        prop:value=description
                        on:input=move |ev| set_description.set(event_target_value(&ev))
                    />
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                        "투표 유형 *"
                    </label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="vote_type"
                                value="available"
                                checked=move || vote_type.get() == VoteType::Available
                                on:change=move |_| set_vote_type.set(VoteType::Available)
                                class="w-4 h-4 text-blue-600"
                            />
                            <span class="text-gray-700 dark:text-gray-300">"되는 날짜 선택"</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="vote_type"
                                value="unavailable"
                                checked=move || vote_type.get() == VoteType::Unavailable
                                on:change=move |_| set_vote_type.set(VoteType::Unavailable)
                                class="w-4 h-4 text-blue-600"
                            />
                            <span class="text-gray-700 dark:text-gray-300">"안되는 날짜 선택"</span>
                        </label>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {move || match vote_type.get() {
                            VoteType::Available => "참여자들이 가능한 날짜를 선택합니다",
                            VoteType::Unavailable => "참여자들이 불가능한 날짜를 선택합니다",
                        }}
                    </p>
                </div>

                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                            "시작 날짜 *"
                        </label>
                        <input
                            type="date"
                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            prop:value=start_date
                            on:input=move |ev| set_start_date.set(event_target_value(&ev))
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                            "종료 날짜 *"
                        </label>
                        <input
                            type="date"
                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            prop:value=end_date
                            on:input=move |ev| set_end_date.set(event_target_value(&ev))
                        />
                    </div>
                </div>

                {move || {
                    let count = day_count();
                    if count > 0 {
                        view! {
                            <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p class="text-sm text-blue-800 dark:text-blue-300">
                                    "📅 총 " {count} "일의 날짜가 생성됩니다"
                                </p>
                                {move || {
                                    if count > 31 {
                                        view! {
                                            <p class="text-sm text-yellow-700 dark:text-yellow-400 mt-2">
                                                "⚠️ 날짜가 많으면 달력이 길어질 수 있습니다"
                                            </p>
                                        }.into_view()
                                    } else {
                                        view! { <></> }.into_view()
                                    }
                                }}
                            </div>
                        }.into_view()
                    } else {
                        view! { <></> }.into_view()
                    }
                }}

                {move || error.get().map(|err| view! {
                    <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p class="text-sm text-red-800 dark:text-red-300">{err}</p>
                    </div>
                })}

                <button
                    type="submit"
                    disabled=creating
                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
                >
                    {move || if creating.get() { "생성 중..." } else { "투표 만들기" }}
                </button>
            </form>
        </div>
    }
}

#[cfg(feature = "ssr")]
async fn create_poll_request(
    request: CreatePollRequest,
) -> Result<CreatePollResponse, String> {
    use crate::db;

    let pool = expect_context::<sqlx::PgPool>();

    let poll_id = db::create_poll(
        &pool,
        request.title,
        request.description,
        request.start_date,
        request.end_date,
        request.vote_type,
    )
    .await
    .map_err(|e| format!("Database error: {}", e))?;

    Ok(CreatePollResponse { poll_id })
}

#[cfg(not(feature = "ssr"))]
async fn create_poll_request(
    request: CreatePollRequest,
) -> Result<CreatePollResponse, String> {
    use gloo_net::http::Request;

    let response = Request::post("/api/polls")
        .json(&request)
        .map_err(|e| format!("Failed to serialize request: {}", e))?
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if !response.ok() {
        return Err(format!("Server error: {}", response.status()));
    }

    response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))
}
