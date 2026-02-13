"use client";

import { FC, useState, useCallback, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { PLATFORM_FEE_BPS } from "@/lib/constants";
import { OnChainMarket, buildPlacePredictionTx, getBalance } from "@/lib/program";
import { BetSuccess } from "./BetSuccess";

interface MarketCardProps {
  market: OnChainMarket & { category: string };
}

export const MarketCard: FC<MarketCardProps> = ({ market }) => {
  const [betAmount, setBetAmount] = useState("");
  const [showBetting, setShowBetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastBet, setLastBet] = useState<{position: boolean; amount: number; payout: number; sig: string}>({position: true, amount: 0, payout: 0, sig: ""});
  const { publicKey, signTransaction, signAllTransactions, connected } = useWallet();
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

  // Calculate potential payouts
  const payouts = useMemo(() => {
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) return null;

    const fee = PLATFORM_FEE_BPS / 10000;

    const newYesPool = market.yesPool + amount;
    const newNoPool = market.noPool + amount;
    const totalIfYes = newYesPool + market.noPool;
    const totalIfNo = market.yesPool + newNoPool;

    const grossYes = (amount / newYesPool) * totalIfYes;
    const grossNo = (amount / newNoPool) * totalIfNo;

    const netYes = grossYes * (1 - fee);
    const netNo = grossNo * (1 - fee);

    const profitYes = netYes - amount;
    const profitNo = netNo - amount;

    const multiplierYes = netYes / amount;
    const multiplierNo = netNo / amount;

    return {
      yes: { payout: netYes, profit: profitYes, multiplier: multiplierYes },
      no: { payout: netNo, profit: profitNo, multiplier: multiplierNo },
    };
  }, [betAmount, market.yesPool, market.noPool]);

  const placeBet = useCallback(
    async (position: boolean) => {
      if (!publicKey || !connected || !signTransaction || !signAllTransactions) {
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

        const balance = await getBalance(publicKey);
        if (balance < amount + 0.01) {
          setTxStatus(`⚠️ Insufficient balance (${balance.toFixed(3)} SOL)`);
          setLoading(false);
          return;
        }

        // Create an Anchor provider with the connected wallet
        const wallet = { publicKey, signTransaction, signAllTransactions };
        const provider = new AnchorProvider(connection, wallet as any, {
          commitment: "confirmed",
        });

        const tx = await buildPlacePredictionTx(provider, market.id, amount, position);
        setTxStatus("✍️ Approve in your wallet...");

        const { blockhash } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = publicKey;

        const signedTx = await signTransaction(tx);
        setTxStatus("⏳ Confirming on Solana...");

        const signature = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(signature, "confirmed");

        // Calculate payout for display
        const payout = payouts ? (position ? payouts.yes.payout : payouts.no.payout) : amount;
        setLastBet({ position, amount, payout, sig: signature });
        setShowSuccess(true);
        setTxStatus(null);
        setBetAmount("");
        setShowBetting(false);
      } catch (err: any) {
        console.error("Transaction failed:", err);
        if (err.message?.includes("User rejected")) {
          setTxStatus("❌ Transaction cancelled");
        } else if (err.message?.includes("already in use")) {
          setTxStatus("⚠️ You already have a prediction on this market!");
        } else if (err.message?.includes("PositionMismatch")) {
          setTxStatus("⚠️ Can't switch sides! You already bet the other way.");
        } else {
          setTxStatus("❌ Transaction failed — try again");
        }
      } finally {
        setLoading(false);
      }
    },
    [publicKey, connected, signTransaction, signAllTransactions, betAmount, market.id, connection]
  );

  const isExpired = market.resolutionTime.getTime() < Date.now();

  return (
    <div className="gradient-border rounded-xl bg-seek-card p-4 md:p-5 hover:bg-seek-card/80 transition">
      {/* Category + Time */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-seek-teal/20 text-seek-teal">
          {market.category}
        </span>
        <div className="flex items-center gap-2">
          {market.resolved && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              market.outcome ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}>
              {market.outcome ? "✅ YES" : "❌ NO"}
            </span>
          )}
          <span className="text-xs text-gray-500">{timeLeft()}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base md:text-lg font-semibold mb-2 leading-tight">{market.title}</h3>
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
        <span>💰 Pool: {totalPool.toFixed(2)} SOL</span>
        <span className="text-xs text-seek-teal/60">⛓️ on-chain</span>
      </div>

      {/* Bet Section */}
      {market.resolved || isExpired ? (
        <div className="w-full py-2.5 rounded-lg bg-gray-800 text-gray-500 text-center text-sm">
          {market.resolved ? "Market Resolved" : "Market Expired"}
        </div>
      ) : !showBetting ? (
        <button
          onClick={() => setShowBetting(true)}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-seek-purple to-seek-teal text-white font-medium text-sm hover:opacity-90 transition active:scale-[0.98]"
        >
          🔮 Make a Prediction
        </button>
      ) : (
        <div className="space-y-3">
          <div>
            <input
              type="number"
              placeholder="Amount in SOL"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-full bg-seek-dark border border-seek-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-seek-purple"
              min="0.01"
              step="0.01"
              disabled={loading}
            />
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2">
            {[0.1, 0.5, 1, 5].map((amt) => (
              <button
                key={amt}
                onClick={() => setBetAmount(amt.toString())}
                className="flex-1 py-1.5 rounded text-xs bg-seek-dark border border-seek-border text-gray-400 hover:text-white hover:border-seek-purple transition"
              >
                {amt} SOL
              </button>
            ))}
          </div>

          {/* Payout Preview */}
          {payouts && (
            <div className="bg-seek-dark border border-seek-border rounded-lg p-3 space-y-2">
              <div className="text-xs text-gray-500 font-medium mb-1">💰 Estimated Payouts (after 3% fee)</div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-seek-teal"></span>
                  <span className="text-xs text-gray-400">If YES wins:</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-seek-teal">
                    {payouts.yes.payout.toFixed(3)} SOL
                  </span>
                  <span className="text-xs text-green-400 ml-2">
                    +{payouts.yes.profit.toFixed(3)} ({payouts.yes.multiplier.toFixed(2)}x)
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span className="text-xs text-gray-400">If NO wins:</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-red-400">
                    {payouts.no.payout.toFixed(3)} SOL
                  </span>
                  <span className="text-xs text-green-400 ml-2">
                    +{payouts.no.profit.toFixed(3)} ({payouts.no.multiplier.toFixed(2)}x)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* YES / NO buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => placeBet(true)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg btn-yes text-white font-medium text-sm transition disabled:opacity-50"
            >
              {loading ? "..." : `🟢 YES${payouts ? ` (${payouts.yes.multiplier.toFixed(2)}x)` : ""}`}
            </button>
            <button
              onClick={() => placeBet(false)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg btn-no text-white font-medium text-sm transition disabled:opacity-50"
            >
              {loading ? "..." : `🔴 NO${payouts ? ` (${payouts.no.multiplier.toFixed(2)}x)` : ""}`}
            </button>
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
      <BetSuccess
        show={showSuccess}
        marketTitle={market.title}
        position={lastBet.position}
        amount={lastBet.amount}
        potentialPayout={lastBet.payout}
        txSignature={lastBet.sig}
        variant="bet"
        onClose={() => {
          setShowSuccess(false);
          window.location.reload();
        }}
      />
    </div>
  );
};
