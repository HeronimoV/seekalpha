"use client";

import { FC, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchConfig, fetchAllMarkets } from "@/lib/program";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export const Hero: FC = () => {
  const { connected } = useWallet();
  const [marketCount, setMarketCount] = useState<number>(0);
  const [totalVolume, setTotalVolume] = useState<number>(0);

  useEffect(() => {
    fetchConfig()
      .then((c) => setMarketCount(c.marketCount))
      .catch(() => {});
    fetchAllMarkets()
      .then((markets) => {
        const vol = markets.reduce((sum, m) => sum + m.yesPool + m.noPool, 0);
        setTotalVolume(vol);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="text-center py-12 md:py-20 px-4 animate-fade-in">
      {/* Pulsing LIVE ON MAINNET badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-seek-teal/10 border border-seek-teal/30 pulse-badge">
        <span className="w-2.5 h-2.5 rounded-full bg-seek-teal animate-pulse"></span>
        <span className="text-sm font-semibold text-seek-teal tracking-wide">LIVE ON MAINNET</span>
      </div>

      <div className="text-5xl md:text-6xl mb-4 md:mb-6">🔮</div>

      <h1 className="text-4xl md:text-6xl font-extrabold mb-2 md:mb-3 tracking-tight">
        <span className="animated-gradient-text">SeekAlpha</span>
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5">
        <span className="bg-gradient-to-r from-seek-purple via-seek-teal to-seek-purple bg-clip-text text-transparent">
          Predict. Earn. Defy the Market.
        </span>
      </h2>
      <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-10 px-2">
        The first prediction market built for Solana Seeker. Put your conviction on-chain
        and earn when you&apos;re right.
      </p>

      {!connected && (
        <div className="mb-8 md:mb-10">
          <WalletMultiButton className="!bg-gradient-to-r !from-seek-purple !to-seek-teal hover:!opacity-90 !rounded-xl !h-12 !text-base !px-8 btn-press" />
        </div>
      )}

      {/* Real-time Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-3 animate-slide-up stagger-1">
          <div className="w-12 h-12 rounded-xl bg-seek-purple/10 border border-seek-purple/20 flex items-center justify-center text-2xl">
            📊
          </div>
          <div className="text-left">
            <div className="text-white font-bold text-lg">{marketCount}</div>
            <div className="text-xs text-gray-500">Active Markets</div>
          </div>
        </div>
        <div className="flex items-center gap-3 animate-slide-up stagger-2">
          <div className="w-12 h-12 rounded-xl bg-seek-teal/10 border border-seek-teal/20 flex items-center justify-center text-2xl">
            💰
          </div>
          <div className="text-left">
            <div className="text-white font-bold text-lg">{totalVolume.toFixed(2)} SOL</div>
            <div className="text-xs text-gray-500">Total Volume</div>
          </div>
        </div>
        <div className="flex items-center gap-3 animate-slide-up stagger-3">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-2xl">
            ⚡
          </div>
          <div className="text-left">
            <div className="text-white font-bold text-lg">3%</div>
            <div className="text-xs text-gray-500">Lowest Fees</div>
          </div>
        </div>
      </div>
    </div>
  );
};
