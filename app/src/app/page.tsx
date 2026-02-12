"use client";

import { Hero } from "@/components/Hero";
import { MarketCard } from "@/components/MarketCard";
import { fetchAllMarkets, OnChainMarket } from "@/lib/program";
import { inferCategory } from "@/lib/constants";
import { useState, useEffect } from "react";

const CATEGORIES = ["All", "Crypto", "Tech", "DeFi", "Sports", "Politics", "Memes", "Culture"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [markets, setMarkets] = useState<OnChainMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllMarkets()
      .then((m) => {
        setMarkets(m);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load markets:", err);
        setError("Failed to load markets from Solana. Please try again.");
        setLoading(false);
      });
  }, []);

  const marketsWithCategory = markets.map((m) => ({
    ...m,
    category: inferCategory(m.title),
  }));

  const filteredMarkets =
    activeCategory === "All"
      ? marketsWithCategory
      : marketsWithCategory.filter((m) => m.category === activeCategory);

  return (
    <>
      <Hero />

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 hide-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
              activeCategory === cat
                ? "bg-seek-purple text-white"
                : "bg-seek-card text-gray-400 hover:text-white border border-seek-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-seek-purple mb-4"></div>
          <p className="text-gray-400">Loading markets from Solana...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-seek-purple text-white text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Markets Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}

      {!loading && !error && filteredMarkets.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-4">🔮</p>
          <p>No markets in this category yet. Check back soon!</p>
        </div>
      )}

      {/* On-chain badge */}
      {!loading && !error && markets.length > 0 && (
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-seek-teal/10 border border-seek-teal/20 text-seek-teal text-xs">
            ⛓️ {markets.length} markets live on Solana Devnet
          </span>
        </div>
      )}
    </>
  );
}
