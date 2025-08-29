import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();

  // Navigation handlers
  const navigateToCalculator = (path) => {
    navigate(path);
  };

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📊' },
    { id: 'interest', title: 'Interest Calculator', icon: '📈' },
    { id: 'ltv', title: 'LTV Calculator', icon: '🏦' },
    { id: 'retirement', title: 'Retirement Calculator', icon: '🏖️' },
    { id: 'glossary', title: 'Glossary', icon: '📚' },
    { id: 'faq', title: 'FAQ', icon: '❓' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="guide-content">
            <h2>Welcome to Bitcoin Wealth Builder</h2>
            <p>
              Bitcoin Wealth Builder is a comprehensive financial planning tool designed to help you 
              project and plan your Bitcoin-based wealth strategy. Our three calculators work together 
              to provide you with detailed insights into different aspects of Bitcoin wealth management.
            </p>
            
            <div className="calculator-overview-grid">
              <div className="overview-card clickable-card" onClick={() => navigateToCalculator('/')}>
                <div className="card-icon">📈</div>
                <h3>Interest Calculator</h3>
                <p>
                  Project the future growth of your Bitcoin investment using compound interest. 
                  Perfect for understanding how regular investments (DCA) and time can build wealth.
                </p>
                <ul>
                  <li>Track existing Bitcoin holdings + new investments</li>
                  <li>Cost basis tracking with ROI calculations</li>
                  <li>Interactive charts with multiple viewing modes</li>
                  <li>Key metrics: CAGR, Total Return, Years to Double</li>
                </ul>
                <div className="card-action">
                  <span className="action-text">Click to open calculator →</span>
                </div>
              </div>
              
              <div className="overview-card clickable-card" onClick={() => navigateToCalculator('/ltv')}>
                <div className="card-icon">🏦</div>
                <h3>LTV Calculator</h3>
                <p>
                  Understand the risks and opportunities of borrowing against your Bitcoin. 
                  Calculate safe loan amounts and monitor liquidation risks.
                </p>
                <ul>
                  <li>Visual LTV Risk Gauge with color-coded zones</li>
                  <li>Bitcoin Price Impact Analysis charts</li>
                  <li>Liquidation price scenarios at different LTV ratios</li>
                  <li>Interactive charts with safety margin indicators</li>
                </ul>
                <div className="card-action">
                  <span className="action-text">Click to open calculator →</span>
                </div>
              </div>
              
              <div className="overview-card clickable-card" onClick={() => navigateToCalculator('/retirement')}>
                <div className="card-icon">🏖️</div>
                <h3>Retirement Calculator</h3>
                <p>
                  Plan your Bitcoin retirement strategy with advanced metrics like Stack/House ratios, 
                  living expenses, and multiple loan scenarios.
                </p>
                <ul>
                  <li>Choose between Traditional and Perpetual Loan strategies</li>
                  <li>Track Stack/House and Stack/Expenses ratios</li>
                  <li>Model living expenses and inflation</li>
                  <li>Simulate perpetual loan cycles for sustainable retirement</li>
                </ul>
                <div className="card-action">
                  <span className="action-text">Click to open calculator →</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'interest':
        return (
          <div className="guide-content">
            <h2>📈 Interest Calculator Guide</h2>
            
            <div className="guide-section">
              <h3>What It Does</h3>
              <p>
                The Interest Calculator projects how your Bitcoin investment could grow over time using 
                compound interest principles. It's perfect for existing Bitcoin holders who want to see 
                how their current stack plus continued DCA (Dollar Cost Averaging) investments will grow. 
                The calculator tracks both your existing Bitcoin appreciation and new Bitcoin accumulation.
              </p>
            </div>

            <div className="guide-section">
              <h3>Key Parameters</h3>
              <div className="parameter-grid">
                <div className="parameter-item">
                  <strong>Current Bitcoin Holdings (BTC):</strong>
                  <p>Enter how much Bitcoin you currently own (e.g., 0.5 BTC). This is your existing stack that will appreciate over time.</p>
                </div>
                <div className="parameter-item">
                  <strong>Current Bitcoin Price ($):</strong>
                  <p>Auto-fetched from CoinGecko or manually entered. Used to calculate your initial investment value. Click 'Refresh' for latest price.</p>
                </div>
                <div className="parameter-item">
                  <strong>Calculated Initial Investment:</strong>
                  <p>Auto-calculated from your Bitcoin holdings × current price. This represents the current dollar value of your existing Bitcoin.</p>
                </div>
                <div className="parameter-item">
                  <strong>Monthly Addition ($):</strong>
                  <p>Regular monthly investments (Dollar Cost Averaging). This buys more Bitcoin each month, regardless of price fluctuations.</p>
                </div>
                <div className="parameter-item">
                  <strong>Time in Years:</strong>
                  <p>Investment timeline. Bitcoin's 4-year cycles make longer periods (8+ years) more predictable for combined hodling + DCA strategies.</p>
                </div>
                <div className="parameter-item">
                  <strong>Growth Scenario:</strong>
                  <p>Quick-select preset combinations of growth rate and volatility, or choose Custom for manual control. Scenarios automatically set both Expected Growth Rate and Volatility Factor.</p>
                </div>
                <div className="parameter-item">
                  <strong>Expected Bitcoin Annual Growth Rate:</strong>
                  <p>Expected annual return for Bitcoin price appreciation. Can be set automatically by scenario selection or manually in Custom mode. Use conservative estimates (20-50%) for realistic planning.</p>
                </div>
                <div className="parameter-item">
                  <strong>Projection Mode:</strong>
                  <p>Choose between "Smooth Growth" (traditional compound interest) or "Realistic Volatility" (simulates Bitcoin's real-world price fluctuations year-to-year).</p>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Growth Scenarios</h3>
              <p>
                Growth Scenarios provide quick-select preset combinations of growth rates and volatility that represent 
                different Bitcoin investment philosophies. Choose a scenario to automatically set both your expected 
                growth rate and volatility factor, or select Custom for full manual control.
              </p>
              
              <div className="scenario-explanation-grid">
                <div className="scenario-explanation">
                  <h4 style={{color: '#28a745', marginBottom: '0.5rem'}}>Conservative</h4>
                  <p><strong>Growth:</strong> 20% annually</p>
                  <p><strong>Volatility:</strong> 40%</p>
                  <p style={{fontSize: '0.8rem', marginTop: '0.5rem'}}>Lower expectations with reduced risk</p>
                </div>
                <div className="scenario-explanation">
                  <h4 style={{color: '#007BFF', marginBottom: '0.5rem'}}>Moderate</h4>
                  <p><strong>Growth:</strong> 45% annually</p>
                  <p><strong>Volatility:</strong> 70%</p>
                  <p style={{fontSize: '0.8rem', marginTop: '0.5rem'}}>Balanced Bitcoin performance expectations</p>
                </div>
                <div className="scenario-explanation">
                  <h4 style={{color: '#FF8C00', marginBottom: '0.5rem'}}>Optimistic</h4>
                  <p><strong>Growth:</strong> 70% annually</p>
                  <p><strong>Volatility:</strong> 90%</p>
                  <p style={{fontSize: '0.8rem', marginTop: '0.5rem'}}>High growth with maximum volatility</p>
                </div>
                <div className="scenario-explanation">
                  <h4 style={{color: '#FFC107', marginBottom: '0.5rem'}}>Custom</h4>
                  <p><strong>Growth:</strong> Your choice</p>
                  <p><strong>Volatility:</strong> Your choice</p>
                  <p style={{fontSize: '0.8rem', marginTop: '0.5rem'}}>Full manual control over parameters</p>
                </div>
              </div>

              <div className="guide-section">
                <h4>How to Use Growth Scenarios</h4>
                <div className="step-by-step-guide">
                  <div className="step">
                    <h4>Step 1: Choose Your Scenario</h4>
                    <ul>
                      <li><strong>New to Bitcoin:</strong> Start with Conservative (20% growth) for safer projections</li>
                      <li><strong>Experienced Holder:</strong> Use Moderate (45% growth) for balanced expectations</li>
                      <li><strong>Bitcoin Maximalist:</strong> Try Optimistic (70% growth) for bullish projections</li>
                      <li><strong>Specific Requirements:</strong> Select Custom to set your own exact values</li>
                    </ul>
                  </div>
                  
                  <div className="step">
                    <h4>Step 2: Understand Preset Behavior</h4>
                    <ul>
                      <li>When you select Conservative, Moderate, or Optimistic, the growth rate and volatility inputs become <strong>read-only</strong></li>
                      <li>Values are automatically set based on the scenario's predefined parameters</li>
                      <li>To change values, you must switch to Custom mode</li>
                    </ul>
                  </div>
                  
                  <div className="step">
                    <h4>Step 3: Custom Mode Details</h4>
                    <ul>
                      <li>Select "Custom" to unlock manual editing of growth rate and volatility</li>
                      <li>A warning message appears: "⚠️ You are in Custom Mode - set your own parameters below"</li>
                      <li>All input fields become editable for precise control</li>
                      <li>Perfect for testing specific scenarios or matching historical data</li>
                    </ul>
                  </div>
                </div>
                
                <div className="tip-item success">
                  <strong>💡 Pro Tip:</strong> Start with a preset scenario close to your expectations, then switch to Custom mode to fine-tune the values if needed.
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Projection Modes</h3>
              <div className="strategy-comparison-grid">
                <div className="strategy-comparison-card">
                  <h4>Smooth Growth Mode</h4>
                  <p>Uses traditional compound interest calculations with your Expected Annual Growth Rate applied consistently each year.</p>
                  <div className="pros">
                    <strong>✓ Pros:</strong>
                    <ul>
                      <li>Clean mathematical projection</li>
                      <li>Easy to understand and plan with</li>
                      <li>Shows average long-term trajectory</li>
                      <li>Perfect for conservative financial planning</li>
                    </ul>
                  </div>
                  <div className="ideal-for">
                    <strong>Best for:</strong> Traditional financial planning and average long-term projections
                  </div>
                </div>
                <div className="strategy-comparison-card">
                  <h4>Realistic Volatility Mode</h4>
                  <p>Simulates Bitcoin's actual volatility with year-to-year price fluctuations around your expected average growth rate.</p>
                  <div className="pros">
                    <strong>✓ Pros:</strong>
                    <ul>
                      <li>More realistic Bitcoin-like growth patterns</li>
                      <li>Shows potential ups and downs</li>
                      <li>Helps with psychological preparation</li>
                      <li>Demonstrates volatility around long-term trend</li>
                    </ul>
                  </div>
                  <div className="ideal-for">
                    <strong>Best for:</strong> Understanding Bitcoin's volatile nature while maintaining long-term growth expectations
                  </div>
                </div>
              </div>
              
              <div className="guide-section">
                <h4>Volatility Controls</h4>
                <p>When using Realistic Volatility mode, volatility settings can be preset by Growth Scenarios or customized manually:</p>
                <div className="parameter-grid">
                  <div className="parameter-item">
                    <strong>Volatility Factor (0-100%):</strong>
                    <p>Controls how much yearly returns can vary. Automatically set by Growth Scenarios (Conservative: 40%, Moderate: 70%, Optimistic: 90%) or manually adjustable in Custom mode. Higher values create more dramatic year-to-year swings.</p>
                  </div>
                  <div className="parameter-item">
                    <strong>Scenario Integration:</strong>
                    <p>When using preset scenarios, volatility is automatically configured. Switch to Custom mode to manually adjust volatility settings for your specific needs.</p>
                  </div>
                </div>
                <div className="tip-item warning">
                  <strong>⚠️ Important:</strong> Volatility mode shows ONE possible path. Bitcoin's actual performance will be different, but the long-term average should approach your Expected Annual Growth Rate.
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Cost Basis Tracking</h3>
              <p>
                For existing Bitcoin holders, the calculator includes an optional Cost Basis section to track your investment performance:
              </p>
              <div className="feature-list">
                <div className="parameter-item">
                  <strong>Average Purchase Price:</strong>
                  <p>Enter your average Bitcoin purchase price to calculate total cost basis and current ROI.</p>
                </div>
                <div className="parameter-item">
                  <strong>Total Cost Basis:</strong>
                  <p>Auto-calculated as: Current BTC Holdings × Average Purchase Price</p>
                </div>
                <div className="parameter-item">
                  <strong>Current ROI:</strong>
                  <p>Shows your return on investment percentage based on current Bitcoin price vs your average purchase price.</p>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Interactive Charts & Visualizations</h3>
              <p>
                The Interest Calculator provides multiple chart views and key metrics to help visualize your Bitcoin growth:
              </p>
              <div className="feature-list">
                <div className="parameter-item">
                  <strong>Key Metrics Display:</strong>
                  <p>Shows Total Return %, CAGR (Compound Annual Growth Rate), Final Multiple, and estimated Years to Double your investment.</p>
                </div>
                <div className="parameter-item">
                  <strong>Chart View Toggle:</strong>
                  <p>Switch between Portfolio Value (stacked area chart), Bitcoin Holdings (BTC focus), and Combined View (all metrics).</p>
                </div>
                <div className="parameter-item">
                  <strong>Interactive Legend:</strong>
                  <p>Click legend items to show/hide specific data lines. Hover tooltips provide detailed information for each data point.</p>
                </div>
                <div className="parameter-item">
                  <strong>Enhanced Tooltips:</strong>
                  <p>Hover over chart points to see formatted values, Bitcoin holdings, and year-over-year changes.</p>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Example Scenarios</h3>
              
              <div className="example-box">
                <h4>Existing Bitcoin Holder + DCA Strategy</h4>
                <ul>
                  <li><strong>Current Bitcoin Holdings:</strong> 0.25 BTC</li>
                  <li><strong>Bitcoin Price:</strong> $60,000</li>
                  <li><strong>Initial Investment Value:</strong> $15,000 (auto-calculated)</li>
                  <li><strong>Monthly Addition:</strong> $500 (DCA strategy)</li>
                  <li><strong>Time Period:</strong> 8 years</li>
                  <li><strong>Growth Rate:</strong> 30% (moderate for Bitcoin)</li>
                </ul>
                <p><strong>Result:</strong> Your 0.25 BTC grows to ~2.5 BTC through appreciation, plus you accumulate ~1.2 BTC through DCA, totaling ~3.7 BTC worth potentially $800,000+ after 8 years.</p>
              </div>

              <div className="example-box">
                <h4>Pure DCA Strategy (No Existing Bitcoin)</h4>
                <ul>
                  <li><strong>Current Bitcoin Holdings:</strong> 0 BTC</li>
                  <li><strong>Initial Investment:</strong> $0</li>
                  <li><strong>Monthly Addition:</strong> $500 (DCA strategy)</li>
                  <li><strong>Time Period:</strong> 10 years</li>
                  <li><strong>Growth Rate:</strong> 25% (conservative for Bitcoin)</li>
                </ul>
                <p><strong>Result:</strong> This pure DCA strategy accumulates ~1.5 BTC and turns $60,000 in contributions into potentially $400,000+ through consistent investing.</p>
              </div>
            </div>

            <div className="guide-section">
              <h3>How to Use</h3>
              <ol>
                <li><strong>Enter Your Bitcoin Holdings:</strong> Input how much Bitcoin you currently own (leave as 0 if starting fresh)</li>
                <li><strong>Set Bitcoin Price:</strong> Click 'Refresh' for current price or enter a custom value for future scenarios</li>
                <li><strong>Review Calculated Investment:</strong> Your initial investment value is auto-calculated from BTC × Price</li>
                <li><strong>Set Monthly DCA Amount:</strong> Choose a realistic monthly investment you can sustain long-term</li>
                <li><strong>Choose Time Horizon:</strong> Longer periods (8+ years) show the power of combining hodling + DCA</li>
                <li><strong>Use Conservative Rates:</strong> Enter realistic annual appreciation rates (20-50%) for sustainable planning</li>
                <li><strong>Analyze Results:</strong> Review both dollar growth and Bitcoin accumulation metrics</li>
                <li><strong>Study the Chart:</strong> Dual-axis shows both dollar value growth and Bitcoin accumulation over time</li>
              </ol>
            </div>

            <div className="guide-section">
              <h3>Understanding the Results</h3>
              <div className="parameter-grid">
                <div className="parameter-item">
                  <strong>Starting Bitcoin vs Final Bitcoin:</strong>
                  <p>Shows how your existing Bitcoin stack grows through appreciation, plus new Bitcoin accumulated through DCA.</p>
                </div>
                <div className="parameter-item">
                  <strong>Bitcoin Accumulated (DCA):</strong>
                  <p>The additional Bitcoin you purchased through monthly investments. This demonstrates the power of consistent buying.</p>
                </div>
                <div className="parameter-item">
                  <strong>Average BTC Purchase Price:</strong>
                  <p>Your average cost basis for DCA purchases. Compare this to future Bitcoin price to see your DCA success.</p>
                </div>
                <div className="parameter-item">
                  <strong>Chart Analysis:</strong>
                  <p>Left axis shows dollar values, right axis shows Bitcoin amounts. Orange lines represent Bitcoin-specific metrics.</p>
                </div>
              </div>
            </div>
            
            <div className="guide-section">
              <h3>Tips for Success</h3>
              <div className="tip-grid">
                <div className="tip-item success">
                  <strong>✅ Bitcoin Holders Should:</strong>
                  <p>Track both appreciation of existing stack AND accumulation of new Bitcoin, use current Bitcoin price for realistic starting point, maintain consistent DCA regardless of price</p>
                </div>
                <div className="tip-item success">
                  <strong>✅ DCA Strategy:</strong>
                  <p>Focus on Bitcoin accumulation over short-term price movements, use conservative growth estimates (20-50%), plan for 8+ year time horizons</p>
                </div>
                <div className="tip-item warning">
                  <strong>⚠️ Avoid:</strong>
                  <p>Using unrealistic growth rates (>100%), timing the market instead of consistent DCA, ignoring the power of existing Bitcoin appreciation</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ltv':
        return (
          <div className="guide-content">
            <h2>🏦 LTV Calculator Guide</h2>
            
            <div className="guide-section">
              <h3>What Is LTV?</h3>
              <p>
                <strong>Loan-to-Value (LTV)</strong> is the ratio of your loan amount to the value of your Bitcoin collateral. 
                It's the key metric for understanding borrowing risk when taking loans against your Bitcoin.
              </p>
              <div className="formula-box">
                <strong>LTV = (Loan Amount ÷ Collateral Value) × 100%</strong>
              </div>
            </div>

            <div className="guide-section">
              <h3>Risk Levels</h3>
              <div className="risk-grid">
                <div className="risk-item safe">
                  <strong>Low Risk (0-30% LTV)</strong>
                  <p>Very safe borrowing zone. Your Bitcoin would need to drop 70%+ before liquidation risk.</p>
                </div>
                <div className="risk-item moderate">
                  <strong>Moderate Risk (30-50% LTV)</strong>
                  <p>Reasonable borrowing level. Bitcoin would need to drop 50%+ for liquidation concerns.</p>
                </div>
                <div className="risk-item high">
                  <strong>High Risk (50%+ LTV)</strong>
                  <p>Dangerous territory. A 50% Bitcoin price drop could trigger liquidation.</p>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Key Outputs Explained</h3>
              <div className="parameter-grid">
                <div className="parameter-item">
                  <strong>LTV Ratio:</strong>
                  <p>Your current risk level, color-coded: Green (safe), Yellow (caution), Red (danger)</p>
                </div>
                <div className="parameter-item">
                  <strong>Liquidation Price:</strong>
                  <p>The Bitcoin price at which your loan becomes at risk. Always maintain significant buffer above this price.</p>
                </div>
                <div className="parameter-item">
                  <strong>Total Collateral Value:</strong>
                  <p>Current value of your Bitcoin collateral in fiat currency.</p>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Visual Risk Analysis</h3>
              <p>
                The LTV Calculator provides three powerful charts to help you understand and manage borrowing risk:
              </p>
              <div className="feature-list">
                <div className="parameter-item">
                  <strong>LTV Risk Gauge:</strong>
                  <p>Visual horizontal gauge showing your current LTV position within color-coded safety zones (Green: 0-40%, Yellow: 40-60%, Red: 60%+).</p>
                </div>
                <div className="parameter-item">
                  <strong>Bitcoin Price Impact Analysis:</strong>
                  <p>Line chart showing how Bitcoin price changes (-50% to +50%) affect your LTV ratio, with reference lines for caution and danger thresholds.</p>
                </div>
                <div className="parameter-item">
                  <strong>Liquidation Prices Chart:</strong>
                  <p>Bar chart displaying liquidation prices at different LTV ratios (25%, 40%, 50%, 60%, 75%, 90%) with current Bitcoin price as reference line.</p>
                </div>
                <div className="parameter-item">
                  <strong>Interactive Features:</strong>
                  <p>All charts include hover tooltips, formatted values, and reference lines to help identify safe borrowing levels and danger zones.</p>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Example Scenario</h3>
              <div className="example-box">
                <h4>Safe Borrowing Example</h4>
                <ul>
                  <li><strong>Bitcoin Holdings:</strong> 2 BTC</li>
                  <li><strong>Bitcoin Price:</strong> $60,000</li>
                  <li><strong>Collateral Value:</strong> $120,000</li>
                  <li><strong>Loan Amount:</strong> $30,000</li>
                  <li><strong>LTV Ratio:</strong> 25% (Safe - Green)</li>
                  <li><strong>Liquidation Price:</strong> ~$15,000 (75% drop needed)</li>
                </ul>
                <p><strong>Analysis:</strong> This is a very safe loan structure with huge downside protection.</p>
              </div>
            </div>

            <div className="guide-section">
              <h3>Best Practices</h3>
              <div className="tip-grid">
                <div className="tip-item success">
                  <strong>✅ Safe Strategy:</strong>
                  <p>Keep LTV below 30%, monitor liquidation price regularly, have repayment plan ready</p>
                </div>
                <div className="tip-item warning">
                  <strong>⚠️ Danger Signs:</strong>
                  <p>LTV above 50%, liquidation price close to current price, no emergency fund for repayment</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'retirement':
        return (
          <div className="guide-content">
            <h2>🏖️ Retirement Calculator Guide</h2>
            
            <div className="guide-section">
              <h3>Advanced Bitcoin Retirement Planning</h3>
              <p>
                The Retirement Calculator is our most sophisticated tool, combining Bitcoin growth projections 
                with real-world expenses, debt management, and wealth ratios to create a comprehensive 
                retirement strategy.
              </p>
            </div>

            <div className="guide-section">
              <h3>🎯 Strategy Modes</h3>
              <p>
                The Retirement Calculator offers two distinct approaches to Bitcoin retirement planning. 
                Choose the strategy that best matches your risk tolerance and retirement goals.
              </p>
              
              <div className="strategy-comparison">
                <div className="strategy-comparison-grid">
                  <div className="strategy-comparison-card traditional">
                    <h4>📈 Traditional Strategy</h4>
                    <p><strong>Concept:</strong> Hold Bitcoin and potentially sell portions over time for retirement expenses.</p>
                    <div className="strategy-pros-cons">
                      <div className="pros">
                        <strong>✅ Pros:</strong>
                        <ul>
                          <li>Simple and straightforward</li>
                          <li>No debt risk or liquidation concerns</li>
                          <li>Full control over your Bitcoin</li>
                          <li>Tax advantages from long-term holding</li>
                        </ul>
                      </div>
                      <div className="cons">
                        <strong>❌ Cons:</strong>
                        <ul>
                          <li>Reduces Bitcoin holdings over time</li>
                          <li>May miss future appreciation</li>
                          <li>Timing the market is difficult</li>
                          <li>Taxable events when selling</li>
                        </ul>
                      </div>
                    </div>
                    <div className="ideal-for">
                      <strong>💡 Ideal For:</strong>
                      <p>Conservative investors, those approaching retirement soon, or anyone wanting simple strategies without debt complexity.</p>
                    </div>
                  </div>
                  
                  <div className="strategy-comparison-card perpetual">
                    <h4>🔄 Perpetual Loan Strategy</h4>
                    <p><strong>Concept:</strong> Use Bitcoin as collateral for loans to cover living expenses, preserving your Bitcoin holdings.</p>
                    <div className="strategy-pros-cons">
                      <div className="pros">
                        <strong>✅ Pros:</strong>
                        <ul>
                          <li>Preserves Bitcoin holdings</li>
                          <li>No taxable events from selling</li>
                          <li>Benefits from full Bitcoin appreciation</li>
                          <li>Can be perpetually sustainable</li>
                        </ul>
                      </div>
                      <div className="cons">
                        <strong>❌ Cons:</strong>
                        <ul>
                          <li>Liquidation risk if Bitcoin crashes</li>
                          <li>Interest payments reduce returns</li>
                          <li>Complex debt management required</li>
                          <li>Requires discipline and monitoring</li>
                        </ul>
                      </div>
                    </div>
                    <div className="ideal-for">
                      <strong>💡 Ideal For:</strong>
                      <p>Bitcoin maximalists, young retirees with long time horizons, sophisticated investors comfortable with managed debt risk.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>📋 Traditional Strategy - Step by Step</h3>
              <div className="step-by-step-guide">
                <div className="step">
                  <h4>Step 1: Basic Setup</h4>
                  <ul>
                    <li>Select "Traditional Strategy" mode</li>
                    <li>Enter your current Bitcoin holdings (e.g., 2.5 BTC)</li>
                    <li>Set current Bitcoin price (or use refresh button)</li>
                    <li>Choose projection timeline (10-30 years recommended)</li>
                  </ul>
                </div>
                
                <div className="step">
                  <h4>Step 2: Configure Strategy Parameters</h4>
                  <ul>
                    <li><strong>Annual Growth Rate:</strong> Conservative: 15-25%, Moderate: 25-35%, Aggressive: 35%+</li>
                    <li><strong>Volatility Factor:</strong> 0.2-0.4 (higher = more year-to-year variation)</li>
                    <li><strong>Target LTV:</strong> 10-20% (if planning any borrowing)</li>
                    <li><strong>Cash Out Percentage:</strong> 0-5% of gains per year for expenses</li>
                    <li><strong>Additional BTC:</strong> Continuing DCA amount per year</li>
                  </ul>
                </div>
                
                <div className="step">
                  <h4>Step 3: Living Expenses Planning</h4>
                  <ul>
                    <li><strong>Monthly Expenses:</strong> Your current monthly living costs</li>
                    <li><strong>Cost of Living Increase:</strong> 3-7% annually (inflation + lifestyle)</li>
                    <li><strong>House Value:</strong> Current home value for Stack/House ratio</li>
                    <li><strong>House Appreciation:</strong> 3-6% annually</li>
                  </ul>
                </div>

                <div className="example-scenario">
                  <h4>💡 Example: Traditional Strategy</h4>
                  <div className="scenario-details">
                    <p><strong>Setup:</strong></p>
                    <ul>
                      <li>Starting Bitcoin: 1.5 BTC ($90,000 at $60,000/BTC)</li>
                      <li>Projection: 20 years</li>
                      <li>Growth Rate: 20% annually</li>
                      <li>Monthly Expenses: $8,000 ($96,000 annually)</li>
                      <li>Cash Out: 2% of gains yearly for expenses</li>
                    </ul>
                    <p><strong>Expected Outcome:</strong></p>
                    <ul>
                      <li>After 20 years: ~0.8 BTC remaining (sold ~0.7 BTC for expenses)</li>
                      <li>Stack/Expenses Ratio: Still 15-25x (very comfortable)</li>
                      <li>Total expenses covered: ~$3-4 million over 20 years</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>🔄 Perpetual Loan Strategy - Step by Step</h3>
              <div className="step-by-step-guide">
                <div className="step">
                  <h4>Step 1: Basic Setup</h4>
                  <ul>
                    <li>Select "Perpetual Loan Strategy" mode</li>
                    <li>Enter your Bitcoin holdings (minimum 1+ BTC recommended)</li>
                    <li>Set current Bitcoin price</li>
                    <li>Choose timeline (20+ years for full analysis)</li>
                  </ul>
                </div>
                
                <div className="step">
                  <h4>Step 2: Strategy Parameters (Same as Traditional)</h4>
                  <ul>
                    <li><strong>Growth Rate:</strong> Be conservative (15-25%) for safety</li>
                    <li><strong>Interest Rate:</strong> Expected loan rate (6-12%)</li>
                    <li><strong>Living Expenses:</strong> Accurate monthly/annual costs</li>
                  </ul>
                </div>
                
                <div className="step">
                  <h4>Step 3: Perpetual Loan Parameters (Critical Settings)</h4>
                  <ul>
                    <li><strong>Expense Coverage by Loans:</strong> 75-100% (how much of expenses to cover via debt)</li>
                    <li><strong>Target LTV Range Min:</strong> 15-25% (when to take new loans)</li>
                    <li><strong>Target LTV Range Max:</strong> 30-45% (maximum comfortable debt level)</li>
                    <li><strong>Emergency Buffer:</strong> 6-12 months of expenses in reserve</li>
                    <li><strong>Paydown Trigger LTV:</strong> 35-50% (when to aggressively pay down debt)</li>
                    <li><strong>Stress Test Drawdown:</strong> -50% to -80% (Bitcoin crash scenario)</li>
                  </ul>
                </div>

                <div className="step">
                  <h4>Step 4: Interpret Results</h4>
                  <ul>
                    <li><strong>Years of Sustainability:</strong> Should be 20+ years, ideally "Sustainable"</li>
                    <li><strong>Average LTV:</strong> Should stay below 40% for safety</li>
                    <li><strong>Total Expenses Covered:</strong> How much you can live off loans</li>
                    <li><strong>Final BTC Holdings:</strong> Should be close to starting amount</li>
                  </ul>
                </div>

                <div className="example-scenario">
                  <h4>💡 Example: Perpetual Loan Strategy</h4>
                  <div className="scenario-details">
                    <p><strong>Setup:</strong></p>
                    <ul>
                      <li>Starting Bitcoin: 3.0 BTC ($180,000 at $60,000/BTC)</li>
                      <li>Annual Expenses: $120,000</li>
                      <li>Expense Coverage: 100% (cover all expenses via loans)</li>
                      <li>LTV Range: 20-40%</li>
                      <li>Bitcoin Growth: 20% annually</li>
                      <li>Loan Interest: 8%</li>
                    </ul>
                    <p><strong>How It Works Year by Year:</strong></p>
                    <ul>
                      <li><strong>Year 1:</strong> Take $120k loan (67% LTV → too high, reduce)</li>
                      <li><strong>Year 2:</strong> Bitcoin grows to $216k, LTV drops to 56%, take new loan</li>
                      <li><strong>Year 5:</strong> Bitcoin worth $450k, pay down debt, maintain 25-35% LTV</li>
                      <li><strong>Year 10:</strong> Bitcoin worth $1.1M, easily sustainable at 20% LTV</li>
                    </ul>
                    <p><strong>Expected Outcome:</strong></p>
                    <ul>
                      <li>After 20 years: Still own ~2.8-3.0 BTC (minimal Bitcoin sold)</li>
                      <li>Total debt: $300-500k (manageable vs $5M+ Bitcoin value)</li>
                      <li>Living expenses covered: $2.4M over 20 years via loans</li>
                      <li>Result: Lived comfortably while preserving Bitcoin stack</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>⚠️ Risk Management & Warnings</h3>
              <div className="warning-grid">
                <div className="warning-item critical">
                  <strong>🚨 Critical Warnings for Perpetual Loan Strategy:</strong>
                  <ul>
                    <li>Only use with 2+ BTC minimum (smaller amounts too risky)</li>
                    <li>Never exceed 50% LTV - liquidation risk becomes severe</li>
                    <li>Have emergency fund outside of Bitcoin for loan payments</li>
                    <li>Monitor Bitcoin price and LTV ratio weekly during retirement</li>
                    <li>Be prepared to pay down debt aggressively during bear markets</li>
                  </ul>
                </div>
                
                <div className="warning-item moderate">
                  <strong>⚠️ When NOT to Use Perpetual Loan Strategy:</strong>
                  <ul>
                    <li>Less than 2 BTC holdings</li>
                    <li>Risk-averse personality</li>
                    <li>Unable to monitor and manage debt actively</li>
                    <li>Expecting to need large lump sums (medical, emergencies)</li>
                    <li>Unstable income or high expense variability</li>
                  </ul>
                </div>
                
                <div className="warning-item success">
                  <strong>✅ Signs Your Strategy is Working:</strong>
                  <ul>
                    <li>LTV stays consistently below 40%</li>
                    <li>Bitcoin holdings remain stable or growing</li>
                    <li>Debt payments covered by Bitcoin appreciation</li>
                    <li>Stack/Expenses ratio improving over time</li>
                    <li>No stress during 20-30% Bitcoin corrections</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Key Metrics Explained</h3>
              
              <div className="metric-explanation">
                <h4>📊 Stack/House Ratio</h4>
                <p>
                  Compares your Bitcoin value to house value. This ratio helps you understand your wealth 
                  in familiar terms - "How many houses could I buy with my Bitcoin?"
                </p>
                <ul>
                  <li><strong>100%:</strong> Your Bitcoin equals your house value</li>
                  <li><strong>200%:</strong> You could buy 2 houses with your Bitcoin</li>
                  <li><strong>500%:</strong> Your Bitcoin is worth 5 houses - significant wealth</li>
                </ul>
              </div>

              <div className="metric-explanation">
                <h4>💰 Stack/Expenses Ratio</h4>
                <p>
                  Shows how many years of living expenses your Bitcoin covers. This is crucial for 
                  retirement planning and financial independence.
                </p>
                <ul>
                  <li><strong>10x:</strong> 10 years of expenses covered</li>
                  <li><strong>25x:</strong> Traditional "safe withdrawal rate" threshold</li>
                  <li><strong>50x+:</strong> Very comfortable retirement position</li>
                </ul>
              </div>

              <div className="metric-explanation">
                <h4>⚠️ Liquidation Price</h4>
                <p>
                  The Bitcoin price at which your loans become risky (with 25% safety buffer). 
                  This helps you monitor debt safety throughout your retirement plan.
                </p>
              </div>
            </div>

            <div className="guide-section">
              <h3>LTV Scenarios Explained</h3>
              <p>
                The calculator shows four loan scenarios (5%, 10%, 15%, 20% of your Bitcoin as collateral) 
                to help you understand different borrowing strategies:
              </p>
              <div className="scenario-explanation-grid">
                <div className="scenario-explanation">
                  <strong>5% Collateral:</strong> Ultra-conservative borrowing
                </div>
                <div className="scenario-explanation">
                  <strong>10% Collateral:</strong> Conservative borrowing for major expenses
                </div>
                <div className="scenario-explanation">
                  <strong>15% Collateral:</strong> Moderate borrowing for investments
                </div>
                <div className="scenario-explanation">
                  <strong>20% Collateral:</strong> Aggressive borrowing strategy
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>How to Use the Calculator</h3>
              <ol>
                <li><strong>Set Your Bitcoin Holdings:</strong> Enter your current or target Bitcoin amount</li>
                <li><strong>Configure Growth Parameters:</strong> Use realistic annual growth rates (20-50%)</li>
                <li><strong>Input Living Expenses:</strong> Your monthly/annual spending with inflation adjustments</li>
                <li><strong>Set House Value:</strong> For Stack/House ratio calculations and wealth benchmarking</li>
                <li><strong>Configure Loan Strategy:</strong> Set target LTV ratios and interest rates</li>
                <li><strong>Analyze Results:</strong> Focus on Stack/Expenses ratio and risk indicators</li>
              </ol>
            </div>

            <div className="guide-section">
              <h3>Reading the Results</h3>
              <div className="results-guide-grid">
                <div className="result-guide-item">
                  <h4>📊 Charts</h4>
                  <ul>
                    <li>Wealth Growth: Shows total value vs. net worth over time</li>
                    <li>Ratios & Risk: Tracks key metrics and safety levels</li>
                  </ul>
                </div>
                <div className="result-guide-item">
                  <h4>📋 Table</h4>
                  <ul>
                    <li>Color coding: Green (safe), Yellow (caution), Red (danger)</li>
                    <li>Key columns: Stack/House, Stack/Expenses, Liquidation Price</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'glossary':
        return (
          <div className="guide-content">
            <h2>📚 Glossary</h2>
            
            <div className="glossary-grid">
              <div className="glossary-item">
                <strong>Annual Interest Rate</strong>
                <p>The expected yearly return on your Bitcoin investment, expressed as a percentage.</p>
              </div>
              
              <div className="glossary-item">
                <strong>Compound Interest</strong>
                <p>Earning returns on both your original investment and previously earned returns, creating exponential growth.</p>
              </div>
              
              <div className="glossary-item">
                <strong>DCA (Dollar Cost Averaging)</strong>
                <p>Investing a fixed amount regularly regardless of price, reducing impact of volatility.</p>
              </div>
              
              <div className="glossary-item">
                <strong>FCF (Free Cash Flow)</strong>
                <p>Net cash generated after all expenses and debt payments, available for spending or reinvestment.</p>
              </div>
              
              <div className="glossary-item">
                <strong>Liquidation Price</strong>
                <p>The Bitcoin price at which your loan collateral would be insufficient, triggering potential liquidation.</p>
              </div>
              
              <div className="glossary-item">
                <strong>LTV (Loan-to-Value)</strong>
                <p>The ratio of loan amount to collateral value, expressed as a percentage. Higher LTV = higher risk.</p>
              </div>
              
              <div className="glossary-item">
                <strong>Stack</strong>
                <p>Bitcoin community term for your total Bitcoin holdings.</p>
              </div>
              
              <div className="glossary-item">
                <strong>Stack/Expenses Ratio</strong>
                <p>How many years of living expenses your Bitcoin covers. Key metric for financial independence.</p>
              </div>
              
              <div className="glossary-item">
                <strong>Stack/House Ratio</strong>
                <p>Your Bitcoin value compared to house value, expressed as a percentage. Useful wealth benchmark.</p>
              </div>
              
              <div className="glossary-item">
                <strong>Volatility Factor</strong>
                <p>Measure of price variation. Higher volatility = more unpredictable year-to-year returns.</p>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="guide-content">
            <h2>❓ Frequently Asked Questions</h2>
            
            <div className="faq-grid">
              <div className="faq-item">
                <h3>What annual return rate should I use for Bitcoin?</h3>
                <p>
                  Bitcoin's historical average is very high (100%+), but for realistic planning, use 20-50%. 
                  Conservative estimates help you build sustainable financial plans and avoid over-optimism.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>What's a safe LTV ratio for Bitcoin loans?</h3>
                <p>
                  Most experts recommend staying below 30% LTV. This provides significant buffer against 
                  Bitcoin's volatility. Never exceed 50% LTV unless you have strong repayment capabilities.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>Should I enter my existing Bitcoin holdings in the Interest Calculator?</h3>
                <p>
                  Absolutely! The Interest Calculator now supports existing Bitcoin holders. Enter your current Bitcoin amount 
                  to see how your existing stack appreciates PLUS how much additional Bitcoin you'll accumulate through DCA. 
                  This gives you a complete picture of both hodling gains and accumulation strategies.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>What's the difference between Bitcoin appreciation and accumulation?</h3>
                <p>
                  <strong>Appreciation</strong> is when your existing Bitcoin increases in value (your 1 BTC becomes worth more dollars). 
                  <strong>Accumulation</strong> is buying more Bitcoin over time (going from 1 BTC to 2 BTC through DCA). 
                  The Interest Calculator tracks both - showing how your existing stack grows in value while you simultaneously build a larger Bitcoin position.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>What Stack/Expenses ratio do I need to retire?</h3>
                <p>
                  Traditional finance suggests 25x annual expenses (4% safe withdrawal rate). With Bitcoin's 
                  growth potential, some aim for 10-15x, but higher ratios provide more security and flexibility.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>Should I include my house in wealth calculations?</h3>
                <p>
                  Yes! The Stack/House ratio helps you understand wealth in familiar terms. It's particularly 
                  useful for goal setting ("I want my Bitcoin to be worth 3 houses") and family planning.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>How do I handle Bitcoin's 4-year cycles?</h3>
                <p>
                  Bitcoin historically follows ~4-year patterns around halving events. For long-term planning, 
                  focus on 8+ year timeframes that span multiple cycles for more stable projections. This is 
                  especially important when combining hodling existing Bitcoin with ongoing DCA strategies.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>What if Bitcoin doesn't grow as expected?</h3>
                <p>
                  This is why we recommend conservative estimates. Build your plan assuming modest growth, 
                  then any outperformance is bonus. Always have backup plans and don't risk money you can't afford to lose.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>How often should I review my calculations?</h3>
                <p>
                  Review quarterly or when major life changes occur. Bitcoin prices and your financial situation 
                  change, so regular updates help keep your retirement planning realistic and on track.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>Can I trust these projections for financial decisions?</h3>
                <p>
                  These calculators are educational tools for scenario planning, not financial advice. Always 
                  consult with qualified financial advisors for major decisions and never invest more than you can afford to lose.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="user-guide-container">
      <div className="guide-sidebar">
        <h2 className="guide-title">User Guide</h2>
        <nav className="guide-nav">
          {sections.map(section => (
            <button
              key={section.id}
              className={`guide-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-text">{section.title}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="guide-main">
        {renderSection()}
      </div>
    </div>
  );
};

export default UserGuide;