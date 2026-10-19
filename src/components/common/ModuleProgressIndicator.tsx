import React from 'react';

interface ModuleProgressIndicatorProps {
  progressPercentage: number;
  completedCount?: number;
  totalCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
  className?: string;
}

export const ModuleProgressIndicator: React.FC<ModuleProgressIndicatorProps> = ({
  progressPercentage,
  completedCount,
  totalCount,
  size = 'md',
  showBar = true,
  className = '',
}) => {
  const safePercentage = Math.min(100, Math.max(0, Math.round(progressPercentage)));
  const isComplete = safePercentage === 100;

  const barColor = isComplete ? 'bg-emerald-500' : 'bg-primary-600';
  const badgeColor = isComplete
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-blue-50 text-blue-700 border-blue-200';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5 font-semibold',
  };

  return (
    <div className={`inline-flex flex-col gap-1 w-full max-w-[200px] ${className}`}>
      <div className="flex items-center justify-between text-xs font-medium text-gray-700">
        <span className={`inline-flex items-center rounded-full border ${badgeColor} ${sizeClasses[size]}`}>
          {safePercentage}% Syllabus
        </span>
        {completedCount !== undefined && totalCount !== undefined && (
          <span className="text-gray-500 text-xs">
            {completedCount}/{totalCount} Modules
          </span>
        )}
      </div>

      {showBar && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${safePercentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
