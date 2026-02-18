"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchAllMarkets, fetchAllPredictions, OnChainMarket, OnChainPrediction } from "@/lib/program";
import { loadGamification, GamificationData } from "@/lib/gamification";
import { LeaderboardSkeleton } from "@/components/Skeleton";

interface PlatformStats {
  totalMarkets: number;
  activeMarkets: number;
  totalVolume: number;
  totalPredictions: number;
}

interface UserStats {
  wallet: string;
  predictions: number;
  wins: number;
  losses: number;
  winRate: number;
  totalWagered: number;
  netResult: number;
}

function truncateWallet(wallet: string): string {
  return wallet.slice(0, 4) + "..." + wallet.slice(-4);
}

function buildLeaderboard(predictions: OnChainPrediction[], markets: OnChainMarket[]): UserStats[] {
  // Build market lookup by PDA
  const marketMap = new Map<string, OnChainMarket>();
  for (const m of markets) {
    marketMap.set(m.pda, m);
  }

  // Aggregate per user
  const userMap = new Map<string, {
    predictions: number;
    wins: number;
    losses: number;
    totalWagered: number;
    totalWinnings: number;
  }>();

  for (const pred of predictions) {
    let entry = userMap.get(pred.user);
    if (!entry) {
      entry = { predictions: 0, wins: 0, losses: 0, totalWagered: 0, totalWinnings: 0 };
      userMap.set(pred.user, entry);
    }

    entry.predictions++;
    entry.totalWagered += pred.amount;

    const market = marketMap.get(pred.market);
    if (market && market.resolved) {
      if (pred.position === market.outcome) {
        entry.wins++;
        // Approximate winnings: proportional share of losing pool + original amount
        const totalPool = market.yesPool + market.noPool;
        const winningPool = market.outcome ? market.yesPool : market.noPool;
        if (winningPool > 0) {
          const share = pred.amount / winningPool;
          const grossPayout = share * totalPool * 0.97; // 3% fee
          entry.totalWinnings += grossPayout;
        }
      } else {
        entry.losses++;
      }
    }
  }

  // Convert to array, filter min 2 predictions, sort by win rate
  const leaderboard: UserStats[] = [];
  for (const [wallet, data] of Array.from(userMap.entries())) {
    if (data.predictions < 2) continue;
    const resolved = data.wins + data.losses;
    const winRate = resolved > 0 ? (data.wins / resolved) * 100 : 0;
    leaderboard.push({
      wallet,
      predictions: data.predictions,
      wins: data.wins,
      losses: data.losses,
      winRate,
      totalWagered: data.totalWagered,
      netResult: data.totalWinnings - data.totalWagered,
    });
  }

  leaderboard.sort((a, b) => {
    if (b.winRate !== a.winRate) return b.winRate - a.winRate;
    return b.predictions - a.predictions;
  });

  return leaderboard;
}

