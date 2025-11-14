'use client';

import { DateOptionResult } from '@/lib/types';

interface VoteResultsProps {
  results: DateOptionResult[];
}

export function VoteResults({ results }: VoteResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        아직 투표 결과가 없습니다.
      </div>
    );
  }

  // Sort by vote count (descending)
  const sortedResults = [...results].sort((a, b) => b.voteCount - a.voteCount);
  const maxVotes = sortedResults[0]?.voteCount || 0;

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-4">투표 결과</h3>
      {sortedResults.map((result) => {
        const isTopChoice = result.voteCount === maxVotes && maxVotes > 0;
        const percentage = maxVotes > 0 ? (result.voteCount / maxVotes) * 100 : 0;

        return (
          <div
            key={result.dateOptionId}
            className={`p-4 rounded-lg border-2 transition-colors ${
              isTopChoice
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{formatDateTime(result.date)}</p>
                  {isTopChoice && maxVotes > 0 && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                      최다 득표
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.voteCount}
                </p>
                <p className="text-xs text-gray-500">명</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isTopChoice ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Participants */}
            {result.participants.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">참여자:</p>
                <div className="flex flex-wrap gap-1">
                  {result.participants.map((participant, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                    >
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
