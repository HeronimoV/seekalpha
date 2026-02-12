"use client";

import { FC, useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Market } from "@/lib/constants";
import { buildPlacePredictionTx, getBalance } from "@/lib/program";

interface MarketCardProps {
  market: Market;
}

export const MarketCard: FC<MarketCardProps> = ({ market }) => {
  const [betAmount, setBetAmount] = useState("");
  const [showBetting, setShowBetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const totalPool = market.yesPool + market.noPool;
  const yesPercent = totalPool > 0 ? (market.yesPool / totalPool) * 100 : 50;
  const noPercent = 100 - yesPercent;

  const timeLeft = () => {
    const now = new Date();
    const diff = market.resolutionTime.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const placeBet = useCallback(
    async (position: boolean) => {
      if (!publicKey || !connected) {
        setTxStatus("⚠️ Connect your wallet first!");
        return;
      }

      const amount = parseFloat(betAmount);
      if (isNaN(amount) || amount <= 0) {
        setTxStatus("⚠️ Enter a valid amount");
        return;
      }

      if (amount < 0.01) {
        setTxStatus("⚠️ Minimum bet is 0.01 SOL");
        return;
      }

      try {
        setLoading(true);
        setTxStatus("🔄 Building transaction...");

        // Check balance
        const balance = await getBalance(publicKey);
        if (balance < amount + 0.01) {
          setTxStatus(`⚠️ Insufficient balance (${balance.toFixed(3)} SOL)`);
          setLoading(false);
          return;
        }

        const tx = await buildPlacePredictionTx(publicKey, market.id, amount, position);
        setTxStatus("✍️ Approve in your wallet...");

        const signature = await sendTransaction(tx, connection);
        setTxStatus("⏳ Confirming...");

        await connection.confirmTransaction(signature, "confirmed");
        setTxStatus(
          `✅ ${position ? "YES" : "NO"} prediction placed! ${amount} SOL`
        );
        setBetAmount("");

        // Clear status after 5s
        setTimeout(() => {
          setTxStatus(null);
          setShowBetting(false);
        }, 5000);
      } catch (err: any) {
        console.error("Transaction failed:", err);
        if (err.message?.includes("User rejected")) {
          setTxStatus("❌ Transaction cancelled");
        } else {
          setTxStatus("❌ Transaction failed — try again");
        }
      } finally {
        setLoading(false);
      }
    },
    [publicKey, connected, betAmount, market.id, sendTransaction, connection]
  );

  return (
    <div className="gradient-border rounded-xl bg-seek-card p-5 hover:bg-seek-card/80 transition">
      {/* Category + Time */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-seek-teal/20 text-seek-teal">
          {market.category}
        </span>
        <span className="text-xs text-gray-500">{timeLeft()}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 leading-tight">{market.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{market.description}</p>

      {/* Probability Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-seek-teal font-medium">YES {yesPercent.toFixed(1)}%</span>
          <span className="text-red-400 font-medium">NO {noPercent.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-seek-teal to-seek-teal/60 rounded-full transition-all"
            style={{ width: `${yesPercent}%` }}
          />
        </div>
      </div>

      {/* Pool Info */}
      <div className="flex justify-between text-sm text-gray-400 mb-4">
        <span>💰 Total Pool: {totalPool.toFixed(1)} SOL</span>
        <span>👥 {Math.floor(totalPool / 0.5)} predictions</span>
      </div>

      {/* Bet Section */}
      {!showBetting ? (
        <button
          onClick={() => setShowBetting(true)}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-seek-purple to-seek-teal text-white font-medium text-sm hover:opacity-90 transition"
        >
          🔮 Make a Prediction
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount in SOL"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="flex-1 bg-seek-dark border border-seek-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-seek-purple"
              min="0.01"
              step="0.01"
              disabled={loading}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => placeBet(true)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg btn-yes text-white font-medium text-sm transition disabled:opacity-50"
            >
              {loading ? "..." : "🟢 YES"}
            </button>
            <button
              onClick={() => placeBet(false)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg btn-no text-white font-medium text-sm transition disabled:opacity-50"
            >
              {loading ? "..." : "🔴 NO"}
            </button>
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2">
            {[0.1, 0.5, 1, 5].map((amt) => (
              <button
                key={amt}
                onClick={() => setBetAmount(amt.toString())}
                className="flex-1 py-1 rounded text-xs bg-seek-dark border border-seek-border text-gray-400 hover:text-white hover:border-seek-purple transition"
              >
                {amt} SOL
              </button>
            ))}
          </div>

          {txStatus && (
            <div className="text-sm text-center py-2 px-3 rounded-lg bg-seek-dark border border-seek-border">
              {txStatus}
            </div>
          )}

          <button
            onClick={() => {
              setShowBetting(false);
              setTxStatus(null);
            }}
            className="w-full text-xs text-gray-500 hover:text-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
