"use client";

import { FC, useEffect, useState } from "react";
import { Confetti } from "./Confetti";

interface BetSuccessProps {
  show: boolean;
  marketTitle: string;
  position: boolean;
  amount: number;
  potentialPayout: number;
  txSignature: string;
  variant?: "bet" | "win";
  onClose: () => void;
}

export const BetSuccess: FC<BetSuccessProps> = ({
  show,
  marketTitle,
  position,
  amount,
  potentialPayout,
  txSignature,
  variant = "bet",
  onClose,
}) => {
  const [visible, setVisible] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setTimeout(() => setSlideIn(true), 50);
    } else {
      setSlideIn(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [show]);

  if (!visible) return null;

  const isWin = variant === "win";

  return (
    <>
      <Confetti active={show} variant={variant} />

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${
          slideIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Success Card */}
      <div
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90%] max-w-md transition-all duration-500 ${
          slideIn ? "scale-100 opacity-100" : "scale-90 opacity-0 translate-y-8"
        }`}
      >
        <div
          className={`rounded-2xl p-6 ${
            isWin
              ? "bg-gradient-to-br from-yellow-900/90 to-yellow-700/90 border-2 border-yellow-500/50"
              : "bg-gradient-to-br from-seek-purple/90 to-seek-teal/90 border-2 border-seek-teal/50"
          } backdrop-blur-xl shadow-2xl`}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">
              {isWin ? "🏆" : "🔮"}
            </div>
            <h2 className="text-xl font-bold text-white">
              {isWin ? "YOU WON!" : "Prediction Placed!"}
            </h2>
          </div>

          {/* Market Info */}
          <div className="bg-black/20 rounded-xl p-4 mb-4">
            <p className="text-sm text-white/80 mb-3 leading-tight">{marketTitle}</p>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  position
                    ? "bg-seek-teal/30 text-seek-teal border border-seek-teal/50"
                    : "bg-red-500/30 text-red-400 border border-red-500/50"
                }`}
              >
                {position ? "🟢 YES" : "🔴 NO"}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">{isWin ? "Won" : "Staked"}</span>
                <span className="text-white font-semibold">{amount.toFixed(3)} SOL</span>
              </div>
              {!isWin && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Potential Payout</span>
                  <span className="text-green-400 font-semibold">
                    {potentialPayout.toFixed(3)} SOL
                  </span>
                </div>
              )}
              {isWin && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Payout</span>
                  <span className="text-yellow-300 font-bold text-lg">
                    +{potentialPayout.toFixed(3)} SOL
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* TX Link */}
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs text-white/50 hover:text-white/80 transition mb-4"
          >
            ⛓️ View on Solana Explorer →
          </a>

          {/* Share to X */}
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(
              isWin
                ? `🏆 Just won ${potentialPayout.toFixed(3)} SOL on SeekAlpha!\n\n"${marketTitle}"\n\nI predicted ${position ? "YES" : "NO"} and was RIGHT 💰\n\nPredict & earn on Solana 👇\nhttps://seekalpha.bet\n\n@Seek_Alpha_ #SeekAlpha`
                : `🔮 Just placed a prediction on SeekAlpha!\n\n"${marketTitle}"\n\nI'm betting ${position ? "YES 🟢" : "NO 🔴"} with ${amount.toFixed(3)} SOL\n\nThink you know better? 👇\nhttps://seekalpha.bet\n\n@Seek_Alpha_ #SeekAlpha`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-xl font-semibold text-sm text-center transition active:scale-[0.98] bg-black text-white hover:bg-gray-900 mb-3"
          >
            𝕏 Share to X
          </a>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition active:scale-[0.98] ${
              isWin
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {isWin ? "💰 Collect & Continue" : "🔥 Let's Go!"}
          </button>
        </div>
      </div>
    </>
  );
};
