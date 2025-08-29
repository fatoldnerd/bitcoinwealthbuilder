import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine, Legend, LabelList } from 'recharts';

const LTVCalculator = () => {
  // State for input values
  const [collateralAmount, setCollateralAmount] = useState('');
  const [bitcoinPrice, setBitcoinPrice] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [liquidationThreshold, setLiquidationThreshold] = useState('85');
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  
  // State for calculated results
  const [results, setResults] = useState(null);

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
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      // Set a fallback price if API fails
      setBitcoinPrice('50000');
    } finally {
      setIsLoadingPrice(false);
    }
  };

  // Calculate LTV and related metrics
  const calculateLTV = () => {
    const collateral = parseFloat(collateralAmount) || 0;
    const price = parseFloat(bitcoinPrice) || 0;
    const loan = parseFloat(loanAmount) || 0;
    const threshold = parseFloat(liquidationThreshold) || 85;

    if (collateral <= 0 || price <= 0 || loan <= 0) {
      alert('Please enter valid positive numbers for all fields');
      return;
    }

    // Calculate total collateral value
    const totalCollateralValue = collateral * price;
    
    // Calculate LTV ratio
    const ltvRatio = (loan / totalCollateralValue) * 100;
    
    // Calculate liquidation price using custom threshold
    // Formula: Liquidation Price = (Loan Amount / Collateral BTC) / (Liquidation Threshold / 100)
    const liquidationPrice = (loan / collateral) / (threshold / 100);

    // Determine risk level based on LTV
    let riskLevel = 'safe';
    let riskClass = 'ltv-safe';
    
    if (ltvRatio >= 40 && ltvRatio <= 60) {
      riskLevel = 'caution';
      riskClass = 'ltv-caution';
    } else if (ltvRatio > 60) {
      riskLevel = 'danger';
      riskClass = 'ltv-danger';
    }

    setResults({
      ltvRatio: ltvRatio.toFixed(2),
      liquidationPrice: liquidationPrice.toFixed(2),
      totalCollateralValue: totalCollateralValue.toFixed(2),
      liquidationThreshold: threshold,
      riskLevel: riskLevel,
      riskClass: riskClass
    });
  };

  // Format number with commas for display
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Get risk description based on LTV ratio
  const getRiskDescription = (riskLevel) => {
    switch (riskLevel) {
      case 'safe':
        return 'Low risk - Your collateral is well protected';
      case 'caution':
        return 'Moderate risk - Monitor Bitcoin price closely';
      case 'danger':
        return 'High risk - Consider reducing loan amount or adding collateral';
      default:
        return '';
    }
  };

  // Generate LTV Risk Gauge data
  const getLTVGaugeData = () => {
    if (!results) return [];
    
    const currentLTV = parseFloat(results.ltvRatio);
    return [
      { name: 'Safe Zone', value: Math.min(currentLTV, 40), fill: '#28a745' },
      { name: 'Caution Zone', value: currentLTV > 40 ? Math.min(currentLTV - 40, 20) : 0, fill: '#ffc107' },
      { name: 'Danger Zone', value: currentLTV > 60 ? currentLTV - 60 : 0, fill: '#dc3545' },
      { name: 'Remaining', value: Math.max(0, 100 - currentLTV), fill: '#333' }
    ];
  };

  // Generate liquidation price scenarios
  const getLiquidationScenarios = () => {
    if (!collateralAmount || !loanAmount) return [];
    
    const collateral = parseFloat(collateralAmount);
    const loan = parseFloat(loanAmount);
    
    const scenarios = [
      { name: '25% LTV', ltvRatio: 25, liquidationPrice: (loan / collateral) / 0.25 },
      { name: '40% LTV', ltvRatio: 40, liquidationPrice: (loan / collateral) / 0.40 },
      { name: '50% LTV', ltvRatio: 50, liquidationPrice: (loan / collateral) / 0.50 },
      { name: '60% LTV', ltvRatio: 60, liquidationPrice: (loan / collateral) / 0.60 },
      { name: '75% LTV', ltvRatio: 75, liquidationPrice: (loan / collateral) / 0.75 },
      { name: '90% LTV', ltvRatio: 90, liquidationPrice: (loan / collateral) / 0.90 },
    ];
    
    return scenarios;
  };

  // Generate Bitcoin price scenarios
  const getBitcoinPriceScenarios = () => {
    if (!collateralAmount || !loanAmount || !bitcoinPrice) return [];
    
    const collateral = parseFloat(collateralAmount);
    const loan = parseFloat(loanAmount);
    const currentPrice = parseFloat(bitcoinPrice);
    
    const priceChanges = [-50, -30, -15, 0, 15, 30, 50];
    
    return priceChanges.map(change => {
      const newPrice = currentPrice * (1 + change / 100);
      const newCollateralValue = collateral * newPrice;
      const newLTV = (loan / newCollateralValue) * 100;
      
      return {
        name: `${change >= 0 ? '+' : ''}${change}%`,
        priceChange: change,
        bitcoinPrice: newPrice,
        collateralValue: newCollateralValue,
        ltvRatio: newLTV,
        loanValue: loan,
        isDangerPoint: Math.abs(newLTV - 60) < 2
      };
    });
  };

  // Calculate the exact Bitcoin price where LTV hits danger threshold (60%)
  const getDangerThresholdPrice = () => {
    if (!collateralAmount || !loanAmount) return null;
    
    const collateral = parseFloat(collateralAmount);
    const loan = parseFloat(loanAmount);
    
    // At 60% LTV: loan / (collateral * price) = 0.6
    // Solving for price: price = loan / (collateral * 0.6)
    const dangerPrice = loan / (collateral * 0.6);
    
    return dangerPrice;
  };

  // Generate margin call and liquidation table data
  const getMarginCallData = () => {
    if (!collateralAmount || !loanAmount || !bitcoinPrice || !results) return [];
    
    const collateral = parseFloat(collateralAmount);
    const loan = parseFloat(loanAmount);
    const currentPrice = parseFloat(bitcoinPrice);
    const threshold = parseFloat(liquidationThreshold);
    const originalLTV = parseFloat(results.ltvRatio);
    
    const ltvLevels = [70, 80, threshold];
    
    return ltvLevels.map(ltvLevel => {
      // Calculate trigger price: price at which this LTV level is reached
      // At LTV level: loan / (collateral * price) = ltvLevel / 100
      // Solving for price: price = loan / (collateral * (ltvLevel / 100))
      const triggerPrice = loan / (collateral * (ltvLevel / 100));
      
      // Calculate required collateral to restore original LTV
      // Target collateral value at trigger price to maintain original LTV:
      // Required total value = loan / (originalLTV / 100)
      // Required collateral value = Required total value - (collateral * triggerPrice)
      const requiredTotalValue = loan / (originalLTV / 100);
      const currentCollateralValue = collateral * triggerPrice;
      const requiredAdditionalCollateral = Math.max(0, requiredTotalValue - currentCollateralValue);
      
      // Determine risk class and if it's liquidation level
      let riskClass = 'safe-row';
      if (ltvLevel >= 70) riskClass = 'warning-row';
      if (ltvLevel >= 80) riskClass = 'danger-row';
      
      const isLiquidation = ltvLevel === threshold;
      
      return {
        ltvLevel: ltvLevel,
        bitcoinPrice: triggerPrice,
        actionRequired: requiredAdditionalCollateral,
        riskClass: riskClass,
        isLiquidation: isLiquidation
      };
    });
  };

  return (
    <div className="calculator-container">
      <h2 className="calculator-title">Bitcoin Loan LTV Calculator</h2>
      
      <div className="calculator-form">
        <div className="form-group">
          <label className="form-label">Collateral Amount (BTC)</label>
          <input
            type="number"
            className="form-input"
            value={collateralAmount}
            onChange={(e) => setCollateralAmount(e.target.value)}
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

        <div className="form-group">
          <label className="form-label">Desired Loan Amount ($)</label>
          <input
            type="number"
            className="form-input"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter loan amount"
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Liquidation Threshold (%)</label>
          <input
            type="number"
            className="form-input"
            value={liquidationThreshold}
            onChange={(e) => setLiquidationThreshold(e.target.value)}
            placeholder="Enter liquidation threshold"
            min="1"
            max="100"
            step="1"
          />
          <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#AAAAAA' }}>
            LTV ratio at which liquidation occurs (default: 85%)
          </div>
        </div>

        <button 
          className="calculate-button"
          onClick={calculateLTV}
        >
          Calculate LTV
        </button>
      </div>

      {results && (
        <div className="results-container">
          <h3 className="results-title">LTV Analysis Results</h3>
          <div className="results-grid">
            <div className="result-item">
              <div className="result-label">Loan-to-Value Ratio</div>
              <div className={`result-value ${results.riskClass}`}>
                {results.ltvRatio}%
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#AAAAAA' }}>
                {getRiskDescription(results.riskLevel)}
              </div>
            </div>
            <div className="result-item">
              <div className="result-label">Total Collateral Value</div>
              <div className="result-value">${formatNumber(results.totalCollateralValue)}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Liquidation Price</div>
              <div className="result-value">${formatNumber(results.liquidationPrice)}</div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#AAAAAA' }}>
                Bitcoin price at {results.liquidationThreshold}% LTV
              </div>
            </div>
          </div>
          
          {/* Risk Warning */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: results.riskLevel === 'danger' ? '#2d1b1b' : 
                            results.riskLevel === 'caution' ? '#2d2a1b' : '#1b2d1b',
            border: `1px solid ${results.riskLevel === 'danger' ? '#dc3545' : 
                                results.riskLevel === 'caution' ? '#ffc107' : '#28a745'}`,
            borderRadius: '8px'
          }}>
            <strong>Risk Assessment: </strong>
            <span className={results.riskClass}>
              {results.riskLevel.toUpperCase()}
            </span>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              {getRiskDescription(results.riskLevel)}
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {results && (
        <div className="charts-section">
          
          {/* LTV Risk Gauge */}
          <div className="chart-container">
            <h3 className="chart-title">LTV Risk Gauge</h3>
            <div className="ltv-gauge-container">
              <div className="gauge-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[{
                      safe: Math.min(parseFloat(results.ltvRatio), 40),
                      caution: parseFloat(results.ltvRatio) > 40 ? Math.min(parseFloat(results.ltvRatio) - 40, 20) : 0,
                      danger: parseFloat(results.ltvRatio) > 60 ? parseFloat(results.ltvRatio) - 60 : 0
                    }]}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      type="number" 
                      domain={[0, 100]}
                      stroke="#EAEAEA"
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis type="category" hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E1E1E', 
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#EAEAEA'
                      }}
                      formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
                    />
                    <Bar dataKey="safe" stackId="ltv" fill="#28a745" name="Safe Zone (0-40%)" />
                    <Bar dataKey="caution" stackId="ltv" fill="#ffc107" name="Caution Zone (40-60%)" />
                    <Bar dataKey="danger" stackId="ltv" fill="#dc3545" name="Danger Zone (60%+)" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="gauge-current-ltv">
                  Current LTV: <strong className={results.riskClass}>{results.ltvRatio}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Bitcoin Price Scenarios */}
          <div className="chart-container">
            <h3 className="chart-title">Bitcoin Price Impact Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={getBitcoinPriceScenarios()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="name" 
                  stroke="#EAEAEA"
                  label={{ value: 'Bitcoin Price Change', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#EAEAEA"
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                  label={{ value: 'LTV Ratio (%)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#FF8C00"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  label={{ value: 'Value ($)', angle: 90, position: 'insideRight' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E1E1E', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#EAEAEA'
                  }}
                  formatter={(value, name) => {
                    if (name === 'LTV Ratio') {
                      return [`${value.toFixed(1)}%`, name];
                    }
                    return [`$${formatNumber(value)}`, name];
                  }}
                />
                <Legend />
                <ReferenceLine yAxisId="left" y={40} stroke="#ffc107" strokeDasharray="5 5" label="Caution Threshold" />
                <ReferenceLine yAxisId="left" y={60} stroke="#dc3545" strokeDasharray="5 5" label="Danger Threshold" />
                <ReferenceLine x="0%" stroke="#EAEAEA" strokeDasharray="3 3" label="Current Price" />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="ltvRatio" 
                  stroke="#007BFF" 
                  strokeWidth={3}
                  dot={(props) => {
                    if (props.payload && props.payload.isDangerPoint) {
                      return <circle cx={props.cx} cy={props.cy} r={8} fill="#dc3545" stroke="#ffffff" strokeWidth={2} />;
                    }
                    return <circle cx={props.cx} cy={props.cy} r={4} fill="#007BFF" strokeWidth={2} />;
                  }}
                  name="LTV Ratio"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="collateralValue" 
                  stroke="#FF8C00" 
                  strokeWidth={2}
                  dot={{ fill: '#FF8C00', strokeWidth: 2, r: 3 }}
                  name="Collateral Value"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="loanValue" 
                  stroke="#28a745" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#28a745', strokeWidth: 2, r: 3 }}
                  name="Loan Value"
                />
              </LineChart>
            </ResponsiveContainer>
            {getDangerThresholdPrice() && (
              <div className="chart-note" style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                backgroundColor: '#2d1b1b', 
                border: '1px solid #dc3545', 
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <strong style={{ color: '#dc3545' }}>Critical Price Alert:</strong> Your LTV will hit the danger threshold (60%) when Bitcoin drops to <strong>${formatNumber(getDangerThresholdPrice())}</strong>
              </div>
            )}
          </div>

          {/* Margin Call & Liquidation Table */}
          <div className="chart-container">
            <h3 className="chart-title">Margin Call & Liquidation Table</h3>
            <div className="margin-call-table">
              <table className="ltv-table">
                <thead>
                  <tr>
                    <th>LTV Level</th>
                    <th>Bitcoin Price</th>
                    <th>Action Required</th>
                  </tr>
                </thead>
                <tbody>
                  {getMarginCallData().map((row, index) => (
                    <tr key={index} className={row.riskClass}>
                      <td>
                        <strong>{row.ltvLevel}%</strong>
                        {row.isLiquidation && <span className="liquidation-badge">LIQUIDATION</span>}
                      </td>
                      <td>${formatNumber(row.bitcoinPrice)}</td>
                      <td>
                        {row.actionRequired > 0 ? (
                          <span className="add-collateral">
                            Add ${formatNumber(row.actionRequired)} collateral
                          </span>
                        ) : (
                          <span className="safe-status">No action needed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-note">
                <small>Shows Bitcoin prices that trigger different LTV levels and the collateral needed to restore your original LTV ratio.</small>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default LTVCalculator;