import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, Connection } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

// Load wallet keypair
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
const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});
anchor.setProvider(provider);

// Load IDL
const idl = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../target/idl/seekalpha.json"),
    "utf-8"
  )
);

const PROGRAM_ID = new PublicKey("9URCH6UhsMmgwX9xr2L84fimrGjpH8r3xheaSaZ21qGb");
const program = new Program(idl, provider);

async function main() {
  const action = process.argv[2];

  if (action === "init") {
    console.log("🔮 Initializing SeekAlpha platform...");
    console.log("Admin:", walletKeypair.publicKey.toString());
    console.log("Treasury:", walletKeypair.publicKey.toString());

    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      PROGRAM_ID
    );

    try {
      const tx = await (program.methods as any)
        .initialize(walletKeypair.publicKey)
        .accounts({
          config: configPda,
          admin: walletKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("✅ Platform initialized!");
      console.log("Config PDA:", configPda.toString());
      console.log("TX:", tx);
    } catch (e: any) {
      if (e.message?.includes("already in use")) {
        console.log("Platform already initialized!");
      } else {
        throw e;
      }
    }
  } else if (action === "create-market") {
    const title = process.argv[3] || "Will SOL hit $200 by end of February?";
    const description =
      process.argv[4] ||
      "Resolves YES if SOL/USD reaches $200 on any major exchange before Feb 28, 2026.";
    const hoursFromNow = parseInt(process.argv[5] || "720"); // default 30 days

    console.log(`🔮 Creating market: "${title}"`);

    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      PROGRAM_ID
    );

    const config = await (program.account as any).platformConfig.fetch(configPda);
    const marketId = config.marketCount.toNumber();

    const [marketPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("market"),
        new anchor.BN(marketId).toArrayLike(Buffer, "le", 8),
      ],
      PROGRAM_ID
    );

    const [vaultPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("vault"),
        new anchor.BN(marketId).toArrayLike(Buffer, "le", 8),
      ],
      PROGRAM_ID
    );

    const resolutionTime = Math.floor(Date.now() / 1000) + hoursFromNow * 3600;

    // Market type: standard (default), flash1h, flash24h
    const typeArg = (process.argv[6] || "standard").toLowerCase();
    let marketType: any;
    if (typeArg === "flash1h") {
      marketType = { flash1H: {} };
    } else if (typeArg === "flash24h") {
      marketType = { flash24H: {} };
    } else {
      marketType = { standard: {} };
    }

    const tx = await (program.methods as any)
      .createMarket(title, description, new anchor.BN(resolutionTime), marketType)
      .accounts({
        config: configPda,
        market: marketPda,
        vault: vaultPda,
        creator: walletKeypair.publicKey,
        admin: walletKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log(`✅ Market #${marketId} created! (type: ${typeArg})`);
    console.log("Market PDA:", marketPda.toString());
    console.log("TX:", tx);
  } else if (action === "list-markets") {
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      PROGRAM_ID
    );

    const config = await (program.account as any).platformConfig.fetch(configPda);
    console.log(`📊 Total markets: ${config.marketCount.toNumber()}`);
    console.log(`💰 Fee: ${config.feeBps / 100}%`);
    console.log(`👤 Admin: ${config.admin.toString()}`);
    console.log(`🏦 Treasury: ${config.treasury.toString()}`);

    for (let i = 0; i < config.marketCount.toNumber(); i++) {
      const [marketPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("market"),
          new anchor.BN(i).toArrayLike(Buffer, "le", 8),
        ],
        PROGRAM_ID
      );

      const market = await (program.account as any).market.fetch(marketPda);
      console.log(`\n--- Market #${i} ---`);
      console.log(`Title: ${market.title}`);
      console.log(`YES Pool: ${market.yesPool.toNumber() / 1e9} SOL`);
      console.log(`NO Pool: ${market.noPool.toNumber() / 1e9} SOL`);
      console.log(`Resolved: ${market.resolved}`);
      console.log(
        `Resolution Time: ${new Date(market.resolutionTime.toNumber() * 1000).toISOString()}`
      );
    }
  } else {
    console.log("Usage:");
    console.log('  npx ts-node scripts/initialize.ts init');
    console.log('  npx ts-node scripts/initialize.ts create-market "Title" "Description" <hoursFromNow> [standard|flash1h|flash24h]');
    console.log('  npx ts-node scripts/initialize.ts list-markets');
  }
}

main().catch(console.error);
