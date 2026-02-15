"use client";

import { FC, useEffect, useState, useRef } from "react";
import { fetchAllMarkets, OnChainMarket } from "@/lib/program";

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef(0);

  useEffect(() => {
    if (target === 0) return;
    const start = ref.current;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = start + (target - start) * eased;
      setValue(current);
      ref.current = current;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

interface StatsBannerProps {
  markets: OnChainMarket[];
}

export const StatsBanner: FC<StatsBannerProps> = ({ markets }) => {
  const totalMarkets = markets.length;
  const totalVolume = markets.reduce((sum, m) => sum + m.yesPool + m.noPool, 0);
  // Estimate predictions: each market with volume likely has at least some predictions
  const totalPredictions = markets.reduce((sum, m) => {
    const pool = m.yesPool + m.noPool;
    if (pool === 0) return sum;
    // Rough estimate: ~2 predictions per 0.1 SOL of volume
    return sum + Math.max(2, Math.floor(pool / 0.05));
  }, 0);
  const activeMarkets = markets.filter((m) => !m.resolved).length;

  const animMarkets = useCountUp(totalMarkets);
  const animVolume = useCountUp(totalVolume);
  const animPredictions = useCountUp(totalPredictions);
  const animActive = useCountUp(activeMarkets);

  if (markets.length === 0) return null;

  const stats = [
    { label: "Total Markets", value: Math.round(animMarkets).toString(), icon: "📊" },
    { label: "Total Volume", value: `${animVolume.toFixed(2)} SOL`, icon: "💰" },
    { label: "Predictions", value: Math.round(animPredictions).toString(), icon: "🎯" },
    { label: "Active Markets", value: Math.round(animActive).toString(), icon: "🟢" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-seek-card border border-seek-border rounded-xl p-4 text-center"
        >
          <div className="text-2xl mb-1">{stat.icon}</div>
          <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
          <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
