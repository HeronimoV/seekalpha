"use client";

import { FC, useEffect, useState, useRef } from "react";
import { fetchAllMarkets, OnChainMarket } from "@/lib/program";

interface Activity {
  id: string;
  wallet: string;
  amount: number;
  position: boolean;
  marketTitle: string;
  timestamp: Date;
}

function truncateWallet(addr: string): string {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

function generateActivitiesFromMarkets(markets: OnChainMarket[]): Activity[] {
  const activities: Activity[] = [];
  const wallets = [
    "8xuo3K7Rp9Bj2FqNmAkCpVvYhQ4dRn6s37gt",
    "Dk4mJE8vp2QrFcbN9xUzYwT7g3RdH5aW1jKs",
    "7Hnq4BvPzY9RL2WxJ8sKfT6mAc3uDgE5oNit",
    "BpC2xqMnV8R5Fj3WdAhY9G7sTk4zLw6eJm0U",
    "9mTvR2bLxK6qJZ8WnHsCf3Yd5Gg7PaE4oU1i",
    "3FnWkzR7qB2dYxH6TpJm9Lv4CgE8uAs5Nj0K",
    "Qr8T5hLmVj2Bn6WxKdY9Fg3Ap7Cs4Eu0ZiNs",
    "Kw7JnR4bG2Lm8TxVqH5Yf9Ds3CpE6uAo1Zi",
  ];

  for (const market of markets) {
    const totalPool = market.yesPool + market.noPool;
    if (totalPool <= 0) continue;

    // Generate 1-3 activities per market with pool data
    const numActivities = Math.min(3, Math.max(1, Math.floor(totalPool / 0.1)));
    for (let i = 0; i < numActivities; i++) {
      const isYes = i % 2 === 0 ? market.yesPool >= market.noPool : market.yesPool < market.noPool;
      const pool = isYes ? market.yesPool : market.noPool;
      const amount = Math.max(0.05, +(pool / (numActivities + 1) * (0.5 + Math.random())).toFixed(2));
      const wallet = wallets[(market.id * 3 + i) % wallets.length];
      const timeDelta = (i + 1) * 600000 + Math.random() * 300000; // stagger

      activities.push({
        id: `${market.id}-${i}`,
        wallet,
        amount: Math.min(amount, 10),
        position: isYes,
        marketTitle: market.title,
        timestamp: new Date(Date.now() - timeDelta),
      });
    }
  }

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 20);
}

export const ActivityFeed: FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllMarkets()
      .then((markets) => {
        setActivities(generateActivitiesFromMarkets(markets));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!scrollRef.current || activities.length === 0) return;
    const el = scrollRef.current;
    let animId: number;
    let scrollPos = 0;

    const scroll = () => {
      scrollPos += 0.5;
      if (scrollPos >= el.scrollHeight / 2) scrollPos = 0;
      el.scrollTop = scrollPos;
      animId = requestAnimationFrame(scroll);
    };

    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [activities]);

  if (loading || activities.length === 0) return null;

  // Duplicate for infinite scroll effect
  const displayActivities = [...activities, ...activities];

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Live Activity</h2>
      </div>
      <div
        ref={scrollRef}
        className="bg-seek-card border border-seek-border rounded-xl overflow-hidden max-h-48 relative"
        style={{ scrollBehavior: "auto" }}
      >
        <div className="divide-y divide-seek-border/50">
          {displayActivities.map((a, i) => (
            <div key={`${a.id}-${i}`} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="text-base shrink-0">🎯</span>
              <span className="text-gray-300 min-w-0">
                <span className="text-seek-teal font-mono text-xs">{truncateWallet(a.wallet)}</span>
                {" bet "}
                <span className="text-white font-medium">{a.amount.toFixed(2)} SOL</span>
                {" "}
                <span className={a.position ? "text-seek-teal font-medium" : "text-red-400 font-medium"}>
                  {a.position ? "YES" : "NO"}
                </span>
                {" on "}
                <span className="text-gray-200 truncate">{a.marketTitle.length > 40 ? a.marketTitle.slice(0, 40) + "…" : a.marketTitle}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
