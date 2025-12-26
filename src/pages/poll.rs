use crate::components::CalendarGrid;
use crate::models::*;
use leptos::*;
use leptos_router::*;
use uuid::Uuid;

const MEDAL_EMOJIS: [&str; 3] = ["🥇", "🥈", "🥉"];

#[component]
pub fn PollPage() -> impl IntoView {
    let params = use_params_map();
    let poll_id = move || {
        params
            .with(|p| p.get("id").and_then(|id| id.parse::<Uuid>().ok()))
    };

    let (poll_data, set_poll_data) = create_signal(None::<PollWithResults>);
    let (loading, set_loading) = create_signal(true);
    let (error, set_error) = create_signal(None::<String>);

    let (selected_dates, set_selected_dates) = create_signal(Vec::<Uuid>::new());
    let (participant_name, set_participant_name) = create_signal(String::new());
    let (submitting, set_submitting) = create_signal(false);
    let (submit_error, set_submit_error) = create_signal(None::<String>);
    let (submit_success, set_submit_success) = create_signal(false);

    // Load poll data
    create_effect(move |_| {
        if let Some(id) = poll_id() {
            spawn_local(async move {
                set_loading.set(true);
                match fetch_poll(id).await {
                    Ok(data) => {
                        set_poll_data.set(Some(data));
                        set_loading.set(false);
                    }
                    Err(e) => {
                        set_error.set(Some(e));
                        set_loading.set(false);
                    }
                }
            });
        }
    });

    let toggle_date = move |date_id: Uuid| {
        set_submit_success.set(false);
        set_submit_error.set(None);

        set_selected_dates.update(|dates| {
            if let Some(pos) = dates.iter().position(|&id| id == date_id) {
                dates.remove(pos);
            } else {
                dates.push(date_id);
            }
        });
    };

    let on_submit = move |ev: leptos::ev::SubmitEvent| {
        ev.prevent_default();
        set_submit_error.set(None);
        set_submit_success.set(false);

        if selected_dates.get().is_empty() {
            set_submit_error.set(Some("최소 1개의 날짜를 선택해주세요".to_string()));
            return;
        }

        let Some(id) = poll_id() else {
            return;
        };

        set_submitting.set(true);

        let request = SubmitVoteRequest {
            participant_name: if participant_name.get().is_empty() {
                None
            } else {
                Some(participant_name.get())
            },
            selected_date_ids: selected_dates.get(),
        };

        spawn_local(async move {
            match submit_vote(id, request).await {
                Ok(_) => {
                    set_submit_success.set(true);
                    set_submitting.set(false);

                    // Reload poll data
                    if let Ok(data) = fetch_poll(id).await {
                        set_poll_data.set(Some(data));
                    }
                }
                Err(e) => {
                    set_submit_error.set(Some(e));
                    set_submitting.set(false);
                }
            }
        });
    };

    let max_votes = move || {
        poll_data
            .get()
            .map(|p| {
                p.results
                    .iter()
                    .map(|r| r.vote_count)
                    .max()
                    .unwrap_or(0)
            })
            .unwrap_or(0)
    };

    let top_dates = move || {
        poll_data.get().map(|p| {
            let mut sorted = p.results.clone();
            sorted.sort_by(|a, b| b.vote_count.cmp(&a.vote_count));
            sorted
                .into_iter()
                .take(3)
                .filter(|r| r.vote_count > 0)
                .collect::<Vec<_>>()
        })
    };

    view! {
        <div class="container mx-auto px-4 py-8 max-w-6xl">
            {move || {
                if loading.get() {
                    view! {
                        <div class="text-center py-16">
                            <p class="text-xl text-gray-600">"로딩 중..."</p>
                        </div>
                    }.into_view()
                } else if let Some(err) = error.get() {
                    view! {
                        <div class="text-center py-16">
                            <p class="text-xl text-red-600">"오류: " {err}</p>
                        </div>
                    }.into_view()
                } else if let Some(poll) = poll_data.get() {
                    view! {
                        <div>
                            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
                                <div class="flex items-center gap-3 mb-2">
                                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                                        {poll.poll.title.clone()}
                                    </h1>
                                    <span class={format!(
                                        "px-3 py-1 rounded-full text-sm font-medium {}",
                                        match poll.poll.vote_type {
                                            VoteType::Available => "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                                            VoteType::Unavailable => "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                                        }
                                    )}>
                                        {match poll.poll.vote_type {
                                            VoteType::Available => "되는 날짜",
                                            VoteType::Unavailable => "안되는 날짜",
                                        }}
                                    </span>
                                </div>
                                {poll.poll.description.as_ref().map(|desc| view! {
                                    <p class="text-gray-600 dark:text-gray-400">{desc}</p>
                                })}
                                <p class="text-sm text-gray-500 mt-2">
                                    {format!(
                                        "{} ~ {}",
                                        poll.poll.start_date.format("%Y년 %m월 %d일"),
                                        poll.poll.end_date.format("%Y년 %m월 %d일")
                                    )}
                                </p>
                            </div>

                            {move || {
                                let vote_type = poll_data.get().map(|p| p.poll.vote_type).unwrap_or_default();
                                top_dates().and_then(|dates| {
                                if dates.is_empty() {
                                    None
                                } else {
                                    Some(view! {
                                        <div class={format!(
                                            "rounded-lg p-6 shadow-md mb-8 {}",
                                            match vote_type {
                                                VoteType::Available => "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
                                                VoteType::Unavailable => "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
                                            }
                                        )}>
                                            <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                                {match vote_type {
                                                    VoteType::Available => "🏆 인기 날짜 Top 3",
                                                    VoteType::Unavailable => "⚠️ 가장 많이 안되는 날짜 Top 3",
                                                }}
                                            </h2>
                                            <div class="space-y-2">
                                                {dates.into_iter().enumerate().map(|(idx, result)| {
                                                    let medal = MEDAL_EMOJIS.get(idx).unwrap_or(&"");
                                                    view! {
                                                        <div class="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                                                            <div class="flex items-center gap-3">
                                                                <span class="text-2xl">{*medal}</span>
                                                                <span class="font-medium text-gray-900 dark:text-white">
                                                                    {result.date.format("%Y년 %m월 %d일 (%a)").to_string()}
                                                                </span>
                                                            </div>
                                                            <span class="text-lg font-bold text-blue-600">
                                                                {result.vote_count} "표"
                                                            </span>
                                                        </div>
                                                    }
                                                }).collect::<Vec<_>>()}
                                            </div>
                                        </div>
                                    })
                                }
                            })}}

                            <form on:submit=on_submit>
                                <div class="mb-6">
                                    <label class="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                                        "이름 (선택사항)"
                                    </label>
                                    <input
                                        type="text"
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="본인의 이름을 입력하세요"
                                        prop:value=participant_name
                                        on:input=move |ev| set_participant_name.set(event_target_value(&ev))
                                    />
                                </div>

                                <div class="mb-6">
                                    <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                        {match poll.poll.vote_type {
                                            VoteType::Available => "가능한 날짜를 선택하세요",
                                            VoteType::Unavailable => "불가능한 날짜를 선택하세요",
                                        }}
                                    </h2>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {match poll.poll.vote_type {
                                            VoteType::Available => "클릭하여 가능한 날짜를 선택하세요. 진한 녹색은 많은 사람이 가능한 날짜입니다.",
                                            VoteType::Unavailable => "클릭하여 불가능한 날짜를 선택하세요. 진한 녹색은 많은 사람이 불가능한 날짜입니다.",
                                        }}
                                    </p>

                                    <CalendarGrid
                                        date_options=poll.results.clone()
                                        selected_dates=selected_dates
                                        on_toggle=toggle_date
                                        max_votes=max_votes()
                                    />
                                </div>

                                <div class="mb-6">
                                    <p class="text-sm text-gray-600 dark:text-gray-400">
                                        "선택된 날짜: "
                                        <span class="font-bold text-blue-600">
                                            {move || selected_dates.get().len()} "개"
                                        </span>
                                    </p>
                                </div>

                                {move || submit_error.get().map(|err| view! {
                                    <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <p class="text-sm text-red-800 dark:text-red-300">{err}</p>
                                    </div>
                                })}

                                {move || {
                                    if submit_success.get() {
                                        view! {
                                            <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <p class="text-sm text-green-800 dark:text-green-300">
                                                    "✅ 투표가 성공적으로 제출되었습니다!"
                                                </p>
                                            </div>
                                        }.into_view()
                                    } else {
                                        view! { <></> }.into_view()
                                    }
                                }}

                                <button
                                    type="submit"
                                    disabled=submitting
                                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
                                >
                                    {move || if submitting.get() { "제출 중..." } else { "투표하기" }}
                                </button>
                            </form>
                        </div>
                    }.into_view()
                } else {
                    view! { <></> }.into_view()
                }
            }}
        </div>
    }
}

