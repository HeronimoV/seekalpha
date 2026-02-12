"use client";

import { FC } from "react";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export const Navbar: FC = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-seek-border">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold bg-gradient-to-r from-seek-purple to-seek-teal bg-clip-text text-transparent">
          SeekAlpha
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-seek-purple/20 text-seek-purple border border-seek-purple/30">
          BETA
        </span>
      </div>

      <div className="flex items-center gap-6">
        <a href="#" className="text-sm text-gray-400 hover:text-white transition">
          Markets
        </a>
        <a href="#" className="text-sm text-gray-400 hover:text-white transition">
          Portfolio
        </a>
        <a href="#" className="text-sm text-gray-400 hover:text-white transition">
          Leaderboard
        </a>
        <WalletMultiButton className="!bg-seek-purple hover:!bg-seek-purple/80 !rounded-lg !h-9 !text-sm" />
      </div>
    </nav>
  );
};
