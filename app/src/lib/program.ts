"use client";

import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { RPC_ENDPOINT, PROGRAM_ID_STR } from "./constants";

// For now, we use a simple escrow-style approach:
// Bets go to a market vault PDA. When we deploy the real program,
// we swap this out for Anchor CPI calls.

const connection = new Connection(RPC_ENDPOINT, "confirmed");

export function getConnection() {
  return connection;
}

// Derive a deterministic vault address for each market
export function getMarketVault(marketId: number): PublicKey {
  const [vault] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      Buffer.from(new Uint8Array(new BigInt64Array([BigInt(marketId)]).buffer)),
    ],
    new PublicKey(PROGRAM_ID_STR)
  );
  return vault;
}

// Build a place-prediction transaction
// For the demo/devnet phase, this sends SOL to a vault address
export async function buildPlacePredictionTx(
  userPubkey: PublicKey,
  marketId: number,
  amountSol: number,
  position: boolean // true = YES, false = NO
): Promise<Transaction> {
  const vault = getMarketVault(marketId);
  const lamports = Math.floor(amountSol * LAMPORTS_PER_SOL);

  const tx = new Transaction();

  // Transfer SOL to vault
  tx.add(
    SystemProgram.transfer({
      fromPubkey: userPubkey,
      toPubkey: vault,
      lamports,
    })
  );

  // Add a memo-like instruction to record the prediction on-chain
  // Format: "SEEKALPHA:BET:<marketId>:<YES|NO>:<amount>"
  const memo = `SEEKALPHA:BET:${marketId}:${position ? "YES" : "NO"}:${amountSol}`;
  tx.add(
    new TransactionInstruction({
      keys: [{ pubkey: userPubkey, isSigner: true, isWritable: false }],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: Buffer.from(memo),
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = userPubkey;

  return tx;
}

// Get SOL balance
export async function getBalance(pubkey: PublicKey): Promise<number> {
  const balance = await connection.getBalance(pubkey);
  return balance / LAMPORTS_PER_SOL;
}
