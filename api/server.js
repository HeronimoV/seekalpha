const express = require("express");
const cors = require("cors");
const { Connection, PublicKey } = require("@solana/web3.js");
const { Program, AnchorProvider, BN } = require("@coral-xyz/anchor");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3847;
const RPC = "https://mainnet.helius-rpc.com/?api-key=46442713-bfc2-46dc-b68f-9e509b48e828";
const PROGRAM_ID = new PublicKey("4occZKXYz3tXjNQYr58YhAwWsCKsP2yZaYdSgQtgMY3a");
const connection = new Connection(RPC, "confirmed");

// Load IDL
const IDL = require("./idl.json");

// Helper: get all market PDAs
async function fetchAllMarkets() {
  const programAccounts = await connection.getProgramAccounts(PROGRAM_ID, {
    filters: [
      { dataSize: 8 + 8 + 32 + (4 + 128) + (4 + 512) + 8 + 8 + 8 + 1 + 2 + 8 + 1 + 1 }, // Market account size (approximate)
    ],
  });

  // Better approach: use discriminator
  const markets = [];
  const allAccounts = await connection.getProgramAccounts(PROGRAM_ID);

  for (const acc of allAccounts) {
    const data = acc.account.data;
    // Market accounts are large (700+ bytes), Config is small, Prediction is medium
    if (data.length > 500) {
      try {
        const market = decodeMarket(data, acc.pubkey);
        if (market) markets.push(market);
      } catch (e) {
        // Skip non-market accounts
      }
    }
  }

  return markets;
}

function decodeMarket(data, pubkey) {
  // Skip 8-byte discriminator
  let offset = 8;

  // id: u64
  const id = Number(data.readBigUInt64LE(offset));
  offset += 8;

  // creator: Pubkey (32 bytes)
  const creator = new PublicKey(data.slice(offset, offset + 32)).toBase58();
  offset += 32;

  // title: String (4-byte length prefix + data)
  const titleLen = data.readUInt32LE(offset);
  offset += 4;
  const title = data.slice(offset, offset + titleLen).toString("utf8");
  offset += titleLen;

  // description: String (4-byte length prefix + data)
  const descLen = data.readUInt32LE(offset);
  offset += 4;
  const description = data.slice(offset, offset + descLen).toString("utf8");
  offset += descLen;

  // yes_pool: u64
  const yesPool = Number(data.readBigUInt64LE(offset));
  offset += 8;

  // no_pool: u64
  const noPool = Number(data.readBigUInt64LE(offset));
  offset += 8;

  // resolution_time: i64
  const resolutionTime = Number(data.readBigInt64LE(offset));
  offset += 8;

  // resolved: bool
  const resolved = data[offset] === 1;
  offset += 1;

  // outcome: Option<bool> (1 byte tag + optional 1 byte value)
  const hasOutcome = data[offset] === 1;
  offset += 1;
  let outcome = null;
  if (hasOutcome) {
    outcome = data[offset] === 1;
  }
  offset += 1;

  // created_at: i64
  const createdAt = Number(data.readBigInt64LE(offset));
  offset += 8;

  // market_type: enum (1 byte)
  const marketTypeRaw = data[offset];
  offset += 1;
  const marketType = marketTypeRaw === 0 ? "standard" : marketTypeRaw === 1 ? "flash1h" : "flash24h";

  // bump: u8
  const bump = data[offset];

  const totalPool = yesPool + noPool;
  const yesOdds = totalPool > 0 ? ((yesPool / totalPool) * 100).toFixed(1) : "50.0";
  const noOdds = totalPool > 0 ? ((noPool / totalPool) * 100).toFixed(1) : "50.0";

  return {
    pubkey: pubkey.toBase58(),
    id,
    title,
    description,
    yesPool: yesPool / 1e9, // Convert lamports to SOL
    noPool: noPool / 1e9,
    totalVolume: totalPool / 1e9,
    yesOdds: parseFloat(yesOdds),
    noOdds: parseFloat(noOdds),
    resolutionTime: new Date(resolutionTime * 1000).toISOString(),
    resolutionTimestamp: resolutionTime,
    createdAt: new Date(createdAt * 1000).toISOString(),
    resolved,
    outcome,
    marketType,
    status: resolved ? "resolved" : Date.now() / 1000 > resolutionTime ? "expired" : "active",
  };
}

// ── API Routes ──

// GET /api/markets — all markets
app.get("/api/markets", async (req, res) => {
  try {
    const markets = await fetchAllMarkets();
    const status = req.query.status; // ?status=active|resolved|expired
    const category = req.query.category; // ?category=crypto|sports|politics|culture|memes|defi|tech
    let filtered = markets;

    if (status) {
      filtered = filtered.filter((m) => m.status === status);
    }

    // Sort by newest first
    filtered.sort((a, b) => b.id - a.id);

    res.json({
      success: true,
      count: filtered.length,
      markets: filtered,
    });
  } catch (err) {
    console.error("Error fetching markets:", err);
    res.status(500).json({ success: false, error: "Failed to fetch markets" });
  }
});

