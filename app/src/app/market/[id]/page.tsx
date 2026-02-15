"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchMarket, OnChainMarket } from "@/lib/program";
import { inferCategory } from "@/lib/constants";
import { MarketCard } from "@/components/MarketCard";

export default function MarketPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [market, setMarket] = useState<(OnChainMarket & { category: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (isNaN(id)) {
      setError("Invalid market ID");
      setLoading(false);
      return;
    }

    fetchMarket(id)
      .then((m) => {
        setMarket({ ...m, category: inferCategory(m.title) });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Market not found");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-24">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-seek-purple mb-4"></div>
        <p className="text-gray-400">Loading market from Solana...</p>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-4">🔮</div>
        <h2 className="text-2xl font-bold mb-2">Market Not Found</h2>
        <p className="text-gray-400 mb-6">{error || "This market doesn't exist."}</p>
        <a
          href="/"
          className="px-6 py-3 rounded-xl bg-seek-purple text-white font-medium hover:bg-seek-purple/80 transition"
        >
          ← Back to Markets
        </a>
      </div>
    );
  }

  const totalPool = market.yesPool + market.noPool;
  const yesPercent = totalPool > 0 ? (market.yesPool / totalPool) * 100 : 50;

  return (
    <div className="py-8 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <a href="/" className="text-sm text-gray-500 hover:text-white transition">
          ← All Markets
        </a>
      </div>

      {/* Market Detail Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-seek-teal/20 text-seek-teal">
            {market.category}
          </span>
          <span className="text-xs text-gray-500">Market #{market.id}</span>
          {market.resolved && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              market.outcome ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}>
              Resolved: {market.outcome ? "YES ✅" : "NO ❌"}
            </span>
          )}
        </div>
      </div>

      {/* The Market Card (with full betting UI) */}
      <MarketCard market={market} />

      {/* Share Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
          }}
          className="flex-1 py-2.5 rounded-lg bg-seek-card border border-seek-border text-sm text-gray-400 hover:text-white hover:border-seek-purple transition"
        >
          {shareCopied ? "✅ Link Copied!" : "🔗 Copy Link"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`What do you think? "${market.title}" — predict now on @Seek_Alpha_`)}&url=${encodeURIComponent(`https://seekalpha.bet/market/${market.id}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 rounded-lg bg-gray-800 border border-seek-border text-sm text-gray-400 hover:text-white hover:border-gray-600 transition text-center"
        >
          𝕏 Share on X
        </a>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-seek-card border border-seek-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-3">Recent Activity</h3>
        <div className="text-center py-6 text-gray-500 text-sm">
          <p className="text-2xl mb-2">📊</p>
          <p>Activity feed coming soon!</p>
          <p className="text-xs text-gray-600 mt-1">On-chain predictions will appear here</p>
        </div>
      </div>

      {/* Market Details */}
      <div className="mt-6 bg-seek-card border border-seek-border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-sm text-gray-300">Market Details</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 text-xs mb-1">Created</div>
            <div className="text-white">{market.createdAt.toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Resolves</div>
            <div className="text-white">{market.resolutionTime.toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">YES Pool</div>
            <div className="text-seek-teal font-medium">{market.yesPool.toFixed(3)} SOL</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">NO Pool</div>
            <div className="text-red-400 font-medium">{market.noPool.toFixed(3)} SOL</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Total Volume</div>
            <div className="text-white font-medium">{totalPool.toFixed(3)} SOL</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Current Odds</div>
            <div className="text-white">{yesPercent.toFixed(1)}% YES / {(100 - yesPercent).toFixed(1)}% NO</div>
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-xs mb-1">Resolution Criteria</div>
          <div className="text-gray-300 text-sm">{market.description}</div>
        </div>

        <div>
          <div className="text-gray-500 text-xs mb-1">On-Chain Address</div>
          <a
            href={`https://explorer.solana.com/address/${market.pda}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-seek-teal text-xs hover:underline font-mono break-all"
          >
            {market.pda}
          </a>
        </div>
      </div>
    </div>
  );
}
