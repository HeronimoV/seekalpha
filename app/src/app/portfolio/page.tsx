"use client";

import { FC, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

interface UserPrediction {
  marketTitle: string;
  position: "YES" | "NO";
  amount: number;
  status: "active" | "won" | "lost";
  potentialWin: number;
  category: string;
}

// Demo data — will be replaced with on-chain reads
const DEMO_PREDICTIONS: UserPrediction[] = [
  {
    marketTitle: "Will SOL hit $200 by end of February?",
    position: "YES",
    amount: 0.5,
    status: "active",
    potentialWin: 0.8,
    category: "Crypto",
  },
  {
    marketTitle: "Will Bitcoin reach $120K before April?",
    position: "NO",
    amount: 1.0,
    status: "active",
    potentialWin: 2.57,
    category: "Crypto",
  },
];

export default function PortfolioPage() {
  const { connected, publicKey } = useWallet();

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

  const activePredictions = DEMO_PREDICTIONS.filter((p) => p.status === "active");
  const totalStaked = DEMO_PREDICTIONS.reduce((sum, p) => sum + p.amount, 0);
  const totalPotential = DEMO_PREDICTIONS.reduce((sum, p) => sum + p.potentialWin, 0);

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
      <p className="text-gray-400 mb-8">
        {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)} · Track your predictions and claim winnings
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-seek-card border border-seek-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">Active Predictions</div>
          <div className="text-2xl font-bold text-white">{activePredictions.length}</div>
        </div>
        <div className="bg-seek-card border border-seek-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">Total Staked</div>
          <div className="text-2xl font-bold text-seek-teal">{totalStaked.toFixed(2)} SOL</div>
        </div>
        <div className="bg-seek-card border border-seek-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">Potential Winnings</div>
          <div className="text-2xl font-bold text-green-400">{totalPotential.toFixed(2)} SOL</div>
        </div>
        <div className="bg-seek-card border border-seek-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-seek-purple">—</div>
        </div>
      </div>

      {/* Predictions List */}
      <h2 className="text-xl font-semibold mb-4">Your Predictions</h2>
      <div className="space-y-4">
        {DEMO_PREDICTIONS.map((pred, i) => (
          <div
            key={i}
            className="bg-seek-card border border-seek-border rounded-xl p-5 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-seek-teal/20 text-seek-teal">
                  {pred.category}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    pred.status === "active"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : pred.status === "won"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {pred.status.toUpperCase()}
                </span>
              </div>
              <h3 className="font-medium mb-1">{pred.marketTitle}</h3>
              <div className="text-sm text-gray-400">
                You predicted{" "}
                <span
                  className={
                    pred.position === "YES" ? "text-seek-teal font-medium" : "text-red-400 font-medium"
                  }
                >
                  {pred.position}
                </span>{" "}
                with {pred.amount} SOL
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-sm text-gray-400">Potential Win</div>
              <div className="text-lg font-bold text-green-400">
                +{pred.potentialWin.toFixed(2)} SOL
              </div>
              {pred.status === "won" && (
                <button className="mt-2 px-4 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition">
                  Claim
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {DEMO_PREDICTIONS.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-4">🔮</p>
          <p>No predictions yet. Go make some calls!</p>
        </div>
      )}
    </div>
  );
}
