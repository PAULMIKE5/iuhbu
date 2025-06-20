export const APP_NAME = "Ranger AI Mining";

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  REFERRALS: "/referrals",
  SWAP: "/swap",
  WATCH_ADS: "/watch-ads", // New route
};

export const MINING_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
export const MINING_REWARD_PER_CYCLE = 0.5; // Ranger AI tokens

export const REFERRAL_BONUS_FOR_REFERRER_RANGER_AI = 1; // Ranger AI tokens
export const REFERRAL_BONUS_FOR_REFERRED_USER_RANGER_AI = 0.5; // Ranger AI tokens

export const WATCH_AD_REWARD_RANGER_AI = 0.05; // Ranger AI tokens per ad
export const AD_WATCH_DURATION_MS = 10000; // 10 seconds

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";