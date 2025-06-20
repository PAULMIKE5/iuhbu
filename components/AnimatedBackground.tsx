
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-dark to-secondary-dark"></div>
      <div 
        className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-primary opacity-20 rounded-full mix-blend-screen filter blur-3xl animate-subtle-pulse"
        style={{ animationDelay: '0s' }}
      ></div>
      <div 
        className="absolute bottom-1/3 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-secondary opacity-15 rounded-full mix-blend-screen filter blur-3xl animate-subtle-pulse"
        style={{ animationDelay: '2s' }}
      ></div>
       <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 sm:w-80 sm:h-80 bg-accent opacity-10 rounded-full mix-blend-screen filter blur-2xl animate-subtle-pulse"
        style={{ animationDelay: '1s' }}
      ></div>
    </div>
  );
};

export default AnimatedBackground;
    