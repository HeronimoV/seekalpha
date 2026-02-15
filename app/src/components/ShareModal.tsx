"use client";

import { FC, useState } from "react";

interface ShareModalProps {
  show: boolean;
  marketId: number;
  marketTitle: string;
  position?: boolean;
  onClose: () => void;
}

export const ShareModal: FC<ShareModalProps> = ({ show, marketId, marketTitle, position, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!show) return null;

  const url = `https://seekalpha.bet/market/${marketId}`;
  const posText = position !== undefined ? (position ? "YES" : "NO") : "";
  const shareText = posText
    ? `I just bet ${posText} on "${marketTitle}" 🔮 What's your prediction?`
    : `Check out this prediction market: "${marketTitle}" 🔮`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}&via=Seek_Alpha_`,
      "_blank"
    );
  };

  const shareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const shareDiscord = () => {
    navigator.clipboard.writeText(`${shareText}\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-seek-card border border-seek-border rounded-2xl p-6 w-full max-w-md mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">📢</div>
          <h3 className="text-lg font-bold">Share Your Prediction!</h3>
          <p className="text-sm text-gray-400 mt-1">Let everyone know what you think</p>
        </div>

        {/* Preview card */}
        <div className="bg-seek-dark rounded-xl p-4 mb-5 border border-seek-border/50">
          <p className="text-sm text-gray-300">{shareText}</p>
          <p className="text-xs text-seek-teal mt-2">{url}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={copyLink}
            className="py-3 rounded-xl bg-seek-dark border border-seek-border text-sm font-medium hover:border-seek-purple transition"
          >
            {copied ? "✅ Copied!" : "🔗 Copy Link"}
          </button>
          <button
            onClick={shareX}
            className="py-3 rounded-xl bg-gray-800 border border-seek-border text-sm font-medium hover:border-gray-600 transition"
          >
            𝕏 Share on X
          </button>
          <button
            onClick={shareTelegram}
            className="py-3 rounded-xl bg-blue-900/30 border border-blue-800/30 text-sm font-medium hover:border-blue-600/50 transition"
          >
            ✈️ Telegram
          </button>
          <button
            onClick={shareDiscord}
            className="py-3 rounded-xl bg-indigo-900/30 border border-indigo-800/30 text-sm font-medium hover:border-indigo-600/50 transition"
          >
            💬 Discord
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 text-sm text-gray-500 hover:text-gray-300 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
