// Poll types
export interface Poll {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  createdBy: string | null;
  dateOptions: DateOption[];
  votes: Vote[];
}

export interface DateOption {
  id: string;
  pollId: string;
  date: Date;
  createdAt: Date;
  votes: VoteOnDate[];
}

export interface Vote {
  id: string;
  pollId: string;
  participantName: string | null;
  participantId: string;
  submittedAt: Date;
  selectedDates: VoteOnDate[];
}

export interface VoteOnDate {
  id: string;
  voteId: string;
  dateOptionId: string;
}

// API Request/Response types
export interface CreatePollRequest {
  title: string;
  description?: string;
  dateOptions: string[]; // ISO date strings
}

export interface CreatePollResponse {
  pollId: string;
  pollUrl: string;
}

export interface SubmitVoteRequest {
  participantName?: string;
  selectedDateIds: string[];
}

export interface SubmitVoteResponse {
  success: boolean;
  voteId: string;
}

export interface PollWithResults extends Poll {
  results: DateOptionResult[];
}

export interface DateOptionResult {
  dateOptionId: string;
  date: Date;
  voteCount: number;
  participants: string[];
}
