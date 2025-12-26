-- Add vote_type column to polls table
ALTER TABLE polls ADD COLUMN vote_type TEXT NOT NULL DEFAULT 'available';
