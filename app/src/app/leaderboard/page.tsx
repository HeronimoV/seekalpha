"use client";

import { FC } from "react";

interface LeaderEntry {
  rank: number;
  address: string;
  wins: number;
  totalBets: number;
  winRate: number;
  totalEarned: number;
  streak: number;
}

const DEMO_LEADERBOARD: LeaderEntry[] = [
  { rank: 1, address: "7xKX...m4Fp", wins: 23, totalBets: 28, winRate: 82.1, totalEarned: 156.4, streak: 7 },
  { rank: 2, address: "3bNq...8sWz", wins: 19, totalBets: 25, winRate: 76.0, totalEarned: 98.2, streak: 4 },
  { rank: 3, address: "9pRm...2vKd", wins: 31, totalBets: 42, winRate: 73.8, totalEarned: 87.6, streak: 2 },
  { rank: 4, address: "5cYt...6nJh", wins: 15, totalBets: 21, winRate: 71.4, totalEarned: 65.3, streak: 5 },
  { rank: 5, address: "2wFx...9qLp", wins: 28, totalBets: 40, winRate: 70.0, totalEarned: 54.8, streak: 1 },
  { rank: 6, address: "8dHn...3tRk", wins: 12, totalBets: 18, winRate: 66.7, totalEarned: 43.2, streak: 3 },
  { rank: 7, address: "4jSb...7wMc", wins: 20, totalBets: 31, winRate: 64.5, totalEarned: 38.9, streak: 0 },
  { rank: 8, address: "6mVe...1pXa", wins: 17, totalBets: 27, winRate: 63.0, totalEarned: 31.5, streak: 2 },
  { rank: 9, address: "1nWg...4yDf", wins: 14, totalBets: 23, winRate: 60.9, totalEarned: 28.7, streak: 1 },
  { rank: 10, address: "0kZi...5uBs", wins: 11, totalBets: 19, winRate: 57.9, totalEarned: 22.1, streak: 0 },
];

const getRankEmoji = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

export default function LeaderboardPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-400">
          Top predictors on SeekAlpha — ranked by win rate
        </p>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {DEMO_LEADERBOARD.slice(0, 3).map((entry) => (
          <div
            key={entry.rank}
            className={`gradient-border rounded-xl bg-seek-card p-6 text-center ${
              entry.rank === 1 ? "md:order-2 md:scale-105" : ""
            } ${entry.rank === 2 ? "md:order-1" : ""} ${
              entry.rank === 3 ? "md:order-3" : ""
            }`}
          >
            <div className="text-4xl mb-3">{getRankEmoji(entry.rank)}</div>
            <div className="font-mono text-sm text-gray-400 mb-2">{entry.address}</div>
            <div className="text-2xl font-bold text-seek-teal mb-1">
              {entry.winRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400 mb-3">Win Rate</div>
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <span>{entry.wins}W / {entry.totalBets - entry.wins}L</span>
              <span>💰 {entry.totalEarned.toFixed(1)} SOL</span>
            </div>
            {entry.streak > 0 && (
              <div className="mt-2 text-xs text-orange-400">🔥 {entry.streak} win streak</div>
            )}
          </div>
        ))}
      </div>

      {/* Full Table */}
      <div className="bg-seek-card border border-seek-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 gap-4 px-6 py-3 text-xs text-gray-500 font-medium border-b border-seek-border">
          <div>Rank</div>
          <div>Address</div>
          <div className="text-center">Wins</div>
          <div className="text-center">Total</div>
          <div className="text-center">Win Rate</div>
          <div className="text-center">Earned</div>
          <div className="text-center">Streak</div>
        </div>
        {DEMO_LEADERBOARD.map((entry) => (
          <div
            key={entry.rank}
            className="grid grid-cols-7 gap-4 px-6 py-4 text-sm border-b border-seek-border/50 hover:bg-seek-dark/50 transition"
          >
            <div className="font-medium">{getRankEmoji(entry.rank)}</div>
            <div className="font-mono text-gray-400">{entry.address}</div>
            <div className="text-center text-seek-teal">{entry.wins}</div>
            <div className="text-center text-gray-400">{entry.totalBets}</div>
            <div className="text-center font-medium">{entry.winRate.toFixed(1)}%</div>
            <div className="text-center text-green-400">{entry.totalEarned.toFixed(1)} SOL</div>
            <div className="text-center">
              {entry.streak > 0 ? (
                <span className="text-orange-400">🔥 {entry.streak}</span>
              ) : (
                <span className="text-gray-600">—</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6 text-xs text-gray-600">
        Leaderboard updates after each market resolution
      </div>
    </div>
  );
}
