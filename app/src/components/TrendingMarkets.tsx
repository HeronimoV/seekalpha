"use client";

import { FC } from "react";
import { OnChainMarket } from "@/lib/program";

interface TrendingMarketsProps {
  markets: OnChainMarket[];
}

export const TrendingMarkets: FC<TrendingMarketsProps> = ({ markets }) => {
  const trending = markets
    .filter((m) => !m.resolved)
    .sort((a, b) => (b.yesPool + b.noPool) - (a.yesPool + a.noPool))
    .slice(0, 3);

  if (trending.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        🔥 Trending
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trending.map((market, i) => {
          const totalPool = market.yesPool + market.noPool;
          const yesPercent = totalPool > 0 ? (market.yesPool / totalPool) * 100 : 50;

          return (
            <a
              key={market.id}
              href={`/market/${market.id}`}
              className="bg-seek-card border border-seek-purple/20 rounded-xl p-5 hover:border-seek-purple/50 transition group relative overflow-hidden"
            >
              {/* Rank badge */}
              <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
              </div>

              <h3 className="text-base font-semibold mb-3 leading-tight pr-8">{market.title}</h3>

              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-seek-teal font-medium">YES {yesPercent.toFixed(0)}%</span>
                <span className="text-red-400 font-medium">NO {(100 - yesPercent).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-red-400/30 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-seek-teal to-seek-teal/60 rounded-full"
                  style={{ width: `${yesPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="font-medium text-white">💰 {totalPool.toFixed(2)} SOL</span>
                <span className="text-seek-purple font-medium group-hover:text-seek-teal transition">
                  Predict →
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
