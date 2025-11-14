'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import { DateSelector } from '@/components/DateSelector';
import { CreatePollRequest, CreatePollResponse } from '@/lib/types';

export default function CreatePollPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (selectedDates.length === 0) {
      setError('최소 1개의 날짜를 선택해주세요.');
      return;
    }

    setLoading(true);

    try {
      const request: CreatePollRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        dateOptions: selectedDates,
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
          <h1 className="text-3xl font-bold mb-2">새 투표 만들기</h1>
          <p className="text-gray-600 dark:text-gray-400">
            여러 날짜 옵션을 추가하고 참여자들의 투표를 받아보세요.
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

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              날짜 옵션 *
            </label>
            <DateSelector
              selectedDates={selectedDates}
              onChange={setSelectedDates}
            />
            {selectedDates.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                참여자들이 선택할 수 있는 날짜를 추가하세요.
              </p>
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
              disabled={loading || selectedDates.length === 0}
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