// GET /api/markets/:id — single market by ID
app.get("/api/markets/:id", async (req, res) => {
  try {
    const markets = await fetchAllMarkets();
    const market = markets.find((m) => m.id === parseInt(req.params.id));
    if (!market) {
      return res.status(404).json({ success: false, error: "Market not found" });
    }
    res.json({ success: true, market });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch market" });
  }
});

// GET /api/markets/hot — top markets by volume
app.get("/api/hot", async (req, res) => {
  try {
    const markets = await fetchAllMarkets();
    const active = markets
      .filter((m) => m.status === "active")
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, 5);
    res.json({ success: true, count: active.length, markets: active });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch hot markets" });
  }
});

// GET /api/flash — flash markets only
app.get("/api/flash", async (req, res) => {
  try {
    const markets = await fetchAllMarkets();
    const flash = markets
      .filter((m) => m.marketType !== "standard" && m.status === "active")
      .sort((a, b) => a.resolutionTimestamp - b.resolutionTimestamp);
    res.json({ success: true, count: flash.length, markets: flash });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch flash markets" });
  }
});

// GET /api/closing-soon — markets closing within 24h
app.get("/api/closing-soon", async (req, res) => {
  try {
    const markets = await fetchAllMarkets();
    const now = Date.now() / 1000;
    const closing = markets
      .filter((m) => m.status === "active" && m.resolutionTimestamp - now < 86400 && m.resolutionTimestamp > now)
      .sort((a, b) => a.resolutionTimestamp - b.resolutionTimestamp);
    res.json({ success: true, count: closing.length, markets: closing });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch closing markets" });
  }
});

// GET /api/stats — platform stats
app.get("/api/stats", async (req, res) => {
  try {
    const markets = await fetchAllMarkets();
    const active = markets.filter((m) => m.status === "active");
    const totalVolume = markets.reduce((sum, m) => sum + m.totalVolume, 0);
    res.json({
      success: true,
      stats: {
        totalMarkets: markets.length,
        activeMarkets: active.length,
        resolvedMarkets: markets.filter((m) => m.status === "resolved").length,
        totalVolumeSol: parseFloat(totalVolume.toFixed(4)),
        maxBetSol: 0.25,
        platformFeePct: 3,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
});

// GET /api/prediction-accounts/:wallet — get user's predictions
app.get("/api/predictions/:wallet", async (req, res) => {
  try {
    const walletPubkey = new PublicKey(req.params.wallet);
    const allAccounts = await connection.getProgramAccounts(PROGRAM_ID);
    const markets = await fetchAllMarkets();
    
    const predictions = [];
    for (const acc of allAccounts) {
      const data = acc.account.data;
      // Prediction accounts are ~107 bytes
      if (data.length > 50 && data.length < 200) {
        try {
          let offset = 8; // skip discriminator
          const user = new PublicKey(data.slice(offset, offset + 32)).toBase58();
          offset += 32;
          const marketKey = new PublicKey(data.slice(offset, offset + 32)).toBase58();
          offset += 32;
          const amount = Number(data.readBigUInt64LE(offset)) / 1e9;
          offset += 8;
          const position = data[offset] === 1;
          offset += 1;
          const claimed = data[offset] === 1;

          if (user === walletPubkey.toBase58()) {
            const market = markets.find((m) => m.pubkey === marketKey);
            predictions.push({
              market: marketKey,
              marketTitle: market ? market.title : "Unknown",
              marketStatus: market ? market.status : "unknown",
              amountSol: amount,
              position: position ? "YES" : "NO",
              claimed,
              outcome: market ? market.outcome : null,
              won: market && market.resolved ? market.outcome === position : null,
            });
          }
        } catch (e) {
          // Skip
        }
      }
    }

    res.json({ success: true, count: predictions.length, predictions });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch predictions" });
  }
});

// GET /api/bet-instruction/:marketId/:position/:amount/:wallet
// Returns the transaction details needed to place a bet
// SeekerClaw will use solana_send to execute it
app.get("/api/bet-info/:marketId", async (req, res) => {
  try {
    const marketId = parseInt(req.params.marketId);
    const markets = await fetchAllMarkets();
    const market = markets.find((m) => m.id === marketId);

    if (!market) {
      return res.status(404).json({ success: false, error: "Market not found" });
    }

    if (market.status !== "active") {
      return res.status(400).json({ success: false, error: "Market is not active" });
    }

    // Return the market address and vault address needed for the transaction
    const marketIdBytes = Buffer.alloc(8);
    marketIdBytes.writeBigUInt64LE(BigInt(marketId));

    const [marketPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("market"), marketIdBytes],
      PROGRAM_ID
    );

    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), marketIdBytes],
      PROGRAM_ID
    );

    res.json({
      success: true,
      programId: PROGRAM_ID.toBase58(),
      marketAddress: marketPda.toBase58(),
      vaultAddress: vaultPda.toBase58(),
      marketId: marketId,
      maxBetLamports: 250000000,
      maxBetSol: 0.25,
      market: market,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to get bet info" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "seekalpha-api", version: "1.0.0" });
});

app.listen(PORT, () => {
  console.log(`SeekAlpha API running on port ${PORT}`);
  console.log(`Program ID: ${PROGRAM_ID.toBase58()}`);
  console.log(`RPC: mainnet via Helius`);
});
