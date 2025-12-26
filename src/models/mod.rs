use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Vote type: whether participants select available or unavailable dates
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "ssr", derive(sqlx::Type))]
#[cfg_attr(feature = "ssr", sqlx(type_name = "text"))]
pub enum VoteType {
    #[default]
    #[serde(rename = "available")]
    #[cfg_attr(feature = "ssr", sqlx(rename = "available"))]
    Available,
    #[serde(rename = "unavailable")]
    #[cfg_attr(feature = "ssr", sqlx(rename = "unavailable"))]
    Unavailable,
}

impl VoteType {
    pub fn as_str(&self) -> &'static str {
        match self {
            VoteType::Available => "available",
            VoteType::Unavailable => "unavailable",
        }
    }
}

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
    pub vote_type: VoteType,
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
    #[serde(default)]
    pub vote_type: VoteType,
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
