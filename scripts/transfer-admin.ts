import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, Connection } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

const walletKeypair = Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(
      fs.readFileSync(
        path.resolve(process.env.HOME!, ".config/solana/id.json"),
        "utf-8"
      )
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

const PROGRAM_ID = new PublicKey("FEiFToWsHmCgjevuw9k8DNS8N8BdVdwTKostmvN9LS8B");
const program = new Program(idl, provider);

async function main() {
  const newAdmin = new PublicKey(process.argv[2]);
  console.log("Transferring admin to:", newAdmin.toString());

  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    PROGRAM_ID
  );

  const config = await (program.account as any).platformConfig.fetch(configPda);
  console.log("Current admin:", config.admin.toString());
  console.log("Current treasury:", config.treasury.toString());

  // Transfer admin
  const tx = await (program.methods as any)
    .updateAdmin(newAdmin)
    .accounts({
      config: configPda,
      admin: walletKeypair.publicKey,
    })
    .rpc();

  console.log("✅ Admin transferred!");
  console.log("TX:", tx);

  // Verify
  const updated = await (program.account as any).platformConfig.fetch(configPda);
  console.log("New admin:", updated.admin.toString());
  console.log("Treasury (unchanged):", updated.treasury.toString());
}

main().catch(console.error);
