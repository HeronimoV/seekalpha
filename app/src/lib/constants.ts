export const PROGRAM_ID_STR = "FEiFToWsHmCgjevuw9k8DNS8N8BdVdwTKostmvN9LS8B";
export const RPC_ENDPOINT = "https://api.devnet.solana.com";
export const PLATFORM_FEE_BPS = 300; // 3%

// Categories for filtering — markets don't store category on-chain yet,
// so we infer from keywords in the title for now
export function inferCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("sol") || t.includes("btc") || t.includes("bitcoin") || t.includes("eth") || t.includes("crypto")) return "Crypto";
  if (t.includes("seeker") || t.includes("phone") || t.includes("ai") || t.includes("tech")) return "Tech";
  if (t.includes("defi") || t.includes("dex") || t.includes("tvl")) return "DeFi";
  if (t.includes("super bowl") || t.includes("champion") || t.includes("nba") || t.includes("sport")) return "Sports";
  if (t.includes("bill") || t.includes("regulation") || t.includes("congress") || t.includes("politi")) return "Politics";
  if (t.includes("meme") || t.includes("bonk") || t.includes("shib") || t.includes("doge")) return "Memes";
  return "Culture";
}
