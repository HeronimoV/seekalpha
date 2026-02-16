"use client";

import { FC, useState, useEffect } from "react";

const STORAGE_KEY = "seekalpha-mainnet-banner-dismissed";

export const MainnetBanner: FC = () => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  if (dismissed) return null;

  return (
    <div className="banner-gradient text-white text-sm font-medium relative">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
        <span className="text-base">🚀</span>
        <span>
          SeekAlpha is <strong>LIVE on Solana Mainnet!</strong>{" "}
          <a href="/" className="underline underline-offset-2 hover:opacity-80 transition">
            Place your first prediction →
          </a>
        </span>
        <button
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "true");
            setDismissed(true);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-1"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