export default function LeaderboardPage() {
  const { publicKey } = useWallet();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [markets, setMarkets] = useState<OnChainMarket[]>([]);
  const [leaderboard, setLeaderboard] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [gamification, setGamification] = useState<GamificationData | null>(null);

  useEffect(() => {
    Promise.all([fetchAllMarkets(), fetchAllPredictions()])
      .then(([m, predictions]) => {
        setMarkets(m);
        const totalVol = m.reduce((sum, mk) => sum + mk.yesPool + mk.noPool, 0);
        setStats({
          totalMarkets: m.length,
          activeMarkets: m.filter((mk) => !mk.resolved).length,
          totalVolume: totalVol,
          totalPredictions: predictions.length,
        });
        setLeaderboard(buildLeaderboard(predictions, m));
        setLoading(false);
        if (publicKey) {
          setGamification(loadGamification(publicKey.toString()));
        }
      })
      .catch(() => setLoading(false));
  }, [publicKey]);

  // Sort markets by total volume
  const topMarkets = [...markets]
    .sort((a, b) => b.yesPool + b.noPool - (a.yesPool + a.noPool))
    .slice(0, 10);

  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-400">
          Platform stats, top predictors, and hottest markets
        </p>
      </div>

      {loading ? (
        <LeaderboardSkeleton />
      ) : (
        <>
          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-seek-card border border-seek-border rounded-xl p-5 text-center card-glow animate-slide-up stagger-1">
              <div className="text-3xl font-bold text-white animate-count">{stats?.totalMarkets || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Total Markets</div>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-5 text-center card-glow animate-slide-up stagger-2">
              <div className="text-3xl font-bold text-seek-teal animate-count">{stats?.activeMarkets || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Active Markets</div>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-5 text-center card-glow animate-slide-up stagger-3">
              <div className="text-3xl font-bold text-seek-purple animate-count">{stats?.totalVolume.toFixed(2) || "0"}</div>
              <div className="text-sm text-gray-400 mt-1">Total Volume (SOL)</div>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-5 text-center card-glow animate-slide-up stagger-4">
              <div className="text-3xl font-bold text-green-400 animate-count">{stats?.totalPredictions || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Predictions Made</div>
            </div>
          </div>

          {/* Top Predictors */}
          <div className="bg-seek-card border border-seek-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">👑 Top Predictors</h2>
            {leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🔮</div>
                <p className="text-gray-400">No predictions yet. Be the first to compete!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header */}
                <div className="hidden md:flex items-center gap-4 px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                  <div className="w-10 text-center">Rank</div>
                  <div className="flex-1">Wallet</div>
                  <div className="w-20 text-center">Predictions</div>
                  <div className="w-20 text-center">Win Rate</div>
                  <div className="w-24 text-right">Wagered</div>
                  <div className="w-24 text-right">Net P&L</div>
                </div>

                {leaderboard.map((user, i) => {
                  const rank = i + 1;
                  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
                  const isCurrentUser = publicKey && user.wallet === publicKey.toString();

                  return (
                    <div
                      key={user.wallet}
                      className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 border rounded-lg transition-colors ${
                        isCurrentUser
                          ? "border-seek-teal/50 bg-seek-teal/5"
                          : "border-seek-border hover:border-seek-border/80"
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex items-center gap-3 md:w-10 md:justify-center">
                        <span className="text-lg font-bold">
                          {medal || `#${rank}`}
                        </span>
                        <span className="md:hidden font-mono text-sm text-gray-300">
                          {truncateWallet(user.wallet)}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-seek-teal/20 text-seek-teal">You</span>
                          )}
                        </span>
                      </div>

                      {/* Wallet - desktop */}
                      <div className="hidden md:flex flex-1 items-center gap-2">
                        <span className="font-mono text-sm text-gray-300">{truncateWallet(user.wallet)}</span>
                        {isCurrentUser && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-seek-teal/20 text-seek-teal">You</span>
                        )}
                      </div>

                      {/* Stats - mobile: inline grid */}
                      <div className="grid grid-cols-4 gap-2 md:contents text-center md:text-right">
                        <div className="md:w-20 md:text-center">
                          <div className="text-sm font-medium text-white">{user.predictions}</div>
                          <div className="text-xs text-gray-500 md:hidden">Bets</div>
                        </div>
                        <div className="md:w-20 md:text-center">
                          <div className={`text-sm font-medium ${
                            user.winRate >= 60 ? "text-green-400" : user.winRate >= 40 ? "text-yellow-400" : "text-red-400"
                          }`}>
                            {user.winRate.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500 md:hidden">Win</div>
                        </div>
                        <div className="md:w-24 md:text-right">
                          <div className="text-sm font-medium text-white">{user.totalWagered.toFixed(2)}</div>
                          <div className="text-xs text-gray-500 md:hidden">SOL</div>
                        </div>
                        <div className="md:w-24 md:text-right">
                          <div className={`text-sm font-bold ${
                            user.netResult >= 0 ? "text-green-400" : "text-red-400"
                          }`}>
                            {user.netResult >= 0 ? "+" : ""}{user.netResult.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 md:hidden">P&L</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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

          {/* Your Stats */}
          {gamification ? (
            <div className="bg-gradient-to-r from-seek-purple/5 to-seek-teal/5 border border-seek-teal/30 rounded-xl p-6 mb-8 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">🏅 Your Stats</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-seek-teal/20 text-seek-teal font-medium">Connected</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">🔥 {gamification.streak}</div>
                  <div className="text-xs text-gray-400 mt-1">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-seek-purple">{gamification.maxStreak}</div>
                  <div className="text-xs text-gray-400 mt-1">Best Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-seek-teal">{gamification.totalPredictions}</div>
                  <div className="text-xs text-gray-400 mt-1">Total Predictions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{gamification.badges.length}</div>
                  <div className="text-xs text-gray-400 mt-1">Badges Earned</div>
                </div>
              </div>
              {gamification.badges.length > 0 && (
                <div className="flex gap-2 mt-4 justify-center flex-wrap">
                  {gamification.badges.map((id) => {
                    const badge = { "first-prediction": "🔮", "streak-3": "🔥", "streak-5": "🔥🔥", "whale": "🐋", "early-bird": "🐦" }[id];
                    return (
                      <span key={id} className="text-lg" title={id}>{badge}</span>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-seek-card border border-seek-border rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">🏅</div>
              <h2 className="text-xl font-bold mb-2">Connect Wallet to See Your Stats</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Track your prediction streaks, badges, and rankings.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
