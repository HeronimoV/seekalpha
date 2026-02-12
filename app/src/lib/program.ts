"use client";

import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { RPC_ENDPOINT, PROGRAM_ID_STR } from "./constants";
import { IDL } from "./idl";

const PROGRAM_ID = new PublicKey(PROGRAM_ID_STR);
const connection = new Connection(RPC_ENDPOINT, "confirmed");

export function getConnection() {
  return connection;
}

// Get a read-only program instance (no wallet needed)
export function getReadOnlyProgram() {
  // Use a dummy provider for read-only operations
  const dummyWallet = {
    publicKey: PublicKey.default,
    signTransaction: async (tx: any) => tx,
    signAllTransactions: async (txs: any) => txs,
  };
  const provider = new AnchorProvider(connection, dummyWallet as any, {
    commitment: "confirmed",
  });
  return new Program(IDL as any, provider);
}

// PDA derivations
export function getConfigPda(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    PROGRAM_ID
  );
  return pda;
}

export function getMarketPda(marketId: number): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("market"),
      new BN(marketId).toArrayLike(Buffer, "le", 8),
    ],
    PROGRAM_ID
  );
  return pda;
}

export function getVaultPda(marketId: number): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      new BN(marketId).toArrayLike(Buffer, "le", 8),
    ],
    PROGRAM_ID
  );
  return pda;
}

export function getPredictionPda(marketPda: PublicKey, userPubkey: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("prediction"), marketPda.toBuffer(), userPubkey.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

// ─── READ FUNCTIONS ───

export interface OnChainMarket {
  id: number;
  creator: string;
  title: string;
  description: string;
  yesPool: number; // in SOL
  noPool: number; // in SOL
  resolutionTime: Date;
  resolved: boolean;
  outcome: boolean | null;
  createdAt: Date;
  pda: string;
}

export async function fetchConfig() {
  const program = getReadOnlyProgram();
  const configPda = getConfigPda();
  const config = await (program.account as any).platformConfig.fetch(configPda);
  return {
    admin: config.admin.toString(),
    treasury: config.treasury.toString(),
    marketCount: config.marketCount.toNumber(),
    feeBps: config.feeBps,
  };
}

export async function fetchMarket(marketId: number): Promise<OnChainMarket> {
  const program = getReadOnlyProgram();
  const marketPda = getMarketPda(marketId);
  const market = await (program.account as any).market.fetch(marketPda);
  return {
    id: market.id.toNumber(),
    creator: market.creator.toString(),
    title: market.title,
    description: market.description,
    yesPool: market.yesPool.toNumber() / LAMPORTS_PER_SOL,
    noPool: market.noPool.toNumber() / LAMPORTS_PER_SOL,
    resolutionTime: new Date(market.resolutionTime.toNumber() * 1000),
    resolved: market.resolved,
    outcome: market.outcome,
    createdAt: new Date(market.createdAt.toNumber() * 1000),
    pda: marketPda.toString(),
  };
}

export async function fetchAllMarkets(): Promise<OnChainMarket[]> {
  try {
    const config = await fetchConfig();
    const markets: OnChainMarket[] = [];

    const promises = [];
    for (let i = 0; i < config.marketCount; i++) {
      promises.push(
        fetchMarket(i).catch((err) => {
          console.error(`Failed to fetch market #${i}:`, err);
          return null;
        })
      );
    }

    const results = await Promise.all(promises);
    for (const m of results) {
      if (m) markets.push(m);
    }

    return markets;
  } catch (err) {
    console.error("Failed to fetch markets:", err);
    return [];
  }
}

export async function fetchUserPrediction(
  marketPda: PublicKey,
  userPubkey: PublicKey
) {
  const program = getReadOnlyProgram();
  const predPda = getPredictionPda(marketPda, userPubkey);
  try {
    const pred = await (program.account as any).prediction.fetch(predPda);
    return {
      user: pred.user.toString(),
      market: pred.market.toString(),
      amount: pred.amount.toNumber() / LAMPORTS_PER_SOL,
      position: pred.position,
      claimed: pred.claimed,
    };
  } catch {
    return null; // No prediction found
  }
}

// ─── WRITE FUNCTIONS (return instruction builders for wallet signing) ───

export function getProgram(provider: AnchorProvider) {
  return new Program(IDL as any, provider);
}

export async function buildPlacePredictionTx(
  provider: AnchorProvider,
  marketId: number,
  amountSol: number,
  position: boolean
) {
  const program = getProgram(provider);
  const marketPda = getMarketPda(marketId);
  const vaultPda = getVaultPda(marketId);
  const predictionPda = getPredictionPda(marketPda, provider.wallet.publicKey);

  const lamports = new BN(Math.floor(amountSol * LAMPORTS_PER_SOL));

  const tx = await (program.methods as any)
    .placePrediction(lamports, position)
    .accounts({
      market: marketPda,
      prediction: predictionPda,
      vault: vaultPda,
      user: provider.wallet.publicKey,
    })
    .transaction();

  return tx;
}

export async function buildClaimWinningsTx(
  provider: AnchorProvider,
  marketId: number,
  treasuryPubkey: PublicKey
) {
  const program = getProgram(provider);
  const configPda = getConfigPda();
  const marketPda = getMarketPda(marketId);
  const vaultPda = getVaultPda(marketId);
  const predictionPda = getPredictionPda(marketPda, provider.wallet.publicKey);

  const tx = await (program.methods as any)
    .claimWinnings()
    .accounts({
      config: configPda,
      market: marketPda,
      prediction: predictionPda,
      vault: vaultPda,
      treasury: treasuryPubkey,
      user: provider.wallet.publicKey,
    })
    .transaction();

  return tx;
}

// Get SOL balance
export async function getBalance(pubkey: PublicKey): Promise<number> {
  const balance = await connection.getBalance(pubkey);
  return balance / LAMPORTS_PER_SOL;
}
