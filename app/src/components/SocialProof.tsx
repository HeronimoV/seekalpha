"use client";

import { FC } from "react";

const features = [
  {
    icon: "◎",
    title: "Built on Solana",
    description: "Lightning-fast transactions with sub-second finality",
  },
  {
    icon: "🔓",
    title: "Open Source",
    description: "Fully transparent smart contracts — verify everything",
  },
  {
    icon: "💸",
    title: "3% Fees",
    description: "Industry-lowest fees — more profits stay with you",
  },
  {
    icon: "🌍",
    title: "No KYC",
    description: "Connect your wallet and start predicting instantly",
  },
];

export const SocialProof: FC = () => {
  return (
    <div className="mb-12 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Trusted by the Solana Community</h2>
        <p className="text-gray-500 text-sm">Transparent, permissionless, and built for degens.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`bg-seek-card border border-seek-border rounded-xl p-5 text-center card-glow shimmer-hover animate-slide-up stagger-${i + 1}`}
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
