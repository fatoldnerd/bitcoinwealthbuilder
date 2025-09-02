import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import ReportDocument from './ReportDocument';

const GoalPlanner = () => {
  const navigate = useNavigate();

  // Form state
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [startingCapital, setStartingCapital] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  
  // Scenario and projection settings
  const [selectedScenario, setSelectedScenario] = useState('moderate');
  const [projectionMode, setProjectionMode] = useState('smooth');
  const [customRate, setCustomRate] = useState(45);
  const [volatilityFactor, setVolatilityFactor] = useState(70);
  
  // Results state
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalNameForSaving, setGoalNameForSaving] = useState('');
  
  // Report generation state
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [chartImageData, setChartImageData] = useState('');
  
  // Chart reference for capturing
  const chartRef = useRef(null);

  // Scenario configurations
  const scenarios = {
    conservative: { name: 'Conservative', rate: 20, volatility: 40, description: 'Lower growth, stable returns' },
    moderate: { name: 'Moderate', rate: 45, volatility: 70, description: 'Balanced growth and volatility' },
    optimistic: { name: 'Optimistic', rate: 70, volatility: 90, description: 'Higher growth potential, more volatility' },
    custom: { name: 'Custom', rate: customRate, volatility: volatilityFactor, description: 'Set your own parameters' }
  };

  // Get current scenario
  const getCurrentScenario = () => {
    if (selectedScenario === 'custom') {
      return { ...scenarios.custom, rate: customRate, volatility: volatilityFactor };
    }
    return scenarios[selectedScenario];
  };

  // Calculate goal projection
  const calculateGoalProjection = () => {
    const initial = parseFloat(startingCapital) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const years = parseInt(timeHorizon) || 1;
    const target = parseFloat(targetAmount) || 0;
    
    if (target <= 0) {
      alert('Please enter a valid target amount');
      return;
    }

    const scenario = getCurrentScenario();
    const annualRate = scenario.rate / 100;
    const monthlyRate = Math.pow(1 + annualRate, 1/12) - 1;
    const totalMonths = years * 12;
    
    // Generate chart data
    const data = [];
    let portfolioValue = initial;
    
    for (let month = 0; month <= totalMonths; month++) {
      const year = month / 12;
      
      // Add monthly contribution (except at month 0)
      if (month > 0) {
        portfolioValue += monthly;
      }
      
      // Apply growth
      if (month > 0) {
        if (projectionMode === 'smooth') {
          portfolioValue *= (1 + monthlyRate);
        } else {
          // Realistic volatility mode
          const volatility = scenario.volatility / 100;
          const randomFactor = (Math.random() - 0.5) * volatility * 0.5;
          const monthlyGrowth = monthlyRate * (1 + randomFactor);
          portfolioValue *= (1 + monthlyGrowth);
        }
      }
      
      data.push({
        year: year,
        portfolioValue: Math.round(portfolioValue),
        targetAmount: target,
        month: month
      });
    }

    const finalValue = data[data.length - 1].portfolioValue;
    const shortfall = finalValue - target;
    const successRate = finalValue >= target ? 100 : Math.round((finalValue / target) * 100);
    
    // Calculate required monthly contribution to reach target
    const requiredMonthly = monthly === 0 ? 0 : 
      target > initial ? 
        (target - initial * Math.pow(1 + monthlyRate, totalMonths)) / 
        (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)) : 0;

    setResults({
      finalValue,
      targetAmount: target,
      shortfall,
      successRate,
      totalContributions: monthly * totalMonths,
      initialInvestment: initial,
      requiredMonthlyForTarget: Math.max(0, requiredMonthly),
      projectionMode,
      scenario: scenario.name,
      timeHorizon: years
    });
    
    setChartData(data);
  };

  // Handle saving goal to dashboard
  const handleStartPlan = () => {
    if (!results) return;
    setGoalNameForSaving(goalName || 'Unnamed Goal');
    setShowGoalModal(true);
  };

  const saveGoal = () => {
    if (!goalNameForSaving.trim() || !results) return;

    const newGoal = {
      id: Date.now().toString(),
      goalName: goalNameForSaving.trim(),
      targetAmount: results.targetAmount,
      monthlyContribution: parseFloat(monthlyContribution) || 0,
      totalMonths: results.timeHorizon * 12,
      monthsCompleted: 0,
      createdDate: new Date().toISOString(),
      strategy: 'goal', // Different from retirement strategy
      currentProgress: 0,
      goalType: 'general' // To distinguish from retirement goals
    };

    // Load existing goals from localStorage
    const existingGoals = JSON.parse(localStorage.getItem('bitcoinGoals') || '[]');
    
    // Add new goal to array
    const updatedGoals = [...existingGoals, newGoal];
    
    // Save back to localStorage
    localStorage.setItem('bitcoinGoals', JSON.stringify(updatedGoals));

    // Close modal and navigate to dashboard
    setShowGoalModal(false);
    setGoalNameForSaving('');
    navigate('/dashboard');
  };

  const closeModal = () => {
    setShowGoalModal(false);
    setGoalNameForSaving('');
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

  // Capture chart as image
  const captureChart = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: '#1E1E1E',
          scale: 2
        });
        return canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Error capturing chart:', error);
        return null;
      }
    }
    return null;
  };

  // Generate AI-powered report
  const generateReport = async () => {
    if (!results || !goalName.trim()) {
      alert('Please calculate a goal plan and provide a goal name first.');
      return;
    }
    
    setIsGeneratingReport(true);
    setReportReady(false);
    
    try {
      // Capture chart image first
      const chartImage = await captureChart();
      setChartImageData(chartImage || '');
      
      // Get current scenario for more detailed data
      const scenario = getCurrentScenario();
      const scenarioName = selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1);
      
      // Gather comprehensive plan data
      const planData = {
        goalName: goalName.trim(),
        timeHorizon: parseInt(timeHorizon),
        finalValue: results.finalValue,
        monthlyContribution: parseFloat(monthlyContribution) || 0,
        startingCapital: parseFloat(startingCapital) || 0,
        growthScenario: scenarioName,
        projectionMode: projectionMode,
        targetAmount: parseFloat(targetAmount) || 0
      };
      
      // Call our serverless function
      const response = await fetch('/api/generateReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAiSummary(data.summary);
        setReportReady(true);
      } else {
        throw new Error(data.error || 'Failed to generate report');
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      // Set fallback AI summary but still allow report download
      setAiSummary('This financial plan analysis shows your projected path to reaching your goal through disciplined Bitcoin investment. Your systematic approach of regular contributions combined with long-term strategy positions you well for achieving your financial objectives.');
      setReportReady(true);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="calculator-container">
      <h2 className="calculator-title">Bitcoin Goal Planner</h2>
      
      {/* Goal Details Section */}
      <div className="core-inputs-section">
        <div className="form-group">
          <label className="form-label">Goal Name</label>
          <input
            type="text"
            className="form-input"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="e.g., House Down Payment, Emergency Fund"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Target Amount ($)</label>
          <input
            type="number"
            className="form-input"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="Enter target amount"
            min="0"
            step="1000"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Time Horizon: {timeHorizon} years</label>
          <input
            type="range"
            className="form-slider"
            min="1"
            max="30"
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
            <span>1 year</span>
            <span>30 years</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Starting Capital ($) - Optional</label>
          <input
            type="number"
            className="form-input"
            value={startingCapital}
            onChange={(e) => setStartingCapital(e.target.value)}
            placeholder="Current savings (optional)"
            min="0"
            step="1000"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Monthly Contribution ($)</label>
          <input
            type="number"
            className="form-input"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            placeholder="Monthly investment amount"
            min="0"
            step="100"
          />
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="scenario-section">
        <h3 className="section-title">Growth Scenario</h3>
        <div className="scenario-buttons">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <button
              key={key}
              className={`scenario-btn ${selectedScenario === key ? 'active' : ''}`}
              onClick={() => setSelectedScenario(key)}
            >
              {scenario.name}
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                {key !== 'custom' ? `${scenario.rate}% annually` : 'Custom'}
              </div>
            </button>
          ))}
        </div>
        
        {selectedScenario === 'custom' && (
          <div className="custom-params-section">
            <h4 className="section-title">Custom Parameters</h4>
            <div className="custom-grid">
              <div className="custom-item">
                <label>Annual Growth Rate (%)</label>
                <input
                  type="number"
                  className="custom-input"
                  value={customRate}
                  onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="200"
                  step="1"
                />
              </div>
              <div className="custom-item">
                <label>Volatility Factor (%)</label>
                <input
                  type="number"
                  className="custom-input"
                  value={volatilityFactor}
                  onChange={(e) => setVolatilityFactor(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="5"
                />
              </div>
            </div>
          </div>
        )}
        
        <p className="mode-description">
          {getCurrentScenario().description}
        </p>
      </div>

      {/* Projection Mode */}
      <div className="projection-mode-section">
        <h3 className="section-title">Projection Mode</h3>
        <div className="projection-buttons">
          <button
            className={`projection-btn ${projectionMode === 'smooth' ? 'active' : ''}`}
            onClick={() => setProjectionMode('smooth')}
          >
            Smooth Growth
          </button>
          <button
            className={`projection-btn ${projectionMode === 'volatile' ? 'active' : ''}`}
            onClick={() => setProjectionMode('volatile')}
          >
            Realistic Volatility
          </button>
        </div>
        <p className="mode-description">
          {projectionMode === 'smooth' 
            ? 'Steady, consistent growth without market fluctuations' 
            : 'Includes realistic market volatility and fluctuations'}
        </p>
      </div>

      {/* Calculate Button */}
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <button 
          className="calculate-button"
          onClick={calculateGoalProjection}
        >
          Calculate Goal Plan
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="results-container">
          <h3 className="results-title">Goal Planning Results</h3>
          
          <div className="results-grid">
            <div className="result-item">
              <div className="result-label">Target Amount</div>
              <div className="result-value">{formatCurrency(results.targetAmount)}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Projected Final Value</div>
              <div className="result-value highlight">{formatCurrency(results.finalValue)}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Surplus / Shortfall</div>
              <div className={`result-value ${results.shortfall >= 0 ? 'safe' : 'danger'}`}>
                {results.shortfall >= 0 ? '+' : ''}{formatCurrency(results.shortfall)}
              </div>
            </div>
            <div className="result-item">
              <div className="result-label">Success Rate</div>
              <div className={`result-value ${results.successRate >= 100 ? 'safe' : results.successRate >= 80 ? 'highlight' : 'danger'}`}>
                {results.successRate}%
              </div>
            </div>
            <div className="result-item">
              <div className="result-label">Total Contributions</div>
              <div className="result-value">{formatCurrency(results.totalContributions)}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Time Horizon</div>
              <div className="result-value">{results.timeHorizon} years</div>
            </div>
          </div>

          {results.requiredMonthlyForTarget > parseFloat(monthlyContribution || 0) && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: 'rgba(255, 193, 7, 0.1)', 
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <strong style={{ color: '#FFC107' }}>Recommendation:</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#EAEAEA' }}>
                To reach your goal, consider increasing your monthly contribution to{' '}
                <strong style={{ color: '#FF8C00' }}>
                  {formatCurrency(results.requiredMonthlyForTarget)}
                </strong>
              </p>
            </div>
          )}

          {/* Start My Plan Button */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              className="calculate-button"
              onClick={handleStartPlan}
              style={{ 
                background: 'linear-gradient(135deg, #FF8C00, #FFA500)',
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '700'
              }}
            >
              🚀 Start My Plan
            </button>
          </div>
        </div>
      )}

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className="chart-container">
          <h3 className="chart-title">Goal Projection Chart</h3>
          <div ref={chartRef}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="year" 
                stroke="#EAEAEA"
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="#EAEAEA"
                label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
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
                  formatCurrency(value), 
                  name === 'portfolioValue' ? 'Portfolio Value' : 'Target Amount'
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
                y={results.targetAmount} 
                stroke="#28a745" 
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: "Target Amount", position: "topRight" }}
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
          <div className="chart-note">
            <small>
              The green dashed line represents your target amount. Your portfolio projection should cross above this line to successfully reach your goal.
            </small>
          </div>
        </div>
      )}

      {/* Report Generation Section */}
      {results && (
        <div className="report-generation-section" style={{ textAlign: 'center', marginTop: '2rem' }}>
          {!reportReady ? (
            <button
              className="calculate-button"
              onClick={generateReport}
              disabled={isGeneratingReport}
              style={{
                background: isGeneratingReport 
                  ? 'linear-gradient(135deg, #666, #888)' 
                  : 'linear-gradient(135deg, #28a745, #20c997)',
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '700',
                cursor: isGeneratingReport ? 'not-allowed' : 'pointer',
                opacity: isGeneratingReport ? 0.7 : 1
              }}
            >
              {isGeneratingReport ? '🤖 Generating Report...' : '📄 Generate Report'}
            </button>
          ) : (
            <div>
              <p style={{ color: '#28a745', marginBottom: '1rem', fontSize: '1.1rem' }}>
                ✅ Report Ready! Your AI-powered financial analysis has been generated.
              </p>
              <PDFDownloadLink
                document={
                  <ReportDocument 
                    planData={{
                      goalName: goalName.trim(),
                      timeHorizon: parseInt(timeHorizon),
                      finalValue: results.finalValue,
                      monthlyContribution: parseFloat(monthlyContribution) || 0,
                      startingCapital: parseFloat(startingCapital) || 0,
                      targetAmount: parseFloat(targetAmount) || 0,
                      growthScenario: selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1),
                      projectionMode: projectionMode,
                      planType: 'goal'
                    }}
                    aiSummary={aiSummary}
                    chartImageData={chartImageData}
                  />
                }
                fileName={`${(goalName || 'Financial-Goal').replace(/[^a-zA-Z0-9]/g, '-')}-Report.pdf`}
                className="calculate-button"
                style={{
                  background: 'linear-gradient(135deg, #007BFF, #0056b3)',
                  fontSize: '1.1rem',
                  padding: '1rem 2rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'inline-block',
                  borderRadius: '8px',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                {({ blob, url, loading, error }) =>
                  loading ? '📥 Preparing Download...' : '📥 Download Report'
                }
              </PDFDownloadLink>
            </div>
          )}
        </div>
      )}

      {/* Goal Creation Modal */}
      {showGoalModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1E1E1E',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #333',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ color: '#FF8C00', marginBottom: '1rem', textAlign: 'center' }}>
              Confirm Goal Details
            </h3>
            <p style={{ color: '#BDBDBD', marginBottom: '1.5rem', textAlign: 'center' }}>
              Ready to start tracking your "{goalNameForSaving}" goal?
            </p>
            <div style={{
              backgroundColor: '#2A2A2A',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#BDBDBD' }}>Target:</span>
                <span style={{ color: '#EAEAEA', fontWeight: '600' }}>{formatCurrency(results.targetAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#BDBDBD' }}>Monthly:</span>
                <span style={{ color: '#EAEAEA', fontWeight: '600' }}>{formatCurrency(parseFloat(monthlyContribution) || 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#BDBDBD' }}>Time Frame:</span>
                <span style={{ color: '#EAEAEA', fontWeight: '600' }}>{results.timeHorizon} years</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={closeModal}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: '#EAEAEA',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={saveGoal}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #FF8C00, #FFA500)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Start Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalPlanner;