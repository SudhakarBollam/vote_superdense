import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate ,useNavigate} from 'react-router-dom';
import WelcomePage from './pages/WelcomePage.jsx';
import EntangledKeyPage from './pages/EntangledKeyPage.jsx';
import VotingPage from './pages/VotingPage.jsx';
import QuantumApp from './pages/QuantumApp.jsx';
import TransmissionPage from './pages/TransmissionPage.jsx';

const App = () => {
  return (
    <Router>
      <div className="font-sans antialiased min-h-screen w-full">
        <Routes>
          {/* Main welcome page */}
          <Route path="/" element={<WelcomePage />} />
          
          {/* Routes for your quantum application pages */}
          <Route path="/quantum-app" element={<QuantumApp />} />
          <Route path="/entangled-key" element={<EntangledKeyPage />} />
          <Route path="/voting-app" element={<VotingPage />} />
          <Route path="/transmission-app" element={<TransmissionPage />} />
          
          {/* Redirects any unmatched URLs back to the welcome page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
