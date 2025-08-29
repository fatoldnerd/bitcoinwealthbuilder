import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const calculators = [
    {
      id: 'interest',
      title: 'Growth & Interest Calculator',
      description: 'Project your Bitcoin wealth over time with compound interest calculations and Dollar-Cost Averaging strategies.',
      path: '/interest',
      color: '#007BFF',
      icon: '📈'
    },
    {
      id: 'ltv',
      title: 'LTV Risk Calculator',
      description: 'Understand borrowing risks when using Bitcoin as collateral and calculate safe loan amounts to avoid liquidation.',
      path: '/ltv',
      color: '#28a745',
      icon: '🏦'
    },
    {
      id: 'retirement',
      title: 'Retirement Planning Calculator',
      description: 'Plan your Bitcoin retirement with two strategies: selling for income or borrowing against your holdings.',
      path: '/retirement',
      color: '#FF8C00',
      icon: '🏖️'
    }
  ];

  const handleTileClick = (path) => {
    navigate(path);
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-headline">Plan Your Bitcoin Future with Confidence</h1>
        <p className="hero-subheadline">
          Go beyond simple spreadsheets with a suite of interactive tools designed to help you 
          visualize your long-term wealth, manage risk, and plan for retirement.
        </p>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="features-grid">
          {calculators.map((calc) => (
            <div 
              key={calc.id}
              className="feature-tile"
              onClick={() => handleTileClick(calc.path)}
            >
              {/* Screenshot with Hover Overlay */}
              <div className="tile-screenshot" style={{ borderColor: calc.color }}>
                <div className="screenshot-placeholder">
                  <span className="placeholder-icon">{calc.icon}</span>
                </div>
                <div className="hover-overlay">
                  <div className="overlay-content">
                    <span className="overlay-icon">🚀</span>
                    <p className="overlay-text">Click to open calculator</p>
                  </div>
                </div>
              </div>

              {/* Tile Content */}
              <div className="tile-content">
                <h3 className="tile-title">{calc.title}</h3>
                <p className="tile-description">{calc.description}</p>
                <button 
                  className="tile-cta"
                  style={{ backgroundColor: calc.color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTileClick(calc.path);
                  }}
                >
                  Launch Calculator
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="info-section">
        <div className="info-grid">
          <div className="info-card">
            <h3>🔒 Privacy First</h3>
            <p>All calculations happen in your browser. No data is stored or transmitted.</p>
          </div>
          <div className="info-card">
            <h3>📊 Real-Time Data</h3>
            <p>Live Bitcoin prices from CoinGecko API for accurate, up-to-date calculations.</p>
          </div>
          <div className="info-card">
            <h3>📚 Comprehensive Guide</h3>
            <p>Detailed documentation and examples to help you make informed decisions.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;