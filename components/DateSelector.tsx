'use client';

import { useState } from 'react';
import { Button } from './Button';

interface DateSelectorProps {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
}

export function DateSelector({ selectedDates, onChange }: DateSelectorProps) {
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('10:00');

  const addDate = () => {
    if (!dateInput) return;

    const dateTime = new Date(`${dateInput}T${timeInput}`);
    const isoString = dateTime.toISOString();

    if (!selectedDates.includes(isoString)) {
      onChange([...selectedDates, isoString]);
      setDateInput('');
    }
  };

  const removeDate = (dateToRemove: string) => {
    onChange(selectedDates.filter((d) => d !== dateToRemove));
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
    });
  };

  // Sort dates chronologically
  const sortedDates = [...selectedDates].sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          />
        </div>
        <div className="w-32">
          <input
            type="time"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          />
        </div>
        <Button type="button" onClick={addDate}>
          추가
        </Button>
      </div>

      {sortedDates.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            선택된 날짜 ({sortedDates.length}개)
          </p>
          <div className="space-y-2">
            {sortedDates.map((date) => (
              <div
                key={date}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-sm">{formatDateTime(date)}</span>
                <button
                  type="button"
                  onClick={() => removeDate(date)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
