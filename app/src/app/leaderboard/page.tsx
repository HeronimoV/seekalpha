"use client";

import { useEffect, useState } from "react";
import { fetchAllMarkets, OnChainMarket } from "@/lib/program";

interface PlatformStats {
  totalMarkets: number;
  activeMarkets: number;
  totalVolume: number;
  totalPredictions: number;
}

export default function LeaderboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [markets, setMarkets] = useState<OnChainMarket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMarkets()
      .then((m) => {
        setMarkets(m);
        const totalVol = m.reduce((sum, mk) => sum + mk.yesPool + mk.noPool, 0);
        setStats({
          totalMarkets: m.length,
          activeMarkets: m.filter((mk) => !mk.resolved).length,
          totalVolume: totalVol,
          totalPredictions: m.reduce(
            (sum, mk) => sum + (mk.yesPool > 0 ? 1 : 0) + (mk.noPool > 0 ? 1 : 0),
            0
          ),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Sort markets by total volume
  const topMarkets = [...markets]
    .sort((a, b) => b.yesPool + b.noPool - (a.yesPool + a.noPool))
    .slice(0, 10);

  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-400">
          Platform stats and top markets — user rankings coming soon!
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-seek-purple mb-4"></div>
          <p className="text-gray-400">Loading stats from Solana...</p>
        </div>
      ) : (
        <>
          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-seek-card border border-seek-border rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-white">{stats?.totalMarkets || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Total Markets</div>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-seek-teal">{stats?.activeMarkets || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Active Markets</div>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-seek-purple">{stats?.totalVolume.toFixed(2) || "0"}</div>
              <div className="text-sm text-gray-400 mt-1">Total Volume (SOL)</div>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-green-400">{stats?.totalPredictions || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Predictions Made</div>
            </div>
          </div>

          {/* Top Markets by Volume */}
          <div className="bg-seek-card border border-seek-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">🔥 Top Markets by Volume</h2>
            <div className="space-y-3">
              {topMarkets.map((market, i) => {
                const totalPool = market.yesPool + market.noPool;
                const yesPercent = totalPool > 0 ? (market.yesPool / totalPool) * 100 : 50;

                return (
                  <div
                    key={market.id}
                    className="flex items-center gap-4 p-4 border border-seek-border rounded-lg"
                  >
                    <div className="text-lg font-bold text-gray-500 w-8 text-center">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{market.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-seek-teal">YES {yesPercent.toFixed(0)}%</span>
                        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden max-w-[200px]">
                          <div
                            className="h-full bg-seek-teal rounded-full"
                            style={{ width: `${yesPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-red-400">NO {(100 - yesPercent).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{totalPool.toFixed(2)} SOL</div>
                      <div className="text-xs text-gray-500">volume</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-seek-card border border-seek-border rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">🏅</div>
            <h2 className="text-xl font-bold mb-2">User Rankings Coming Soon</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Win rate tracking, prediction streaks, and user profiles are in Phase 4.
              Start placing predictions now to build your track record!
            </p>
          </div>
        </>
      )}
    </div>
  );
}
