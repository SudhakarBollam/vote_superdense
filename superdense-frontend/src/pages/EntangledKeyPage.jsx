import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// This is the component for the "Step 1: The Entangled Key" page.
export default function EntangledKeyPage() {
  const navigate = useNavigate();
  const onProceed = () => {
    navigate('/voting-app');
  };
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start the animation after the component mounts.
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 500); // Small delay to ensure CSS transitions can be seen

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white"
         style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(163, 66, 237, 0.2) 0%, rgba(20, 10, 50, 0.8) 50%, rgba(5, 5, 20, 1) 100%)' }}>
      
      {/* Main container */}
      <div className="w-full max-w-7xl flex flex-col items-center justify-center p-4">
        
        {/* Step Title and Subtitle */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-400 font-['Inter']">Step 1: The Entangled Key</h1>
          <p className="text-xl text-purple-300 font-medium font-['Inter'] mt-2">Creating your quantum-secured ballot</p>
        </div>

        {/* The main diagram container */}
        <div className="relative w-full flex items-center justify-center mb-12">
          
          {/* Central Server Box */}
          <div className="flex flex-col items-center mx-4">
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 border-2 border-blue-500 rounded-2xl p-4 md:p-6 text-center text-sm md:text-base font-bold shadow-lg transform transition-transform duration-500 ease-out"
                 style={{ transform: isAnimating ? 'scale(1)' : 'scale(0.8)', opacity: isAnimating ? 1 : 0 }}>
              <p>Central Server</p>
            </div>
            {/* Server's Qubit */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-full mt-4 animate-pulse-slow transition-opacity duration-1000 ease-in"
                 style={{ opacity: isAnimating ? 1 : 0 }}></div>
            <p className="mt-2 text-sm text-gray-400">Server's Qubit</p>
          </div>
          
          {/* The Entanglement Line */}
          <div className="relative flex-1 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transform transition-transform duration-1000 ease-out"
               style={{ transform: isAnimating ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left' }}>
            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm md:text-base text-white bg-purple-600 px-3 py-1 rounded-full shadow-lg whitespace-nowrap opacity-0 animate-fade-in-slow"
                  style={{ animationDelay: '1s' }}>ENTANGLED PAIR</span>
            <span className="absolute left-1/2 top-[450%] transform -translate-x-1/2 text-sm text-purple-300 font-medium whitespace-nowrap opacity-0 animate-fade-in-slow"
                  style={{ animationDelay: '1.5s' }}>Quantum Entanglement ✨</span>
          </div>

          {/* Your Seat Box */}
          <div className="flex flex-col items-center mx-4">
            <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 border-2 border-indigo-500 rounded-2xl p-4 md:p-6 text-center text-sm md:text-base font-bold shadow-lg transform transition-transform duration-500 ease-out"
                 style={{ transform: isAnimating ? 'scale(1)' : 'scale(0.8)', opacity: isAnimating ? 1 : 0 }}>
              <p>Your Seat</p>
            </div>
            {/* Your Qubit */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-500 rounded-full mt-4 animate-pulse-slow transition-opacity duration-1000 ease-in"
                 style={{ animationDelay: '0.5s', opacity: isAnimating ? 1 : 0 }}></div>
            <p className="mt-2 text-sm text-gray-400">Your Ballot Qubit</p>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="w-full max-w-4xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-filter backdrop-blur-sm border border-gray-700 font-['Inter'] transform transition-transform duration-700 ease-out"
             style={{ transform: isAnimating ? 'scale(1)' : 'scale(0.9)', opacity: isAnimating ? 1 : 0, animationDelay: '2s' }}>
          <p className="text-lg md:text-xl font-bold mb-4 text-white">Quantum Entanglement Complete! </p>
          <p className="text-base text-gray-300">
            You've been given one half of an entangled qubit pair. Think of it as a magic envelope linked to another one held by the server. What happens to one <span className="text-purple-400 font-semibold">instantly affects the other</span>, no matter the distance.
          </p>
        </div>

        {/* Proceed Button */}
        <button 
          onClick={() => navigate('/voting-app')} // This will now correctly call the function from App.jsx
          className="relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 mt-8">
            <span className="relative z-10">Proceed to Voting</span>
          </button>
      </div>
    </div>
  );
}

// Keyframes for animations
const style = document.createElement('style');
style.innerHTML = `
  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 3s infinite ease-in-out;
  }
  @keyframes fade-in-slow {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  .animate-fade-in-slow {
    animation: fade-in-slow 1s forwards;
  }
`;
document.head.appendChild(style);
