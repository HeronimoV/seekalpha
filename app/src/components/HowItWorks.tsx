"use client";

import { FC } from "react";

const steps = [
  { icon: "🔗", title: "Connect Wallet", desc: "Link your Phantom wallet in one click. No sign-up, no KYC." },
  { icon: "🔍", title: "Browse Markets", desc: "Explore predictions across crypto, sports, AI & more." },
  { icon: "🎯", title: "Place Your Bet", desc: "Go YES or NO and back your conviction with SOL." },
  { icon: "💰", title: "Win & Claim", desc: "If you're right, claim your winnings instantly on-chain." },
];

export const HowItWorks: FC = () => {
  return (
    <div className="mb-16 mt-8">
      <h2 className="text-2xl font-bold text-center mb-2">How It Works</h2>
      <p className="text-gray-500 text-sm text-center mb-8">Four simple steps to start predicting</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-seek-card border border-seek-border rounded-xl p-6 text-center relative group hover:border-seek-purple/50 transition"
          >
            <div className="absolute -top-3 left-4 text-xs font-bold text-seek-purple bg-seek-dark px-2 py-0.5 rounded-full border border-seek-border">
              Step {i + 1}
            </div>
            <div className="text-4xl mb-3 mt-1">{step.icon}</div>
            <h3 className="font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-gray-400">{step.desc}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-seek-teal font-bold">SOL-native</span> — no bridging
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-seek-purple font-bold">3% fee</span> — lowest available
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-green-400 font-bold">Open source</span> — fully transparent
        </div>
      </div>
    </div>
  );
};
