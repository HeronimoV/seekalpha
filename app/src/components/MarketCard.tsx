"use client";

import { FC, useState } from "react";
import { Market } from "@/lib/constants";

interface MarketCardProps {
  market: Market;
}

export const MarketCard: FC<MarketCardProps> = ({ market }) => {
  const [betAmount, setBetAmount] = useState("");
  const [showBetting, setShowBetting] = useState(false);

  const totalPool = market.yesPool + market.noPool;
  const yesPercent = totalPool > 0 ? (market.yesPool / totalPool) * 100 : 50;
  const noPercent = 100 - yesPercent;

  const timeLeft = () => {
    const now = new Date();
    const diff = market.resolutionTime.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="gradient-border rounded-xl bg-seek-card p-5 hover:bg-seek-card/80 transition">
      {/* Category + Time */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-seek-teal/20 text-seek-teal">
          {market.category}
        </span>
        <span className="text-xs text-gray-500">{timeLeft()}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 leading-tight">{market.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{market.description}</p>

      {/* Probability Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-seek-teal font-medium">YES {yesPercent.toFixed(1)}%</span>
          <span className="text-red-400 font-medium">NO {noPercent.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-seek-teal to-seek-teal/60 rounded-full transition-all"
            style={{ width: `${yesPercent}%` }}
          />
        </div>
      </div>

      {/* Pool Info */}
      <div className="flex justify-between text-sm text-gray-400 mb-4">
        <span>💰 Total Pool: {totalPool.toFixed(1)} SOL</span>
        <span>👥 {Math.floor(totalPool / 0.5)} predictions</span>
      </div>

      {/* Bet Section */}
      {!showBetting ? (
        <button
          onClick={() => setShowBetting(true)}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-seek-purple to-seek-teal text-white font-medium text-sm hover:opacity-90 transition"
        >
          Make a Prediction
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="SOL amount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="flex-1 bg-seek-dark border border-seek-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-seek-purple"
              min="0.01"
              step="0.01"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 rounded-lg btn-yes text-white font-medium text-sm transition">
              🟢 YES
            </button>
            <button className="flex-1 py-2.5 rounded-lg btn-no text-white font-medium text-sm transition">
              🔴 NO
            </button>
          </div>
          <button
            onClick={() => setShowBetting(false)}
            className="w-full text-xs text-gray-500 hover:text-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
