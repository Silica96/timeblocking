'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { VoteResults } from '@/components/VoteResults';
import { PollWithResults, SubmitVoteRequest } from '@/lib/types';

export default function PollPage() {
  const params = useParams();
  const pollId = params.id as string;

  const [poll, setPoll] = useState<PollWithResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [participantName, setParticipantName] = useState('');
  const [selectedDateIds, setSelectedDateIds] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch poll data
  const fetchPoll = async () => {
    try {
      const response = await fetch(`/api/polls/${pollId}`);

      if (!response.ok) {
        throw new Error('투표를 찾을 수 없습니다.');
      }

      const data: PollWithResults = await response.json();
      setPoll(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  const handleDateToggle = (dateId: string) => {
    setSelectedDateIds((prev) =>
      prev.includes(dateId)
        ? prev.filter((id) => id !== dateId)
        : [...prev, dateId]
    );
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (selectedDateIds.length === 0) {
      setSubmitError('최소 1개의 날짜를 선택해주세요.');
      return;
    }

    setSubmitting(true);

    try {
      const request: SubmitVoteRequest = {
        participantName: participantName.trim() || undefined,
        selectedDateIds,
      };

      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '투표 제출에 실패했습니다.');
      }

      setSubmitSuccess(true);
      // Refresh poll data to show updated results
      await fetchPoll();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

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

  const copyLinkToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('링크가 클립보드에 복사되었습니다!');
  };

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

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{poll.title}</h1>
          {poll.description && (
            <p className="text-gray-600 dark:text-gray-400">{poll.description}</p>
          )}
          <div className="mt-4">
            <Button variant="outline" onClick={copyLinkToClipboard}>
              📋 링크 복사
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Voting Section */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">투표하기</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Participant Name */}
                <Input
                  label="이름 (선택사항)"
                  placeholder="익명"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                />

                {/* Date Options */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    가능한 날짜 선택 *
                  </label>
                  <div className="space-y-2">
                    {poll.dateOptions.map((dateOption) => (
                      <label
                        key={dateOption.id}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedDateIds.includes(dateOption.id)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDateIds.includes(dateOption.id)}
                          onChange={() => handleDateToggle(dateOption.id)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm font-medium">
                          {formatDateTime(dateOption.date)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Success message */}
                {submitSuccess && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✓ 투표가 성공적으로 제출되었습니다!
                    </p>
                  </div>
                )}

                {/* Error message */}
                {submitError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {submitError}
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={submitting || selectedDateIds.length === 0}
                  fullWidth
                >
                  {submitting ? '제출 중...' : '투표하기'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  투표는 언제든지 수정할 수 있습니다.
                </p>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <VoteResults results={poll.results} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
