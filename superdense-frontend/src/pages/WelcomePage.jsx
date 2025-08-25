import React from 'react';
import { useNavigate } from 'react-router-dom';

// Main component for the Quantum Ballot welcome page.
// It now receives a prop called 'onProceed'
export default function WelcomePage() {
    const navigate = useNavigate();
    const handleProceed = () => {
        navigate('/entangled-key');
    };

    return (
        // Main container with a dark background and a galactic, dynamic effect
        // using a radial gradient.
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white font-sans"
            style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(163, 66, 237, 0.2) 0%, rgba(20, 10, 50, 0.8) 50%, rgba(5, 5, 20, 1) 100%)' }}>

            {/* Container for the main content card */}
            <div className="w-full max-w-2xl text-center">

                {/* Main title */}
                <h1 className="text-5xl md:text-6xl font-extrabold text-purple-400 mb-2 font-['Inter']">Quantum Ballot</h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-purple-300 font-medium mb-8 font-['Inter']">The Un-Hackable Vote</p>

                {/* The main card containing the introduction and the button */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-filter backdrop-blur-sm border border-gray-700 font-['Inter']">

                    {/* Icons at the top of the card */}
                    <div className="flex justify-center items-center space-x-6 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.01 12.01 0 002.944 12c0 2.898 1.127 5.666 3.04 7.618A11.955 11.955 0 0112 21.056c2.898 0 5.666-1.127 7.618-3.04A12.01 12.01 0 0021.056 12c0-2.898-1.127-5.666-3.04-7.618z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    {/* Main welcome message and description */}
                    <p className="text-lg md:text-xl font-bold mb-4 text-white">Welcome, Board Member. Your vote on the top-secret 'Project Chimera' is critical.</p>
                    <p className="text-base text-gray-300 mb-4">
                        Corporate spies are trying to intercept it. Today, we will use a revolutionary <span className="text-purple-400 font-semibold">Quantum Ballot</span> system to ensure your vote is transmitted with perfect security.
                    </p>
                    <p className="text-base text-gray-300 mb-8">
                        You'll experience firsthand how <span className="text-purple-400 font-semibold">Superdense Coding</span> sends 2 bits of information using just 1 qubit, while providing unbreakable quantum security.
                    </p>

                    {/* The "Begin Secure Setup" button */}
                    <button
                        onClick={handleProceed}
                        className="relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50">
                        <span className="relative z-10">Begin Secure Setup</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
