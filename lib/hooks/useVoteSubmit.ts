import { useState } from 'react';
import { SubmitVoteRequest } from '@/lib/types';

interface UseVoteSubmitResult {
  submit: (pollId: string, request: SubmitVoteRequest) => Promise<boolean>;
  submitting: boolean;
  submitError: string;
  submitSuccess: boolean;
  resetStatus: () => void;
}

/**
 * Custom hook to handle vote submission
 */
export function useVoteSubmit(onSuccess?: () => void): UseVoteSubmitResult {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submit = async (pollId: string, request: SubmitVoteRequest): Promise<boolean> => {
    setSubmitError('');
    setSubmitSuccess(false);

    if (request.selectedDateIds.length === 0) {
      setSubmitError('최소 1개의 날짜를 선택해주세요.');
      return false;
    }

    setSubmitting(true);

    try {
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
      onSuccess?.();
      return true;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const resetStatus = () => {
    setSubmitError('');
    setSubmitSuccess(false);
  };

  return {
    submit,
    submitting,
    submitError,
    submitSuccess,
    resetStatus,
  };
}
