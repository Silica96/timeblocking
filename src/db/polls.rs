use crate::models::*;
use chrono::{DateTime, Utc};
use sqlx::{PgPool, Row};
use uuid::Uuid;

pub async fn create_poll(
    pool: &PgPool,
    title: String,
    description: Option<String>,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
    vote_type: VoteType,
) -> Result<Uuid, sqlx::Error> {
    let poll_id = Uuid::new_v4();

    // Insert poll
    sqlx::query(
        r#"
        INSERT INTO polls (id, title, description, start_date, end_date, vote_type, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        "#,
    )
    .bind(poll_id)
    .bind(title)
    .bind(description)
    .bind(start_date)
    .bind(end_date)
    .bind(vote_type.as_str())
    .execute(pool)
    .await?;

    // Generate date options
    let mut current = start_date.date_naive();
    let end = end_date.date_naive();

    while current <= end {
        let date_time = current.and_hms_opt(0, 0, 0).unwrap().and_utc();
        let date_id = Uuid::new_v4();

        sqlx::query(
            r#"
            INSERT INTO date_options (id, poll_id, date)
            VALUES ($1, $2, $3)
            "#,
        )
        .bind(date_id)
        .bind(poll_id)
        .bind(date_time)
        .execute(pool)
        .await?;

        current = current.succ_opt().unwrap();
    }

    Ok(poll_id)
}

pub async fn get_poll_with_results(
    pool: &PgPool,
    poll_id: Uuid,
) -> Result<PollWithResults, sqlx::Error> {
    // Get poll
    let poll = sqlx::query_as::<_, Poll>(
        r#"
        SELECT id, title, description, start_date, end_date, created_at, created_by, vote_type
        FROM polls
        WHERE id = $1
        "#,
    )
    .bind(poll_id)
    .fetch_one(pool)
    .await?;

    // Get date options with vote counts
    let results = sqlx::query(
        r#"
        SELECT
            d.id,
            d.date,
            COUNT(DISTINCT vod.vote_id) as vote_count
        FROM date_options d
        LEFT JOIN votes_on_dates vod ON d.id = vod.date_option_id
        WHERE d.poll_id = $1
        GROUP BY d.id, d.date
        ORDER BY d.date
        "#,
    )
    .bind(poll_id)
    .fetch_all(pool)
    .await?
    .into_iter()
    .map(|row| DateOptionWithVotes {
        id: row.get("id"),
        date: row.get("date"),
        vote_count: row.get::<i64, _>("vote_count"),
    })
    .collect();

    Ok(PollWithResults { poll, results })
}

pub async fn submit_vote(
    pool: &PgPool,
    poll_id: Uuid,
    participant_name: Option<String>,
    participant_id: Option<Uuid>,
    selected_date_ids: Vec<Uuid>,
) -> Result<Uuid, sqlx::Error> {
    let participant_id = participant_id.unwrap_or_else(Uuid::new_v4);

    // Delete existing votes for this participant
    sqlx::query(
        r#"
        DELETE FROM votes_on_dates
        WHERE vote_id IN (
            SELECT id FROM votes WHERE poll_id = $1 AND participant_id = $2
        )
        "#,
    )
    .bind(poll_id)
    .bind(participant_id)
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        DELETE FROM votes
        WHERE poll_id = $1 AND participant_id = $2
        "#,
    )
    .bind(poll_id)
    .bind(participant_id)
    .execute(pool)
    .await?;

    // Create new vote
    let vote_id = Uuid::new_v4();
    sqlx::query(
        r#"
        INSERT INTO votes (id, poll_id, participant_name, participant_id, submitted_at)
        VALUES ($1, $2, $3, $4, NOW())
        "#,
    )
    .bind(vote_id)
    .bind(poll_id)
    .bind(participant_name)
    .bind(participant_id)
    .execute(pool)
    .await?;

    // Insert vote selections
    for date_id in selected_date_ids {
        sqlx::query(
            r#"
            INSERT INTO votes_on_dates (vote_id, date_option_id)
            VALUES ($1, $2)
            "#,
        )
        .bind(vote_id)
        .bind(date_id)
        .execute(pool)
        .await?;
    }

    Ok(participant_id)
}
