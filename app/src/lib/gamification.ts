"use client";

// Badge definitions
export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const ALL_BADGES: Badge[] = [
  { id: "first-prediction", name: "First Prediction", icon: "🔮", description: "Placed your first prediction" },
  { id: "streak-3", name: "3-Streak", icon: "🔥", description: "3 correct predictions in a row" },
  { id: "streak-5", name: "5-Streak", icon: "🔥🔥", description: "5 correct predictions in a row" },
  { id: "whale", name: "Whale", icon: "🐋", description: "Bet more than 1 SOL on a single market" },
  { id: "early-bird", name: "Early Bird", icon: "🐦", description: "Bet within the first hour of a market" },
];

const STORAGE_KEY_PREFIX = "seekalpha_gamification_";

function getKey(wallet: string) {
  return `${STORAGE_KEY_PREFIX}${wallet}`;
}

export interface GamificationData {
  streak: number;
  maxStreak: number;
  badges: string[]; // badge ids
  totalPredictions: number;
  maxBetSol: number;
  earliestBetMinutes: number; // minutes after market creation
}

function defaultData(): GamificationData {
  return { streak: 0, maxStreak: 0, badges: [], totalPredictions: 0, maxBetSol: 0, earliestBetMinutes: Infinity };
}

export function loadGamification(wallet: string): GamificationData {
  if (typeof window === "undefined") return defaultData();
  try {
    const raw = localStorage.getItem(getKey(wallet));
    if (!raw) return defaultData();
    return { ...defaultData(), ...JSON.parse(raw) };
  } catch {
    return defaultData();
  }
}

export function saveGamification(wallet: string, data: GamificationData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getKey(wallet), JSON.stringify(data));
}

// Call after a prediction is placed
export function recordPrediction(
  wallet: string,
  amountSol: number,
  marketCreatedAt: Date
) {
  const data = loadGamification(wallet);
  data.totalPredictions += 1;

  // First prediction badge
  if (!data.badges.includes("first-prediction")) {
    data.badges.push("first-prediction");
  }

  // Whale badge
  if (amountSol > 1 && !data.badges.includes("whale")) {
    data.badges.push("whale");
  }
  data.maxBetSol = Math.max(data.maxBetSol, amountSol);

  // Early bird — bet within first hour
  const minutesSinceCreation = (Date.now() - marketCreatedAt.getTime()) / (1000 * 60);
  if (minutesSinceCreation <= 60 && !data.badges.includes("early-bird")) {
    data.badges.push("early-bird");
  }
  data.earliestBetMinutes = Math.min(data.earliestBetMinutes, minutesSinceCreation);

  saveGamification(wallet, data);
}

// Call when checking resolved markets to update streak
export function updateStreak(wallet: string, won: boolean) {
  const data = loadGamification(wallet);

  if (won) {
    data.streak += 1;
    data.maxStreak = Math.max(data.maxStreak, data.streak);

    if (data.streak >= 3 && !data.badges.includes("streak-3")) {
      data.badges.push("streak-3");
    }
    if (data.streak >= 5 && !data.badges.includes("streak-5")) {
      data.badges.push("streak-5");
    }
  } else {
    data.streak = 0;
  }

  saveGamification(wallet, data);
}

export function getBadgeDetails(badgeId: string): Badge | undefined {
  return ALL_BADGES.find((b) => b.id === badgeId);
}
