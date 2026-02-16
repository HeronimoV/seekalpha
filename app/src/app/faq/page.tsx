"use client";

import { useState, FC } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is SeekAlpha?",
    answer:
      "SeekAlpha is a decentralized prediction market built on Solana. You can bet on the outcomes of real-world events — from crypto prices to sports to politics. If your prediction is correct, you win a share of the pool.",
  },
  {
    question: "How do I get started?",
    answer:
      "1. Install the Phantom wallet (phantom.app)\n2. Fund your wallet with SOL\n3. Visit seekalpha.bet and click 'Select Wallet' to connect\n4. Browse markets, pick one, and place your prediction!\n\nWe're currently on Devnet, so you can test with free devnet SOL from faucet.solana.com.",
  },
  {
    question: "How does betting work?",
    answer:
      "Each market has a YES pool and a NO pool. When you bet, your SOL goes into one of these pools. When the market resolves, the winning side splits the total pool proportionally to their stakes. For example, if you put in 10% of the YES pool and YES wins, you get 10% of the total pool (minus the 3% fee).",
  },
  {
    question: "What are the fees?",
    answer:
      "SeekAlpha charges a flat 3% fee on winnings only. This fee is deducted when you claim your payout from a resolved market. There are no deposit fees, no withdrawal fees, and no fees on losing bets.",
  },
  {
    question: "How are markets resolved?",
    answer:
      "Currently, markets are resolved manually by the SeekAlpha team based on publicly verifiable information. In the future, we'll integrate Pyth and Switchboard oracles for automated resolution of crypto price markets.",
  },
  {
    question: "What happens if I lose?",
    answer:
      "If your prediction is wrong, you lose your staked SOL. It goes to the winners. That's the risk — but it's also why the payouts can be great when you're right.",
  },
  {
    question: "Can I bet on multiple markets?",
    answer:
      "Yes! You can place predictions on as many markets as you want. You can also bet on both YES and NO in the same market to hedge, though that's usually not profitable.",
  },
  {
    question: "How do I claim my winnings?",
    answer:
      "After a market resolves, go to your Portfolio page. You'll see a 'Claim' button next to any winning predictions. Click it, approve the transaction in your wallet, and your SOL will be sent to you.",
  },
  {
    question: "Is this on mainnet?",
    answer:
      "Not yet! We're currently in beta on Solana Devnet. This means you're playing with free test SOL, not real money. We'll announce our mainnet launch on Twitter (@Seek_Alpha_) when it's ready.",
  },
  {
    question: "What wallets are supported?",
    answer:
      "We support Phantom, Solflare, and any Solana-compatible wallet through the Solana Wallet Adapter. For the best experience on Seeker phones, we recommend Phantom.",
  },
  {
    question: "How is the payout calculated?",
    answer:
      "Your payout = (Your Stake / Winning Pool) × Total Pool × (1 - 0.03)\n\nFor example: You bet 1 SOL on YES. The YES pool is 10 SOL and the NO pool is 5 SOL (15 SOL total). If YES wins, your payout = (1/10) × 15 × 0.97 = 1.455 SOL — a profit of 0.455 SOL.",
  },
  {
    question: "Will SeekAlpha be on the Seeker dApp Store?",
    answer:
      "Yes! SeekAlpha is being built specifically for the Solana Seeker ecosystem. We're planning to submit to the dApp Store as soon as our mainnet version is stable.",
  },
  {
    question: "Can I create my own market?",
    answer:
      "Not yet — markets are currently curated by the SeekAlpha team to ensure quality. User-created markets are on our roadmap for Phase 3 (Q2 2026).",
  },
];

const FAQAccordion: FC<{ item: FAQItem }> = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-seek-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-seek-card/50 transition"
      >
        <span className="font-medium text-sm md:text-base pr-4">{item.question}</span>
        <span className={`text-gray-500 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed whitespace-pre-line border-t border-seek-border/50 pt-3">
          {item.answer}
        </div>
      )}
    </div>
  );
};

export default function FAQPage() {
  return (
    <div className="py-12 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">❓</div>
        <h1 className="text-3xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-400">Everything you need to know about SeekAlpha.</p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <FAQAccordion key={i} item={faq} />
        ))}
      </div>

      <div className="text-center mt-10 p-6 bg-seek-card border border-seek-border rounded-xl">
        <h3 className="font-semibold mb-2">Still have questions?</h3>
        <p className="text-sm text-gray-400 mb-4">
          Reach out to us on Twitter and we&apos;ll help you out.
        </p>
        <a
          href="https://twitter.com/Seek_Alpha_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 rounded-lg bg-seek-purple text-white text-sm font-medium hover:bg-seek-purple/80 transition"
        >
          🐦 @Seek_Alpha_
        </a>
      </div>
    </div>
  );
}
