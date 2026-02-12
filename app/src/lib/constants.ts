export const PROGRAM_ID_STR = "FEiFToWsHmCgjevuw9k8DNS8N8BdVdwTKostmvN9LS8B"; // Placeholder until deployed
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
  // Crypto
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
  // Tech
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
  // DeFi
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
  // Sports
  {
    id: 4,
    title: "Will the Chiefs win Super Bowl LXI?",
    description: "Resolves YES if the Kansas City Chiefs win Super Bowl LXI (2027 season). Resolves NO otherwise.",
    yesPool: 78.3,
    noPool: 234.9,
    resolutionTime: new Date("2027-02-15T00:00:00Z"),
    resolved: false,
    outcome: null,
    category: "Sports",
  },
  {
    id: 5,
    title: "Will a crypto-sponsored team win the Champions League?",
    description: "Resolves YES if the 2025-26 UCL winner has a crypto/Web3 shirt sponsor at time of the final.",
    yesPool: 42.1,
    noPool: 18.3,
    resolutionTime: new Date("2026-06-01T00:00:00Z"),
    resolved: false,
    outcome: null,
    category: "Sports",
  },
  // Politics
  {
    id: 6,
    title: "Will the US pass a stablecoin bill by June 2026?",
    description: "Resolves YES if a federal stablecoin regulation bill is signed into law before July 1, 2026.",
    yesPool: 167.4,
    noPool: 93.8,
    resolutionTime: new Date("2026-07-01T00:00:00Z"),
    resolved: false,
    outcome: null,
    category: "Politics",
  },
  // Memes
  {
    id: 7,
    title: "Will BONK flip SHIB in market cap this year?",
    description: "Resolves YES if BONK's market cap exceeds SHIB's on CoinGecko at any point before Dec 31, 2026.",
    yesPool: 89.6,
    noPool: 156.2,
    resolutionTime: new Date("2026-12-31T23:59:59Z"),
    resolved: false,
    outcome: null,
    category: "Memes",
  },
  {
    id: 8,
    title: "Will a new memecoin hit $1B market cap in under 24 hours?",
    description: "Resolves YES if any new token (launched after Feb 1, 2026) reaches $1B mcap within 24h of launch.",
    yesPool: 201.3,
    noPool: 45.7,
    resolutionTime: new Date("2026-06-30T23:59:59Z"),
    resolved: false,
    outcome: null,
    category: "Memes",
  },
  // Culture
  {
    id: 9,
    title: "Will an AI-generated film win a major festival award in 2026?",
    description: "Resolves YES if a primarily AI-generated film wins at Cannes, Venice, Sundance, or TIFF in 2026.",
    yesPool: 28.4,
    noPool: 71.9,
    resolutionTime: new Date("2026-12-31T23:59:59Z"),
    resolved: false,
    outcome: null,
    category: "Culture",
  },
];
