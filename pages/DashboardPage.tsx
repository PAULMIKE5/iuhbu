
import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '../hooks/useUser';
import { getDailyMiningInsight } from '../services/geminiService';
import { MINING_DURATION_MS } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';
import { Currency } from '../types';
import AdSenseUnit from '../components/AdSenseUnit'; // Import AdSense component

const StatCard: React.FC<{ title: string; value: string | number; icon?: React.ReactNode; colorClass?: string; large?: boolean; className?: string }> = ({ title, value, icon, colorClass = "text-accent", large = false, className = "" }) => (
  <div className={`bg-gray-800 bg-opacity-60 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 ${large ? 'col-span-1 md:col-span-2' : ''} ${className}`}>
    <div className="flex items-center justify-between">
      <h3 className={`text-sm font-medium text-gray-400 uppercase tracking-wider ${large ? 'text-lg' : ''}`}>{title}</h3>
      {icon && <div className={`text-3xl ${colorClass} opacity-70`}>{icon}</div>}
    </div>
    <p className={`mt-2 text-3xl font-semibold ${colorClass} ${large ? 'text-5xl' : ''}`}>{value}</p>
  </div>
);

const formatTime = (ms: number): string => {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const DashboardPage: React.FC = () => {
  const { currentUser, startMining, claimRewards } = useUser();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState<boolean>(true);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const fetchInsight = async () => {
      setInsightLoading(true);
      const insight = await getDailyMiningInsight();
      setAiInsight(insight);
      setInsightLoading(false);
    };
    fetchInsight();
  }, []);

  useEffect(() => {
    let intervalId: number | undefined; 
    if (currentUser?.isMining && currentUser.miningEndTime) {
      const updateTimer = () => {
        const remaining = currentUser.miningEndTime! - Date.now();
        setTimeRemaining(remaining > 0 ? remaining : 0);
        if (remaining <= 0) {
          claimRewards(); 
          if (intervalId) clearInterval(intervalId);
        }
      };
      updateTimer(); 
      intervalId = setInterval(updateTimer, 1000) as unknown as number; 
    } else {
      setTimeRemaining(0);
    }
    return () => clearInterval(intervalId);
  }, [currentUser?.isMining, currentUser?.miningEndTime, claimRewards]);

  const canStartMining = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.isMining) return false; 
    return true;
  }, [currentUser]);

  const miningProgressPercent = useMemo(() => {
    if (!currentUser?.isMining || !currentUser.miningStartTime || !currentUser.miningEndTime) return 0;
    const elapsed = Date.now() - currentUser.miningStartTime;
    return Math.min(100, (elapsed / MINING_DURATION_MS) * 100);
  }, [currentUser?.isMining, currentUser?.miningStartTime, currentUser?.miningEndTime]);

  if (!currentUser) {
    return <div className="p-8 text-center"><LoadingSpinner /></div>;
  }
  
  const RangerAICoinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 inline-block mr-1">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
      <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
      <path d="M12 12.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
    </svg>
  );


  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-8">Welcome, <span className="text-accent">{currentUser.email.split('@')[0]}</span>!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title="Ranger AI Balance" 
            value={`${currentUser.balanceRangerAI.toFixed(4)}`} 
            icon={<RangerAICoinIcon/>} 
            colorClass="text-ranger" 
            large 
            className="animate-card-glow"
        />
        <StatCard title="USDT Balance" value={`$${currentUser.balanceUSDT.toFixed(2)}`} colorClass="text-green-400" />
        <StatCard title="BNB Balance" value={`${currentUser.balanceBNB.toFixed(4)}`} colorClass="text-yellow-500" />
      </div>

      <div className="bg-gray-800 bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-xl mb-8 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-accent mb-2">Mining Hub</h2>
        {currentUser.isMining ? (
          <>
            <p className="text-lg text-gray-300 mb-4">Mining Power: <span className="font-bold text-ranger">Active</span></p>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Time Remaining:</span>
                <span className="font-semibold text-gray-200">{formatTime(timeRemaining)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                <div className="bg-ranger h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${miningProgressPercent}%` }}></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">Your rig is working hard. Check back when the cycle completes!</p>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-300 mb-4">Mining Power: <span className="font-bold text-red-500">Inactive</span></p>
            <button
              onClick={startMining}
              disabled={!canStartMining}
              className="w-full bg-accent hover:bg-yellow-300 text-gray-900 font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md text-lg animate-button-glow"
            >
              {canStartMining ? 'Start 24-Hour Mining Cycle' : 'Mining Cycle Complete or Ongoing'}
            </button>
            {!canStartMining && currentUser.miningEndTime && Date.now() > currentUser.miningEndTime && (
                 <p className="text-center text-green-400 mt-3">Mining cycle complete! Rewards automatically claimed. Ready for a new cycle.</p>
            )}
             {!canStartMining && !currentUser.isMining && currentUser.lastClaimTime && (
                 <p className="text-center text-green-400 mt-3">Rewards claimed. You can start a new cycle now.</p>
            )}
          </>
        )}
      </div>

      <div className="bg-gray-800 bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-xl mb-8 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-secondary mb-3">AI Daily Insight</h2>
        {insightLoading ? (
          <div className="flex items-center space-x-2 text-gray-400"> <LoadingSpinner size="sm" /> <span>Fetching wisdom from the AI core...</span></div>
        ) : (
          <p className="text-gray-300 italic">"{aiInsight || 'No insight available today.'}"</p>
        )}
      </div>

      {/* Advertisement Section */}
      <div className="bg-gray-800 bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-xl mb-8 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-gray-400 mb-4 text-center">Advertisement</h2>
        <AdSenseUnit 
          adClient="ca-pub-8191648460080505" 
          adSlot="YOUR_AD_SLOT_ID_HERE" // IMPORTANT: Replace with your actual AdSense ad slot ID
          className="min-h-[100px] w-full" // Adjust min-height as needed
        />
         <p className="text-xs text-gray-500 text-center mt-2">
            Ads support Ranger AI Mining. Ensure your ad slot ID is configured for ads to display correctly.
        </p>
      </div>

    </div>
  );
};

export default DashboardPage;