"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

// Admin wallet — only this address can create/resolve markets
const ADMIN_WALLET = ""; // Will be set to your wallet pubkey

const CATEGORIES = ["Crypto", "Tech", "DeFi", "Sports", "Politics", "Memes", "Culture"];

interface MarketForm {
  title: string;
  description: string;
  category: string;
  resolutionDate: string;
  resolutionTime: string;
}

interface ActiveMarket {
  id: number;
  title: string;
  category: string;
  yesPool: number;
  noPool: number;
  resolutionTime: string;
  resolved: boolean;
}

const DEMO_ACTIVE_MARKETS: ActiveMarket[] = [
  { id: 0, title: "Will SOL hit $200 by end of February?", category: "Crypto", yesPool: 145.5, noPool: 87.2, resolutionTime: "2026-02-28", resolved: false },
  { id: 1, title: "Will Bitcoin reach $120K before April?", category: "Crypto", yesPool: 312.0, noPool: 198.5, resolutionTime: "2026-04-01", resolved: false },
  { id: 2, title: "Will the Seeker phone ship before Q2 2026?", category: "Tech", yesPool: 56.8, noPool: 23.1, resolutionTime: "2026-07-01", resolved: false },
  { id: 3, title: "Will ETH flip SOL in daily DEX volume this month?", category: "DeFi", yesPool: 34.2, noPool: 89.7, resolutionTime: "2026-02-28", resolved: false },
];

export default function AdminPage() {
  const { connected, publicKey } = useWallet();
  const [form, setForm] = useState<MarketForm>({
    title: "",
    description: "",
    category: "Crypto",
    resolutionDate: "",
    resolutionTime: "23:59",
  });
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (!connected) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-6">🔐</div>
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p className="text-gray-400 mb-8">Connect the admin wallet to manage markets.</p>
        <WalletMultiButton className="!bg-seek-purple hover:!bg-seek-purple/80 !rounded-xl !h-12 !text-base !px-8" />
      </div>
    );
  }

  const handleCreate = async () => {
    if (!form.title || !form.description || !form.resolutionDate) {
      setStatus("⚠️ Fill in all fields");
      return;
    }
    setCreating(true);
    setStatus("🔄 Creating market...");

    // Simulate for now — will wire to actual program instruction
    setTimeout(() => {
      setStatus("✅ Market created successfully!");
      setForm({ title: "", description: "", category: "Crypto", resolutionDate: "", resolutionTime: "23:59" });
      setCreating(false);
      setTimeout(() => setStatus(null), 3000);
    }, 1500);
  };

  const handleResolve = async (marketId: number, outcome: boolean) => {
    setStatus(`🔄 Resolving market #${marketId} as ${outcome ? "YES" : "NO"}...`);
    setTimeout(() => {
      setStatus(`✅ Market #${marketId} resolved as ${outcome ? "YES" : "NO"}`);
      setTimeout(() => setStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">⚙️ Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">
            {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
          Admin Connected
        </span>
      </div>

      {status && (
        <div className="mb-6 p-4 rounded-xl bg-seek-card border border-seek-border text-center">
          {status}
        </div>
      )}

      {/* Create Market */}
      <div className="bg-seek-card border border-seek-border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">📝 Create New Market</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Market Question</label>
            <input
              type="text"
              placeholder='e.g. "Will SOL hit $300 by June?"'
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-seek-dark border border-seek-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-seek-purple"
              maxLength={128}
            />
            <div className="text-xs text-gray-600 mt-1">{form.title.length}/128</div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Description / Resolution Criteria</label>
            <textarea
              placeholder="How will this market be resolved? Be specific."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-seek-dark border border-seek-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-seek-purple min-h-[100px] resize-y"
              maxLength={512}
            />
            <div className="text-xs text-gray-600 mt-1">{form.description.length}/512</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-seek-dark border border-seek-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-seek-purple"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Resolution Date</label>
              <input
                type="date"
                value={form.resolutionDate}
                onChange={(e) => setForm({ ...form, resolutionDate: e.target.value })}
                className="w-full bg-seek-dark border border-seek-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-seek-purple"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Resolution Time (UTC)</label>
              <input
                type="time"
                value={form.resolutionTime}
                onChange={(e) => setForm({ ...form, resolutionTime: e.target.value })}
                className="w-full bg-seek-dark border border-seek-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-seek-purple"
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-seek-purple to-seek-teal text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {creating ? "Creating..." : "🚀 Create Market"}
          </button>
        </div>
      </div>

      {/* Active Markets - Resolve */}
      <div className="bg-seek-card border border-seek-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">📊 Active Markets — Resolve</h2>
        <div className="space-y-4">
          {DEMO_ACTIVE_MARKETS.map((market) => (
            <div
              key={market.id}
              className="border border-seek-border rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-seek-teal/20 text-seek-teal">
                    {market.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    Resolves: {market.resolutionTime}
                  </span>
                </div>
                <h3 className="font-medium text-sm">{market.title}</h3>
                <div className="text-xs text-gray-400 mt-1">
                  Pool: {(market.yesPool + market.noPool).toFixed(1)} SOL (YES: {market.yesPool} / NO: {market.noPool})
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleResolve(market.id, true)}
                  className="px-4 py-2 rounded-lg btn-yes text-white text-sm font-medium"
                >
                  ✅ YES
                </button>
                <button
                  onClick={() => handleResolve(market.id, false)}
                  className="px-4 py-2 rounded-lg btn-no text-white text-sm font-medium"
                >
                  ❌ NO
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
