import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { Currency } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const SwapPage: React.FC = () => {
  const { currentUser, swapCurrency, isLoading: isUserLoading } = useUser();
  const [fromCurrency, setFromCurrency] = useState<Currency>(Currency.RANGER_AI);
  const [toCurrency, setToCurrency] = useState<Currency>(Currency.USDT);
  const [amount, setAmount] = useState<string>('');
  const [swapMessage, setSwapMessage] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);


  if (isUserLoading || !currentUser) {
    return <div className="p-8 text-center"><LoadingSpinner /></div>;
  }

  const getBalance = (currency: Currency): number => {
    switch (currency) {
      case Currency.RANGER_AI: return currentUser.balanceRangerAI;
      case Currency.USDT: return currentUser.balanceUSDT;
      case Currency.BNB: return currentUser.balanceBNB;
      default: return 0;
    }
  };

  // Updated mock exchange rates for display purposes - 1 RangerAI = 2.62 USDT
  const rangerAiToUsdtRate = 2.62;
  const usdtToBnbRate = 0.002; 
  const bnbToUsdtRate = 500;

  const displayRates = {
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
  
  const currentRate = displayRates[fromCurrency]?.[toCurrency] || (displayRates[toCurrency]?.[fromCurrency] ? 1 / displayRates[toCurrency]?.[fromCurrency] : 0) ;
  const amountToReceive = parseFloat(amount) * currentRate || 0;


  const handleSwap = async () => {
    setSwapMessage(null);
    setIsSwapping(true);
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setSwapMessage("Please enter a valid amount.");
      setIsSwapping(false);
      return;
    }
    if (fromCurrency === toCurrency) {
      setSwapMessage("Cannot swap a currency for itself.");
      setIsSwapping(false);
      return;
    }
     if (!displayRates[fromCurrency]?.[toCurrency] && !displayRates[toCurrency]?.[fromCurrency]) {
      setSwapMessage(`Swapping ${fromCurrency} to ${toCurrency} is not currently supported.`);
      setIsSwapping(false);
      return;
    }

    const result = await swapCurrency(fromCurrency, toCurrency, numericAmount);
    if (result === true) {
      setSwapMessage(`Successfully swapped ${numericAmount.toFixed(4)} ${fromCurrency} for ${amountToReceive.toFixed(4)} ${toCurrency}.`);
      setAmount('');
    } else {
      setSwapMessage(typeof result === 'string' ? result : "Swap failed. Please try again.");
    }
    setIsSwapping(false);
  };
  
  const handleSetMax = () => {
    setAmount(getBalance(fromCurrency).toString());
  };

  const switchCurrencies = () => {
    const isValidOriginalPair = displayRates[fromCurrency]?.[toCurrency];
    const isValidReversedPair = displayRates[toCurrency]?.[fromCurrency];

    if (isValidOriginalPair || isValidReversedPair) {
        const tempFrom = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(tempFrom);
        setAmount(''); 
    } else {
        setSwapMessage(`Cannot directly switch to swap ${toCurrency} for ${fromCurrency}. Select manually if pair is supported.`);
    }
  };


  const availableCurrencies = Object.values(Currency);
  const toCurrenciesAvailable = availableCurrencies.filter(c => c !== fromCurrency && (displayRates[fromCurrency]?.[c] || displayRates[c]?.[fromCurrency]));


  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-8">Token Operations</h1>
      
      {/* Swap Section */}
      <div className="max-w-xl mx-auto bg-gray-800 bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-xl backdrop-blur-md mb-10">
        <h2 className="text-2xl font-semibold text-accent mb-6 text-center">Swap Tokens</h2>
        {swapMessage && (
          <div className={`p-3 mb-4 rounded-md text-sm ${swapMessage.startsWith('Successfully') ? 'bg-green-700 bg-opacity-80 text-green-100' : 'bg-red-800 bg-opacity-80 text-red-200'}`}>
            {swapMessage}
          </div>
        )}

        {/* From Currency */}
        <div className="mb-4">
          <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-400 mb-1">From</label>
          <div className="flex">
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => {
                const newFrom = e.target.value as Currency;
                setFromCurrency(newFrom);
                const currentToIsValid = displayRates[newFrom]?.[toCurrency] || displayRates[toCurrency]?.[newFrom];
                if (!currentToIsValid) {
                  const newTo = Object.values(Currency).find(c => c !== newFrom && (displayRates[newFrom]?.[c] || displayRates[c]?.[newFrom]));
                  if (newTo) setToCurrency(newTo); else setToCurrency('' as Currency); // Fallback if no valid pair for newFrom
                }
                 setAmount(''); 
              }}
              className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-gray-200 bg-gray-700 border border-gray-600 rounded-l-md hover:bg-gray-600 focus:ring-1 focus:outline-none focus:ring-accent"
            >
              {availableCurrencies.map(curr => <option key={curr} value={curr}>{curr}</option>)}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="any"
              className="block w-full p-3 text-sm text-gray-200 bg-gray-900 border border-l-0 border-gray-600 rounded-r-md focus:ring-accent focus:border-accent placeholder-gray-500"
            />
          </div>
          <div className="text-xs text-gray-400 mt-1 flex justify-between">
            <span>Balance: {getBalance(fromCurrency).toFixed(4)} {fromCurrency}</span>
            <button onClick={handleSetMax} className="text-accent hover:underline">Max</button>
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center my-4">
            <button 
                onClick={switchCurrencies}
                disabled={!(displayRates[fromCurrency]?.[toCurrency] || displayRates[toCurrency]?.[fromCurrency])}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-accent transition-transform transform hover:rotate-180 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Switch currencies"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4 4 4m6 0v12m0 0l4-4m-4 4L13 16" />
                </svg>
            </button>
        </div>

        {/* To Currency */}
        <div className="mb-6">
          <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-400 mb-1">To</label>
          <div className="flex">
             <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as Currency)}
              className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-gray-200 bg-gray-700 border border-gray-600 rounded-l-md hover:bg-gray-600 focus:ring-1 focus:outline-none focus:ring-accent"
            >
              {toCurrenciesAvailable.length > 0 ? 
                toCurrenciesAvailable.map(curr => <option key={curr} value={curr}>{curr}</option>) :
                <option value="">No swap available</option>
              }
            </select>
            <input
              type="number"
              value={amountToReceive.toFixed(4)}
              readOnly
              placeholder="0.00"
              className="block w-full p-3 text-sm text-gray-400 bg-gray-900 border border-l-0 border-gray-600 rounded-r-md focus:ring-accent focus:border-accent placeholder-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">Balance: {getBalance(toCurrency).toFixed(4)} {toCurrency}</div>
        </div>
        
        {currentRate > 0 && parseFloat(amount) > 0 && (
          <p className="text-sm text-gray-400 mb-4 text-center">
            Rate: 1 {fromCurrency} ≈ {currentRate.toFixed(4)} {toCurrency} <br/>
            You receive: {amountToReceive.toFixed(4)} {toCurrency}
          </p>
        )}
         {!(displayRates[fromCurrency]?.[toCurrency]) && fromCurrency !== toCurrency && ( // Check if direct swap is not possible
            <p className="text-sm text-red-400 mb-4 text-center">
                Swapping from {fromCurrency} to {toCurrency} is not directly supported.
            </p>
        )}


        <button
          onClick={handleSwap}
          disabled={isSwapping || !amount || parseFloat(amount) <= 0 || fromCurrency === toCurrency || !displayRates[fromCurrency]?.[toCurrency]}
          className="w-full bg-accent hover:bg-yellow-300 text-gray-900 font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSwapping ? <LoadingSpinner size="sm" color="text-gray-900"/> : 'Swap Tokens'}
        </button>
      </div>

      {/* Withdrawal Section */}
      <div className="max-w-xl mx-auto bg-gray-800 bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-xl backdrop-blur-md">
         <h2 className="text-2xl font-semibold text-red-500 mb-3 text-center">Withdraw Funds</h2>
         <p className="text-gray-400 mb-4 text-center">Access your mined assets. Please note withdrawal systems are under maintenance.</p>
         <div className="flex justify-center">
            <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105"
            >
                Attempt Withdrawal
            </button>
         </div>
      </div>

      <Modal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} title="Withdrawal Status">
        <p className="text-gray-300">Our withdrawal systems are currently undergoing scheduled maintenance to enhance security and performance.</p>
        <p className="text-gray-400 mt-2">This applies to {Currency.RANGER_AI}, {Currency.USDT}, and {Currency.BNB} withdrawals.</p>
        <p className="text-gray-400 mt-2">Please try again later. We apologize for any inconvenience.</p>
        <button 
            onClick={() => setIsWithdrawModalOpen(false)} 
            className="mt-6 w-full bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-colors"
        >
            Understood
        </button>
      </Modal>

    </div>
  );
};

export default SwapPage;