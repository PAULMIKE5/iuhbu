
import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import LoadingSpinner from '../components/LoadingSpinner';
import { User } from '../types';

const ReferralPage: React.FC = () => {
  const { currentUser, getUsers } = useUser(); // getUsers is for demo
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referredUsers, setReferredUsers] = useState<User[]>([]);

  useEffect(() => {
    if (currentUser) {
      const allUsers = getUsers(); // In a real app, this would be a backend call
      const myReferrals = allUsers.filter(user => user.referredBy === currentUser.referralCode);
      setReferredUsers(myReferrals);
    }
  }, [currentUser, getUsers]);

  if (!currentUser) {
    return <div className="p-8 text-center"><LoadingSpinner /></div>;
  }

  const referralLink = `${window.location.origin}${window.location.pathname}#/register?ref=${currentUser.referralCode}`;

  const handleCopy = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        if (type === 'code') setCopiedCode(true);
        if (type === 'link') setCopiedLink(true);
        setTimeout(() => {
          setCopiedCode(false);
          setCopiedLink(false);
        }, 2000);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-8">Invite Fellow Rangers</h1>
      
      <div className="bg-gray-800 bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-xl backdrop-blur-md mb-8">
        <h2 className="text-2xl font-semibold text-accent mb-4">Your Referral Credentials</h2>
        <p className="text-gray-300 mb-4">Share your code or link to invite new users and earn potential rewards (rewards system coming soon!).</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400">Your Referral Code</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input 
              type="text" 
              readOnly 
              value={currentUser.referralCode} 
              className="flex-1 block w-full rounded-none rounded-l-md p-3 bg-gray-700 text-gray-200 border-gray-600 sm:text-lg focus:ring-accent focus:border-accent"
            />
            <button
              onClick={() => handleCopy(currentUser.referralCode, 'code')}
              className="inline-flex items-center px-4 py-3 border border-l-0 border-gray-600 rounded-r-md bg-primary hover:bg-primary-light text-sm font-medium text-white transition-colors focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            >
              {copiedCode ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Your Referral Link</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input 
              type="text" 
              readOnly 
              value={referralLink} 
              className="flex-1 block w-full rounded-none rounded-l-md p-3 bg-gray-700 text-gray-200 border-gray-600 sm:text-sm focus:ring-accent focus:border-accent"
            />
            <button
              onClick={() => handleCopy(referralLink, 'link')}
              className="inline-flex items-center px-4 py-3 border border-l-0 border-gray-600 rounded-r-md bg-secondary hover:bg-secondary-light text-sm font-medium text-white transition-colors focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            >
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-xl backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-accent mb-4">Your Referred Rangers ({referredUsers.length})</h2>
        {referredUsers.length > 0 ? (
          <ul className="space-y-3">
            {referredUsers.map(user => (
              <li key={user.id} className="bg-gray-700 p-3 rounded-md text-gray-300">
                {user.email} (Joined: {new Date(parseInt(user.id.split('-')[1])).toLocaleDateString()}) {/* Demo: extract timestamp from ID */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">You haven't referred any users yet. Share your code to grow your network!</p>
        )}
      </div>
    </div>
  );
};

export default ReferralPage;
    