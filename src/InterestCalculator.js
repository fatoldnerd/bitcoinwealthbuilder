import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const InterestCalculator = () => {
  // State for input values
  const [currentBTC, setCurrentBTC] = useState('');
  const [bitcoinPrice, setBitcoinPrice] = useState('');
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [initialInvestment, setInitialInvestment] = useState('');
  const [monthlyAddition, setMonthlyAddition] = useState('');
  const [timeInYears, setTimeInYears] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  
  // Cost basis tracking state
  const [showCostBasis, setShowCostBasis] = useState(false);
  const [averagePurchasePrice, setAveragePurchasePrice] = useState('');
  const [totalCostBasis, setTotalCostBasis] = useState('');
  const [currentROI, setCurrentROI] = useState('');
  
  // State for calculated results
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartView, setChartView] = useState('combined'); // 'portfolio', 'bitcoin', 'combined'

  // Fetch Bitcoin price from CoinGecko API on component mount
  useEffect(() => {
    fetchBitcoinPrice();
  }, []);

  const fetchBitcoinPrice = async () => {
    setIsLoadingPrice(true);
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      const price = response.data.bitcoin.usd;
      setBitcoinPrice(price.toString());
      // Auto-calculate initial investment if BTC amount is provided
      if (currentBTC && !initialInvestment) {
        setInitialInvestment((parseFloat(currentBTC) * price).toString());
      }
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      setBitcoinPrice('50000');
    } finally {
      setIsLoadingPrice(false);
    }
  };

  // Update initial investment when BTC amount or price changes
  const updateInitialInvestment = () => {
    if (currentBTC && bitcoinPrice) {
      const btcAmount = parseFloat(currentBTC) || 0;
      const price = parseFloat(bitcoinPrice) || 0;
      setInitialInvestment((btcAmount * price).toString());
    }
  };


  // Handle Bitcoin price change
  const handlePriceChange = (value) => {
    setBitcoinPrice(value);
    if (currentBTC && value) {
      const btcAmount = parseFloat(currentBTC) || 0;
      const price = parseFloat(value) || 0;
      setInitialInvestment((btcAmount * price).toString());
      // Recalculate ROI if we have average purchase price
      if (averagePurchasePrice) {
        calculateROI(btcAmount, price, parseFloat(averagePurchasePrice));
      }
    }
  };

  // Handle average purchase price change
  const handleAveragePriceChange = (value) => {
    setAveragePurchasePrice(value);
    if (currentBTC && value) {
      const btcAmount = parseFloat(currentBTC) || 0;
      const avgPrice = parseFloat(value) || 0;
      const currentPrice = parseFloat(bitcoinPrice) || 0;
      
      // Calculate total cost basis
      const costBasis = btcAmount * avgPrice;
      setTotalCostBasis(costBasis.toFixed(2));
      
      // Calculate ROI if we have current price
      if (currentPrice > 0) {
        calculateROI(btcAmount, currentPrice, avgPrice);
      }
    }
  };

  // Calculate ROI
  const calculateROI = (btcAmount, currentPrice, avgPrice) => {
    const currentValue = btcAmount * currentPrice;
    const costBasis = btcAmount * avgPrice;
    
    if (costBasis > 0) {
      const roi = ((currentValue - costBasis) / costBasis) * 100;
      setCurrentROI(roi.toFixed(1));
    }
  };

  // Handle BTC amount change (updated to include cost basis calculations)
  const handleBTCChange = (value) => {
    setCurrentBTC(value);
    if (value && bitcoinPrice) {
      const btcAmount = parseFloat(value) || 0;
      const price = parseFloat(bitcoinPrice) || 0;
      setInitialInvestment((btcAmount * price).toString());
      
      // Recalculate cost basis and ROI if we have average price
      if (averagePurchasePrice) {
        const avgPrice = parseFloat(averagePurchasePrice) || 0;
        const costBasis = btcAmount * avgPrice;
        setTotalCostBasis(costBasis.toFixed(2));
        calculateROI(btcAmount, price, avgPrice);
      }
    }
  };

  // Compound interest calculation function
  const calculateCompoundInterest = () => {
    const btcAmount = parseFloat(currentBTC) || 0;
    const btcPrice = parseFloat(bitcoinPrice) || 0;
    const principal = parseFloat(initialInvestment) || 0;
    const monthlyDeposit = parseFloat(monthlyAddition) || 0;
    const years = parseFloat(timeInYears) || 0;
    const rate = parseFloat(annualRate) / 100 || 0;
    if ((btcAmount <= 0 && principal <= 0) || years <= 0 || rate <= 0 || btcPrice <= 0) {
      alert('Please enter valid positive numbers for all required fields');
      return;
    }

    // Calculate compound interest for principal (annual compounding)
    const compoundAmount = principal * Math.pow(1 + rate, years);
    
    // Calculate future value of monthly deposits (annuity)
    const monthlyRate = rate / 12;
    const totalMonths = years * 12;
    const monthlyDepositFV = monthlyDeposit * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const totalFutureValue = compoundAmount + monthlyDepositFV;
    const totalPrincipal = principal + (monthlyDeposit * totalMonths);
    const totalInterest = totalFutureValue - totalPrincipal;

    // Generate chart data for year-by-year growth with BTC tracking
    const yearlyData = [];
    
    for (let year = 0; year <= years; year++) {
      const yearCompound = principal * Math.pow(1 + rate, year);
      const yearMonths = year * 12;
      const yearMonthlyFV = year === 0 ? 0 : monthlyDeposit * 
        ((Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate);
      const yearTotal = yearCompound + yearMonthlyFV;
      
      // Calculate BTC accumulated from monthly investments
      const btcFromMonthlyInvestments = year === 0 ? 0 : (monthlyDeposit * yearMonths) / btcPrice;
      const totalBTC = btcAmount + btcFromMonthlyInvestments;
      const totalBTCValue = totalBTC * btcPrice * Math.pow(1 + rate, year); // BTC value appreciation
      
      yearlyData.push({
        year: year,
        value: Math.round(yearTotal),
        principal: Math.round(principal + (monthlyDeposit * yearMonths)),
        interest: Math.round(yearTotal - (principal + (monthlyDeposit * yearMonths))),
        btcHoldings: Math.round(totalBTC * 100000000) / 100000000, // Round to 8 decimal places
        btcValue: Math.round(totalBTCValue),
        dollarsInvested: Math.round(principal + (monthlyDeposit * yearMonths))
      });
    }

    const finalBTC = yearlyData[yearlyData.length - 1].btcHoldings;
    const finalBTCValue = yearlyData[yearlyData.length - 1].btcValue;
    const totalBTCAccumulated = finalBTC - btcAmount;
    const averageBTCPrice = totalBTCAccumulated > 0 ? (monthlyDeposit * totalMonths) / totalBTCAccumulated : btcPrice;

    setResults({
      totalFutureValue: totalFutureValue.toFixed(2),
      totalPrincipal: totalPrincipal.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      startingBTC: btcAmount.toFixed(8),
      finalBTC: finalBTC.toFixed(8),
      btcAccumulated: totalBTCAccumulated.toFixed(8),
      finalBTCValue: finalBTCValue.toFixed(2),
      averageBTCPrice: averageBTCPrice.toFixed(2),
      currentBTCPrice: btcPrice.toFixed(2),
      // Cost basis information
      totalCostBasis: totalCostBasis,
      currentROI: currentROI,
      averagePurchasePrice: averagePurchasePrice
    });
    
    setChartData(yearlyData);
  };

  // Format number with commas for display
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculate key metrics
  const calculateKeyMetrics = (data, initialValue) => {
    if (!data || data.length === 0) return {};
    
    const finalValue = data[data.length - 1].value;
    const years = data.length - 1;
    
    const totalReturn = ((finalValue - initialValue) / initialValue) * 100;
    const cagr = years > 0 ? (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100 : 0;
    const finalMultiple = finalValue / initialValue;
    
    // Time to double (Rule of 72 approximation)
    const timeToDouble = cagr > 0 ? 72 / cagr : Infinity;
    
    return {
      totalReturn: totalReturn.toFixed(1),
      cagr: cagr.toFixed(1),
      finalMultiple: finalMultiple.toFixed(1),
      timeToDouble: isFinite(timeToDouble) ? timeToDouble.toFixed(1) : 'N/A'
    };
  };

  return (
    <div className="calculator-container">
      <h2 className="calculator-title">Bitcoin Compound Interest Calculator</h2>
      
      <div className="calculator-form">
        <div className="form-group">
          <label className="form-label">Current Bitcoin Holdings (BTC)</label>
          <input
            type="number"
            className="form-input"
            value={currentBTC}
            onChange={(e) => handleBTCChange(e.target.value)}
            placeholder="Enter your current Bitcoin amount"
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
            onChange={(e) => handlePriceChange(e.target.value)}
            placeholder="Enter Bitcoin price"
            min="0"
            step="0.01"
          />
        </div>

        {/* Collapsible Cost Basis Section */}
        <div className="cost-basis-section">
          <button
            type="button"
            className="cost-basis-toggle"
            onClick={() => setShowCostBasis(!showCostBasis)}
          >
            <span className="toggle-icon">{showCostBasis ? '▼' : '▶'}</span>
            <span className="toggle-text">Cost Basis Details (Optional)</span>
          </button>
          
          {showCostBasis && (
            <div className="cost-basis-details">
              <div className="form-group">
                <label className="form-label">Average Purchase Price ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={averagePurchasePrice}
                  onChange={(e) => handleAveragePriceChange(e.target.value)}
                  placeholder="Enter your average BTC purchase price"
                  min="0"
                  step="0.01"
                />
              </div>
              
              {totalCostBasis && (
                <div className="calculated-values">
                  <div className="calc-item">
                    <span className="calc-label">Total Cost Basis:</span>
                    <span className="calc-value">${parseFloat(totalCostBasis).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  {currentROI && (
                    <div className="calc-item">
                      <span className="calc-label">Current ROI:</span>
                      <span className={`calc-value ${parseFloat(currentROI) >= 0 ? 'positive' : 'negative'}`}>
                        {parseFloat(currentROI) >= 0 ? '+' : ''}{currentROI}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Calculated Initial Investment ($)</label>
          <input
            type="number"
            className="form-input calculated-input"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
            placeholder="Auto-calculated from BTC × Price"
            min="0"
            step="0.01"
            readOnly
          />
        </div>

        <div className="form-group">
          <label className="form-label">Regular Monthly Addition ($)</label>
          <input
            type="number"
            className="form-input"
            value={monthlyAddition}
            onChange={(e) => setMonthlyAddition(e.target.value)}
            placeholder="Enter monthly addition"
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Time in Years</label>
          <input
            type="number"
            className="form-input"
            value={timeInYears}
            onChange={(e) => setTimeInYears(e.target.value)}
            placeholder="Enter investment duration"
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Expected Bitcoin Annual Growth Rate (%)</label>
          <input
            type="number"
            className="form-input"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
            placeholder="Enter expected Bitcoin growth rate"
            min="0"
            step="0.01"
          />
        </div>


        <button 
          className="calculate-button"
          onClick={calculateCompoundInterest}
        >
          Calculate Future Value
        </button>
      </div>

      {results && (
        <div className="results-container">
          <h3 className="results-title">Calculation Results</h3>
          <div className="results-grid">
            <div className="result-item">
              <div className="result-label">Total Future Value</div>
              <div className="result-value highlight">${formatNumber(results.totalFutureValue)}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Total Principal Invested</div>
              <div className="result-value">${formatNumber(results.totalPrincipal)}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Total Interest Earned</div>
              <div className="result-value">${formatNumber(results.totalInterest)}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Starting Bitcoin</div>
              <div className="result-value">{results.startingBTC} BTC</div>
            </div>
            <div className="result-item">
              <div className="result-label">Final Bitcoin Holdings</div>
              <div className="result-value highlight">{results.finalBTC} BTC</div>
            </div>
            <div className="result-item">
              <div className="result-label">Bitcoin Accumulated (DCA)</div>
              <div className="result-value">{results.btcAccumulated} BTC</div>
            </div>
            <div className="result-item">
              <div className="result-label">Average BTC Purchase Price</div>
              <div className="result-value">${formatNumber(results.averageBTCPrice)}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Final BTC Value</div>
              <div className="result-value">${formatNumber(results.finalBTCValue)}</div>
            </div>
          </div>
          
          {/* Cost Basis Performance Section */}
          {results.totalCostBasis && results.currentROI && (
            <div className="cost-basis-results">
              <h4 className="cost-basis-title">Your Bitcoin Performance</h4>
              <div className="results-grid">
                <div className="result-item">
                  <div className="result-label">Total Cost Basis</div>
                  <div className="result-value">${formatNumber(results.totalCostBasis)}</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Current ROI</div>
                  <div className={`result-value ${parseFloat(results.currentROI) >= 0 ? 'positive' : 'negative'}`}>
                    {parseFloat(results.currentROI) >= 0 ? '+' : ''}{results.currentROI}%
                  </div>
                </div>
                <div className="result-item">
                  <div className="result-label">Current Profit/Loss</div>
                  <div className={`result-value ${parseFloat(results.currentROI) >= 0 ? 'positive' : 'negative'}`}>
                    {(() => {
                      const currentValue = parseFloat(results.startingBTC) * parseFloat(results.currentBTCPrice);
                      const profitLoss = currentValue - parseFloat(results.totalCostBasis);
                      return `${profitLoss >= 0 ? '+' : ''}$${formatNumber(Math.abs(profitLoss).toFixed(2))}`;
                    })()}
                  </div>
                </div>
                <div className="result-item">
                  <div className="result-label">Average Purchase Price</div>
                  <div className="result-value">${formatNumber(results.averagePurchasePrice)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {chartData.length > 0 && (
        <div className="chart-container">
          <h3 className="chart-title">Investment Growth Over Time</h3>
          
          {/* Key Metrics */}
          {(() => {
            const initialInv = parseFloat(initialInvestment) || 0;
            const keyMetrics = calculateKeyMetrics(chartData, initialInv);
            return (
              <div className="key-metrics">
                <div className="metric-item">
                  <div className="metric-label">Total Return</div>
                  <div className="metric-value">{keyMetrics.totalReturn}%</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">CAGR</div>
                  <div className="metric-value">{keyMetrics.cagr}%</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Final Multiple</div>
                  <div className="metric-value">{keyMetrics.finalMultiple}x</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Years to Double</div>
                  <div className="metric-value">{keyMetrics.timeToDouble}</div>
                </div>
              </div>
            );
          })()}
          
          {/* Chart View Toggle */}
          <div className="chart-controls">
            <button 
              className={`chart-toggle ${chartView === 'portfolio' ? 'active' : ''}`}
              onClick={() => setChartView('portfolio')}
            >
              Portfolio Value
            </button>
            <button 
              className={`chart-toggle ${chartView === 'bitcoin' ? 'active' : ''}`}
              onClick={() => setChartView('bitcoin')}
            >
              Bitcoin Holdings
            </button>
            <button 
              className={`chart-toggle ${chartView === 'combined' ? 'active' : ''}`}
              onClick={() => setChartView('combined')}
            >
              Combined View
            </button>
          </div>
          <ResponsiveContainer width="100%" height={450}>
            {chartView === 'portfolio' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#28a745" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#28a745" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007BFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#007BFF" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="year" 
                  stroke="#EAEAEA"
                  label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#EAEAEA"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E1E1E', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#EAEAEA'
                  }}
                  formatter={(value, name) => [`$${formatNumber(value)}`, name]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="principal"
                  stackId="1"
                  stroke="#28a745"
                  fill="url(#principalGradient)"
                  name="Principal"
                />
                <Area
                  type="monotone"
                  dataKey="interest"
                  stackId="1"
                  stroke="#007BFF"
                  fill="url(#interestGradient)"
                  name="Interest/Growth"
                />
              </AreaChart>
            ) : chartView === 'bitcoin' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="year" 
                  stroke="#EAEAEA"
                  label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#EAEAEA"
                  tickFormatter={(value) => `${value.toFixed(4)} BTC`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#FF8C00"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E1E1E', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#EAEAEA'
                  }}
                  formatter={(value, name) => {
                    if (name === 'BTC Holdings') {
                      return [`${parseFloat(value).toFixed(8)} BTC`, name];
                    }
                    return [`$${formatNumber(value)}`, name];
                  }}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="btcHoldings" 
                  stroke="#FFC107" 
                  strokeWidth={3}
                  dot={{ fill: '#FFC107', strokeWidth: 2, r: 4 }}
                  name="BTC Holdings"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="btcValue" 
                  stroke="#FF8C00" 
                  strokeWidth={3}
                  dot={{ fill: '#FF8C00', strokeWidth: 2, r: 4 }}
                  name="BTC Value"
                />
              </LineChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="year" 
                  stroke="#EAEAEA"
                  label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#EAEAEA"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#FF8C00"
                  tickFormatter={(value) => `${value.toFixed(4)} BTC`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E1E1E', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#EAEAEA'
                  }}
                  formatter={(value, name) => {
                    if (name === 'BTC Holdings') {
                      return [`${parseFloat(value).toFixed(8)} BTC`, name];
                    }
                    return [`$${formatNumber(value)}`, name];
                  }}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="value" 
                  stroke="#007BFF" 
                  strokeWidth={3}
                  dot={{ fill: '#007BFF', strokeWidth: 2, r: 4 }}
                  name="Total Value"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="principal" 
                  stroke="#28a745" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#28a745', strokeWidth: 2, r: 3 }}
                  name="Principal"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="btcValue" 
                  stroke="#FF8C00" 
                  strokeWidth={2}
                  dot={{ fill: '#FF8C00', strokeWidth: 2, r: 3 }}
                  name="BTC Value"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="btcHoldings" 
                  stroke="#FFC107" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ fill: '#FFC107', strokeWidth: 2, r: 3 }}
                  name="BTC Holdings"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default InterestCalculator;