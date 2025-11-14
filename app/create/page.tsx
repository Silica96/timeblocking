'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import { CreatePollRequest, CreatePollResponse } from '@/lib/types';
import { getDayCount } from '@/lib/utils/date';
import { MAX_DATE_RANGE_WARNING } from '@/lib/constants';

export default function CreatePollPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate number of days in range
  const dayCount = startDate && endDate ? getDayCount(startDate, endDate) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!startDate || !endDate) {
      setError('시작일과 종료일을 선택해주세요.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const request: CreatePollRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        startDate: startDate,
        endDate: endDate,
      };

      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '투표 생성에 실패했습니다.');
      }

      const data: CreatePollResponse = await response.json();

      // Redirect to the poll page
      router.push(`/poll/${data.pollId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">새 일정 투표 만들기</h1>
          <p className="text-gray-600 dark:text-gray-400">
            날짜 범위를 선택하면 참여자들이 가능한 날짜를 달력에서 선택할 수 있습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="투표 제목 *"
            placeholder="예: 팀 회식 날짜 투표"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Description */}
          <Textarea
            label="설명 (선택사항)"
            placeholder="투표에 대한 추가 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          {/* Date Range */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold mb-4">날짜 범위 설정 *</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  시작일
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  종료일
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  required
                />
              </div>
            </div>

            {dayCount > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                📅 총 <span className="font-semibold text-blue-600 dark:text-blue-400">{dayCount}일</span>이 투표 대상입니다.
              </div>
            )}

            {dayCount > MAX_DATE_RANGE_WARNING && (
              <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ 날짜가 많으면 달력이 길어질 수 있습니다.
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || !startDate || !endDate}
              fullWidth
            >
              {loading ? '생성 중...' : '투표 만들기'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              disabled={loading}
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
