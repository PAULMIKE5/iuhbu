
import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { currentUser } = useUser();
  const [copied, setCopied] = useState(false);

  if (!currentUser) {
    return <div className="p-8 text-center"><LoadingSpinner /></div>;
  }

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(currentUser.referralCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };
  
  const referralLink = `${window.location.origin}${window.location.pathname}#/register?ref=${currentUser.referralCode}`;


  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-8">Your Profile</h1>
      
      <div className="bg-gray-800 bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-xl backdrop-blur-md max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400">Email Address</label>
            <p className="mt-1 text-lg text-gray-200 bg-gray-700 p-3 rounded-md">{currentUser.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400">Your Unique Referral Code</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input 
                type="text" 
                readOnly 
                value={currentUser.referralCode} 
                className="flex-1 block w-full rounded-none rounded-l-md p-3 bg-gray-700 text-gray-200 border-gray-600 sm:text-lg focus:ring-accent focus:border-accent"
              />
              <button
                onClick={handleCopyReferral}
                className="inline-flex items-center px-4 py-3 border border-l-0 border-gray-600 rounded-r-md bg-primary hover:bg-primary-light text-sm font-medium text-white transition-colors focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-400">Your Referral Link</label>
             <p className="mt-1 text-sm text-gray-300 bg-gray-700 p-3 rounded-md overflow-x-auto">
                {referralLink}
             </p>
             <button
                onClick={() => navigator.clipboard.writeText(referralLink).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}
                className="mt-2 w-full bg-secondary hover:bg-secondary-light text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-colors"
              >
                {copied ? 'Link Copied!' : 'Copy Referral Link'}
              </button>
          </div>

          {currentUser.referredBy && (
            <div>
              <label className="block text-sm font-medium text-gray-400">Referred By Code</label>
              <p className="mt-1 text-lg text-gray-200 bg-gray-700 p-3 rounded-md">{currentUser.referredBy}</p>
            </div>
          )}

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-accent mb-3">Account Balances</h3>
            <div className="space-y-2">
              <p className="text-gray-300">Ranger AI: <span className="font-bold text-ranger">{currentUser.balanceRangerAI.toFixed(4)}</span></p>
              <p className="text-gray-300">USDT: <span className="font-bold text-green-400">${currentUser.balanceUSDT.toFixed(2)}</span></p>
              <p className="text-gray-300">BNB: <span className="font-bold text-yellow-500">{currentUser.balanceBNB.toFixed(4)}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
    