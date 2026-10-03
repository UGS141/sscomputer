import React, { useState, useEffect, useCallback } from 'react';

interface LaunchOfferCountdownProps {
  expiresAt: string;
  onExpire?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const LaunchOfferCountdown: React.FC<LaunchOfferCountdownProps> = ({ expiresAt, onExpire }) => {
  const calculateTimeRemaining = useCallback((): TimeRemaining => {
    const targetTime = new Date(expiresAt).getTime();
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (isNaN(targetTime) || difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
  }, [expiresAt]);

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining.isExpired) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeRemaining, onExpire]);

  if (timeRemaining.isExpired) {
    return (
      <div className="py-2.5 px-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center uppercase tracking-wider">
        Offer Ended • Campaign Expired
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center my-4">
      {/* DAYS */}
      <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white shadow-sm border border-teal-600/30">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#F5B72C]">
          {formatNumber(timeRemaining.days)}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-teal-200 uppercase tracking-wider mt-0.5">
          Days
        </span>
      </div>

      {/* HOURS */}
      <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white shadow-sm border border-teal-600/30">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#F5B72C]">
          {formatNumber(timeRemaining.hours)}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-teal-200 uppercase tracking-wider mt-0.5">
          Hours
        </span>
      </div>

      {/* MINUTES */}
      <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white shadow-sm border border-teal-600/30">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#F5B72C]">
          {formatNumber(timeRemaining.minutes)}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-teal-200 uppercase tracking-wider mt-0.5">
          Mins
        </span>
      </div>

      {/* SECONDS */}
      <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white shadow-sm border border-teal-600/30">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#F5B72C] animate-pulse">
          {formatNumber(timeRemaining.seconds)}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-teal-200 uppercase tracking-wider mt-0.5">
          Secs
        </span>
      </div>
    </div>
  );
};
