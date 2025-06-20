
export interface User {
  id: string;
  email: string;
  passwordHash: string; // In a real app, never store plain passwords
  referralCode: string;
  referredBy?: string;
  balanceRangerAI: number;
  balanceUSDT: number;
  balanceBNB: number;
}

export interface MiningState {
  isMining: boolean;
  miningStartTime: number | null;
  miningEndTime: number | null;
  lastClaimTime: number | null;
}

export interface UserSession extends User, MiningState {}

export enum Currency {
  RANGER_AI = "RangerAI",
  USDT = "USDT",
  BNB = "BNB",
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}
    