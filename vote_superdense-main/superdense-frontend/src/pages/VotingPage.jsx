import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaTimes } from 'react-icons/fa'; // FaSpinner is used for the loading indicator

// This component displays the voting options for the quantum ballot.
export default function VotingPage() {
  const [selectedVote, setSelectedVote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  const handleVote = async (voteOption) => {
    setSelectedVote(voteOption);
    setLoading(true);
    setError(null);
    setResults(null);

    const voteMessage = voteOption.sends;
    
    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: voteMessage, include_eve: false }),
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

  const voteOptions = [
    { title: "DENY", sends: "00", gate: "Z gate - flip the phase", id: "deny" },
    { title: "POSTPONE", sends: "01", gate: "Y gate - flip both bit and phase", id: "postpone" },
    { title: "ABSTAIN", sends: "10", gate: "No operation - maintain original state", id: "abstain" },
    { title: "APPROVE", sends: "11", gate: "X gate - flip the bit value", id: "approve" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white"
      style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(163, 66, 237, 0.2) 0%, rgba(20, 10, 50, 0.8) 50%, rgba(5, 5, 20, 1) 100%)' }}>
      
      <div className="w-full max-w-7xl flex flex-col items-center justify-center p-4">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-400 font-['Inter']">Step 2: Encode Your Decision</h1>
          <p className="text-xl text-purple-300 font-medium font-['Inter'] mt-2">Choose your vote to encode onto your qubit</p>
        </div>

        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-lg animate-pulse-slow"></div>
          <p className="mt-2 text-base text-gray-400">Your Ballot Qubit</p>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded mb-4 w-full max-w-4xl">
            Error: {error}
          </div>
        )}
        
        {loading && (
          <div className="p-4 bg-purple-100 text-purple-700 rounded mb-4 w-full max-w-4xl flex items-center justify-center space-x-2">
            <FaSpinner className="animate-spin" />
            <span>Casting vote...</span>
          </div>
        )}

        {results ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-filter backdrop-blur-sm border border-gray-700 w-full max-w-4xl text-center">
            <h3 className="text-3xl font-bold text-green-400 mb-4">Vote Cast Successfully!</h3>
            <p className="text-lg text-white mb-2">You voted to: <span className="font-bold">{selectedVote.title}</span></p>
            <p className="text-lg text-white mb-6">Your vote was securely decoded as: <span className="font-bold">{results.secure.counts}</span></p>
            <img src={`data:image/png;base64,${results.secure.histogram_img}`} alt="Vote histogram" className="w-full max-w-xl mx-auto rounded-lg" />
            <button
              onClick={() => navigate('/')}
              className="mt-8 relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10">Return to Welcome Page</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {voteOptions.map((option) => (
              <div 
                key={option.id}
                onClick={() => handleVote(option)}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-2xl p-6 shadow-2xl backdrop-filter backdrop-blur-sm transition-all duration-300 transform cursor-pointer hover:scale-105 hover:border-purple-500">
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-4"></div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-blue-400">{option.title}</h2>
                  <p className="text-sm text-gray-300">Sends: <span className="font-semibold text-white">{option.sends}</span></p>
                  <p className="text-xs text-gray-500 mt-2">{option.gate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
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
`;
document.head.appendChild(style);
