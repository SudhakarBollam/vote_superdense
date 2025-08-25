import React, { useState } from 'react';

const QuantumApp = () => {
  const [message, setMessage] = useState('00');
  const [includeEve, setIncludeEve] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, include_eve: includeEve }),
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
    <div className="p-6 bg-white rounded-lg shadow-md min-h-[calc(100vh-180px)]">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Superdense Coding Simulator</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="flex items-center space-x-4">
          <label className="text-gray-700">Message (2 bits):</label>
          <select
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="00">00</option>
            <option value="01">01</option>
            <option value="10">10</option>
            <option value="11">11</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeEve}
            onChange={(e) => setIncludeEve(e.target.checked)}
            className="h-4 w-4 text-indigo-600 rounded"
          />
          <label className="text-gray-700">Simulate Eavesdropper (Eve)</label>
        </div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50" disabled={loading}>
          {loading ? 'Simulating...' : 'Run Simulation'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          Error: {error}
        </div>
      )}

      {results && (
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold">Results for Message "{results.message}"</h3>
          
          <div>
            <h4 className="text-xl font-medium mb-2">Initial State Bloch Sphere</h4>
            <img src={`data:image/png;base64,${results.bloch_sphere_img}`} alt="Bloch sphere" />
          </div>

          <div>
            <h4 className="text-xl font-medium mb-2">Secure Communication (Without Eve)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h5 className="font-semibold">Final Circuit</h5>
                <img src={`data:image/png;base64,${results.secure.circuit_img}`} alt="Secure circuit" />
              </div>
              <div className="p-4 border rounded">
                <h5 className="font-semibold">Measurement Results</h5>
                <img src={`data:image/png;base64,${results.secure.histogram_img}`} alt="Secure histogram" />
              </div>
            </div>
          </div>

          {results.include_eve && (
            <div>
              <h4 className="text-xl font-medium mb-2">Eavesdropping Attack (With Eve)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <h5 className="font-semibold">Final Circuit</h5>
                  <img src={`data:image/png;base64,${results.eve.circuit_img}`} alt="Eve's circuit" />
                </div>
                <div className="p-4 border rounded">
                  <h5 className="font-semibold">Measurement Results</h5>
                  <img src={`data:image/png;base64,${results.eve.histogram_img}`} alt="Eve's histogram" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuantumApp;
