"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import dynamic from "next/dynamic";
import {
  fetchAllMarkets,
  fetchUserPrediction,
  fetchConfig,
  buildClaimWinningsTx,
  getMarketPda,
  OnChainMarket,
} from "@/lib/program";
import { inferCategory } from "@/lib/constants";
import {
  loadGamification,
  updateStreak,
  ALL_BADGES,
  getBadgeDetails,
  GamificationData,
} from "@/lib/gamification";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

interface UserPred {
  market: OnChainMarket;
  position: boolean;
  amount: number;
  claimed: boolean;
  category: string;
}

export default function PortfolioPage() {
  const { connected, publicKey, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const [predictions, setPredictions] = useState<UserPred[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [gamification, setGamification] = useState<GamificationData | null>(null);

  useEffect(() => {
    if (!connected || !publicKey) return;

    setLoading(true);
    (async () => {
      try {
        const markets = await fetchAllMarkets();
        const preds: UserPred[] = [];

        for (const market of markets) {
          const marketPda = getMarketPda(market.id);
          const pred = await fetchUserPrediction(marketPda, publicKey);
          if (pred) {
            preds.push({
              market,
              position: pred.position,
              amount: pred.amount,
              claimed: pred.claimed,
              category: inferCategory(market.title),
            });
          }
        }

        setPredictions(preds);

        // Update streaks from resolved markets
        const walletStr = publicKey.toString();
        for (const pred of preds) {
          if (pred.market.resolved) {
            updateStreak(walletStr, pred.market.outcome === pred.position);
          }
        }
        setGamification(loadGamification(walletStr));
      } catch (err) {
        console.error("Failed to load predictions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [connected, publicKey]);

  const handleClaim = async (pred: UserPred) => {
    if (!publicKey || !signTransaction || !signAllTransactions) return;

    try {
      setClaimingId(pred.market.id);
      const config = await fetchConfig();
      const wallet = { publicKey, signTransaction, signAllTransactions };
      const provider = new AnchorProvider(connection, wallet as any, { commitment: "confirmed" });

      const tx = await buildClaimWinningsTx(
        provider,
        pred.market.id,
        new PublicKey(config.treasury)
      );

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signedTx = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig, "confirmed");

      // Refresh
      window.location.reload();
    } catch (err: any) {
      console.error("Claim failed:", err);
      alert(err.message || "Claim failed");
    } finally {
      setClaimingId(null);
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-6">👛</div>
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-8">
          Connect your Solana wallet to view your predictions and winnings.
        </p>
        <WalletMultiButton className="!bg-seek-purple hover:!bg-seek-purple/80 !rounded-xl !h-12 !text-base !px-8" />
      </div>
    );
  }

  const activePredictions = predictions.filter((p) => !p.market.resolved);
  const totalStaked = predictions.reduce((sum, p) => sum + p.amount, 0);
  const wonPredictions = predictions.filter(
    (p) => p.market.resolved && p.market.outcome === p.position
  );
  const lostPredictions = predictions.filter(
    (p) => p.market.resolved && p.market.outcome !== p.position
  );
  const winRate =
    wonPredictions.length + lostPredictions.length > 0
      ? (wonPredictions.length / (wonPredictions.length + lostPredictions.length)) * 100
      : 0;

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
      <p className="text-gray-400 mb-8">
        {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)} · Track your predictions and claim winnings
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-seek-card border border-seek-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">Active</div>
          <div className="text-2xl font-bold text-white">{activePredictions.length}</div>
        </div>
        <div className="bg-seek-card border border-seek-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">Total Staked</div>
          <div className="text-2xl font-bold text-seek-teal">{totalStaked.toFixed(2)} SOL</div>
        </div>
        <div className="bg-seek-card border border-seek-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">Won</div>
          <div className="text-2xl font-bold text-green-400">{wonPredictions.length}</div>
        </div>
        <div className="bg-seek-card border border-seek-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-seek-purple">
            {predictions.length > 0 ? `${winRate.toFixed(0)}%` : "—"}
          </div>
        </div>
      </div>

      {/* Badges & Streak */}
      {gamification && (
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">Achievements</h2>
            {gamification.streak > 0 && (
              <span className="text-sm px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                🔥 {gamification.streak}-Streak
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ALL_BADGES.map((badge) => {
              const earned = gamification.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rounded-xl p-4 text-center border transition ${
                    earned
                      ? "bg-seek-card border-seek-teal/30"
                      : "bg-seek-card/40 border-seek-border opacity-40"
                  }`}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-medium">{badge.name}</div>
                  <div className="text-[10px] text-gray-500 mt-1">{badge.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-seek-purple mb-4"></div>
          <p className="text-gray-400">Loading your predictions from Solana...</p>
        </div>
      )}

      {/* Predictions List */}
      {!loading && predictions.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Your Predictions</h2>
          <div className="space-y-4">
            {predictions.map((pred) => {
              const isWin = pred.market.resolved && pred.market.outcome === pred.position;
              const isLoss = pred.market.resolved && pred.market.outcome !== pred.position;
              const canClaim = isWin && !pred.claimed;

              return (
                <div
                  key={pred.market.id}
                  className="bg-seek-card border border-seek-border rounded-xl p-5 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-seek-teal/20 text-seek-teal">
                        {pred.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          !pred.market.resolved
                            ? "bg-yellow-500/20 text-yellow-400"
                            : isWin
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {!pred.market.resolved ? "ACTIVE" : isWin ? "WON" : "LOST"}
                      </span>
                    </div>
                    <h3 className="font-medium mb-1">{pred.market.title}</h3>
                    <div className="text-sm text-gray-400">
                      You predicted{" "}
                      <span className={pred.position ? "text-seek-teal font-medium" : "text-red-400 font-medium"}>
                        {pred.position ? "YES" : "NO"}
                      </span>{" "}
                      with {pred.amount.toFixed(2)} SOL
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {canClaim && (
                      <button
                        onClick={() => handleClaim(pred)}
                        disabled={claimingId === pred.market.id}
                        className="px-4 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition disabled:opacity-50"
                      >
                        {claimingId === pred.market.id ? "Claiming..." : "💰 Claim"}
                      </button>
                    )}
                    {pred.claimed && (
                      <span className="text-xs text-gray-500">Claimed ✓</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && predictions.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-4">🔮</p>
          <p>No predictions yet. Go make some calls!</p>
        </div>
      )}
    </div>
  );
}
