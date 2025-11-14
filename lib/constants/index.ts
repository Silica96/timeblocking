/**
 * UI Constants
 */
export const MONTH_NAMES_KO = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
] as const;

export const DAY_NAMES_KO = ['일', '월', '화', '수', '목', '금', '토'] as const;

export const MEDAL_EMOJIS = ['🥇', '🥈', '🥉'] as const;

/**
 * Color intensity levels for heatmap
 */
export const HEATMAP_COLORS = {
  LEVEL_5: 'bg-green-600',
  LEVEL_4: 'bg-green-500',
  LEVEL_3: 'bg-green-400',
  LEVEL_2: 'bg-green-300',
  LEVEL_1: 'bg-green-200',
} as const;

export const HEATMAP_THRESHOLDS = {
  LEVEL_5: 0.8,
  LEVEL_4: 0.6,
  LEVEL_3: 0.4,
  LEVEL_2: 0.2,
} as const;

/**
 * Validation constants
 */
export const MAX_DATE_RANGE_WARNING = 31; // Show warning if range > 31 days

/**
 * Cookie settings
 */
export const PARTICIPANT_COOKIE_PREFIX = 'participant_';
export const PARTICIPANT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds
