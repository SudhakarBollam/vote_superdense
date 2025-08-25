import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaEye, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function TransmissionPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the selected vote from the previous page's state
  const voteOption = location.state?.voteOption;

  // Function to run the simulation based on the channel choice
  const runSimulation = async (includeEve) => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    if (!voteOption) {
      setError('No vote was selected. Please go back and try again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: voteOption.sends, include_eve: includeEve }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white"
      style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(163, 66, 237, 0.2) 0%, rgba(20, 10, 50, 0.8) 50%, rgba(5, 5, 20, 1) 100%)' }}>

      <div className="w-full max-w-7xl flex flex-col items-center justify-center p-4">
        
        {loading && (
          <div className="bg-purple-100 text-purple-700 rounded-lg p-6 shadow-md w-full max-w-xl flex items-center justify-center mb-8">
            <FaSpinner className="animate-spin text-2xl mr-4" />
            <span className="text-lg">Simulating transmission...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 rounded-lg p-6 shadow-md w-full max-w-xl mb-8">
            <h3 className="text-xl font-bold mb-2">Simulation Failed</h3>
            <p className="text-sm">Error: {error}</p>
          </div>
        )}

        {!results && !loading && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-purple-400 font-['Inter']">Step 3: Choose Transmission Method</h1>
              <p className="text-xl text-purple-300 font-medium font-['Inter'] mt-2">How should we send your encoded vote?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <div 
                onClick={() => runSimulation(false)} // Pass false for no Eve
                className="bg-gray-800 border-2 border-green-500 rounded-2xl p-6 shadow-2xl backdrop-filter backdrop-blur-sm transition-all duration-300 transform cursor-pointer hover:scale-105 hover:bg-gray-700">
                <div className="flex flex-col items-center text-center">
                  <FaShieldAlt className="text-green-400 text-5xl mb-4"/>
                  <h2 className="text-2xl font-bold mb-2 text-green-400">Secure Channel</h2>
                  <p className="text-sm text-gray-300">Direct quantum transmission with no interference.</p>
                </div>
              </div>

              <div 
                onClick={() => runSimulation(true)} // Pass true for Eve
                className="bg-gray-800 border-2 border-red-500 rounded-2xl p-6 shadow-2xl backdrop-filter backdrop-blur-sm transition-all duration-300 transform cursor-pointer hover:scale-105 hover:bg-gray-700">
                <div className="flex flex-col items-center text-center">
                  <FaEye className="text-red-400 text-5xl mb-4"/>
                  <h2 className="text-2xl font-bold mb-2 text-red-400">Intercepted Channel</h2>
                  <p className="text-sm text-gray-300">Corporate spy "Eve" attempts to eavesdrop.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {results && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-filter backdrop-blur-sm border border-gray-700 w-full max-w-4xl text-center">
            <h3 className="text-3xl font-bold text-green-400 mb-4">Simulation Complete!</h3>
            <p className="text-lg text-white mb-6">Your vote was cast for: <span className="font-bold">{voteOption?.title}</span></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Secure Channel Results */}
              <div className="bg-gray-900 p-6 rounded-xl border border-green-500 shadow-lg">
                <h4 className="text-xl font-bold text-green-400 mb-4 flex items-center justify-center space-x-2">
                  <FaShieldAlt /> Secure Channel
                </h4>
                <img 
                  src={`data:image/png;base64,${results.secure.histogram_img}`} 
                  alt="Secure Histogram" 
                  className="w-full mx-auto" 
                />
                <p className="mt-4 text-white text-lg">
                  Decoded bits: <span className="font-bold text-purple-400">{results.secure.counts}</span>
                </p>
                <p className={`mt-2 ${results.secure.counts === voteOption.sends ? 'text-green-400' : 'text-red-400'}`}>
                  Result: <span className="font-bold">{results.secure.counts === voteOption.sends ? 'Vote Registered Correctly' : 'Error Detected'}</span>
                </p>
              </div>

              {/* Eve's Attack Results */}
              {results.include_eve && (
                <div className="bg-gray-900 p-6 rounded-xl border border-red-500 shadow-lg">
                  <h4 className="text-xl font-bold text-red-400 mb-4 flex items-center justify-center space-x-2">
                    <FaEye /> Intercepted Channel
                  </h4>
                  <img 
                    src={`data:image/png;base64,${results.eve.histogram_img}`} 
                    alt="Eve's Histogram" 
                    className="w-full mx-auto" 
                  />
                  <p className="mt-4 text-white text-lg">
                    Decoded bits: <span className="font-bold text-purple-400">{results.eve.counts}</span>
                  </p>
                  <p className={`mt-2 ${results.eve.counts === voteOption.sends ? 'text-green-400' : 'text-red-400'}`}>
                    Result: <span className="font-bold">{results.eve.counts === voteOption.sends ? 'Vote Registered Correctly' : 'Error Detected!'}</span>
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/')}
              className="mt-8 relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10">Start New Vote</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
