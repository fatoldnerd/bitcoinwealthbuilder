import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

const RetirementCalculator = () => {
  // Core input values - simplified to essential parameters only
  const [startingBTC, setStartingBTC] = useState('3.4'); // User's current Bitcoin holdings
  const [bitcoinPrice, setBitcoinPrice] = useState(''); // Current Bitcoin price (fetched from API)
  const [isLoadingPrice, setIsLoadingPrice] = useState(false); // Loading state for price fetch
  const [yearsUntilRetirement, setYearsUntilRetirement] = useState(20); // Replaced age inputs with direct years
  const [retirementDuration, setRetirementDuration] = useState(30); // Customizable retirement period duration
  const [desiredRetirementIncome, setDesiredRetirementIncome] = useState(120000); // Annual income needed in retirement
  const [monthlyContribution, setMonthlyContribution] = useState(0); // Dollar-cost averaging monthly contribution
  
  // Scenario selector state - controls all rate-based assumptions
  const [selectedScenario, setSelectedScenario] = useState('moderate');
  
  // Top-level strategy selector - primary choice between sell vs borrow for retirement funding
  const [retirementStrategy, setRetirementStrategy] = useState('sell'); // 'sell' or 'borrow'
  
  // Predefined scenario assumptions - bundles all the complex rate parameters
  const scenarios = {
    conservative: {
      inflationRate: 3,
      bitcoinGrowthRate: 15,
      withdrawalRate: 3.5,
      loanInterestRate: 6,
      postRetirementBitcoinGrowth: 8,
      targetAnnualLTV: 15
    },
    moderate: {
      inflationRate: 4,
      bitcoinGrowthRate: 25,
      withdrawalRate: 4,
      loanInterestRate: 8,
      postRetirementBitcoinGrowth: 12,
      targetAnnualLTV: 25
    },
    optimistic: {
      inflationRate: 3,
      bitcoinGrowthRate: 35,
      withdrawalRate: 5,
      loanInterestRate: 10,
      postRetirementBitcoinGrowth: 20,
      targetAnnualLTV: 35
    },
    custom: {
      inflationRate: 4,
      bitcoinGrowthRate: 25,
      withdrawalRate: 4,
      loanInterestRate: 8,
      postRetirementBitcoinGrowth: 12,
      targetAnnualLTV: 25
    }
  };
  
  // Custom scenario parameters (only visible when custom is selected)
  const [customParams, setCustomParams] = useState(scenarios.custom);
  
  // Chart data states for the two distinct phases
  const [accumulationData, setAccumulationData] = useState([]); // Phase 1: Growth to retirement
  const [retirementData, setRetirementData] = useState([]); // Phase 2: 30-year retirement simulation
  const [results, setResults] = useState(null);

  // Fetch Bitcoin price from CoinGecko API on component mount
  useEffect(() => {
    fetchBitcoinPrice();
  }, []);

  // Clear results when key parameters change so user knows to recalculate
  useEffect(() => {
    if (results) {
      setResults(null);
      setAccumulationData([]);
      setRetirementData([]);
    }
  }, [retirementStrategy, selectedScenario, monthlyContribution]);

  const fetchBitcoinPrice = async () => {
    setIsLoadingPrice(true);
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      const price = response.data.bitcoin.usd;
      setBitcoinPrice(price.toString());
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      setBitcoinPrice('50000');
    } finally {
      setIsLoadingPrice(false);
    }
  };
  
  // Get current scenario assumptions - helper function
  const getCurrentAssumptions = () => {
    return selectedScenario === 'custom' ? customParams : scenarios[selectedScenario];
  };

  // Generate Bitcoin price projection with compound growth (simplified, no volatility)
  const generateBitcoinPrices = (startPrice, years, annualGrowthRate) => {
    const prices = [];
    let currentPrice = startPrice;
    
    for (let year = 0; year <= years; year++) {
      if (year === 0) {
        prices.push(currentPrice);
        continue;
      }
      
      // Simple compound growth for cleaner projections
      currentPrice = currentPrice * (1 + annualGrowthRate / 100);
      prices.push(Math.round(currentPrice));
    }
    
    return prices;
  };

  // Calculate required retirement portfolio based on desired income and withdrawal rate
  const calculateRequiredRetirementPortfolio = () => {
    const assumptions = getCurrentAssumptions();
    return desiredRetirementIncome / (assumptions.withdrawalRate / 100);
  };

  // Main calculation function - orchestrates both phases of retirement planning
  const calculateRetirementProjection = () => {
    const btc = parseFloat(startingBTC) || 0;
    const startPrice = parseFloat(bitcoinPrice) || 0;
    
    if (btc <= 0 || startPrice <= 0) {
      alert('Please enter valid Bitcoin amount and price');
      return;
    }
    
    const assumptions = getCurrentAssumptions();
    const requiredPortfolio = calculateRequiredRetirementPortfolio();
    
    // Phase 1: Accumulation Phase (working years until retirement)
    const accumulationPhase = calculateAccumulationPhase(btc, startPrice, assumptions, requiredPortfolio);
    
    // Phase 2: Retirement Phase (customizable duration after retirement with strategy-specific logic)
    const retirementPhase = calculateRetirementPhase(
      accumulationPhase.finalBTC, 
      accumulationPhase.finalPrice, 
      assumptions,
      retirementDuration
    );
    
    setAccumulationData(accumulationPhase.data);
    setRetirementData(retirementPhase.data);
    
    // Set comprehensive results for display
    setResults({
      requiredPortfolio,
      projectedPortfolio: accumulationPhase.finalValue,
      shortfall: accumulationPhase.finalValue - requiredPortfolio,
      finalBTC: accumulationPhase.finalBTC,
      retirementStrategy, // Store the strategy that was actually used
      retirementViable: retirementPhase.viable,
      yearsUntilDepletion: retirementPhase.yearsUntilDepletion,
      finalRetirementValue: retirementPhase.finalValue
    });
  };
  
  // Phase 1: Calculate accumulation phase with Dollar-Cost Averaging (DCA)
  // This phase shows portfolio growth toward retirement target including monthly contributions
  const calculateAccumulationPhase = (startingBTC, startPrice, assumptions, targetValue) => {
    const totalMonths = yearsUntilRetirement * 12;
    const monthlyGrowthRate = Math.pow(1 + assumptions.bitcoinGrowthRate / 100, 1 / 12) - 1;
    
    // Initialize tracking variables
    let currentBTC = startingBTC; // Start with initial Bitcoin holdings
    let currentPrice = startPrice; // Track price month by month
    const data = [];
    
    // Monthly DCA simulation loop
    for (let month = 0; month <= totalMonths; month++) {
      // Step 1: Apply one month of price growth (except for month 0)
      if (month > 0) {
        currentPrice = currentPrice * (1 + monthlyGrowthRate);
      }
      
      // Step 2: Add monthly contribution by purchasing Bitcoin at current price
      if (month > 0 && monthlyContribution > 0) {
        const btcPurchased = monthlyContribution / currentPrice;
        currentBTC += btcPurchased;
      }
      
      // Calculate current portfolio value
      const portfolioValue = currentBTC * currentPrice;
      
      // Store data points for charting (every 12 months for yearly display)
      if (month % 12 === 0) {
        const year = month / 12;
        data.push({
          year,
          price: currentPrice,
          portfolioValue,
          targetValue, // Reference line showing retirement goal
          btcAmount: currentBTC // Total BTC accumulated including DCA
        });
      }
    }
    
    return {
      data,
      finalBTC: currentBTC,
      finalPrice: currentPrice,
      finalValue: currentBTC * currentPrice
    };
  };
  
  // Phase 2: Calculate retirement phase (customizable duration of retirement with strategy-specific logic)
  // This phase simulates the chosen retirement strategy over the user-defined retirement duration
  const calculateRetirementPhase = (startingBTC, startPrice, assumptions, retirementDuration) => {
    console.log(`Calculating retirement phase with strategy: ${retirementStrategy}`);
    // MODIFIED: Using customizable retirementDuration instead of hardcoded 30 years
    const retirementYears = retirementDuration;
    const data = [];
    let currentBTC = startingBTC;
    let currentLoanPrincipal = 0;
    let currentIncome = desiredRetirementIncome;
    let viable = true;
    let yearsUntilDepletion = null;
    
    for (let year = 0; year <= retirementYears; year++) {
      // Calculate Bitcoin price with post-retirement growth rate (typically lower)
      const price = startPrice * Math.pow(1 + assumptions.postRetirementBitcoinGrowth / 100, year);
      const portfolioValue = currentBTC * price;
      
      // Adjust income for inflation each year
      if (year > 0) {
        currentIncome *= (1 + assumptions.inflationRate / 100);
      }
      
      if (retirementStrategy === 'sell') {
        // SELL FOR INCOME STRATEGY: Gradually sell Bitcoin to fund living expenses
        // Portfolio balance and BTC holdings decrease over time
        if (year > 0 && currentBTC > 0) {
          const btcToSell = currentIncome / price;
          currentBTC = Math.max(0, currentBTC - btcToSell);
          
          if (year <= 3) {
            console.log(`Sell strategy Year ${year}: Selling ${btcToSell.toFixed(4)} BTC, remaining: ${currentBTC.toFixed(4)} BTC`);
          }
          
          // Check if we've run out of Bitcoin
          if (currentBTC === 0 && !yearsUntilDepletion) {
            yearsUntilDepletion = year;
            viable = false;
          }
        }
        
        data.push({
          year,
          price,
          btcHoldings: currentBTC,
          portfolioValue: currentBTC * price,
          annualIncome: year === 0 ? 0 : currentIncome,
          strategy: 'sell'
        });
        
      } else {
        // BORROW FOR INCOME STRATEGY: Use Bitcoin as collateral, execute loan rollover
        // BTC holdings stay constant, but debt accumulates with interest
        if (year > 0) {
          // Loan Rollover Logic:
          // 1. Calculate interest on previous year's loan principal
          const previousLoanInterest = currentLoanPrincipal * (assumptions.loanInterestRate / 100);
          
          // 2. Calculate new loan amount = old principal + interest + living expenses
          const newLoanAmount = currentLoanPrincipal + previousLoanInterest + currentIncome;
          
          // 3. Calculate LTV ratio = total debt / BTC collateral value
          const ltvRatio = portfolioValue > 0 ? (newLoanAmount / portfolioValue) * 100 : 100;
          
          if (year <= 3) {
            console.log(`Borrow strategy Year ${year}: Loan principal: $${newLoanAmount.toFixed(0)}, LTV: ${ltvRatio.toFixed(1)}%`);
          }
          
          // 4. Check if LTV exceeds safe threshold (75% = liquidation risk)
          if (ltvRatio > 75 && !yearsUntilDepletion) {
            yearsUntilDepletion = year;
            viable = false;
          }
          
          currentLoanPrincipal = newLoanAmount;
        }
        
        data.push({
          year,
          price,
          btcHoldings: currentBTC, // BTC holdings preserved
          portfolioValue,
          loanPrincipal: currentLoanPrincipal,
          ltvRatio: portfolioValue > 0 ? (currentLoanPrincipal / portfolioValue) * 100 : 0,
          annualIncome: year === 0 ? 0 : currentIncome,
          strategy: 'borrow'
        });
      }
    }
    
    return {
      data,
      viable,
      yearsUntilDepletion,
      finalValue: retirementStrategy === 'sell' 
        ? currentBTC * data[retirementYears].price 
        : data[retirementYears].portfolioValue - currentLoanPrincipal
    };
  };

  // Update custom parameters when scenario is custom
  const updateCustomParam = (field, value) => {
    setCustomParams(prev => ({
      ...prev,
      [field]: parseFloat(value)
    }));
  };

  // Format number with commas for display
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Format percentage
  const formatPercent = (num) => {
    return parseFloat(num).toFixed(1);
  };

  return (
    <div className="calculator-container">
      <h2 className="calculator-title">Bitcoin Retirement Calculator</h2>
      
      {/* Top-Level Strategy Selector - Primary choice between sell vs borrow */}
      <div className="strategy-mode-section">
        <h3 className="section-title">How do you plan to fund your retirement?</h3>
        <div className="strategy-toggle">
          <button 
            className={`strategy-btn ${retirementStrategy === 'sell' ? 'active' : ''}`}
            onClick={() => {
              setRetirementStrategy('sell');
              console.log('Strategy changed to: sell');
            }}
          >
            Sell for Income
          </button>
          <button 
            className={`strategy-btn ${retirementStrategy === 'borrow' ? 'active' : ''}`}
            onClick={() => {
              setRetirementStrategy('borrow');
              console.log('Strategy changed to: borrow');
            }}
          >
            Borrow for Income
          </button>
        </div>
        <p className="strategy-description">
          {retirementStrategy === 'sell' 
            ? "Gradually sell Bitcoin during retirement to fund living expenses. Your Bitcoin holdings will decrease over time."
            : "Use Bitcoin as collateral for loans to fund expenses. Your Bitcoin stays intact but you accumulate debt."
          }
        </p>
      </div>
      
      <div className="calculator-form">
        {/* Simplified Core Inputs - Reduced from many fields to essentials */}
        <div className="core-inputs-section">
          <div className="form-group">
            <label className="form-label">Starting Bitcoin Amount (BTC)</label>
            <input
              type="number"
              className="form-input"
              value={startingBTC}
              onChange={(e) => setStartingBTC(e.target.value)}
              placeholder="Enter Bitcoin amount"
              min="0"
              step="0.00000001"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Current Bitcoin Price ($)
              <button 
                type="button"
                onClick={fetchBitcoinPrice}
                style={{
                  marginLeft: '10px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  background: '#007BFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                disabled={isLoadingPrice}
              >
                {isLoadingPrice ? 'Loading...' : 'Refresh'}
              </button>
            </label>
            <input
              type="number"
              className="form-input"
              value={bitcoinPrice}
              onChange={(e) => setBitcoinPrice(e.target.value)}
              placeholder="Enter Bitcoin price"
              min="0"
              step="0.01"
            />
          </div>

          {/* Desired Retirement Income */}
          <div className="form-group">
            <label className="form-label">Desired Annual Retirement Income ($)</label>
            <input
              type="number"
              className="form-input"
              value={desiredRetirementIncome}
              onChange={(e) => setDesiredRetirementIncome(parseFloat(e.target.value))}
              placeholder="Enter desired income"
              min="0"
              step="1000"
            />
          </div>
          
          {/* Years Until Retirement Slider - Replaces separate age inputs */}
          <div className="form-group">
            <label className="form-label">Years Until Retirement: {yearsUntilRetirement}</label>
            <input
              type="range"
              className="form-slider"
              min="5"
              max="40"
              value={yearsUntilRetirement}
              onChange={(e) => setYearsUntilRetirement(parseInt(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
              <span>5 years</span>
              <span>40 years</span>
            </div>
          </div>
          
          {/* Retirement Duration Slider - New feature for customizable retirement period */}
          <div className="form-group">
            <label className="form-label">Retirement Duration (in years): {retirementDuration}</label>
            <input
              type="range"
              className="form-slider"
              min="10"
              max="50"
              value={retirementDuration}
              onChange={(e) => setRetirementDuration(parseInt(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
              <span>10 years</span>
              <span>50 years</span>
            </div>
          </div>
        </div>

        {/* Contribution Plan Section - New DCA Feature */}
        <div className="contribution-plan-section">
          <h3 className="scenarios-title">Contribution Plan</h3>
          <div className="form-group">
            <label className="form-label">Regular Monthly Contribution ($)</label>
            <input
              type="number"
              className="form-input"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
              placeholder="Enter monthly contribution"
              min="0"
              step="100"
            />
            <div className="input-help">
              Enter the dollar amount you plan to invest in Bitcoin each month during the accumulation phase. Set to 0 for no regular contributions.
            </div>
          </div>
        </div>

        {/* Scenario Selector - Bundles all rate-based assumptions */}
        <div className="scenario-section">
          <h3 className="scenarios-title">Scenario</h3>
          <div className="scenario-buttons">
            {Object.keys(scenarios).map(scenario => (
              <button
                key={scenario}
                className={`scenario-btn ${selectedScenario === scenario ? 'active' : ''}`}
                onClick={() => setSelectedScenario(scenario)}
              >
                {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Show current scenario assumptions for transparency */}
          <div className="scenario-display">
            <h4>Current Assumptions:</h4>
            <div className="assumptions-grid">
              <div>Inflation Rate: {getCurrentAssumptions().inflationRate}%</div>
              <div>Bitcoin Growth Rate: {getCurrentAssumptions().bitcoinGrowthRate}%</div>
              {retirementStrategy === 'sell' && (
                <div>Withdrawal Rate: {getCurrentAssumptions().withdrawalRate}%</div>
              )}
              {retirementStrategy === 'borrow' && (
                <div>Target Annual LTV: {getCurrentAssumptions().targetAnnualLTV}%</div>
              )}
              <div>Loan Interest Rate: {getCurrentAssumptions().loanInterestRate}%</div>
              <div>Post-Retirement BTC Growth: {getCurrentAssumptions().postRetirementBitcoinGrowth}%</div>
            </div>
          </div>
        </div>

        {/* Custom Parameters - Only show when Custom scenario is selected */}
        {selectedScenario === 'custom' && (
          <div className="custom-params-section">
            <h3 className="scenarios-title">Custom Parameters</h3>
            <div className="custom-grid">
              <div className="custom-item">
                <label>Inflation Rate (%)</label>
                <input
                  type="number"
                  className="custom-input"
                  value={customParams.inflationRate}
                  onChange={(e) => updateCustomParam('inflationRate', e.target.value)}
                  min="0"
                  max="20"
                  step="0.1"
                />
              </div>
              
              <div className="custom-item">
                <label>Bitcoin Growth Rate (%)</label>
                <input
                  type="number"
                  className="custom-input"
                  value={customParams.bitcoinGrowthRate}
                  onChange={(e) => updateCustomParam('bitcoinGrowthRate', e.target.value)}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
              
              {/* Show Withdrawal Rate only for Sell strategy */}
              {retirementStrategy === 'sell' && (
                <div className="custom-item">
                  <label>Withdrawal Rate (%)</label>
                  <input
                    type="number"
                    className="custom-input"
                    value={customParams.withdrawalRate}
                    onChange={(e) => updateCustomParam('withdrawalRate', e.target.value)}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
              )}
              
              {/* Show Target Annual LTV only for Borrow strategy */}
              {retirementStrategy === 'borrow' && (
                <div className="custom-item">
                  <label>Target Annual LTV (%)</label>
                  <input
                    type="number"
                    className="custom-input"
                    value={customParams.targetAnnualLTV}
                    onChange={(e) => updateCustomParam('targetAnnualLTV', e.target.value)}
                    min="5"
                    max="50"
                    step="1"
                  />
                </div>
              )}
              
              <div className="custom-item">
                <label>Loan Interest Rate (%)</label>
                <input
                  type="number"
                  className="custom-input"
                  value={customParams.loanInterestRate}
                  onChange={(e) => updateCustomParam('loanInterestRate', e.target.value)}
                  min="0"
                  max="20"
                  step="0.1"
                />
              </div>
              
              <div className="custom-item">
                <label>Post-Retirement BTC Growth (%)</label>
                <input
                  type="number"
                  className="custom-input"
                  value={customParams.postRetirementBitcoinGrowth}
                  onChange={(e) => updateCustomParam('postRetirementBitcoinGrowth', e.target.value)}
                  min="0"
                  max="50"
                  step="1"
                />
              </div>
            </div>
          </div>
        )}

        <button 
          className="calculate-button"
          onClick={calculateRetirementProjection}
        >
          Calculate Retirement Plan
        </button>
      </div>

      {/* Results Section - Simplified and focused on key insights */}
      {results && (
        <div className="results-container">
          <h3 className="results-title">Retirement Analysis Results</h3>
          
          <div className="results-grid">
            <div className="result-item">
              <div className="result-label">Required Portfolio for Retirement</div>
              <div className="result-value">${formatNumber(results.requiredPortfolio)}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Projected Portfolio at Retirement</div>
              <div className="result-value highlight">${formatNumber(results.projectedPortfolio)}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Portfolio Shortfall/Surplus</div>
              <div className={`result-value ${results.shortfall >= 0 ? 'safe' : 'danger'}`}>
                ${formatNumber(results.shortfall)}
              </div>
            </div>
            <div className="result-item">
              <div className="result-label">Final BTC Holdings</div>
              <div className="result-value">{results.finalBTC.toFixed(4)} BTC</div>
            </div>
            <div className="result-item">
              <div className="result-label">Retirement Strategy</div>
              <div className="result-value highlight">{retirementStrategy === 'sell' ? '🔽 Sell for Income' : '💰 Borrow for Income'}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Strategy Viability ({retirementDuration} years)</div>
              <div className={`result-value ${results.retirementViable ? 'safe' : 'danger'}`}>
                {results.retirementViable ? 'Viable' : 'Not Sustainable'}
              </div>
            </div>
            {results.yearsUntilDepletion && (
              <div className="result-item">
                <div className="result-label">Years Until Depletion/Risk</div>
                <div className="result-value danger">{results.yearsUntilDepletion} years</div>
              </div>
            )}
            <div className="result-item">
              <div className="result-label">Final Retirement Net Worth</div>
              <div className="result-value">${formatNumber(results.finalRetirementValue)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart 1: Accumulation Phase - Shows path to retirement target */}
      {accumulationData.length > 0 && (
        <div className="chart-container">
          <h3 className="chart-title">Chart 1: Accumulation Phase - Path to Retirement</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={accumulationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="year" 
                stroke="#EAEAEA"
                label={{ value: 'Years Until Retirement', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="#EAEAEA"
                label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#EAEAEA'
                }}
                formatter={(value, name) => [
                  `$${formatNumber(value)}`, 
                  name === 'portfolioValue' ? 'Projected Portfolio' : 'Required Portfolio'
                ]}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="portfolioValue" 
                stroke="#007BFF" 
                strokeWidth={3}
                name="Projected Portfolio Value"
              />
              <ReferenceLine 
                y={accumulationData[0]?.targetValue} 
                stroke="#28a745" 
                strokeWidth={2}
                strokeDasharray="5 5"
                label="Required Portfolio Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart 2: Retirement Phase - Strategy-specific simulation */}
      {retirementData.length > 0 && (
        <div className="chart-container">
          <h3 className="chart-title">Chart 2: Retirement Phase - {retirementDuration} Year Simulation (Strategy: {results?.retirementStrategy === 'sell' ? '🔽 SELL for Income' : '💰 BORROW for Income'})</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={retirementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="year" 
                stroke="#EAEAEA"
                label={{ value: 'Years in Retirement', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#EAEAEA"
                label={{ value: results?.retirementStrategy === 'sell' ? 'BTC Holdings / Portfolio ($)' : 'Portfolio Value ($)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => results?.retirementStrategy === 'sell' && value < 100 ? value.toFixed(2) : `$${(value / 1000000).toFixed(1)}M`}
              />
              {results?.retirementStrategy === 'borrow' && (
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#dc3545"
                  label={{ value: 'LTV Ratio (%)', angle: 90, position: 'insideRight' }}
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                />
              )}
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#EAEAEA'
                }}
                formatter={(value, name) => {
                  if (name === 'btcHoldings') return [`${value.toFixed(4)} BTC`, 'BTC Holdings'];
                  if (name === 'ltvRatio') return [`${value.toFixed(1)}%`, 'LTV Ratio'];
                  if (name === 'loanPrincipal') return [`$${formatNumber(value)}`, 'Total Loan Principal'];
                  return [`$${formatNumber(value)}`, name];
                }}
                labelFormatter={(label) => `Year ${label} of Retirement`}
              />
              <Legend />
              
              {results?.retirementStrategy === 'sell' ? (
                <>
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="portfolioValue" 
                    stroke="#007BFF" 
                    strokeWidth={3}
                    name="Portfolio Balance ($)"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="btcHoldings" 
                    stroke="#FFA500" 
                    strokeWidth={2}
                    name="BTC Holdings (amount)"
                  />
                </>
              ) : (
                <>
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="btcHoldings" 
                    stroke="#FFA500" 
                    strokeWidth={2}
                    name="BTC Holdings (preserved)"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="loanPrincipal" 
                    stroke="#dc3545" 
                    strokeWidth={2}
                    name="Total Loan Principal"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="ltvRatio" 
                    stroke="#FF6B6B" 
                    strokeWidth={3}
                    name="LTV Ratio (%)"
                  />
                  <ReferenceLine yAxisId="right" y={75} stroke="#dc3545" strokeDasharray="3 3" label="Danger Zone (75% LTV)" />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RetirementCalculator;