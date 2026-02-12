"use client";

import { FC, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getBalance } from "@/lib/program";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export const Navbar: FC = () => {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (publicKey && connected) {
      getBalance(publicKey).then(setBalance).catch(() => setBalance(null));
      const interval = setInterval(() => {
        getBalance(publicKey).then(setBalance).catch(() => setBalance(null));
      }, 15000);
      return () => clearInterval(interval);
    } else {
      setBalance(null);
    }
  }, [publicKey, connected]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-seek-border">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold bg-gradient-to-r from-seek-purple to-seek-teal bg-clip-text text-transparent">
          🔮 SeekAlpha
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-seek-purple/20 text-seek-purple border border-seek-purple/30">
          DEVNET
        </span>
      </div>

      <div className="flex items-center gap-6">
        <a href="/" className="text-sm text-gray-400 hover:text-white transition hidden md:block">
          Markets
        </a>
        <a href="/portfolio" className="text-sm text-gray-400 hover:text-white transition hidden md:block">
          Portfolio
        </a>
        <a href="/leaderboard" className="text-sm text-gray-400 hover:text-white transition hidden md:block">
          Leaderboard
        </a>
        {connected && balance !== null && (
          <span className="text-sm text-seek-teal font-medium">
            {balance.toFixed(2)} SOL
          </span>
        )}
        <WalletMultiButton className="!bg-seek-purple hover:!bg-seek-purple/80 !rounded-lg !h-9 !text-sm" />
      </div>
    </nav>
  );
};
