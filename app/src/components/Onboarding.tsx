"use client";

import { FC, useState, useEffect } from "react";

const STORAGE_KEY = "seekalpha-onboarding-complete";

const steps = [
  {
    emoji: "🔮",
    title: "Welcome to SeekAlpha!",
    description:
      "SeekAlpha is a decentralized prediction market on Solana. Predict outcomes of real-world events and earn SOL when you're right. Everything is on-chain, transparent, and trustless.",
  },
  {
    emoji: "👛",
    title: "Connect Your Wallet",
    description:
      "You'll need a Solana wallet to get started. We recommend Phantom — it works great on both desktop and Seeker.",
    link: { url: "https://phantom.app", label: "Download Phantom →" },
  },
  {
    emoji: "💧",
    title: "Get Devnet SOL",
    description:
      "SeekAlpha is currently on Solana Devnet. Get free test SOL from the faucet — it's not real money, so experiment freely!",
    link: { url: "https://faucet.solana.com", label: "Get Free Devnet SOL →" },
  },
  {
    emoji: "🎯",
    title: "Place Your First Prediction",
    description:
      "Browse markets, pick one you have conviction on, choose YES or NO, and stake your SOL. Your prediction is recorded on-chain instantly.",
  },
  {
    emoji: "🏆",
    title: "Track & Win",
    description:
      "Check your Portfolio to track active predictions. When markets resolve, claim your winnings! Earn badges and build your prediction streak.",
  },
];

export const Onboarding: FC = () => {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const done = localStorage.getItem(STORAGE_KEY);
      if (!done) setShow(true);
    }
  }, []);

  const complete = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  if (!show) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-seek-card border border-seek-border rounded-2xl max-w-md w-full p-6 md:p-8 relative">
        {/* Skip */}
        <button
          onClick={complete}
          className="absolute top-4 right-4 text-xs text-gray-500 hover:text-white transition"
        >
          Skip
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">{current.emoji}</div>
          <h2 className="text-xl font-bold mb-3">{current.title}</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{current.description}</p>
          {current.link && (
            <a
              href={current.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-seek-teal hover:text-seek-teal/80 font-medium transition"
            >
              {current.link.label}
            </a>
          )}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? "bg-seek-purple w-6" : i < step ? "bg-seek-teal" : "bg-seek-border"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-2.5 rounded-lg border border-seek-border text-gray-400 text-sm font-medium hover:text-white hover:border-seek-purple transition"
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => (isLast ? complete() : setStep(step + 1))}
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-seek-purple to-seek-teal text-white text-sm font-medium hover:opacity-90 transition"
          >
            {isLast ? "Get Started! 🚀" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};
