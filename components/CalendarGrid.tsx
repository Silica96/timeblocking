'use client';

import { DateOption } from '@/lib/types';

interface CalendarGridProps {
  dateOptions: DateOption[];
  selectedDateIds: string[];
  onDateToggle: (dateId: string) => void;
  voteCountsMap?: Map<string, number>;
  maxVoteCount?: number;
}

export function CalendarGrid({
  dateOptions,
  selectedDateIds,
  onDateToggle,
  voteCountsMap,
  maxVoteCount = 1,
}: CalendarGridProps) {
  // Group dates by month
  const datesByMonth = dateOptions.reduce((acc, dateOption) => {
    const date = new Date(dateOption.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    if (!acc[monthKey]) {
      acc[monthKey] = {
        year: date.getFullYear(),
        month: date.getMonth(),
        dates: [],
      };
    }

    acc[monthKey].dates.push(dateOption);
    return acc;
  }, {} as Record<string, { year: number; month: number; dates: DateOption[] }>);

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // Get heat map color based on vote count
  const getHeatmapColor = (voteCount: number) => {
    if (!voteCountsMap || voteCount === 0) return '';

    const intensity = maxVoteCount > 0 ? voteCount / maxVoteCount : 0;

    if (intensity >= 0.8) return 'bg-green-600';
    if (intensity >= 0.6) return 'bg-green-500';
    if (intensity >= 0.4) return 'bg-green-400';
    if (intensity >= 0.2) return 'bg-green-300';
    return 'bg-green-200';
  };

  return (
    <div className="space-y-8">
      {Object.entries(datesByMonth).map(([monthKey, { year, month, dates }]) => {
        // Sort dates for this month
        const sortedDates = [...dates].sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Get the first day of the month to calculate offset
        const firstDate = new Date(sortedDates[0].date);
        const firstDayOfWeek = firstDate.getDay();

        return (
          <div key={monthKey} className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">
              {year}년 {monthNames[month]}
            </h3>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day, idx) => (
                <div
                  key={day}
                  className={`text-center text-sm font-medium py-2 ${
                    idx === 0 ? 'text-red-600 dark:text-red-400' :
                    idx === 6 ? 'text-blue-600 dark:text-blue-400' :
                    'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for offset */}
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}

              {/* Date cells */}
              {sortedDates.map((dateOption) => {
                const date = new Date(dateOption.date);
                const dayOfWeek = date.getDay();
                const isSelected = selectedDateIds.includes(dateOption.id);
                const voteCount = voteCountsMap?.get(dateOption.id) || 0;
                const heatmapColor = getHeatmapColor(voteCount);

                return (
                  <button
                    key={dateOption.id}
                    type="button"
                    onClick={() => onDateToggle(dateOption.id)}
                    className={`
                      aspect-square p-2 rounded-lg border-2 transition-all relative
                      ${isSelected
                        ? 'border-blue-500 bg-blue-500 text-white font-bold shadow-lg scale-105'
                        : heatmapColor
                        ? `border-gray-200 dark:border-gray-700 ${heatmapColor} text-gray-900`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                      ${dayOfWeek === 0 && !isSelected ? 'text-red-600 dark:text-red-400' : ''}
                      ${dayOfWeek === 6 && !isSelected ? 'text-blue-600 dark:text-blue-400' : ''}
                    `}
                  >
                    <div className="text-lg">{date.getDate()}</div>
                    {voteCount > 0 && !isSelected && (
                      <div className="absolute bottom-0 right-0 text-xs bg-gray-900 text-white px-1 rounded-tl">
                        {voteCount}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
