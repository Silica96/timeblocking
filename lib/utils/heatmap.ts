import { HEATMAP_COLORS, HEATMAP_THRESHOLDS } from '@/lib/constants';

/**
 * Get heatmap color based on vote count intensity
 */
export function getHeatmapColor(voteCount: number, maxVoteCount: number): string {
  if (voteCount === 0 || maxVoteCount === 0) return '';

  const intensity = voteCount / maxVoteCount;

  if (intensity >= HEATMAP_THRESHOLDS.LEVEL_5) return HEATMAP_COLORS.LEVEL_5;
  if (intensity >= HEATMAP_THRESHOLDS.LEVEL_4) return HEATMAP_COLORS.LEVEL_4;
  if (intensity >= HEATMAP_THRESHOLDS.LEVEL_3) return HEATMAP_COLORS.LEVEL_3;
  if (intensity >= HEATMAP_THRESHOLDS.LEVEL_2) return HEATMAP_COLORS.LEVEL_2;

  return HEATMAP_COLORS.LEVEL_1;
}

/**
 * Calculate vote statistics from results
 */
export function calculateVoteStats(
  results: Array<{ dateOptionId: string; voteCount: number }>
): { voteCountsMap: Map<string, number>; maxVoteCount: number } {
  const voteCountsMap = new Map<string, number>();
  let maxVoteCount = 0;

  results.forEach((result) => {
    voteCountsMap.set(result.dateOptionId, result.voteCount);
    if (result.voteCount > maxVoteCount) {
      maxVoteCount = result.voteCount;
    }
  });

  return { voteCountsMap, maxVoteCount };
}
