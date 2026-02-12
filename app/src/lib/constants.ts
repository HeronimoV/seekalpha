import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey("SeekA1pha111111111111111111111111111111111");
export const RPC_ENDPOINT = "https://api.devnet.solana.com";
export const PLATFORM_FEE_BPS = 300; // 3%

// Demo markets for UI development before contract is deployed
export interface Market {
  id: number;
  title: string;
  description: string;
  yesPool: number;
  noPool: number;
  resolutionTime: Date;
  resolved: boolean;
  outcome: boolean | null;
  category: string;
}

export const DEMO_MARKETS: Market[] = [
  {
    id: 0,
    title: "Will SOL hit $200 by end of February?",
    description: "Resolves YES if SOL/USD reaches $200 on any major exchange before Feb 28, 2026.",
    yesPool: 145.5,
    noPool: 87.2,
    resolutionTime: new Date("2026-02-28T23:59:59Z"),
    resolved: false,
    outcome: null,
    category: "Crypto",
  },
  {
    id: 1,
    title: "Will Bitcoin reach $120K before April?",
    description: "Resolves YES if BTC/USD touches $120,000 on Binance or Coinbase before April 1, 2026.",
    yesPool: 312.0,
    noPool: 198.5,
    resolutionTime: new Date("2026-04-01T00:00:00Z"),
    resolved: false,
    outcome: null,
    category: "Crypto",
  },
  {
    id: 2,
    title: "Will the Seeker phone ship before Q2 2026?",
    description: "Resolves YES if Solana Mobile confirms Seeker units have shipped to customers before July 1, 2026.",
    yesPool: 56.8,
    noPool: 23.1,
    resolutionTime: new Date("2026-07-01T00:00:00Z"),
    resolved: false,
    outcome: null,
    category: "Tech",
  },
  {
    id: 3,
    title: "Will ETH flip SOL in daily DEX volume this month?",
    description: "Resolves YES if Ethereum DEX volume exceeds Solana DEX volume for any single day in February 2026.",
    yesPool: 34.2,
    noPool: 89.7,
    resolutionTime: new Date("2026-02-28T23:59:59Z"),
    resolved: false,
    outcome: null,
    category: "DeFi",
  },
];
