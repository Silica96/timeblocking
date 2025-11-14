use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "ssr", derive(sqlx::FromRow))]
pub struct Poll {
    pub id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub created_by: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "ssr", derive(sqlx::FromRow))]
pub struct DateOption {
    pub id: Uuid,
    pub poll_id: Uuid,
    pub date: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "ssr", derive(sqlx::FromRow))]
pub struct Vote {
    pub id: Uuid,
    pub poll_id: Uuid,
    pub participant_name: Option<String>,
    pub participant_id: Uuid,
    pub submitted_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DateOptionWithVotes {
    pub id: Uuid,
    pub date: DateTime<Utc>,
    pub vote_count: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PollWithResults {
    #[serde(flatten)]
    pub poll: Poll,
    pub results: Vec<DateOptionWithVotes>,
}

// Request/Response types
#[derive(Debug, Serialize, Deserialize)]
pub struct CreatePollRequest {
    pub title: String,
    pub description: Option<String>,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreatePollResponse {
    pub poll_id: Uuid,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SubmitVoteRequest {
    pub participant_name: Option<String>,
    pub selected_date_ids: Vec<Uuid>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SubmitVoteResponse {
    pub participant_id: Uuid,
}
