"use client";

import { Hero } from "@/components/Hero";
import { MarketCard } from "@/components/MarketCard";
import { fetchAllMarkets, OnChainMarket } from "@/lib/program";
import { inferCategory } from "@/lib/constants";
import { useState, useEffect, useMemo } from "react";

const CATEGORIES = ["All", "Crypto", "Tech", "DeFi", "Sports", "Politics", "Memes", "Culture"];

type SortOption = "newest" | "ending-soon" | "most-volume" | "highest-yes" | "highest-no";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");
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

  const processedMarkets = useMemo(() => {
    let result = markets.map((m) => ({
      ...m,
      category: inferCategory(m.title),
    }));

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((m) => m.category === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "ending-soon":
        result.sort((a, b) => a.resolutionTime.getTime() - b.resolutionTime.getTime());
        break;
      case "most-volume":
        result.sort((a, b) => (b.yesPool + b.noPool) - (a.yesPool + a.noPool));
        break;
      case "highest-yes":
        result.sort((a, b) => {
          const aYes = (a.yesPool + a.noPool) > 0 ? a.yesPool / (a.yesPool + a.noPool) : 0.5;
          const bYes = (b.yesPool + b.noPool) > 0 ? b.yesPool / (b.yesPool + b.noPool) : 0.5;
          return bYes - aYes;
        });
        break;
      case "highest-no":
        result.sort((a, b) => {
          const aNo = (a.yesPool + a.noPool) > 0 ? a.noPool / (a.yesPool + a.noPool) : 0.5;
          const bNo = (b.yesPool + b.noPool) > 0 ? b.noPool / (b.yesPool + b.noPool) : 0.5;
          return bNo - aNo;
        });
        break;
    }

    // Separate active vs resolved
    const active = result.filter((m) => !m.resolved);
    const resolved = result.filter((m) => m.resolved);

    return { active, resolved };
  }, [markets, activeCategory, sortBy, searchQuery]);

  return (
    <>
      <Hero />

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search markets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-seek-card border border-seek-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-seek-purple placeholder-gray-500"
        />
      </div>

      {/* Category Filter + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar flex-1">
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
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-seek-card border border-seek-border rounded-full px-4 py-1.5 text-sm text-gray-400 focus:outline-none focus:border-seek-purple shrink-0"
        >
          <option value="newest">🆕 Newest</option>
          <option value="ending-soon">⏰ Ending Soon</option>
          <option value="most-volume">💰 Most Volume</option>
          <option value="highest-yes">🟢 Highest YES</option>
          <option value="highest-no">🔴 Highest NO</option>
        </select>
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

      {/* Active Markets */}
      {!loading && !error && processedMarkets.active.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-seek-teal animate-pulse"></span>
            <h2 className="text-lg font-semibold">Active Markets ({processedMarkets.active.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {processedMarkets.active.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </>
      )}

      {/* Resolved Markets */}
      {!loading && !error && processedMarkets.resolved.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-500">Resolved Markets ({processedMarkets.resolved.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 opacity-60">
            {processedMarkets.resolved.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </>
      )}

      {!loading && !error && processedMarkets.active.length === 0 && processedMarkets.resolved.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-4">🔮</p>
          <p>{searchQuery ? "No markets match your search." : "No markets in this category yet. Check back soon!"}</p>
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
