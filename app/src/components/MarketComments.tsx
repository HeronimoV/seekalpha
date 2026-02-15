"use client";

import { FC, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface Comment {
  wallet: string;
  message: string;
  timestamp: number;
}

interface MarketCommentsProps {
  marketId: number;
}

export const MarketComments: FC<MarketCommentsProps> = ({ marketId }) => {
  const { publicKey, connected } = useWallet();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const storageKey = `seekalpha-comments-${marketId}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setComments(JSON.parse(stored));
    } catch {}
  }, [storageKey]);

  const postComment = () => {
    if (!publicKey || !newComment.trim()) return;
    const comment: Comment = {
      wallet: publicKey.toString(),
      message: newComment.trim().slice(0, 280),
      timestamp: Date.now(),
    };
    const updated = [comment, ...comments];
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNewComment("");
  };

  const truncateWallet = (w: string) => `${w.slice(0, 4)}...${w.slice(-4)}`;

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="mt-6 bg-seek-card border border-seek-border rounded-xl p-5">
      <h3 className="font-semibold text-sm text-gray-300 mb-4">💬 Discussion</h3>

      {connected && publicKey ? (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value.slice(0, 280))}
              placeholder="Share your thoughts..."
              className="flex-1 bg-seek-dark border border-seek-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-seek-purple placeholder-gray-500"
              onKeyDown={(e) => e.key === "Enter" && postComment()}
            />
            <button
              onClick={postComment}
              disabled={!newComment.trim()}
              className="px-4 py-2.5 rounded-lg bg-seek-purple text-white text-sm font-medium hover:bg-seek-purple/80 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
          <div className="text-xs text-gray-600 mt-1 text-right">{newComment.length}/280</div>
        </div>
      ) : (
        <div className="text-center py-4 mb-4 bg-seek-dark rounded-lg border border-seek-border">
          <p className="text-sm text-gray-400">🔗 Connect your wallet to join the discussion</p>
        </div>
      )}

      {comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          <p className="text-2xl mb-2">💬</p>
          <p>No comments yet — be the first!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {comments.map((c, i) => (
            <div key={i} className="bg-seek-dark rounded-lg p-3 border border-seek-border/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-seek-teal">{truncateWallet(c.wallet)}</span>
                <span className="text-xs text-gray-600">{timeAgo(c.timestamp)}</span>
              </div>
              <p className="text-sm text-gray-300">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
