"use client";

import { FC } from "react";

export const Hero: FC = () => {
  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-5xl font-bold mb-4">
        <span className="bg-gradient-to-r from-seek-purple via-seek-teal to-seek-purple bg-clip-text text-transparent">
          Predict. Earn. Defy the Market.
        </span>
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
        The first prediction market built for Solana Seeker. Put your conviction on-chain
        and earn when you&apos;re right.
      </p>
      <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          <div className="text-left">
            <div className="text-white font-medium">4 Active Markets</div>
            <div>Predict outcomes</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <div className="text-left">
            <div className="text-white font-medium">946.5 SOL</div>
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
    </div>
  );
};
