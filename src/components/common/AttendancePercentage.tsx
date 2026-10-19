import React from 'react';

interface AttendancePercentageProps {
  percentage: number;
  minRequired?: number;
  size?: 'sm' | 'md' | 'lg';
  showProgressBar?: boolean;
  className?: string;
}

export const AttendancePercentage: React.FC<AttendancePercentageProps> = ({
  percentage,
  minRequired = 75,
  size = 'md',
  showProgressBar = false,
  className = '',
}) => {
  const safePercentage = Math.min(100, Math.max(0, Math.round(percentage)));

  let colorClass = 'bg-rose-50 text-rose-700 border-rose-200';
  let barColorClass = 'bg-rose-500';
  let statusText = 'Critical';

  if (safePercentage >= minRequired) {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    barColorClass = 'bg-emerald-500';
    statusText = 'Good';
  } else if (safePercentage >= 60) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
    barColorClass = 'bg-amber-500';
    statusText = 'At Risk';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5 font-semibold',
  };

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex items-center font-medium rounded-full border ${colorClass} ${sizeClasses[size]}`}
          title={`Attendance: ${safePercentage}% (${statusText}, Min required: ${minRequired}%)`}
        >
          {safePercentage}%
        </span>
        {size === 'lg' && (
          <span className="text-xs text-gray-500 font-medium">({statusText})</span>
        )}
      </div>

      {showProgressBar && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${barColorClass}`}
            style={{ width: `${safePercentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
