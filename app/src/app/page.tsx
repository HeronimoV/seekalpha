"use client";

import { Hero } from "@/components/Hero";
import { MarketCard } from "@/components/MarketCard";
import { NotificationBanners } from "@/components/NotificationBanners";
import { fetchAllMarkets, OnChainMarket } from "@/lib/program";
import { inferCategory } from "@/lib/constants";
import { useState, useEffect, useMemo } from "react";

const CATEGORIES = ["All", "Crypto", "Tech", "DeFi", "Sports", "Politics", "Memes", "Culture"];
const MARKET_TYPE_FILTERS = ["All", "Standard", "Flash ⚡"] as const;
type MarketTypeFilter = typeof MARKET_TYPE_FILTERS[number];

type SortOption = "newest" | "ending-soon" | "most-volume" | "highest-yes" | "highest-no";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTypeFilter, setActiveTypeFilter] = useState<MarketTypeFilter>("All");
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

    // Filter by market type
    if (activeTypeFilter === "Standard") {
      result = result.filter((m) => m.marketType === "standard");
    } else if (activeTypeFilter === "Flash ⚡") {
      result = result.filter((m) => m.marketType === "flash1h" || m.marketType === "flash24h");
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
  }, [markets, activeCategory, activeTypeFilter, sortBy, searchQuery]);

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

      {/* Market Type Filter */}
      <div className="flex gap-2 mb-4">
        {MARKET_TYPE_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveTypeFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
              activeTypeFilter === filter
                ? filter === "Flash ⚡"
                  ? "bg-amber-500 text-white"
                  : "bg-seek-purple text-white"
                : "bg-seek-card text-gray-400 hover:text-white border border-seek-border"
            }`}
          >
            {filter}
          </button>
        ))}
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

      {/* Notification Banners */}
      {!loading && !error && <NotificationBanners markets={markets} />}

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

      {/* How it Works */}
      {!loading && !error && (
        <div className="mb-16 mt-8">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-seek-card border border-seek-border rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">👛</div>
              <h3 className="font-semibold mb-2">1. Connect Wallet</h3>
              <p className="text-sm text-gray-400">
                Connect your Phantom wallet. No sign-up, no KYC, no email. Just your Solana wallet.
              </p>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🔮</div>
              <h3 className="font-semibold mb-2">2. Place Your Prediction</h3>
              <p className="text-sm text-gray-400">
                Pick a market, choose YES or NO, and stake SOL. Your prediction is recorded on-chain.
              </p>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold mb-2">3. Win & Collect</h3>
              <p className="text-sm text-gray-400">
                If you predicted correctly, claim your share of the pool. Only 3% fee — lowest in the game.
              </p>
            </div>
          </div>

          {/* Stats bar */}
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
      )}

      {/* Community CTA */}
      {!loading && !error && (
        <div className="bg-gradient-to-r from-seek-purple/10 to-seek-teal/10 border border-seek-border rounded-xl p-8 text-center mb-12">
          <h2 className="text-xl font-bold mb-2">Join the Community</h2>
          <p className="text-gray-400 text-sm mb-4">Get market alerts, suggest new markets, and flex your predictions.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://discord.gg/ZAYhF4hSZv"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition"
            >
              💬 Discord
            </a>
            <a
              href="https://t.me/+PQI6FKeLWm5iYmIx"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition"
            >
              ✈️ Telegram
            </a>
            <a
              href="https://twitter.com/Seek_Alpha_"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition"
            >
              𝕏 Twitter
            </a>
          </div>
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