#[cfg(feature = "ssr")]
async fn fetch_poll(poll_id: Uuid) -> Result<PollWithResults, String> {
    use crate::db;

    let pool = expect_context::<sqlx::PgPool>();

    db::get_poll_with_results(&pool, poll_id)
        .await
        .map_err(|e| format!("Database error: {}", e))
}

#[cfg(not(feature = "ssr"))]
async fn fetch_poll(poll_id: Uuid) -> Result<PollWithResults, String> {
    use gloo_net::http::Request;

    let response = Request::get(&format!("/api/polls/{}", poll_id))
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

#[cfg(feature = "ssr")]
async fn submit_vote(poll_id: Uuid, request: SubmitVoteRequest) -> Result<SubmitVoteResponse, String> {
    use crate::db;

    let pool = expect_context::<sqlx::PgPool>();

    let participant_id = db::submit_vote(
        &pool,
        poll_id,
        request.participant_name,
        None,
        request.selected_date_ids,
    )
    .await
    .map_err(|e| format!("Database error: {}", e))?;

    Ok(SubmitVoteResponse { participant_id })
}

#[cfg(not(feature = "ssr"))]
async fn submit_vote(poll_id: Uuid, request: SubmitVoteRequest) -> Result<SubmitVoteResponse, String> {
    use gloo_net::http::Request;

    let response = Request::post(&format!("/api/polls/{}/vote", poll_id))
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
