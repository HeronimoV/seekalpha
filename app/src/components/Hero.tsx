"use client";

import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
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

  return (
    <div className="text-center py-10 md:py-16 px-4">
      <div className="text-5xl md:text-6xl mb-4 md:mb-6">🔮</div>
      <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
        <span className="bg-gradient-to-r from-seek-purple via-seek-teal to-seek-purple bg-clip-text text-transparent">
          Predict. Earn. Defy the Market.
        </span>
      </h1>
      <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-6 md:mb-8 px-2">
        The first prediction market built for Solana Seeker. Put your conviction on-chain
        and earn when you&apos;re right.
      </p>

      {!connected && (
        <div className="mb-6 md:mb-8">
          <WalletMultiButton className="!bg-gradient-to-r !from-seek-purple !to-seek-teal hover:!opacity-90 !rounded-xl !h-12 !text-base !px-8" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <div className="text-left">
            <div className="text-white font-medium">10 Active Markets</div>
            <div>Predict outcomes</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <div className="text-left">
            <div className="text-white font-medium">1,505 SOL</div>
            <div>Total volume</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <div className="text-left">
            <div className="text-white font-medium">3% Fee</div>
            <div>Lowest on Solana</div>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-6 inline-flex items-center gap-2 text-xs text-gray-600 bg-seek-card px-4 py-2 rounded-full border border-seek-border">
        <span className="w-2 h-2 rounded-full bg-seek-teal animate-pulse"></span>
        Running on Solana Devnet — testnet SOL only
      </div>
    </div>
  );
};
