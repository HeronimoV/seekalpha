"use client";

import { Hero } from "@/components/Hero";
import { MarketCard } from "@/components/MarketCard";
import { DEMO_MARKETS } from "@/lib/constants";
import { useState } from "react";

const CATEGORIES = ["All", "Crypto", "Tech", "DeFi", "Sports", "Politics"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredMarkets =
    activeCategory === "All"
      ? DEMO_MARKETS
      : DEMO_MARKETS.filter((m) => m.category === activeCategory);

  return (
    <>
      <Hero />

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
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

      {/* Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {filteredMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-4">🔮</p>
          <p>No markets in this category yet. Check back soon!</p>
        </div>
      )}
    </>
  );
}
