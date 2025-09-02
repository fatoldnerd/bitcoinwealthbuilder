import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import LandingPage from './LandingPage';
import InterestCalculator from './InterestCalculator';
import GoalPlanner from './GoalPlanner';
import LTVCalculator from './LTVCalculator';
import RetirementCalculator from './RetirementCalculator';
import OpportunityCostCalculator from './OpportunityCostCalculator';
import MyDashboard from './MyDashboard';
import UserGuide from './UserGuide';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* New Navigation Component */}
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/interest" element={<InterestCalculator />} />
            <Route path="/goal-planner" element={<GoalPlanner />} />
            <Route path="/ltv" element={<LTVCalculator />} />
            <Route path="/retirement" element={<RetirementCalculator />} />
            <Route path="/opportunity-cost" element={<OpportunityCostCalculator />} />
            <Route path="/dashboard" element={<MyDashboard />} />
            <Route path="/guide" element={<UserGuide />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;