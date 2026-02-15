"use client";

import { FC, useState, useEffect } from "react";
import { OnChainMarket } from "@/lib/program";

interface ClosingSoonProps {
  markets: OnChainMarket[];
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Expired";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${mins}m`;
}

export const ClosingSoon: FC<ClosingSoonProps> = ({ markets }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const closingSoon = markets
    .filter((m) => {
      if (m.resolved) return false;
      const diff = m.resolutionTime.getTime() - now;
      return diff > 0 && diff <= 48 * 60 * 60 * 1000;
    })
    .sort((a, b) => a.resolutionTime.getTime() - b.resolutionTime.getTime());

  if (closingSoon.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        ⏰ Closing Soon
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {closingSoon.map((market) => {
          const diff = market.resolutionTime.getTime() - now;
          const isUrgent = diff < 24 * 60 * 60 * 1000;
          const totalPool = market.yesPool + market.noPool;
          const yesPercent = totalPool > 0 ? (market.yesPool / totalPool) * 100 : 50;

          return (
            <a
              key={market.id}
              href={`/market/${market.id}`}
              className={`flex-shrink-0 w-72 bg-seek-card rounded-xl p-4 border transition hover:scale-[1.02] ${
                isUrgent
                  ? "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                  : "border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.06)]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isUrgent
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {formatCountdown(diff)}
                </span>
                <span className="text-xs text-gray-500">{totalPool.toFixed(2)} SOL</span>
              </div>
              <h3 className="text-sm font-semibold mb-3 line-clamp-2 leading-tight">{market.title}</h3>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-seek-teal">YES {yesPercent.toFixed(0)}%</span>
                <span className="text-red-400">NO {(100 - yesPercent).toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-red-400/30 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-seek-teal rounded-full"
                  style={{ width: `${yesPercent}%` }}
                />
              </div>
              <div className="text-center">
                <span className="text-xs font-medium text-seek-purple">Bet Now →</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
