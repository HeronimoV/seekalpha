"use client";

import { FC, useEffect, useState } from "react";
import { fetchAllMarkets, OnChainMarket } from "@/lib/program";

interface MarketActivity {
  id: number;
  title: string;
  yesPool: number;
  noPool: number;
  totalPool: number;
}

export const ActivityFeed: FC = () => {
  const [markets, setMarkets] = useState<MarketActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMarkets()
      .then((m) => {
        const active = m
          .filter((mk) => mk.yesPool + mk.noPool > 0)
          .map((mk) => ({
            id: mk.id,
            title: mk.title,
            yesPool: mk.yesPool,
            noPool: mk.noPool,
            totalPool: mk.yesPool + mk.noPool,
          }))
          .sort((a, b) => b.totalPool - a.totalPool);
        setMarkets(active);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || markets.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Live Markets</h2>
      </div>
      <div className="bg-seek-card border border-seek-border rounded-xl overflow-hidden">
        <div className="divide-y divide-seek-border/50">
          {markets.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="text-base shrink-0">🔮</span>
              <span className="text-gray-300 min-w-0 flex-1">
                <span className="text-gray-200">{m.title.length > 45 ? m.title.slice(0, 45) + "…" : m.title}</span>
              </span>
              <span className="shrink-0 flex items-center gap-3 text-xs">
                <span className="text-seek-teal font-medium">YES {m.yesPool.toFixed(3)}</span>
                <span className="text-red-400 font-medium">NO {m.noPool.toFixed(3)}</span>
                <span className="text-gray-500">{m.totalPool.toFixed(3)} SOL</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
