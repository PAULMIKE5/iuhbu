import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, MiningState, UserSession, Currency } from '../types';
import { 
    MINING_DURATION_MS, 
    MINING_REWARD_PER_CYCLE,
    REFERRAL_BONUS_FOR_REFERRER_RANGER_AI,
    REFERRAL_BONUS_FOR_REFERRED_USER_RANGER_AI,
    WATCH_AD_REWARD_RANGER_AI
} from '../constants';

const MOCK_USERS_DB_KEY = 'ranger_ai_users_db';
const CURRENT_USER_SESSION_KEY = 'ranger_ai_current_user_session';

interface UserContextType {
  currentUser: UserSession | null;
  login: (email: string, passwordAttempt: string) => Promise<boolean>;
  register: (email: string, passwordRaw: string, referredByCode?: string) => Promise<boolean | string>;
  logout: () => void;
  startMining: () => void;
  claimRewards: () => void;
  swapCurrency: (from: Currency, to: Currency, amount: number) => Promise<boolean | string>;
  watchAdAndEarn: () => Promise<boolean | string>; // New function for ad rewards
  isLoading: boolean;
  error: string | null;
  getUsers: () => User[]; 
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const getLocalStorageItem = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalStorageItem = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};


export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getMockUsers = (): User[] => getLocalStorageItem<User[]>(MOCK_USERS_DB_KEY, []);
  const saveMockUsers = (users: User[]): void => setLocalStorageItem(MOCK_USERS_DB_KEY, users);

  const generateReferralCode = (): string => `RGR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  const simpleHash = (password: string): string => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; 
    }
    return `sim_hash_${hash}`;
  };

  const loadCurrentUser = useCallback(() => {
    setIsLoading(true);
    const session = getLocalStorageItem<UserSession | null>(CURRENT_USER_SESSION_KEY, null);
    if (session) {
      setCurrentUser(session);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      setLocalStorageItem(CURRENT_USER_SESSION_KEY, currentUser);
    } else {
      localStorage.removeItem(CURRENT_USER_SESSION_KEY);
    }
  }, [currentUser]);

  const login = async (email: string, passwordAttempt: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    const users = getMockUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    const passwordHashAttempt = simpleHash(passwordAttempt);

    if (user && user.passwordHash === passwordHashAttempt) {
      const existingSession = getLocalStorageItem<UserSession | null>(`${CURRENT_USER_SESSION_KEY}_${user.id}`, null);
      const sessionData: UserSession = {
        ...user, 
        isMining: existingSession?.isMining || false,
        miningStartTime: existingSession?.miningStartTime || null,
        miningEndTime: existingSession?.miningEndTime || null,
        lastClaimTime: existingSession?.lastClaimTime || null,
      };
      setCurrentUser(sessionData);
      setLocalStorageItem(CURRENT_USER_SESSION_KEY, sessionData); 
      setLocalStorageItem(`${CURRENT_USER_SESSION_KEY}_${user.id}`, sessionData); 
      setIsLoading(false);
      return true;
    }
    setError("Invalid email or password.");
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, passwordRaw: string, referredByCode?: string): Promise<boolean | string> => {
    setIsLoading(true);
    setError(null);
    const users = getMockUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError("Email already registered.");
      setIsLoading(false);
      return "Email already registered.";
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      email,
      passwordHash: simpleHash(passwordRaw),
      referralCode: generateReferralCode(),
      referredBy: referredByCode,
      balanceRangerAI: 0, 
      balanceUSDT: 1,   
      balanceBNB: 0,     
    };

    if (referredByCode) {
      const referringUserIndex = users.findIndex(u => u.referralCode === referredByCode);
      if (referringUserIndex !== -1) {
        users[referringUserIndex].balanceRangerAI += REFERRAL_BONUS_FOR_REFERRER_RANGER_AI;
        newUser.balanceRangerAI += REFERRAL_BONUS_FOR_REFERRED_USER_RANGER_AI;
      } else {
        console.warn(`Referral code ${referredByCode} not found.`);
      }
    }
    
    users.push(newUser);
    saveMockUsers(users); 
    
    const sessionData: UserSession = {
        ...newUser,
        isMining: false,
        miningStartTime: null,
        miningEndTime: null,
        lastClaimTime: null,
    };
    setCurrentUser(sessionData);
    setLocalStorageItem(CURRENT_USER_SESSION_KEY, sessionData);
    setLocalStorageItem(`${CURRENT_USER_SESSION_KEY}_${sessionData.id}`, sessionData);

    setIsLoading(false);
    return true;
  };

  const logout = () => {
    if (currentUser) {
         setLocalStorageItem(`${CURRENT_USER_SESSION_KEY}_${currentUser.id}`, currentUser); 
    }
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_SESSION_KEY);
  };
  
  const claimRewards = useCallback(() => {
    setCurrentUser(prevUser => {
      if (!prevUser || !prevUser.isMining || !prevUser.miningEndTime || Date.now() < prevUser.miningEndTime) {
        if (prevUser && prevUser.isMining && prevUser.miningEndTime && Date.now() >= prevUser.miningEndTime) {
           return { ...prevUser, isMining: false, balanceRangerAI: prevUser.balanceRangerAI + MINING_REWARD_PER_CYCLE };
        }
        return prevUser;
      }
      return {
        ...prevUser,
        isMining: false,
        miningStartTime: null,
        miningEndTime: null,
        balanceRangerAI: prevUser.balanceRangerAI + MINING_REWARD_PER_CYCLE,
        lastClaimTime: Date.now(),
      };
    });
  }, []);


  const startMining = () => {
    setCurrentUser(prevUser => {
      if (!prevUser || prevUser.isMining) return prevUser;
      const startTime = Date.now();
      return {
        ...prevUser,
        isMining: true,
        miningStartTime: startTime,
        miningEndTime: startTime + MINING_DURATION_MS,
      };
    });
  };

  const swapCurrency = async (from: Currency, to: Currency, amount: number): Promise<boolean | string> => {
    setError(null);
    if (!currentUser) return "User not logged in";
    if (amount <= 0) return "Amount must be positive";

    const rangerAiToUsdtRate = 2.62;
    const usdtToBnbRate = 0.002; 
    const bnbToUsdtRate = 500;   

    const rates = {
      [Currency.RANGER_AI]: { 
        [Currency.USDT]: rangerAiToUsdtRate, 
        [Currency.BNB]: rangerAiToUsdtRate * usdtToBnbRate 
      },
      [Currency.USDT]: { 
        [Currency.RANGER_AI]: 1 / rangerAiToUsdtRate, 
        [Currency.BNB]: usdtToBnbRate 
      },
      [Currency.BNB]: { 
        [Currency.RANGER_AI]: bnbToUsdtRate / rangerAiToUsdtRate, 
        [Currency.USDT]: bnbToUsdtRate 
      },
    };

    if (!rates[from] || !rates[from][to]) return "Swap pair not supported";

    const rate = rates[from][to];
    const amountToReceive = amount * rate;

    let newBalances = { ...currentUser };

    const updateBalance = (currency: Currency, change: number) => {
      switch (currency) {
        case Currency.RANGER_AI: newBalances.balanceRangerAI += change; break;
        case Currency.USDT: newBalances.balanceUSDT += change; break;
        case Currency.BNB: newBalances.balanceBNB += change; break;
      }
    };
    
    const getBalance = (currency: Currency) => {
        switch (currency) {
            case Currency.RANGER_AI: return currentUser.balanceRangerAI;
            case Currency.USDT: return currentUser.balanceUSDT;
            case Currency.BNB: return currentUser.balanceBNB;
            default: return 0;
        }
    }

    if (getBalance(from) < amount) {
      return `Insufficient ${from} balance. You have ${getBalance(from).toFixed(4)}, need ${amount}.`;
    }

    updateBalance(from, -amount);
    updateBalance(to, amountToReceive);
    
    setCurrentUser(newBalances);
    return true;
  };

  const watchAdAndEarn = async (): Promise<boolean | string> => {
    if (!currentUser) return "User not logged in. Cannot claim ad reward.";
    
    setCurrentUser(prevUser => {
      if (!prevUser) return null; // Should not happen if guard above works
      
      const updatedUser = {
        ...prevUser,
        balanceRangerAI: prevUser.balanceRangerAI + WATCH_AD_REWARD_RANGER_AI,
      };
      
      // Update the user in mock DB as well
      const users = getMockUsers();
      const userIndex = users.findIndex(u => u.id === prevUser.id);
      if (userIndex !== -1) {
        users[userIndex].balanceRangerAI = updatedUser.balanceRangerAI;
        saveMockUsers(users);
      }
      
      return updatedUser;
    });
    return true;
  };


  useEffect(() => {
    let intervalId: number | undefined; 
    if (currentUser?.isMining && currentUser.miningEndTime) {
      if (Date.now() >= currentUser.miningEndTime) {
        claimRewards();
      } else {
        intervalId = setInterval(() => {
          if (currentUser.miningEndTime && Date.now() >= currentUser.miningEndTime) {
            claimRewards();
            if(intervalId) clearInterval(intervalId);
          }
          setCurrentUser(prev => prev ? {...prev} : null); 
        }, 1000) as unknown as number; 
      }
    }
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.isMining, currentUser?.miningEndTime, claimRewards]);
  
  const getUsers = (): User[] => getMockUsers();


  return (
    <UserContext.Provider value={{ currentUser, login, register, logout, startMining, claimRewards, swapCurrency, watchAdAndEarn, isLoading, error, getUsers }}>
      {children}
    </UserContext.Provider>
  );
};