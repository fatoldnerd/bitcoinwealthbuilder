import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, AreaChart, Area } from 'recharts';

const RetirementCalculator = () => {
  // State for input values
  const [startingBTC, setStartingBTC] = useState('3.4');
  const [bitcoinPrice, setBitcoinPrice] = useState('');
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  
  // Strategy parameters
  const [strategyParams, setStrategyParams] = useState({
    projectionYears: 20,
    annualGrowthRate: 25, // Average annual Bitcoin growth
    volatilityFactor: 0.3, // How much year-to-year variation
    ltvTarget: 15, // Target LTV ratio
    maxLtv: 25, // Maximum LTV allowed
    interestRate: 8, // Loan interest rate
    rebalanceFrequency: 'yearly', // How often to rebalance
    cashOutPercentage: 0, // Percentage to cash out annually
    additionalBTC: 0, // Additional BTC purchased annually
  });

  // Living expenses and house parameters
  const [livingParams, setLivingParams] = useState({
    monthlyExpenses: 10000, // Monthly living expenses
    annualExpenses: 120000, // Annual expenses (auto-calculated)
    costOfLivingIncrease: 5, // Annual cost increase %
    houseValue: 300000, // Current house value
    houseAppreciation: 5, // Annual house appreciation %
  });
  
  // Strategy mode state
  const [strategyMode, setStrategyMode] = useState('traditional'); // 'traditional' or 'perpetual'
  
  // Perpetual loan strategy parameters
  const [perpetualParams, setPerpetualParams] = useState({
    expenseCoveragePercent: 100, // % of expenses covered by loans
    targetLtvMin: 20, // Minimum target LTV
    targetLtvMax: 40, // Maximum target LTV
    emergencyBufferMonths: 6, // Months of expenses in reserve
    paydownTriggerLtv: 35, // LTV level that triggers loan paydown
    stressTestDrawdown: -50, // Stress test drawdown percentage
  });
  
  // State for calculated results
  const [results, setResults] = useState(null);
  const [yearlyData, setYearlyData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [ratioData, setRatioData] = useState([]);
  const [loanData, setLoanData] = useState([]);

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
      setBitcoinPrice('50000');
    } finally {
      setIsLoadingPrice(false);
    }
  };

  // Generate realistic Bitcoin price movements
  const generateBitcoinPrices = (startPrice, years, growthRate, volatility) => {
    const prices = [];
    let currentPrice = startPrice;
    
    for (let year = 0; year <= years; year++) {
      if (year === 0) {
        prices.push(currentPrice);
        continue;
      }
      
      // Generate random growth with volatility
      const baseGrowth = growthRate / 100;
      const volatilityRange = volatility * 2; // ±volatility%
      const randomFactor = (Math.random() - 0.5) * volatilityRange;
      const yearGrowth = baseGrowth + randomFactor;
      
      currentPrice = currentPrice * (1 + yearGrowth);
      prices.push(Math.round(currentPrice));
    }
    
    return prices;
  };

  // Calculate perpetual loan strategy
  const calculatePerpetualLoanStrategy = () => {
    const btc = parseFloat(startingBTC) || 0;
    const startPrice = parseFloat(bitcoinPrice) || 0;
    const years = parseInt(strategyParams.projectionYears) || 20;
    
    if (btc <= 0 || startPrice <= 0) {
      alert('Please enter valid Bitcoin amount and price');
      return;
    }

    const prices = generateBitcoinPrices(
      startPrice, 
      years, 
      strategyParams.annualGrowthRate, 
      strategyParams.volatilityFactor
    );

    const loanProjection = [];
    let currentBTC = btc;
    let totalOutstandingDebt = 0;
    let totalInterestPaid = 0;
    let totalExpensesCovered = 0;
    let currentHouseValue = livingParams.houseValue;
    let currentAnnualExpenses = livingParams.annualExpenses;
    let liquidationYear = null;

    for (let year = 0; year <= years; year++) {
      const currentPrice = prices[year];
      const currentValue = currentBTC * currentPrice;
      
      // Update expenses and house value
      if (year > 0) {
        currentAnnualExpenses *= (1 + livingParams.costOfLivingIncrease / 100);
        currentHouseValue *= (1 + livingParams.houseAppreciation / 100);
      }

      // Calculate current LTV
      const currentLTV = currentValue > 0 ? (totalOutstandingDebt / currentValue) * 100 : 0;

      // Calculate this year's expenses to be covered by loan
      const expensesToCover = currentAnnualExpenses * (perpetualParams.expenseCoveragePercent / 100);
      let newLoanAmount = 0;
      let loanPaydown = 0;
      let annualInterest = 0;

      if (year > 0) {
        // Calculate interest on existing debt
        annualInterest = totalOutstandingDebt * (strategyParams.interestRate / 100);
        totalInterestPaid += annualInterest;
        totalOutstandingDebt += annualInterest; // Add interest to debt

        // Determine if we should take new loan or pay down debt
        if (currentLTV < perpetualParams.targetLtvMin) {
          // LTV is low - can take new loan for expenses
          newLoanAmount = Math.min(
            expensesToCover,
            (currentValue * (perpetualParams.targetLtvMax / 100)) - totalOutstandingDebt
          );
          
          if (newLoanAmount > 0) {
            totalOutstandingDebt += newLoanAmount;
            totalExpensesCovered += newLoanAmount;
          }
        } else if (currentLTV > perpetualParams.paydownTriggerLtv) {
          // LTV is too high - pay down debt instead of taking new loan
          const targetDebt = currentValue * (perpetualParams.targetLtvMin / 100);
          loanPaydown = Math.max(0, totalOutstandingDebt - targetDebt);
          
          // Can only pay down what we have in BTC appreciation
          const availableForPaydown = currentValue * 0.1; // Max 10% of portfolio value
          loanPaydown = Math.min(loanPaydown, availableForPaydown);
          
          totalOutstandingDebt = Math.max(0, totalOutstandingDebt - loanPaydown);
          
          // Reduce BTC holdings to pay down loan
          const btcUsedForPaydown = loanPaydown / currentPrice;
          currentBTC = Math.max(0, currentBTC - btcUsedForPaydown);
        }

        // Check for liquidation risk
        if (currentLTV > 75 && !liquidationYear) {
          liquidationYear = year;
        }
      }

      // Calculate metrics
      const stackHouseRatio = currentValue / currentHouseValue;
      const stackExpensesRatio = currentValue / currentAnnualExpenses;
      const debtServiceRatio = totalOutstandingDebt > 0 ? (annualInterest / (currentValue * 0.2)) : 0;
      const availableCreditLine = Math.max(0, (currentValue * (perpetualParams.targetLtvMax / 100)) - totalOutstandingDebt);

      loanProjection.push({
        year,
        price: currentPrice,
        btcHoldings: currentBTC,
        value: currentValue,
        expenses: currentAnnualExpenses,
        houseValue: currentHouseValue,
        stackHouseRatio: stackHouseRatio,
        stackExpensesRatio: stackExpensesRatio,
        newLoanAmount,
        loanPaydown,
        totalOutstandingDebt,
        currentLTV,
        annualInterest,
        debtServiceRatio,
        availableCreditLine,
        expensesCovered: year === 0 ? 0 : (newLoanAmount > 0 ? newLoanAmount : 0),
        sustainabilityScore: currentLTV < 30 ? 'Excellent' : currentLTV < 50 ? 'Good' : currentLTV < 70 ? 'Risky' : 'Danger'
      });
    }

    setLoanData(loanProjection);
    
    // Set summary results
    setResults({
      finalBTC: currentBTC.toFixed(8),
      finalValue: (currentBTC * prices[years]).toFixed(2),
      totalDebt: totalOutstandingDebt.toFixed(2),
      totalInterestPaid: totalInterestPaid.toFixed(2),
      totalExpensesCovered: totalExpensesCovered.toFixed(2),
      finalLTV: loanProjection[years].currentLTV.toFixed(1),
      liquidationYear: liquidationYear,
      yearsOfSustainability: liquidationYear ? liquidationYear : years,
      averageLTV: (loanProjection.slice(1).reduce((sum, year) => sum + year.currentLTV, 0) / years).toFixed(1)
    });
  };

  // Calculate year-by-year projections
  const calculateRetirementProjection = () => {
    const btc = parseFloat(startingBTC) || 0;
    const startPrice = parseFloat(bitcoinPrice) || 0;
    const years = parseInt(strategyParams.projectionYears) || 20;
    
    if (btc <= 0 || startPrice <= 0) {
      alert('Please enter valid Bitcoin amount and price');
      return;
    }

    const prices = generateBitcoinPrices(
      startPrice, 
      years, 
      strategyParams.annualGrowthRate, 
      strategyParams.volatilityFactor
    );

    const yearlyProjection = [];
    const ratioProjection = [];
    let currentBTC = btc;
    let totalDebt = 0;
    let totalInterestPaid = 0;
    let totalCashOut = 0;
    let totalAdditionalBTC = 0;
    let currentHouseValue = livingParams.houseValue;
    let currentAnnualExpenses = livingParams.annualExpenses;

    for (let year = 0; year <= years; year++) {
      const currentPrice = prices[year];
      const currentValue = currentBTC * currentPrice;
      
      // Update living expenses and house value for this year
      if (year > 0) {
        currentAnnualExpenses *= (1 + livingParams.costOfLivingIncrease / 100);
        currentHouseValue *= (1 + livingParams.houseAppreciation / 100);
      }
      
      const monthlyExpenses = currentAnnualExpenses / 12;
      const btcMonthlyExpenses = monthlyExpenses / currentPrice;
      const btcAnnualExpenses = currentAnnualExpenses / currentPrice;
      
      // Calculate year-over-year changes
      let gainPercent = 0;
      let gainDollars = 0;
      
      if (year > 0) {
        const prevValue = yearlyProjection[year - 1].value;
        gainDollars = currentValue - prevValue;
        gainPercent = prevValue > 0 ? (gainDollars / prevValue) * 100 : 0;
      }

      // Calculate leverage and debt
      let targetLTV = strategyParams.ltvTarget;
      let maxLTV = strategyParams.maxLtv;
      
      // Adjust LTV based on market conditions
      if (gainPercent > 50) {
        targetLTV = Math.min(targetLTV + 5, maxLTV); // Increase leverage in bull markets
      } else if (gainPercent < -20) {
        targetLTV = Math.max(targetLTV - 10, 5); // Reduce leverage in bear markets
      }

      const targetDebt = currentValue * (targetLTV / 100);
      const debtChange = targetDebt - totalDebt;
      
      // Calculate interest on existing debt
      const annualInterest = totalDebt * (strategyParams.interestRate / 100);
      totalInterestPaid += annualInterest;
      
      // Update debt
      if (debtChange > 0) {
        totalDebt += debtChange;
      } else if (debtChange < 0) {
        totalDebt = Math.max(0, totalDebt + debtChange);
      }

      // Calculate cash flow
      let freeCashFlow = 0;
      let cashOutAmount = 0;
      let additionalBTCAmount = 0;

      if (year > 0) {
        // Cash out percentage of gains
        if (strategyParams.cashOutPercentage > 0 && gainDollars > 0) {
          cashOutAmount = gainDollars * (strategyParams.cashOutPercentage / 100);
          totalCashOut += cashOutAmount;
        }

        // Purchase additional BTC
        if (strategyParams.additionalBTC > 0) {
          additionalBTCAmount = strategyParams.additionalBTC * currentPrice;
          currentBTC += strategyParams.additionalBTC;
          totalAdditionalBTC += strategyParams.additionalBTC;
        }

        // Calculate free cash flow
        freeCashFlow = gainDollars - annualInterest - cashOutAmount - additionalBTCAmount;
      }

      // Calculate net worth and key ratios
      const netWorth = currentValue - totalDebt;
      const stackHouseRatio = (currentValue / currentHouseValue) * 100;
      const stackExpensesRatio = currentValue / currentAnnualExpenses;
      const liquidationPrice = totalDebt > 0 ? (totalDebt / currentBTC) * 1.25 : 0; // 25% safety margin
      
      yearlyProjection.push({
        year: year,
        calendarYear: 2024 + year,
        value: Math.round(currentValue),
        gainPercent: Math.round(gainPercent * 100) / 100,
        gainDollars: Math.round(gainDollars),
        ltv: Math.round((totalDebt / currentValue) * 100 * 100) / 100,
        debt: Math.round(totalDebt),
        interest: Math.round(annualInterest),
        fcf: Math.round(freeCashFlow),
        netWorth: Math.round(netWorth),
        btcPrice: Math.round(currentPrice),
        btcAmount: Math.round(currentBTC * 1000000) / 1000000,
        cashOut: Math.round(cashOutAmount),
        additionalBTC: Math.round(additionalBTCAmount),
        // New metrics from spreadsheets
        houseValue: Math.round(currentHouseValue),
        annualExpenses: Math.round(currentAnnualExpenses),
        monthlyExpenses: Math.round(monthlyExpenses),
        btcMonthlyExpenses: Math.round(btcMonthlyExpenses * 100000000) / 100000000,
        stackHouseRatio: Math.round(stackHouseRatio * 100) / 100,
        stackExpensesRatio: Math.round(stackExpensesRatio * 100) / 100,
        liquidationPrice: Math.round(liquidationPrice)
      });
      
      // Store ratio data for additional charts
      ratioProjection.push({
        year: 2024 + year,
        stackHouseRatio: stackHouseRatio,
        stackExpensesRatio: stackExpensesRatio,
        ltv: (totalDebt / currentValue) * 100,
        liquidationPrice: liquidationPrice,
        currentPrice: currentPrice
      });
    }

    // Calculate totals and LTV scenarios
    const finalValue = yearlyProjection[yearlyProjection.length - 1].value;
    const totalGain = finalValue - yearlyProjection[0].value;
    const finalNetWorth = yearlyProjection[yearlyProjection.length - 1].netWorth;
    const finalBTCPrice = prices[prices.length - 1];
    
    // Calculate 50% LTV scenarios at different collateral percentages (like spreadsheet)
    const ltvScenarios = [5, 10, 15, 20].map(collateralPercent => {
      const collateralValue = finalValue * (collateralPercent / 100);
      const loanAmount = collateralValue * 0.5; // 50% LTV
      return {
        collateralPercent,
        collateralValue: Math.round(collateralValue),
        loanAmount: Math.round(loanAmount),
        annualInterest: Math.round(loanAmount * (strategyParams.interestRate / 100))
      };
    });

    setResults({
      startingValue: yearlyProjection[0].value,
      finalValue: finalValue,
      totalGain: totalGain,
      totalGainPercent: ((totalGain / yearlyProjection[0].value) * 100),
      finalNetWorth: finalNetWorth,
      totalDebt: totalDebt,
      totalInterestPaid: totalInterestPaid,
      totalCashOut: totalCashOut,
      totalAdditionalBTC: totalAdditionalBTC,
      finalBTC: currentBTC,
      finalBTCPrice: finalBTCPrice,
      ltvScenarios: ltvScenarios
    });

    setYearlyData(yearlyProjection);
    setRatioData(ratioProjection);
    generateChartData(yearlyProjection);
  };

  // Generate chart data
  const generateChartData = (yearlyProjection) => {
    const chartData = yearlyProjection.map(year => ({
      year: year.calendarYear,
      value: year.value,
      netWorth: year.netWorth,
      debt: year.debt,
      btcPrice: year.btcPrice / 1000, // Show in thousands
      gainPercent: year.gainPercent
    }));
    
    setChartData(chartData);
  };

  // Update strategy parameters
  const updateStrategyParam = (field, value) => {
    setStrategyParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update living parameters
  const updateLivingParam = (field, value) => {
    setLivingParams(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-calculate annual expenses if monthly changes
      if (field === 'monthlyExpenses') {
        updated.annualExpenses = parseFloat(value) * 12;
      }
      return updated;
    });
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
      
      {/* Strategy Mode Selection */}
      <div className="strategy-mode-section">
        <h3 className="section-title">Retirement Strategy</h3>
        <div className="strategy-toggle">
          <button 
            className={`strategy-btn ${strategyMode === 'traditional' ? 'active' : ''}`}
            onClick={() => setStrategyMode('traditional')}
          >
            Traditional Strategy
          </button>
          <button 
            className={`strategy-btn ${strategyMode === 'perpetual' ? 'active' : ''}`}
            onClick={() => setStrategyMode('perpetual')}
          >
            Perpetual Loan Strategy
          </button>
        </div>
        <p className="strategy-description">
          {strategyMode === 'traditional' 
            ? "Hold and potentially sell Bitcoin over time for retirement expenses."
            : "Use Bitcoin as collateral for loans to cover living expenses, keeping your Bitcoin intact."
          }
        </p>
      </div>
      
      <div className="calculator-form">
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

        <div className="strategy-section">
          <h3 className="scenarios-title">Strategy Parameters</h3>
          <div className="strategy-grid">
            <div className="strategy-item">
              <label>Projection Years</label>
              <input
                type="number"
                className="strategy-input"
                value={strategyParams.projectionYears}
                onChange={(e) => updateStrategyParam('projectionYears', e.target.value)}
                min="5"
                max="50"
              />
            </div>
            
            <div className="strategy-item">
              <label>Annual Growth Rate (%)</label>
              <input
                type="number"
                className="strategy-input"
                value={strategyParams.annualGrowthRate}
                onChange={(e) => updateStrategyParam('annualGrowthRate', e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="strategy-item">
              <label>Volatility Factor</label>
              <input
                type="number"
                className="strategy-input"
                value={strategyParams.volatilityFactor}
                onChange={(e) => updateStrategyParam('volatilityFactor', e.target.value)}
                min="0"
                max="1"
                step="0.1"
              />
            </div>
            
            <div className="strategy-item">
              <label>Target LTV (%)</label>
              <input
                type="number"
                className="strategy-input"
                value={strategyParams.ltvTarget}
                onChange={(e) => updateStrategyParam('ltvTarget', e.target.value)}
                min="0"
                max="50"
                step="0.1"
              />
            </div>
            
            <div className="strategy-item">
              <label>Max LTV (%)</label>
              <input
                type="number"
                className="strategy-input"
                value={strategyParams.maxLtv}
                onChange={(e) => updateStrategyParam('maxLtv', e.target.value)}
                min="0"
                max="50"
                step="0.1"
              />
            </div>
            
            <div className="strategy-item">
              <label>Interest Rate (%)</label>
              <input
                type="number"
                className="strategy-input"
                value={strategyParams.interestRate}
                onChange={(e) => updateStrategyParam('interestRate', e.target.value)}
                min="0"
                max="20"
                step="0.1"
              />
            </div>
            
            <div className="strategy-item">
              <label>Cash Out % of Gains</label>
              <input
                type="number"
                className="strategy-input"
                value={strategyParams.cashOutPercentage}
                onChange={(e) => updateStrategyParam('cashOutPercentage', e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="strategy-item">
              <label>Additional BTC/Year</label>
              <input
                type="number"
                className="strategy-input"
                value={strategyParams.additionalBTC}
                onChange={(e) => updateStrategyParam('additionalBTC', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="strategy-section">
          <h3 className="scenarios-title">Living Expenses & House</h3>
          <div className="strategy-grid">
            <div className="strategy-item">
              <label>Monthly Expenses ($)</label>
              <input
                type="number"
                className="strategy-input"
                value={livingParams.monthlyExpenses}
                onChange={(e) => updateLivingParam('monthlyExpenses', e.target.value)}
                min="0"
                step="100"
              />
            </div>
            
            <div className="strategy-item">
              <label>Annual Expenses ($)</label>
              <input
                type="number"
                className="strategy-input"
                value={livingParams.annualExpenses}
                onChange={(e) => updateLivingParam('annualExpenses', e.target.value)}
                min="0"
                step="1000"
                readOnly
                style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}
              />
            </div>
            
            <div className="strategy-item">
              <label>Cost of Living Increase (%/year)</label>
              <input
                type="number"
                className="strategy-input"
                value={livingParams.costOfLivingIncrease}
                onChange={(e) => updateLivingParam('costOfLivingIncrease', e.target.value)}
                min="0"
                max="20"
                step="0.1"
              />
            </div>
            
            <div className="strategy-item">
              <label>House Value ($)</label>
              <input
                type="number"
                className="strategy-input"
                value={livingParams.houseValue}
                onChange={(e) => updateLivingParam('houseValue', e.target.value)}
                min="0"
                step="10000"
              />
            </div>
            
            <div className="strategy-item">
              <label>House Appreciation (%/year)</label>
              <input
                type="number"
                className="strategy-input"
                value={livingParams.houseAppreciation}
                onChange={(e) => updateLivingParam('houseAppreciation', e.target.value)}
                min="0"
                max="20"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Perpetual Loan Parameters - Only show when perpetual mode is selected */}
        {strategyMode === 'perpetual' && (
          <div className="strategy-section">
            <h3 className="scenarios-title">Perpetual Loan Parameters</h3>
            <div className="strategy-grid">
              <div className="strategy-item">
                <label>Expense Coverage by Loans (%)</label>
                <input
                  type="number"
                  className="strategy-input"
                  value={perpetualParams.expenseCoveragePercent}
                  onChange={(e) => setPerpetualParams(prev => ({ ...prev, expenseCoveragePercent: parseInt(e.target.value) }))}
                  min="0"
                  max="100"
                  step="5"
                />
              </div>
              
              <div className="strategy-item">
                <label>Target LTV Range Min (%)</label>
                <input
                  type="number"
                  className="strategy-input"
                  value={perpetualParams.targetLtvMin}
                  onChange={(e) => setPerpetualParams(prev => ({ ...prev, targetLtvMin: parseInt(e.target.value) }))}
                  min="5"
                  max="40"
                  step="1"
                />
              </div>
              
              <div className="strategy-item">
                <label>Target LTV Range Max (%)</label>
                <input
                  type="number"
                  className="strategy-input"
                  value={perpetualParams.targetLtvMax}
                  onChange={(e) => setPerpetualParams(prev => ({ ...prev, targetLtvMax: parseInt(e.target.value) }))}
                  min="10"
                  max="60"
                  step="1"
                />
              </div>
              
              <div className="strategy-item">
                <label>Emergency Buffer (Months)</label>
                <input
                  type="number"
                  className="strategy-input"
                  value={perpetualParams.emergencyBufferMonths}
                  onChange={(e) => setPerpetualParams(prev => ({ ...prev, emergencyBufferMonths: parseInt(e.target.value) }))}
                  min="3"
                  max="24"
                  step="1"
                />
              </div>
              
              <div className="strategy-item">
                <label>Paydown Trigger LTV (%)</label>
                <input
                  type="number"
                  className="strategy-input"
                  value={perpetualParams.paydownTriggerLtv}
                  onChange={(e) => setPerpetualParams(prev => ({ ...prev, paydownTriggerLtv: parseInt(e.target.value) }))}
                  min="25"
                  max="70"
                  step="1"
                />
              </div>
              
              <div className="strategy-item">
                <label>Stress Test Drawdown (%)</label>
                <input
                  type="number"
                  className="strategy-input"
                  value={perpetualParams.stressTestDrawdown}
                  onChange={(e) => setPerpetualParams(prev => ({ ...prev, stressTestDrawdown: parseInt(e.target.value) }))}
                  min="-90"
                  max="-10"
                  step="5"
                />
              </div>
            </div>
          </div>
        )}

        <button 
          className="calculate-button"
          onClick={strategyMode === 'perpetual' ? calculatePerpetualLoanStrategy : calculateRetirementProjection}
        >
          {strategyMode === 'perpetual' ? 'Simulate Loan Strategy' : 'Calculate Retirement Projection'}
        </button>
      </div>

      {results && (
        <div className="results-container">
          <h3 className="results-title">
            {strategyMode === 'perpetual' ? 'Perpetual Loan Strategy Results' : 'Retirement Projection Results'}
          </h3>
          
          {strategyMode === 'perpetual' ? (
            <div className="results-grid">
              <div className="result-item">
                <div className="result-label">Final BTC Holdings</div>
                <div className="result-value highlight">{results.finalBTC} BTC</div>
              </div>
              <div className="result-item">
                <div className="result-label">Final Portfolio Value</div>
                <div className="result-value">${formatNumber(results.finalValue)}</div>
              </div>
              <div className="result-item">
                <div className="result-label">Total Outstanding Debt</div>
                <div className="result-value">${formatNumber(results.totalDebt)}</div>
              </div>
              <div className="result-item">
                <div className="result-label">Final LTV Ratio</div>
                <div className={`result-value ${parseFloat(results.finalLTV) < 30 ? 'safe' : parseFloat(results.finalLTV) < 50 ? 'warning' : 'danger'}`}>
                  {results.finalLTV}%
                </div>
              </div>
              <div className="result-item">
                <div className="result-label">Total Interest Paid</div>
                <div className="result-value">${formatNumber(results.totalInterestPaid)}</div>
              </div>
              <div className="result-item">
                <div className="result-label">Total Expenses Covered</div>
                <div className="result-value highlight">${formatNumber(results.totalExpensesCovered)}</div>
              </div>
              <div className="result-item">
                <div className="result-label">Average LTV</div>
                <div className="result-value">{results.averageLTV}%</div>
              </div>
              <div className="result-item">
                <div className="result-label">Years of Sustainability</div>
                <div className={`result-value ${results.liquidationYear ? 'danger' : 'safe'}`}>
                  {results.liquidationYear ? `${results.yearsOfSustainability} (Risk)` : `${results.yearsOfSustainability}+ (Sustainable)`}
                </div>
              </div>
            </div>
          ) : (
            <div className="results-grid">
              <div className="result-item">
                <div className="result-label">Starting Value</div>
                <div className="result-value">${formatNumber(results.startingValue)}</div>
              </div>
              <div className="result-item">
                <div className="result-label">Final Value</div>
                <div className="result-value highlight">${formatNumber(results.finalValue)}</div>
              </div>
              <div className="result-item">
                <div className="result-label">Total Gain</div>
                <div className="result-value">${formatNumber(results.totalGain)}</div>
              </div>
              <div className="result-item">
                <div className="result-label">Total Gain %</div>
                <div className="result-value">{formatPercent(results.totalGainPercent)}%</div>
              </div>
              <div className="result-item">
                <div className="result-label">Final Net Worth</div>
                <div className="result-value">${formatNumber(results.finalNetWorth)}</div>
              </div>
              <div className="result-item">
                <div className="result-label">Final BTC Amount</div>
                <div className="result-value">{results.finalBTC.toFixed(4)} BTC</div>
              </div>
              <div className="result-item">
                <div className="result-label">Final BTC Price</div>
                <div className="result-value">${formatNumber(results.finalBTCPrice)}</div>
              </div>
              <div className="result-item">
                <div className="result-label">Total Interest Paid</div>
                <div className="result-value">${formatNumber(results.totalInterestPaid)}</div>
              </div>
              <div className="result-item">
                <div className="result-label">Total Cash Out</div>
                <div className="result-value">${formatNumber(results.totalCashOut)}</div>
              </div>
              <div className="result-item">
                <div className="result-label">Additional BTC Purchased</div>
                <div className="result-value">{results.totalAdditionalBTC.toFixed(4)} BTC</div>
              </div>
            </div>
          )}
          
          {results.ltvScenarios && (
            <div className="ltv-scenarios-section">
              <h4 className="scenarios-title">50% LTV Loan Scenarios (Final Year)</h4>
              <div className="scenarios-grid">
                {results.ltvScenarios.map((scenario, index) => (
                  <div key={index} className="scenario-card">
                    <div className="scenario-header">
                      <strong>{scenario.collateralPercent}% Collateral</strong>
                    </div>
                    <div className="scenario-details">
                      <div className="scenario-row">
                        <span>Collateral Value:</span>
                        <span>${formatNumber(scenario.collateralValue)}</span>
                      </div>
                      <div className="scenario-row">
                        <span>Loan Amount:</span>
                        <span>${formatNumber(scenario.loanAmount)}</span>
                      </div>
                      <div className="scenario-row">
                        <span>Annual Interest:</span>
                        <span>${formatNumber(scenario.annualInterest)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {yearlyData.length > 0 && (
        <div className="yearly-table-container">
          <h3 className="chart-title">Year-by-Year Projection</h3>
          <div className="yearly-table-wrapper">
            <table className="yearly-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Value</th>
                  <th>Gain %</th>
                  <th>Gain $</th>
                  <th>LTV %</th>
                  <th>Debt</th>
                  <th>Interest</th>
                  <th>FCF</th>
                  <th>Net Worth</th>
                  <th>BTC Price</th>
                  <th>House Value</th>
                  <th>Stack/House</th>
                  <th>Annual Expenses</th>
                  <th>Stack/Expenses</th>
                  <th>Liquidation Price</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.map((year, index) => (
                  <tr key={index} className={year.gainPercent < 0 ? 'negative-gain' : ''}>
                    <td>{year.calendarYear}</td>
                    <td>${formatNumber(year.value)}</td>
                    <td className={year.gainPercent < 0 ? 'negative' : 'positive'}>
                      {formatPercent(year.gainPercent)}%
                    </td>
                    <td className={year.gainDollars < 0 ? 'negative' : 'positive'}>
                      ${formatNumber(year.gainDollars)}
                    </td>
                    <td>{formatPercent(year.ltv)}%</td>
                    <td>${formatNumber(year.debt)}</td>
                    <td>${formatNumber(year.interest)}</td>
                    <td className={year.fcf < 0 ? 'negative' : 'positive'}>
                      ${formatNumber(year.fcf)}
                    </td>
                    <td>${formatNumber(year.netWorth)}</td>
                    <td>${formatNumber(year.btcPrice)}</td>
                    <td>${formatNumber(year.houseValue || 0)}</td>
                    <td className={year.stackHouseRatio > 200 ? 'positive' : year.stackHouseRatio > 100 ? 'neutral' : 'negative'}>
                      {formatPercent(year.stackHouseRatio || 0)}%
                    </td>
                    <td>${formatNumber(year.annualExpenses || 0)}</td>
                    <td className={year.stackExpensesRatio > 25 ? 'positive' : year.stackExpensesRatio > 10 ? 'neutral' : 'negative'}>
                      {formatPercent(year.stackExpensesRatio || 0)}x
                    </td>
                    <td className={year.liquidationPrice > year.btcPrice * 0.8 ? 'danger' : year.liquidationPrice > year.btcPrice * 0.5 ? 'warning' : 'safe'}>
                      ${formatNumber(year.liquidationPrice || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="chart-container">
          <h3 className="chart-title">Wealth Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="year" 
                stroke="#EAEAEA"
                label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="#EAEAEA"
                label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#EAEAEA'
                }}
                formatter={(value, name) => [
                  name === 'btcPrice' ? `$${formatNumber(value * 1000)}` : `$${formatNumber(value)}`, 
                  name === 'btcPrice' ? 'BTC Price' : name === 'netWorth' ? 'Net Worth' : name === 'debt' ? 'Debt' : 'Total Value'
                ]}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#007BFF" 
                fill="#007BFF"
                fillOpacity={0.3}
                name="Total Value"
              />
              <Area 
                type="monotone" 
                dataKey="netWorth" 
                stroke="#28a745" 
                fill="#28a745"
                fillOpacity={0.3}
                name="Net Worth"
              />
              <Line 
                type="monotone" 
                dataKey="debt" 
                stroke="#dc3545" 
                strokeWidth={2}
                name="Debt"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {ratioData.length > 0 && (
        <div className="chart-container">
          <h3 className="chart-title">Key Ratios & Risk Metrics</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={ratioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="year" 
                stroke="#EAEAEA"
                label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#EAEAEA"
                label={{ value: 'Ratio/LTV (%)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#EAEAEA"
                label={{ value: 'Price ($)', angle: 90, position: 'insideRight' }}
                tickFormatter={(value) => `$${formatNumber(value)}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#EAEAEA'
                }}
                formatter={(value, name) => {
                  if (name.includes('Price')) return [`$${formatNumber(value)}`, name];
                  if (name.includes('Ratio')) return [`${value.toFixed(1)}%`, name];
                  if (name === 'Stack/Expenses Ratio') return [`${value.toFixed(1)}x`, name];
                  return [`${value.toFixed(1)}%`, name];
                }}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="stackHouseRatio" 
                stroke="#28a745" 
                strokeWidth={2}
                name="Stack/House Ratio"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="stackExpensesRatio" 
                stroke="#17a2b8" 
                strokeWidth={2}
                name="Stack/Expenses Ratio"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="ltv" 
                stroke="#ffc107" 
                strokeWidth={2}
                name="LTV %"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="liquidationPrice" 
                stroke="#dc3545" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Liquidation Price"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="currentPrice" 
                stroke="#007BFF" 
                strokeWidth={3}
                name="BTC Price"
              />
              <ReferenceLine yAxisId="left" y={25} stroke="#dc3545" strokeDasharray="3 3" label="Max LTV" />
              <ReferenceLine yAxisId="left" y={100} stroke="#28a745" strokeDasharray="3 3" label="Stack=House" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RetirementCalculator;

