"use client";

import { FC, useState, useEffect } from "react";
import { OnChainMarket } from "@/lib/program";

interface Props {
  markets: OnChainMarket[];
}

export const NotificationBanners: FC<Props> = ({ markets }) => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeMarkets = markets.filter((m) => !m.resolved);

  // Markets resolving within 24 hours
  const resolvingSoon = activeMarkets.filter((m) => {
    const diff = m.resolutionTime.getTime() - now;
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
  });

  // Flash markets ending within 1 hour
  const flashEnding = activeMarkets.filter((m) => {
    const isFlash = m.marketType === "flash1h" || m.marketType === "flash24h";
    const diff = m.resolutionTime.getTime() - now;
    return isFlash && diff > 0 && diff <= 60 * 60 * 1000;
  });

  const formatCountdown = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const banners: { id: string; content: string; gradient: string }[] = [];

  if (resolvingSoon.length > 0 && !dismissed.has("resolving")) {
    banners.push({
      id: "resolving",
      content: `🔥 ${resolvingSoon.length} market${resolvingSoon.length > 1 ? "s" : ""} resolving soon!`,
      gradient: "from-orange-500/20 to-red-500/20 border-orange-500/30",
    });
  }

  flashEnding.forEach((m) => {
    const key = `flash-${m.id}`;
    if (dismissed.has(key)) return;
    const diff = m.resolutionTime.getTime() - now;
    banners.push({
      id: key,
      content: `⚡ Flash market ending in ${formatCountdown(diff)}! "${m.title.slice(0, 40)}${m.title.length > 40 ? "..." : ""}"`,
      gradient: "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
    });
  });

  if (banners.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {banners.map((b) => (
        <div
          key={b.id}
          className={`relative bg-gradient-to-r ${b.gradient} border rounded-xl px-4 py-3 text-sm font-medium`}
        >
          {b.content}
          <button
            onClick={() => setDismissed((prev) => new Set(prev).add(b.id))}
            className="absolute top-2 right-3 text-gray-400 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
