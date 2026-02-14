"use client";

import { FC, useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  compact?: boolean;
}

export const CountdownTimer: FC<CountdownTimerProps> = ({ targetDate, compact }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) {
        setTimeLeft("Expired");
        setUrgent(false);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setUrgent(diff < 300000); // < 5 min

      if (h > 0) {
        setTimeLeft(`${h}h ${m}m ${s}s`);
      } else if (m > 0) {
        setTimeLeft(`${m}m ${s}s`);
      } else {
        setTimeLeft(`${s}s`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft === "Expired") {
    return <span className="text-xs text-red-400 font-medium">Expired</span>;
  }

  return (
    <span
      className={`text-xs font-mono font-medium ${
        urgent ? "text-red-400 animate-pulse" : "text-amber-400"
      } ${compact ? "" : "bg-amber-400/10 px-2 py-0.5 rounded-full"}`}
    >
      ⏱ {timeLeft}
    </span>
  );
};
