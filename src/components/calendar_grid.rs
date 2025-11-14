use crate::models::DateOptionWithVotes;
use chrono::{Datelike, NaiveDate};
use leptos::*;
use std::collections::HashMap;
use uuid::Uuid;

const DAY_NAMES: [&str; 7] = ["일", "월", "화", "수", "목", "금", "토"];
const MONTH_NAMES: [&str; 12] = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
];

#[component]
pub fn CalendarGrid(
    date_options: Vec<DateOptionWithVotes>,
    selected_dates: ReadSignal<Vec<Uuid>>,
    on_toggle: impl Fn(Uuid) + 'static + Clone,
    max_votes: i64,
) -> impl IntoView {
    let months = group_by_month(&date_options);

    view! {
        <div class="space-y-8">
            {months.into_iter().map(|(year, month, dates)| {
                let on_toggle = on_toggle.clone();
                view! {
                    <MonthCalendar
                        year=year
                        month=month
                        dates=dates
                        selected_dates=selected_dates
                        on_toggle=on_toggle
                        max_votes=max_votes
                    />
                }
            }).collect::<Vec<_>>()}
        </div>
    }
}

#[component]
fn MonthCalendar(
    year: i32,
    month: u32,
    dates: Vec<DateOptionWithVotes>,
    selected_dates: ReadSignal<Vec<Uuid>>,
    on_toggle: impl Fn(Uuid) + 'static + Clone,
    max_votes: i64,
) -> impl IntoView {
    // Create hashmap for quick lookup
    let dates_map: HashMap<NaiveDate, &DateOptionWithVotes> = dates
        .iter()
        .map(|d| {
            let date = d.date.naive_utc().date();
            (date, d)
        })
        .collect();

    // Get first day of month
    let first_day = NaiveDate::from_ymd_opt(year, month, 1).unwrap();
    let first_weekday = first_day.weekday().num_days_from_sunday() as usize;

    // Get days in month
    let days_in_month = if month == 12 {
        NaiveDate::from_ymd_opt(year + 1, 1, 1).unwrap()
    } else {
        NaiveDate::from_ymd_opt(year, month + 1, 1).unwrap()
    }
    .signed_duration_since(first_day)
    .num_days() as u32;

    let mut calendar_days: Vec<Option<(u32, Option<&DateOptionWithVotes>)>> = vec![];

    // Add empty cells for days before month starts
    for _ in 0..first_weekday {
        calendar_days.push(None);
    }

    // Add days of month
    for day in 1..=days_in_month {
        let date = NaiveDate::from_ymd_opt(year, month, day).unwrap();
        let date_option = dates_map.get(&date).copied();
        calendar_days.push(Some((day, date_option)));
    }

    view! {
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {format!("{} {}", year, MONTH_NAMES[month as usize - 1])}
            </h3>

            <div class="grid grid-cols-7 gap-2">
                // Day headers
                {DAY_NAMES.iter().enumerate().map(|(i, day)| {
                    let is_sunday = i == 0;
                    let is_saturday = i == 6;
                    let color = if is_sunday {
                        "text-red-600 dark:text-red-400"
                    } else if is_saturday {
                        "text-blue-600 dark:text-blue-400"
                    } else {
                        "text-gray-700 dark:text-gray-300"
                    };

                    view! {
                        <div class=format!("text-center font-bold text-sm {}", color)>
                            {*day}
                        </div>
                    }
                }).collect::<Vec<_>>()}

                // Calendar days
                {calendar_days.into_iter().enumerate().map(|(idx, cell)| {
                    let weekday = idx % 7;
                    let on_toggle = on_toggle.clone();

                    match cell {
                        None => view! {
                            <div class="aspect-square"></div>
                        }.into_view(),
                        Some((day, None)) => view! {
                            <div class="aspect-square p-2 text-center text-gray-400">
                                {day}
                            </div>
                        }.into_view(),
                        Some((day, Some(date_option))) => {
                            let date_id = date_option.id;
                            let vote_count = date_option.vote_count;
                            let heatmap_class = get_heatmap_color(vote_count, max_votes);

                            view! {
                                <DayCell
                                    day=day
                                    date_id=date_id
                                    vote_count=vote_count
                                    heatmap_class=heatmap_class
                                    weekday=weekday
                                    selected_dates=selected_dates
                                    on_toggle=on_toggle
                                />
                            }.into_view()
                        }
                    }
                }).collect::<Vec<_>>()}
            </div>
        </div>
    }
}

#[component]
fn DayCell(
    day: u32,
    date_id: Uuid,
    vote_count: i64,
    heatmap_class: &'static str,
    weekday: usize,
    selected_dates: ReadSignal<Vec<Uuid>>,
    on_toggle: impl Fn(Uuid) + 'static,
) -> impl IntoView {
    let is_selected = move || selected_dates.get().contains(&date_id);

    let is_sunday = weekday == 0;
    let is_saturday = weekday == 6;

    let text_color = if is_sunday {
        "text-red-600 dark:text-red-400"
    } else if is_saturday {
        "text-blue-600 dark:text-blue-400"
    } else {
        "text-gray-700 dark:text-gray-300"
    };

    view! {
        <button
            type="button"
            class=move || {
                let base = "aspect-square p-2 rounded-lg border-2 transition-all relative cursor-pointer hover:scale-105";
                if is_selected() {
                    format!("{} border-blue-500 bg-blue-500 text-white font-bold shadow-lg scale-105", base)
                } else if !heatmap_class.is_empty() {
                    format!("{} border-gray-200 dark:border-gray-700 {} text-gray-900", base, heatmap_class)
                } else {
                    format!("{} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 {}", base, text_color)
                }
            }
            on:click=move |_| on_toggle(date_id)
        >
            <div class="text-sm font-medium">{day}</div>
            {move || {
                if vote_count > 0 && !is_selected() {
                    view! {
                        <div class="text-xs mt-1">{vote_count}</div>
                    }.into_view()
                } else {
                    view! { <></> }.into_view()
                }
            }}
        </button>
    }
}

fn group_by_month(dates: &[DateOptionWithVotes]) -> Vec<(i32, u32, Vec<DateOptionWithVotes>)> {
    let mut months: HashMap<(i32, u32), Vec<DateOptionWithVotes>> = HashMap::new();

    for date in dates {
        let dt = date.date.naive_utc().date();
        let key = (dt.year(), dt.month());
        months.entry(key).or_insert_with(Vec::new).push(date.clone());
    }

    let mut result: Vec<_> = months
        .into_iter()
        .map(|((year, month), dates)| (year, month, dates))
        .collect();

    result.sort_by_key(|(year, month, _)| (*year, *month));
    result
}

fn get_heatmap_color(vote_count: i64, max_votes: i64) -> &'static str {
    if max_votes == 0 || vote_count == 0 {
        return "";
    }

    let percentage = (vote_count as f64 / max_votes as f64 * 100.0) as i64;

    match percentage {
        80..=100 => "bg-green-600",
        60..=79 => "bg-green-500",
        40..=59 => "bg-green-400",
        20..=39 => "bg-green-300",
        _ => "bg-green-200",
    }
}
