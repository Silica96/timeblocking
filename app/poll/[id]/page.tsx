'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CalendarGrid } from '@/components/CalendarGrid';
import { usePoll } from '@/lib/hooks/usePoll';
import { useVoteSubmit } from '@/lib/hooks/useVoteSubmit';
import { calculateVoteStats } from '@/lib/utils/heatmap';
import { formatDateKo } from '@/lib/utils/date';
import { MEDAL_EMOJIS } from '@/lib/constants';

export default function PollPage() {
  const params = useParams();
  const pollId = params.id as string;

  const { poll, loading, error, refetch } = usePoll(pollId);
  const { submit, submitting, submitError, submitSuccess, resetStatus } = useVoteSubmit(refetch);

  const [participantName, setParticipantName] = useState('');
  const [selectedDateIds, setSelectedDateIds] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(true);

  const handleDateToggle = (dateId: string) => {
    setSelectedDateIds((prev) =>
      prev.includes(dateId)
        ? prev.filter((id) => id !== dateId)
        : [...prev, dateId]
    );
    resetStatus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await submit(pollId, {
      participantName: participantName.trim() || undefined,
      selectedDateIds,
    });

    if (success) {
      setShowResults(true);
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 클립보드에 복사되었습니다!');
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !poll) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">오류</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || '투표를 불러올 수 없습니다.'}
          </p>
          <Button onClick={() => window.location.href = '/'}>
            홈으로 돌아가기
          </Button>
        </div>
      </main>
    );
  }

  // Calculate vote statistics
  const { voteCountsMap, maxVoteCount } = calculateVoteStats(poll.results);

  // Get top voted dates
  const topVotedDates = [...poll.results]
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 3)
    .filter((r) => r.voteCount > 0);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{poll.title}</h1>
          {poll.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">{poll.description}</p>
          )}

          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" onClick={copyLinkToClipboard}>
              📋 링크 복사
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowResults(!showResults)}
            >
              {showResults ? '👁️ 결과 숨기기' : '👁️ 결과 보기'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        {showResults && (
          <div className="mb-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div className="text-sm text-gray-500 mb-1">총 참여자</div>
              <div className="text-2xl font-bold text-blue-600">{poll.votes.length}명</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div className="text-sm text-gray-500 mb-1">투표 기간</div>
              <div className="text-lg font-semibold">
                {formatDateKo(poll.startDate, { month: 'short', day: 'numeric' })} ~{' '}
                {formatDateKo(poll.endDate, { month: 'short', day: 'numeric' })}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div className="text-sm text-gray-500 mb-1">최다 득표</div>
              <div className="text-2xl font-bold text-green-600">
                {maxVoteCount > 0 ? `${maxVoteCount}표` : '없음'}
              </div>
            </div>
          </div>
        )}

        {/* Top voted dates */}
        {showResults && topVotedDates.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              🏆 인기 날짜 TOP 3
            </h3>
            <div className="space-y-2">
              {topVotedDates.map((result, idx) => (
                <div key={result.dateOptionId} className="flex items-center gap-3">
                  <div className="text-2xl">{MEDAL_EMOJIS[idx]}</div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {formatDateKo(result.date, {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                      })}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {result.voteCount}명 가능
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voting form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Participant name */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <Input
              label="이름 (선택사항)"
              placeholder="익명으로 참여할 수 있습니다"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
            />
            <p className="mt-2 text-sm text-gray-500">
              💡 가능한 날짜를 달력에서 클릭하여 선택하세요.
              {showResults && ' 초록색이 진할수록 더 많은 사람이 선택한 날짜입니다.'}
            </p>
          </div>

          {/* Calendar Grid */}
          <CalendarGrid
            dateOptions={poll.dateOptions}
            selectedDateIds={selectedDateIds}
            onDateToggle={handleDateToggle}
            voteCountsMap={showResults ? voteCountsMap : undefined}
            maxVoteCount={maxVoteCount}
          />

          {/* Selected count */}
          {selectedDateIds.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <p className="text-blue-600 dark:text-blue-400 font-semibold">
                ✓ {selectedDateIds.length}개의 날짜를 선택했습니다
              </p>
            </div>
          )}

          {/* Success message */}
          {submitSuccess && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 font-semibold text-center">
                ✓ 투표가 성공적으로 제출되었습니다!
              </p>
            </div>
          )}

          {/* Error message */}
          {submitError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{submitError}</p>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={submitting || selectedDateIds.length === 0}
            fullWidth
          >
            {submitting
              ? '제출 중...'
              : selectedDateIds.length > 0
              ? `${selectedDateIds.length}개 날짜 투표하기`
              : '날짜를 선택하세요'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            투표는 언제든지 다시 수정할 수 있습니다.
          </p>
        </form>
      </div>
    </main>
  );
}
