import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ReferralPage from './pages/ReferralPage';
import SwapPage from './pages/SwapPage';
import WatchAdsPage from './pages/WatchAdsPage'; // Import new page
import { ROUTES } from './constants';

const App: React.FC = () => {
  return (
    <UserProvider>
      <HashRouter>
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                <Route path={ROUTES.REFERRALS} element={<ReferralPage />} />
                <Route path={ROUTES.SWAP} element={<SwapPage />} />
                <Route path={ROUTES.WATCH_ADS} element={<WatchAdsPage />} /> {/* Add new route */}
              </Route>
              
              {/* Default redirect */}
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </UserProvider>
  );
};

export default App;