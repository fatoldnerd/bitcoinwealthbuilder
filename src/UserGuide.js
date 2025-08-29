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
              <div className="overview-card clickable-card" onClick={() => navigateToCalculator('/interest')}>
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
                  Plan your Bitcoin retirement with two distinct strategies: gradually selling Bitcoin 
                  or using it as loan collateral to preserve holdings.
                </p>
                <ul>
                  <li>Dollar-Cost Averaging (DCA) with monthly contributions during accumulation</li>
                  <li>Two-phase modeling: Accumulation → Retirement simulation</li>
                  <li>Choose between "Sell for Income" vs "Borrow for Income" strategies</li>
                  <li>Customizable retirement duration (10-50 years) for personalized planning</li>
                  <li>Simplified scenario presets with conditional custom parameters</li>
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
              <p>
                The LTV Calculator now features a customizable <strong>Liquidation Threshold</strong> (default 85%) 
                that represents the LTV ratio at which your loan becomes at risk of liquidation. This makes the 
                calculator much more realistic compared to the traditional 100% liquidation assumption.
              </p>
            </div>

            <div className="guide-section">
              <h3>Key Parameters</h3>
              <div className="parameter-grid">
                <div className="parameter-item">
                  <strong>Collateral Amount (BTC):</strong>
                  <p>The amount of Bitcoin you're using as collateral for your loan.</p>
                </div>
                <div className="parameter-item">
                  <strong>Current Bitcoin Price ($):</strong>
                  <p>Auto-fetched from CoinGecko or manually entered. Click 'Refresh' for the latest price.</p>
                </div>
                <div className="parameter-item">
                  <strong>Desired Loan Amount ($):</strong>
                  <p>The amount you want to borrow against your Bitcoin collateral.</p>
                </div>
                <div className="parameter-item">
                  <strong>Liquidation Threshold (%):</strong>
                  <p>The LTV ratio at which liquidation occurs (default: 85%). Most real-world lending platforms liquidate between 80-90% LTV, making this much more realistic than the old 100% assumption.</p>
                </div>
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
                  <p>The Bitcoin price at which your loan reaches your custom liquidation threshold (e.g., 85% LTV). This is much more realistic than assuming 100% LTV liquidation. Always maintain significant buffer above this price.</p>
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
                The LTV Calculator provides powerful visualizations to help you understand and manage borrowing risk:
              </p>
              <div className="feature-list">
                <div className="parameter-item">
                  <strong>LTV Risk Gauge:</strong>
                  <p>Visual horizontal gauge showing your current LTV position within color-coded safety zones (Green: 0-40%, Yellow: 40-60%, Red: 60%+).</p>
                </div>
                <div className="parameter-item">
                  <strong>Bitcoin Price Impact Analysis:</strong>
                  <p>Enhanced line chart showing how Bitcoin price changes (-50% to +50%) affect your LTV ratio. Features a <strong>Critical Price Alert</strong> that displays the exact Bitcoin price where your LTV will hit the danger threshold (60%), along with special highlighting for danger intersection points.</p>
                </div>
                <div className="parameter-item">
                  <strong>Margin Call & Liquidation Table:</strong>
                  <p>Actionable risk table showing key LTV milestones (70%, 80%, and your custom liquidation threshold) with the Bitcoin price that triggers each level and the exact dollar amount of collateral you'd need to add to restore your original LTV ratio.</p>
                </div>
                <div className="parameter-item">
                  <strong>Interactive Features:</strong>
                  <p>All charts include hover tooltips, formatted values, and reference lines. The table is color-coded (green/yellow/red) with hover effects and special liquidation badges for easy identification of critical levels.</p>
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
                  <li><strong>Liquidation Threshold:</strong> 85% (realistic lending platform)</li>
                  <li><strong>LTV Ratio:</strong> 25% (Safe - Green)</li>
                  <li><strong>Liquidation Price:</strong> ~$17,647 (liquidation at 85% LTV)</li>
                </ul>
                <p><strong>Analysis:</strong> This is a very safe loan structure. With a realistic 85% liquidation threshold, you still have significant downside protection with Bitcoin needing to drop ~71% before reaching liquidation risk.</p>
              </div>
            </div>

            <div className="guide-section">
              <h3>Understanding the Margin Call Table</h3>
              <p>
                The Margin Call & Liquidation Table provides actionable insights for loan management:
              </p>
              <div className="parameter-grid">
                <div className="parameter-item">
                  <strong>LTV Level Column:</strong>
                  <p>Shows 70%, 80%, and your custom liquidation threshold. Rows are color-coded: green (safe), yellow (warning), red (danger). Liquidation rows include a red "LIQUIDATION" badge.</p>
                </div>
                <div className="parameter-item">
                  <strong>Bitcoin Price Column:</strong>
                  <p>The exact Bitcoin price that would trigger each LTV level. This helps you monitor price levels where you might need to take action.</p>
                </div>
                <div className="parameter-item">
                  <strong>Action Required Column:</strong>
                  <p>The dollar amount of additional collateral you'd need to add to bring your LTV back to your original (safer) level. Shows "No action needed" for safe scenarios or "Add $X,XXX collateral" for risk scenarios.</p>
                </div>
                <div className="parameter-item">
                  <strong>How to Use:</strong>
                  <p>Monitor Bitcoin price against the table values. If Bitcoin approaches a warning price, consider adding collateral or paying down the loan to maintain a safe LTV ratio.</p>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Best Practices</h3>
              <div className="tip-grid">
                <div className="tip-item success">
                  <strong>✅ Safe Strategy:</strong>
                  <p>Keep LTV below 30%, use realistic liquidation thresholds (80-90%), monitor liquidation price regularly, have repayment plan ready</p>
                </div>
                <div className="tip-item success">
                  <strong>✅ Liquidation Threshold Settings:</strong>
                  <p>Use 85% as default (matches most platforms), consider 80% for conservative approach, never assume 100% liquidation - it's unrealistic for real lending</p>
                </div>
                <div className="tip-item warning">
                  <strong>⚠️ Danger Signs:</strong>
                  <p>LTV above 50%, liquidation price close to current price, no emergency fund for repayment, ignoring margin call table warnings</p>
                </div>
                <div className="tip-item warning">
                  <strong>⚠️ Use the Margin Call Table:</strong>
                  <p>Monitor Bitcoin price against warning levels, prepare additional collateral before reaching danger zones, act on "Action Required" recommendations promptly</p>
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
              <h3>Two-Phase Bitcoin Retirement Planning</h3>
              <p>
                The Retirement Calculator uses a simplified, two-phase approach to model your Bitcoin retirement journey. 
                It combines Dollar-Cost Averaging during accumulation with strategy-specific retirement simulations 
                to give you clear insights into your retirement viability.
              </p>
              
              <div className="phase-overview">
                <div className="phase-card">
                  <h4>📈 Phase 1: Accumulation (Working Years)</h4>
                  <p>Models how your Bitcoin portfolio grows from now until retirement, including:</p>
                  <ul>
                    <li>Initial Bitcoin holdings appreciation</li>
                    <li>Monthly Dollar-Cost Averaging contributions (optional)</li>
                    <li>Month-by-month compound growth simulation</li>
                    <li>Target portfolio calculation based on desired retirement income</li>
                  </ul>
                </div>
                
                <div className="phase-card">
                  <h4>🏖️ Phase 2: Retirement (Customizable Duration)</h4>
                  <p>Simulates your chosen strategy over your selected retirement duration (10-50 years):</p>
                  <ul>
                    <li><strong>Sell Strategy:</strong> Shows portfolio depletion as you sell Bitcoin for income</li>
                    <li><strong>Borrow Strategy:</strong> Shows debt accumulation and LTV risk over time</li>
                    <li>Inflation-adjusted expenses year by year</li>
                    <li>Sustainability analysis and risk indicators</li>
                    <li>Adjustable retirement period to match your life expectancy and planning needs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>🎯 Retirement Funding Strategies</h3>
              <p>
                The calculator asks one key question: <strong>"How do you plan to fund your retirement?"</strong> 
                Your answer determines the entire retirement phase simulation and chart visualization.
              </p>
              
              <div className="strategy-comparison">
                <div className="strategy-comparison-grid">
                  <div className="strategy-comparison-card">
                    <h4>🔽 Sell for Income</h4>
                    <p><strong>Concept:</strong> Gradually sell Bitcoin during retirement to fund living expenses.</p>
                    <div className="strategy-pros-cons">
                      <div className="pros">
                        <strong>✅ Pros:</strong>
                        <ul>
                          <li>Simple and straightforward approach</li>
                          <li>No debt risk or liquidation concerns</li>
                          <li>Full control over your Bitcoin holdings</li>
                          <li>Clear depletion timeline for planning</li>
                        </ul>
                      </div>
                      <div className="cons">
                        <strong>❌ Cons:</strong>
                        <ul>
                          <li>Bitcoin holdings decrease over time</li>
                          <li>Misses potential future appreciation</li>
                          <li>Creates taxable events when selling</li>
                          <li>May run out of Bitcoin before death</li>
                        </ul>
                      </div>
                    </div>
                    <div className="ideal-for">
                      <strong>💡 Ideal For:</strong>
                      <p>Conservative investors, those wanting predictable cash flow, or anyone preferring debt-free retirement strategies.</p>
                    </div>
                  </div>
                  
                  <div className="strategy-comparison-card">
                    <h4>💰 Borrow for Income</h4>
                    <p><strong>Concept:</strong> Use Bitcoin as collateral for loans while preserving holdings through "loan rollover" cycles.</p>
                    <div className="strategy-pros-cons">
                      <div className="pros">
                        <strong>✅ Pros:</strong>
                        <ul>
                          <li>Preserves Bitcoin holdings completely</li>
                          <li>No taxable selling events</li>
                          <li>Benefits from continued Bitcoin appreciation</li>
                          <li>Potentially infinite sustainability</li>
                        </ul>
                      </div>
                      <div className="cons">
                        <strong>❌ Cons:</strong>
                        <ul>
                          <li>Liquidation risk if Bitcoin crashes</li>
                          <li>Compound interest on loans increases debt</li>
                          <li>Complex debt management required</li>
                          <li>LTV monitoring and risk management needed</li>
                        </ul>
                      </div>
                    </div>
                    <div className="ideal-for">
                      <strong>💡 Ideal For:</strong>
                      <p>Bitcoin maximalists, long-term believers, sophisticated investors comfortable with managed debt risk.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>📋 Step-by-Step Usage Guide</h3>
              <div className="step-by-step-guide">
                <div className="step">
                  <h4>Step 1: Choose Your Retirement Strategy</h4>
                  <ul>
                    <li>Select <strong>"Sell for Income"</strong> if you plan to gradually sell Bitcoin in retirement</li>
                    <li>Select <strong>"Borrow for Income"</strong> if you want to use Bitcoin as loan collateral</li>
                    <li>This choice affects the entire retirement simulation and chart visualization</li>
                  </ul>
                </div>
                
                <div className="step">
                  <h4>Step 2: Enter Your Current Situation</h4>
                  <ul>
                    <li><strong>Starting Bitcoin Amount:</strong> Your current Bitcoin holdings (e.g., 3.4 BTC)</li>
                    <li><strong>Current Bitcoin Price:</strong> Use the refresh button for live price or enter manually</li>
                    <li><strong>Desired Retirement Income:</strong> Annual income needed in today's dollars</li>
                    <li><strong>Years Until Retirement:</strong> Use the slider to select 5-40 years</li>
                    <li><strong>Retirement Duration:</strong> Use the slider to select 10-50 years (default: 30 years)</li>
                  </ul>
                </div>
                
                <div className="step">
                  <h4>Step 3: Configure Dollar-Cost Averaging (DCA)</h4>
                  <ul>
                    <li><strong>Regular Monthly Contribution:</strong> Dollar amount to invest each month (set to $0 for no DCA)</li>
                    <li>DCA runs month-by-month simulation: growth → purchase Bitcoin → repeat</li>
                    <li>Significantly increases final Bitcoin holdings and retirement portfolio size</li>
                    <li>Example: $1000/month over 20 years can double or triple your final Bitcoin amount</li>
                  </ul>
                </div>
                
                <div className="step">
                  <h4>Step 4: Select Economic Scenario</h4>
                  <ul>
                    <li><strong>Conservative:</strong> 15% Bitcoin growth, 3% inflation, 6% loan rates</li>
                    <li><strong>Moderate:</strong> 25% Bitcoin growth, 4% inflation, 8% loan rates</li>
                    <li><strong>Optimistic:</strong> 35% Bitcoin growth, 3% inflation, 10% loan rates</li>
                    <li><strong>Custom:</strong> Set your own parameters with strategy-specific fields</li>
                  </ul>
                </div>
                
                <div className="step">
                  <h4>Step 5: Interpret Results and Charts</h4>
                  <ul>
                    <li><strong>Results Summary:</strong> Required vs projected portfolio, shortfall/surplus, viability</li>
                    <li><strong>Chart 1 - Accumulation:</strong> Portfolio growth path with target line</li>
                    <li><strong>Chart 2 - Retirement:</strong> Strategy-specific simulation for your chosen duration</li>
                    <li>Look for "Strategy Viability (X years)" and "Years Until Depletion/Risk" warnings</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>📊 Understanding the Two Charts</h3>
              
              <div className="chart-explanation">
                <h4>📈 Chart 1: Accumulation Phase - Path to Retirement</h4>
                <ul>
                  <li>Shows your projected portfolio value from now until retirement</li>
                  <li>Blue line: Your projected portfolio growth (includes DCA if enabled)</li>
                  <li>Green dashed line: Required portfolio target for your desired income</li>
                  <li>Goal: Blue line should meet or exceed the green target line</li>
                </ul>
                
                <h4>🏖️ Chart 2: Retirement Phase - Your Custom Duration Simulation</h4>
                <p>This chart simulates your retirement for the duration you selected (10-50 years).</p>
                
                <p><strong>For "Sell for Income" Strategy:</strong></p>
                <ul>
                  <li>Blue line: Portfolio balance (decreases as you sell Bitcoin)</li>
                  <li>Orange line: BTC holdings amount (decreases over time)</li>
                  <li>Both lines trend downward - this is expected and normal</li>
                  <li>Watch for lines hitting zero before your retirement duration ends</li>
                </ul>
                
                <p><strong>For "Borrow for Income" Strategy:</strong></p>
                <ul>
                  <li>Orange line: BTC holdings (stays flat - preserved!)</li>
                  <li>Red line: Total loan principal (increases over time)</li>
                  <li>Pink line: LTV ratio (key risk indicator on right axis)</li>
                  <li>Red dashed line: 75% LTV danger zone (liquidation risk)</li>
                  <li>Longer durations mean more debt accumulation - watch LTV carefully</li>
                </ul>
              </div>
            </div>

            <div className="guide-section">
              <h3>⏱️ Customizable Retirement Duration</h3>
              <p>
                The calculator now features a <strong>Retirement Duration slider</strong> that allows you to customize how long your retirement period will be. 
                This is crucial for accurate planning based on your life expectancy and personal circumstances.
              </p>
              
              <div className="feature-list">
                <div className="parameter-item">
                  <strong>Range:</strong>
                  <p>10 to 50 years, with a default of 30 years</p>
                </div>
                <div className="parameter-item">
                  <strong>Why It Matters:</strong>
                  <p>Different retirement durations require different portfolio sizes and strategies. A 20-year retirement has very different requirements than a 40-year retirement.</p>
                </div>
                <div className="parameter-item">
                  <strong>Impact on Calculations:</strong>
                  <p>Both "Sell for Income" and "Borrow for Income" strategies adjust their simulations based on your selected duration. Longer durations require more conservative approaches.</p>
                </div>
                <div className="parameter-item">
                  <strong>Choosing Your Duration:</strong>
                  <ul>
                    <li>Early retirement (age 40-50): Consider 40-50 years</li>
                    <li>Standard retirement (age 60-65): Consider 25-35 years</li>
                    <li>Late retirement (age 70+): Consider 15-25 years</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>🚨 Custom Parameters by Strategy</h3>
              <p>When you select "Custom" scenario, the input fields change based on your chosen strategy:</p>
              
              <div className="custom-params-explanation">
                <h4>🔽 Sell for Income - Custom Fields:</h4>
                <ul>
                  <li><strong>Withdrawal Rate:</strong> Percentage of portfolio to withdraw annually (3-5% typical)</li>
                  <li>This determines how much of your Bitcoin you sell each year</li>
                  <li>Lower rates = portfolio lasts longer, higher rates = more income but faster depletion</li>
                </ul>
                
                <h4>💰 Borrow for Income - Custom Fields:</h4>
                <ul>
                  <li><strong>Target Annual LTV:</strong> Desired loan-to-value ratio (15-35% typical)</li>
                  <li>This controls how much debt you take on relative to your Bitcoin value</li>
                  <li>Lower LTV = safer but less income, higher LTV = more income but riskier</li>
                </ul>
              </div>
            </div>

            <div className="guide-section">
              <h3>💡 Example Scenarios</h3>
              
              <div className="example-scenario">
                <h4>🔽 Example: Sell for Income Strategy</h4>
                <div className="scenario-details">
                  <p><strong>Setup:</strong></p>
                  <ul>
                    <li>Starting: 2.0 BTC at $50,000 = $100,000</li>
                    <li>Monthly DCA: $500 for 20 years</li>
                    <li>Retirement Duration: 35 years (age 60 to 95)</li>
                    <li>Desired Income: $80,000/year</li>
                    <li>Scenario: Moderate (25% growth, 4% withdrawal)</li>
                  </ul>
                  <p><strong>Results After DCA:</strong></p>
                  <ul>
                    <li>Total Bitcoin at retirement: ~5.2 BTC</li>
                    <li>Portfolio value: ~$1.6 million</li>
                    <li>Required portfolio: $2 million (4% withdrawal rate)</li>
                    <li>35-year sustainability check shows depletion risk at year 28</li>
                    <li>Solution: Increase DCA or extend accumulation period</li>
                  </ul>
                </div>
              </div>
              
              <div className="example-scenario">
                <h4>💰 Example: Borrow for Income Strategy</h4>
                <div className="scenario-details">
                  <p><strong>Setup:</strong></p>
                  <ul>
                    <li>Starting: 3.0 BTC at $60,000 = $180,000</li>
                    <li>Monthly DCA: $1000 for 15 years</li>
                    <li>Retirement Duration: 40 years (early retirement scenario)</li>
                    <li>Desired Income: $120,000/year</li>
                    <li>Scenario: Moderate (25% growth, 25% target LTV)</li>
                  </ul>
                  <p><strong>Impact of 40-Year Duration:</strong></p>
                  <ul>
                    <li>Longer duration means more total debt accumulation</li>
                    <li>LTV ratio becomes critical after year 25</li>
                    <li>Requires more conservative initial LTV targets</li>
                    <li>Bitcoin growth must consistently outpace loan interest over 40 years</li>
                    <li>Consider reducing annual income or increasing initial BTC holdings</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>⚠️ Important Considerations</h3>
              <div className="warning-grid">
                <div className="warning-item critical">
                  <strong>⚠️ This is a Planning Tool Only</strong>
                  <p>These projections are hypothetical. Bitcoin prices are highly volatile and unpredictable. Past performance does not guarantee future results.</p>
                </div>
                
                <div className="warning-item moderate">
                  <strong>📊 Conservative Assumptions Recommended</strong>
                  <p>Use conservative growth rates and higher safety margins. Better to be pleasantly surprised than financially unprepared.</p>
                </div>
                
                <div className="warning-item success">
                  <strong>🔄 Regular Review Essential</strong>
                  <p>Review and adjust your strategy regularly based on actual Bitcoin performance, life changes, and market conditions.</p>
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