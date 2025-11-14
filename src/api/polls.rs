use crate::db;
use crate::models::*;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use sqlx::PgPool;
use uuid::Uuid;

pub type ApiResult<T> = Result<T, ApiError>;

#[derive(Debug)]
pub enum ApiError {
    DatabaseError(sqlx::Error),
    NotFound,
    ValidationError(String),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            ApiError::DatabaseError(e) => {
                tracing::error!("Database error: {:?}", e);
                (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string())
            }
            ApiError::NotFound => (StatusCode::NOT_FOUND, "Not found".to_string()),
            ApiError::ValidationError(msg) => (StatusCode::BAD_REQUEST, msg),
        };

        (status, message).into_response()
    }
}

impl From<sqlx::Error> for ApiError {
    fn from(e: sqlx::Error) -> Self {
        match e {
            sqlx::Error::RowNotFound => ApiError::NotFound,
            _ => ApiError::DatabaseError(e),
        }
    }
}

pub async fn create_poll(
    State(pool): State<PgPool>,
    Json(req): Json<CreatePollRequest>,
) -> ApiResult<Json<CreatePollResponse>> {
    // Validation
    if req.title.trim().is_empty() {
        return Err(ApiError::ValidationError("Title is required".to_string()));
    }

    if req.end_date < req.start_date {
        return Err(ApiError::ValidationError(
            "End date must be after start date".to_string(),
        ));
    }

    let poll_id = db::create_poll(
        &pool,
        req.title,
        req.description,
        req.start_date,
        req.end_date,
    )
    .await?;

    Ok(Json(CreatePollResponse { poll_id }))
}

pub async fn get_poll(
    State(pool): State<PgPool>,
    Path(poll_id): Path<Uuid>,
) -> ApiResult<Json<PollWithResults>> {
    let poll = db::get_poll_with_results(&pool, poll_id).await?;
    Ok(Json(poll))
}

pub async fn submit_vote(
    State(pool): State<PgPool>,
    Path(poll_id): Path<Uuid>,
    Json(req): Json<SubmitVoteRequest>,
) -> ApiResult<Json<SubmitVoteResponse>> {
    if req.selected_date_ids.is_empty() {
        return Err(ApiError::ValidationError(
            "At least one date must be selected".to_string(),
        ));
    }

    // Get participant_id from cookie if exists (to be implemented)
    let participant_id = None;

    let participant_id = db::submit_vote(
        &pool,
        poll_id,
        req.participant_name,
        participant_id,
        req.selected_date_ids,
    )
    .await?;

    Ok(Json(SubmitVoteResponse { participant_id }))
}
