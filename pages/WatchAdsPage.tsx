
import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import LoadingSpinner from '../components/LoadingSpinner';
import { WATCH_AD_REWARD_RANGER_AI, AD_WATCH_DURATION_MS } from '../constants';
import { Currency } from '../types';

const WatchAdsPage: React.FC = () => {
  const { currentUser, watchAdAndEarn, isLoading: isUserContextLoading } = useUser();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adMessage, setAdMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  // Effect to clear interval if component unmounts while countdown is active
  useEffect(() => {
    let timerId: number | undefined;
    if (isWatchingAd && countdown > 0) {
      timerId = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { // When countdown reaches 1, it will become 0 in next tick, then clear
            clearInterval(timerId as number);
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown as number;
    }
    return () => clearInterval(timerId);
  }, [isWatchingAd, countdown]);


  if (isUserContextLoading || !currentUser) {
    return <div className="p-8 text-center"><LoadingSpinner /></div>;
  }

  const handleWatchAd = async () => {
    if (isWatchingAd) return;

    setIsWatchingAd(true);
    setAdMessage(null);
    setCountdown(AD_WATCH_DURATION_MS / 1000);

    // Simulate ad watching delay
    setTimeout(async () => {
      const result = await watchAdAndEarn();
      if (result === true) {
        setAdMessage(`Ad watched! You earned ${WATCH_AD_REWARD_RANGER_AI.toFixed(2)} ${Currency.RANGER_AI}.`);
      } else {
        setAdMessage(typeof result === 'string' ? result : "Failed to process ad reward. Please try again.");
      }
      setIsWatchingAd(false);
      // Countdown is cleared by useEffect or naturally ends
    }, AD_WATCH_DURATION_MS);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-6 text-center">Watch Ads & Earn</h1>
      <div className="max-w-md mx-auto bg-gray-800 bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-lg">
        <p className="text-gray-300 mb-6 text-center">
          Watch a short ad to earn a small amount of {Currency.RANGER_AI}.
          Every bit counts towards your digital fortune!
        </p>

        <div className="text-center mb-6 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
          <p className="text-lg text-gray-400">Reward per Ad:</p>
          <p className="text-3xl font-bold text-ranger mt-1">
            {WATCH_AD_REWARD_RANGER_AI.toFixed(2)} <span className="text-xl">{Currency.RANGER_AI}</span>
          </p>
        </div>
        
        {isWatchingAd && countdown > 0 && (
          <div className="text-center my-4 p-3 bg-gray-700 rounded-md">
            <LoadingSpinner size="sm" color="text-accent" />
            <p className="text-accent mt-2 animate-pulse">Ad playing... Please wait ({countdown}s)</p>
            <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
                <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-1000 ease-linear" 
                    style={{ width: `${((AD_WATCH_DURATION_MS / 1000 - countdown) / (AD_WATCH_DURATION_MS / 1000)) * 100}%` }}
                ></div>
            </div>
          </div>
        )}

        {adMessage && !isWatchingAd && ( // Only show message if not actively watching
          <div className={`p-3 my-4 rounded-md text-sm text-center ${adMessage.startsWith('Ad watched!') ? 'bg-green-700 bg-opacity-80 text-green-100' : 'bg-red-800 bg-opacity-80 text-red-200'}`}>
            {adMessage}
          </div>
        )}

        <button
          onClick={handleWatchAd}
          disabled={isWatchingAd || isUserContextLoading}
          className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:shadow-none"
        >
          {isWatchingAd ? `Watching Ad... (${countdown}s)` : `Watch Ad (${AD_WATCH_DURATION_MS / 1000}s)`}
        </button>

        <div className="mt-8 text-center border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-200">Your Current Balance:</h3>
            <p className="text-2xl text-ranger mt-1">
                {currentUser.balanceRangerAI.toFixed(4)} {Currency.RANGER_AI}
            </p>
        </div>
      </div>
    </div>
  );
};

export default WatchAdsPage;