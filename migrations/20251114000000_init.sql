-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT
);

-- Create date_options table
CREATE TABLE IF NOT EXISTS date_options (
    id UUID PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    participant_name TEXT,
    participant_id UUID NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create votes_on_dates junction table
CREATE TABLE IF NOT EXISTS votes_on_dates (
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    date_option_id UUID NOT NULL REFERENCES date_options(id) ON DELETE CASCADE,
    PRIMARY KEY (vote_id, date_option_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_date_options_poll_id ON date_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_date_options_date ON date_options(date);
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_participant_id ON votes(participant_id);
CREATE INDEX IF NOT EXISTS idx_votes_on_dates_vote_id ON votes_on_dates(vote_id);
CREATE INDEX IF NOT EXISTS idx_votes_on_dates_date_option_id ON votes_on_dates(date_option_id);
