import { useState, useEffect } from 'react';
import { PollWithResults } from '@/lib/types';

interface UsePollResult {
  poll: PollWithResults | null;
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage poll data
 */
export function usePoll(pollId: string): UsePollResult {
  const [poll, setPoll] = useState<PollWithResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/polls/${pollId}`);

      if (!response.ok) {
        throw new Error('투표를 찾을 수 없습니다.');
      }

      const data: PollWithResults = await response.json();
      setPoll(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  return {
    poll,
    loading,
    error,
    refetch: fetchPoll,
  };
}
