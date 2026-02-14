"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import dynamic from "next/dynamic";
import {
  fetchAllMarkets,
  fetchConfig,
  getConfigPda,
  getMarketPda,
  getVaultPda,
  getProgram,
  OnChainMarket,
} from "@/lib/program";
import { inferCategory } from "@/lib/constants";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const ADMIN_WALLET = "7XnGiEFMreRtdb9FtvX3q5G6B5dWM6fMQQPU5i17fp24";

export default function AdminPage() {
  const { connected, publicKey, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const [markets, setMarkets] = useState<OnChainMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    resolutionDate: "",
    resolutionTime: "23:59",
  });
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAllMarkets()
      .then((m) => {
        setMarkets(m);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  const isAdmin = publicKey?.toString() === ADMIN_WALLET;

  if (!isAdmin) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-6">🚫</div>
        <h2 className="text-2xl font-bold mb-4">Not Authorized</h2>
        <p className="text-gray-400 mb-4">This wallet is not the admin.</p>
        <p className="text-xs text-gray-600 font-mono">{publicKey?.toString()}</p>
      </div>
    );
  }

  const getProvider = () => {
    const wallet = { publicKey: publicKey!, signTransaction: signTransaction!, signAllTransactions: signAllTransactions! };
    return new AnchorProvider(connection, wallet as any, { commitment: "confirmed" });
  };

  const handleCreate = async () => {
    if (!form.title || !form.description || !form.resolutionDate) {
      setStatus("⚠️ Fill in all fields");
      return;
    }

    try {
      setCreating(true);
      setStatus("🔄 Creating market on-chain...");

      const provider = getProvider();
      const program = getProgram(provider);
      const configPda = getConfigPda();

      const config = await fetchConfig();
      const marketId = config.marketCount;

      const marketPda = getMarketPda(marketId);
      const vaultPda = getVaultPda(marketId);

      const resolutionTimestamp = Math.floor(
        new Date(`${form.resolutionDate}T${form.resolutionTime}:00Z`).getTime() / 1000
      );

      const tx = await (program.methods as any)
        .createMarket(form.title, form.description, new BN(resolutionTimestamp))
        .accounts({
          config: configPda,
          market: marketPda,
          vault: vaultPda,
          creator: publicKey,
          admin: publicKey,
        })
        .transaction();

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signedTx = await signTransaction!(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig, "confirmed");

      setStatus(`✅ Market #${marketId} created! TX: ${sig.slice(0, 20)}...`);
      setForm({ title: "", description: "", resolutionDate: "", resolutionTime: "23:59" });

      // Refresh markets
      const updated = await fetchAllMarkets();
      setMarkets(updated);
    } catch (err: any) {
      console.error("Create failed:", err);
      setStatus(`❌ Failed: ${err.message?.slice(0, 100)}`);
    } finally {
      setCreating(false);
    }
  };

  const handleResolve = async (marketId: number, outcome: boolean) => {
    try {
      setResolvingId(marketId);
      setStatus(`🔄 Resolving market #${marketId} as ${outcome ? "YES" : "NO"}...`);

      const provider = getProvider();
      const program = getProgram(provider);
      const configPda = getConfigPda();
      const marketPda = getMarketPda(marketId);

      const tx = await (program.methods as any)
        .resolveMarket(outcome)
        .accounts({
          config: configPda,
          market: marketPda,
          admin: publicKey,
        })
        .transaction();

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signedTx = await signTransaction!(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig, "confirmed");

      setStatus(`✅ Market #${marketId} resolved as ${outcome ? "YES ✅" : "NO ❌"}`);

      // Refresh
      const updated = await fetchAllMarkets();
      setMarkets(updated);
    } catch (err: any) {
      console.error("Resolve failed:", err);
      setStatus(`❌ Resolve failed: ${err.message?.slice(0, 100)}`);
    } finally {
      setResolvingId(null);
    }
  };

  const activeMarkets = markets.filter((m) => !m.resolved);
  const resolvedMarkets = markets.filter((m) => m.resolved);

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">⚙️ Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">
            {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)} · {markets.length} markets
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
          ⛓️ Admin Connected
        </span>
      </div>

      {status && (
        <div className="mb-6 p-4 rounded-xl bg-seek-card border border-seek-border text-center text-sm">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {creating ? "Creating on-chain..." : "🚀 Create Market On-Chain"}
          </button>
        </div>
      </div>

      {/* Active Markets */}
      <div className="bg-seek-card border border-seek-border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">📊 Active Markets ({activeMarkets.length})</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading from Solana...</div>
        ) : (
          <div className="space-y-4">
            {activeMarkets.map((market) => {
              const totalPool = market.yesPool + market.noPool;
              const isExpired = market.resolutionTime.getTime() < Date.now();

              return (
                <div
                  key={market.id}
                  className="border border-seek-border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-seek-teal/20 text-seek-teal">
                        {inferCategory(market.title)}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{market.id} · Resolves: {market.resolutionTime.toLocaleDateString()}
                      </span>
                      {isExpired && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                          EXPIRED — Ready to resolve
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-sm">{market.title}</h3>
                    <div className="text-xs text-gray-400 mt-1">
                      Pool: {totalPool.toFixed(2)} SOL (YES: {market.yesPool.toFixed(2)} / NO: {market.noPool.toFixed(2)})
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolve(market.id, true)}
                      disabled={resolvingId === market.id}
                      className="px-4 py-2 rounded-lg btn-yes text-white text-sm font-medium disabled:opacity-50"
                    >
                      {resolvingId === market.id ? "..." : "✅ YES"}
                    </button>
                    <button
                      onClick={() => handleResolve(market.id, false)}
                      disabled={resolvingId === market.id}
                      className="px-4 py-2 rounded-lg btn-no text-white text-sm font-medium disabled:opacity-50"
                    >
                      {resolvingId === market.id ? "..." : "❌ NO"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved Markets */}
      {resolvedMarkets.length > 0 && (
        <div className="bg-seek-card border border-seek-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">🏁 Resolved Markets ({resolvedMarkets.length})</h2>
          <div className="space-y-3">
            {resolvedMarkets.map((market) => (
              <div
                key={market.id}
                className="border border-seek-border rounded-lg p-4 opacity-60"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    market.outcome ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {market.outcome ? "YES ✅" : "NO ❌"}
                  </span>
                  <span className="text-xs text-gray-500">#{market.id}</span>
                </div>
                <h3 className="font-medium text-sm">{market.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
