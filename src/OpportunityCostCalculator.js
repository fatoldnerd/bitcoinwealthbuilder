import React, { useState } from 'react';

const OpportunityCostCalculator = () => {
  // Form state
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [selectedScenario, setSelectedScenario] = useState('moderate');
  const [customRate, setCustomRate] = useState(45);
  
  // Results state
  const [results, setResults] = useState(null);

  // Scenario configurations - matching existing app patterns
  const scenarios = {
    conservative: { name: 'Conservative', rate: 20, description: 'Lower growth, stable returns' },
    moderate: { name: 'Moderate', rate: 45, description: 'Balanced growth and volatility' },
    optimistic: { name: 'Optimistic', rate: 70, description: 'Higher growth potential, more volatility' },
    custom: { name: 'Custom', rate: customRate, description: 'Set your own parameters' }
  };

  // Get current scenario
  const getCurrentScenario = () => {
    if (selectedScenario === 'custom') {
      return { ...scenarios.custom, rate: customRate };
    }
    return scenarios[selectedScenario];
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Load retirement data from localStorage to check if punchline is possible
  const getRetirementData = () => {
    try {
      const savedGoals = localStorage.getItem('bitcoinGoals');
      if (!savedGoals) return null;
      
      const goals = JSON.parse(savedGoals);
      // Look for retirement-related goals - could have retirement strategy or specific names
      const retirementGoal = goals.find(goal => 
        goal.strategy === 'sell' || goal.strategy === 'borrow' || 
        goal.goalName.toLowerCase().includes('retirement')
      );
      
      return retirementGoal;
    } catch (error) {
      console.error('Error loading retirement data:', error);
      return null;
    }
  };

  // Main calculation function
  const calculateOpportunityCost = () => {
    const cost = parseFloat(itemCost) || 0;
    const years = parseInt(timeHorizon) || 1;
    const name = itemName.trim() || 'This Item';

    if (cost <= 0) {
      alert('Please enter a valid item cost');
      return;
    }

    const scenario = getCurrentScenario();
    const annualRate = scenario.rate / 100;
    
    // Calculate future value using compound interest formula
    const futureValue = cost * Math.pow(1 + annualRate, years);
    
    // Attempt to get retirement data for punchline
    const retirementData = getRetirementData();
    let yearsFunded = null;
    let monthlyRetirementIncome = null;
    
    if (retirementData) {
      // The retirement goals don't currently store the desired income
      // But we can estimate based on target amount and withdrawal rate
      // For now, we'll use a reasonable estimate or skip if no clear data
      
      // If we had desiredRetirementIncome stored, we would use:
      // monthlyRetirementIncome = retirementData.desiredRetirementIncome / 12;
      // yearsFunded = futureValue / retirementData.desiredRetirementIncome;
      
      // Since we don't have this data stored, let's estimate based on common patterns
      // Assume 4% withdrawal rate on target amount for annual income
      const estimatedAnnualIncome = retirementData.targetAmount * 0.04;
      if (estimatedAnnualIncome > 0) {
        monthlyRetirementIncome = estimatedAnnualIncome / 12;
        yearsFunded = futureValue / estimatedAnnualIncome;
      }
    }

    setResults({
      itemName: name,
      currentCost: cost,
      futureValue: futureValue,
      yearsGrowth: years,
      growthRate: scenario.rate,
      scenarioName: scenario.name,
      yearsFunded: yearsFunded,
      monthlyRetirementIncome: monthlyRetirementIncome,
      hasRetirementData: !!retirementData
    });
  };

  return (
    <div className="calculator-container">
      <h2 className="calculator-title">💸 What Is It Really Costing You?</h2>
      
      <div className="calculator-form">
        {/* Item Name Input */}
        <div className="form-group">
          <label className="form-label">Item Name</label>
          <input
            type="text"
            className="form-input"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g., New Luxury Car, Designer Handbag, Latest iPhone"
          />
        </div>

        {/* Item Cost Input */}
        <div className="form-group">
          <label className="form-label">Item Cost ($)</label>
          <input
            type="number"
            className="form-input"
            value={itemCost}
            onChange={(e) => setItemCost(e.target.value)}
            placeholder="Enter the cost"
            min="0"
            step="100"
          />
        </div>

        {/* Time Horizon Input */}
        <div className="form-group">
          <label className="form-label">Time Horizon (Years)</label>
          <input
            type="number"
            className="form-input"
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
            min="1"
            max="50"
          />
          <small className="form-help">
            How many years could this money grow if invested instead?
          </small>
        </div>

        {/* Growth Scenarios */}
        <div className="scenarios-section">
          <h3 className="section-title">Growth Scenarios</h3>
          <div className="scenario-buttons">
            {Object.entries(scenarios).map(([key, scenario]) => (
              <button
                key={key}
                className={`scenario-btn ${selectedScenario === key ? 'active' : ''}`}
                onClick={() => setSelectedScenario(key)}
              >
                {scenario.name}
                {key !== 'custom' && <span className="scenario-rate"> ({scenario.rate}%)</span>}
              </button>
            ))}
          </div>

          {/* Custom Rate Input - Only show when Custom is selected */}
          {selectedScenario === 'custom' && (
            <div className="form-group">
              <label className="form-label">Custom Annual Growth Rate (%)</label>
              <input
                type="number"
                className="form-input"
                value={customRate}
                onChange={(e) => setCustomRate(parseFloat(e.target.value))}
                min="0"
                max="200"
                step="1"
              />
            </div>
          )}

          <div className="scenario-description">
            <span>{getCurrentScenario().description}</span>
          </div>
        </div>

        {/* Calculate Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="calculate-button"
            onClick={calculateOpportunityCost}
            style={{ 
              background: 'linear-gradient(135deg, #FF6B35, #FF8C00)',
              fontSize: '1.2rem',
              padding: '1rem 2rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '700'
            }}
          >
            💰 Calculate the True Cost
          </button>
        </div>
      </div>

      {/* Results Display */}
      {results && (
        <div className="results-container">
          <h3 className="section-title">The Reality Check</h3>
          
          {/* Main Comparison Display */}
          <div className="opportunity-comparison">
            <div className="comparison-item current">
              <div className="comparison-label">Today's {results.itemName}</div>
              <div className="comparison-value current-cost">
                {formatCurrency(results.currentCost)}
              </div>
              <div className="comparison-description">What you spend now</div>
            </div>
            
            <div className="comparison-divider">
              <span className="vs-text">VS</span>
              <div className="arrow">→</div>
            </div>
            
            <div className="comparison-item future">
              <div className="comparison-label">Could Be Tomorrow's</div>
              <div className="comparison-value future-value">
                {formatCurrency(results.futureValue)}
              </div>
              <div className="comparison-description">
                After {results.yearsGrowth} years at {results.growthRate}% growth
              </div>
            </div>
          </div>

          {/* Opportunity Cost Summary */}
          <div className="opportunity-summary">
            <div className="summary-stat">
              <div className="stat-label">Opportunity Cost</div>
              <div className="stat-value cost">
                {formatCurrency(results.futureValue - results.currentCost)}
              </div>
            </div>
            <div className="summary-stat">
              <div className="stat-label">Growth Multiple</div>
              <div className="stat-value">
                {(results.futureValue / results.currentCost).toFixed(1)}x
              </div>
            </div>
          </div>

          {/* Punchline - Only if retirement data exists */}
          {results.hasRetirementData && results.yearsFunded && (
            <div className="punchline-section">
              <div className="punchline-content">
                <h4 className="punchline-title">💡 The Bottom Line</h4>
                <p className="punchline-text">
                  That's enough to fund <strong>{results.yearsFunded.toFixed(1)} years</strong> of 
                  your desired retirement lifestyle.
                </p>
                <p className="punchline-subtext">
                  Every purchase is a choice between instant gratification and future freedom.
                </p>
              </div>
            </div>
          )}

          {/* No Retirement Data Message */}
          {!results.hasRetirementData && (
            <div className="no-retirement-data">
              <p>
                💡 <strong>Want to see how this impacts your retirement?</strong><br/>
                Use our <a href="/retirement" style={{color: '#FF8C00'}}>Retirement Calculator</a> to 
                create a retirement plan, then come back to see the full impact!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpportunityCostCalculator;