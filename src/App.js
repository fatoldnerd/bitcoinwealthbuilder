import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import LandingPage from './LandingPage';
import InterestCalculator from './InterestCalculator';
import LTVCalculator from './LTVCalculator';
import RetirementCalculator from './RetirementCalculator';
import UserGuide from './UserGuide';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <nav className="nav-container">
            <div className="logo">
              <h1>₿ Bitcoin Wealth Builder</h1>
            </div>
            <div className="nav-links">
              <NavLink to="/" className="nav-link">Home</NavLink>
              <NavLink to="/interest" className="nav-link">Interest Calculator</NavLink>
              <NavLink to="/ltv" className="nav-link">LTV Calculator</NavLink>
              <NavLink to="/retirement" className="nav-link">Retirement Calculator</NavLink>
              <NavLink to="/guide" className="nav-link guide-link">📚 User Guide</NavLink>
            </div>
          </nav>
        </header>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/interest" element={<InterestCalculator />} />
            <Route path="/ltv" element={<LTVCalculator />} />
            <Route path="/retirement" element={<RetirementCalculator />} />
            <Route path="/guide" element={<UserGuide />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;