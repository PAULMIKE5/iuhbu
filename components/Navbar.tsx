import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { ROUTES, APP_NAME } from '../constants';
import { Currency } from '../types';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg p-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={currentUser ? ROUTES.DASHBOARD : ROUTES.LOGIN} className="text-2xl font-bold text-accent hover:text-yellow-300 transition-colors">
          {APP_NAME}
        </Link>
        <div className="space-x-2 sm:space-x-4 flex items-center">
          {currentUser ? (
            <>
              <Link to={ROUTES.DASHBOARD} className="text-gray-300 hover:text-white transition-colors px-2 py-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium">Dashboard</Link>
              <Link to={ROUTES.SWAP} className="text-gray-300 hover:text-white transition-colors px-2 py-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium">Swap</Link>
              <Link to={ROUTES.WATCH_ADS} className="text-gray-300 hover:text-white transition-colors px-2 py-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium">Watch Ads</Link>
              <Link to={ROUTES.REFERRALS} className="text-gray-300 hover:text-white transition-colors px-2 py-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium">Referrals</Link>
              <Link to={ROUTES.PROFILE} className="text-gray-300 hover:text-white transition-colors px-2 py-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium">Profile</Link>
              <div className="text-xs sm:text-sm text-ranger hidden md:block">
                {currentUser.balanceRangerAI.toFixed(2)} {Currency.RANGER_AI}
              </div>
              <button
                onClick={handleLogout}
                className="bg-primary hover:bg-primary-light text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 text-xs sm:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">Login</Link>
              <Link to={ROUTES.REGISTER} className="bg-accent hover:bg-yellow-300 text-gray-900 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;