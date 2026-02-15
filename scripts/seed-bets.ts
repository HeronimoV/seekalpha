import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

const walletKeypair = Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(
      fs.readFileSync(path.resolve(process.env.HOME!, ".config/solana/id.json"), "utf-8")
    )
  )
);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const wallet = new anchor.Wallet(walletKeypair);
const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });
anchor.setProvider(provider);

const idl = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../target/idl/seekalpha.json"), "utf-8")
);

const PROGRAM_ID = new PublicKey("9URCH6UhsMmgwX9xr2L84fimrGjpH8r3xheaSaZ21qGb");
const program = new Program(idl, provider);

// Seed bets: [marketId, amountSOL, position (true=YES, false=NO)]
const seedBets: [number, number, boolean][] = [
  // Flash markets — small bets both sides to show action
  [0, 0.1, true],   // BTC $95K 1H — YES
  [0, 0.08, false],  // BTC $95K 1H — NO (need different wallet for other side... same wallet = stack)
  [1, 0.1, true],   // SOL pump 3% 1H — YES
  [2, 0.15, true],  // Token 10x 24H — YES
  [3, 0.12, false], // ETH $4K 24H — NO

  // Standard markets — bigger seed bets
  [4, 0.2, true],   // SOL $200 March — YES
  [5, 0.15, true],  // BTC $120K April — YES
  [6, 0.2, true],   // Seeker Q2 — YES
  [7, 0.1, false],  // Memecoin $1B — NO
  [8, 0.1, true],   // US stablecoin bill — YES
  [9, 0.15, true],  // Solana TVL $20B — YES
  [10, 0.1, true],  // AI ARC-AGI 90% — YES
  [11, 0.1, false], // NBA crypto betting — NO
];

async function main() {
  console.log(`💰 Wallet: ${walletKeypair.publicKey.toString()}`);
  const bal = await connection.getBalance(walletKeypair.publicKey);
  console.log(`💎 Balance: ${bal / LAMPORTS_PER_SOL} SOL\n`);

  for (const [marketId, amountSOL, position] of seedBets) {
    const [marketPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("market"), new anchor.BN(marketId).toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );

    const [predictionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("prediction"), marketPda.toBuffer(), walletKeypair.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(marketId).toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );

    const amountLamports = new anchor.BN(amountSOL * LAMPORTS_PER_SOL);
    const side = position ? "YES" : "NO";

    try {
      // Check if we already have a prediction on this market
      let existingPrediction = null;
      try {
        existingPrediction = await (program.account as any).prediction.fetch(predictionPda);
      } catch {}

      // If we already bet the other side, skip
      if (existingPrediction && existingPrediction.position !== position) {
        console.log(`⏭️  Market #${marketId}: Already bet ${existingPrediction.position ? "YES" : "NO"}, can't bet ${side} — skipping`);
        continue;
      }

      const tx = await (program.methods as any)
        .placePrediction(amountLamports, position)
        .accounts({
          market: marketPda,
          prediction: predictionPda,
          vault: vaultPda,
          user: walletKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log(`✅ Market #${marketId}: ${amountSOL} SOL on ${side} — TX: ${tx.slice(0, 20)}...`);
    } catch (e: any) {
      console.log(`❌ Market #${marketId}: ${e.message?.slice(0, 80)}`);
    }
  }

  const finalBal = await connection.getBalance(walletKeypair.publicKey);
  console.log(`\n💎 Final balance: ${finalBal / LAMPORTS_PER_SOL} SOL`);
  console.log(`💸 Spent: ${(bal - finalBal) / LAMPORTS_PER_SOL} SOL on seed bets`);
}

main().catch(console.error);
