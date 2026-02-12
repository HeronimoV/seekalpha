import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Seekalpha } from "../target/types/seekalpha";
import { expect } from "chai";

describe("seekalpha", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Seekalpha as Program<Seekalpha>;
  const admin = provider.wallet;

  it("Initializes the platform", async () => {
    const [configPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    await program.methods
      .initialize(admin.publicKey)
      .accounts({
        config: configPda,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const config = await program.account.platformConfig.fetch(configPda);
    expect(config.admin.toString()).to.equal(admin.publicKey.toString());
    expect(config.marketCount.toNumber()).to.equal(0);
    expect(config.feeBps).to.equal(300);
  });

  it("Creates a market", async () => {
    const [configPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    const config = await program.account.platformConfig.fetch(configPda);
    const marketId = config.marketCount.toNumber();

    const [marketPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("market"), new anchor.BN(marketId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(marketId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    await program.methods
      .createMarket(
        "Will SOL hit $200 by end of February?",
        "Resolves YES if SOL/USD reaches $200 on any major exchange before Feb 28, 2026.",
        new anchor.BN(futureTime)
      )
      .accounts({
        config: configPda,
        market: marketPda,
        vault: vaultPda,
        creator: admin.publicKey,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const market = await program.account.market.fetch(marketPda);
    expect(market.title).to.equal("Will SOL hit $200 by end of February?");
    expect(market.yesPool.toNumber()).to.equal(0);
    expect(market.noPool.toNumber()).to.equal(0);
    expect(market.resolved).to.equal(false);
  });
});
