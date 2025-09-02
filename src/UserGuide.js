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
    { id: 'overview', title: 'Getting Started', icon: '🚀' },
    { id: 'calculators', title: 'The Calculators', icon: '📊' },
    { id: 'dashboard', title: 'My Dashboard', icon: '⛏️' },
    { id: 'glossary', title: 'Glossary', icon: '📚' },
    { id: 'faq', title: 'FAQ', icon: '❓' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="guide-content">
            <h2>Welcome to Your Bitcoin Wealth Building Journey!</h2>
            <p>
              Congratulations on taking the first step toward building your financial future with Bitcoin! 
              This guide will walk you through everything you need to know to plan, save, and track your 
              progress toward your financial goals.
            </p>
            
            <div className="guide-section">
              <h3>🎯 Your Journey in Three Simple Steps</h3>
              <div className="step-by-step-guide">
                <div className="step">
                  <h4>Step 1: Plan Your Goal</h4>
                  <p>
                    Start with the <strong>Goal Planner</strong> to create a savings plan for any financial target - 
                    whether it's a house down payment, emergency fund, or dream vacation. For retirement specifically, 
                    use our specialized <strong>Retirement Calculator</strong>.
                  </p>
                </div>
                
                <div className="step">
                  <h4>Step 2: Save Your Plan</h4>
                  <p>
                    After calculating your plan, click the <strong>Start My Plan</strong> button to save it to 
                    your personal dashboard. You can track multiple goals simultaneously!
                  </p>
                </div>
                
                <div className="step">
                  <h4>Step 3: Track Your Progress</h4>
                  <p>
                    Visit <strong>My Dashboard</strong> each month to "mine" your next block by confirming your 
                    contribution. Watch your blockchain grow as you progress toward your goal!
                  </p>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>💡 Quick Start Recommendations</h3>
              <div className="tip-grid">
                <div className="tip-item success">
                  <strong>New Users:</strong>
                  <p>Start with the Goal Planner to create your first savings goal</p>
                </div>
                <div className="tip-item success">
                  <strong>Retirement Planning:</strong>
                  <p>Use the Retirement Calculator for long-term wealth preservation strategies</p>
                </div>
                <div className="tip-item success">
                  <strong>Quick Projections:</strong>
                  <p>Use the Interest Calculator for fast, standalone calculations</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'calculators':
        return (
          <div className="guide-content">
            <h2>The Calculators</h2>
            <p>
              Each calculator serves a specific purpose in your wealth-building journey. Here's when and how to use each one:
            </p>
            
            <div className="guide-section">
              <h3>1. 🎯 The Goal Planner</h3>
              <div className="overview-card">
                <h4>Purpose</h4>
                <p>
                  This is your starting point for any specific savings goal that isn't retirement. Perfect for planning:
                </p>
                <ul>
                  <li>House down payment</li>
                  <li>Emergency fund</li>
                  <li>New car purchase</li>
                  <li>College fund</li>
                  <li>Dream vacation</li>
                  <li>Business investment</li>
                </ul>
                
                <h4>How to Use</h4>
                <ol>
                  <li><strong>Name Your Goal:</strong> Give it a memorable name like "Beach House Fund"</li>
                  <li><strong>Set Your Target:</strong> Enter the dollar amount you want to save</li>
                  <li><strong>Choose Time Horizon:</strong> Use the slider to select how many years you have</li>
                  <li><strong>Enter Starting Capital:</strong> Add any existing savings (optional)</li>
                  <li><strong>Set Monthly Contribution:</strong> How much you'll invest each month</li>
                  <li><strong>Select Growth Scenario:</strong> Conservative, Moderate, or Optimistic</li>
                  <li><strong>Calculate:</strong> See if your plan will reach your target</li>
                  <li><strong>Save to Dashboard:</strong> Click "Start My Plan" to begin tracking</li>
                </ol>
                
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button 
                    className="calculate-button"
                    onClick={() => navigateToCalculator('/goal-planner')}
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    Open Goal Planner →
                  </button>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>2. 🏖️ The Retirement Calculator</h3>
              <div className="overview-card">
                <h4>Purpose</h4>
                <p>
                  A specialized tool designed specifically for the complex, long-term goal of retirement. 
                  Unlike other goals, retirement requires careful consideration of how you'll generate income 
                  for decades without a regular paycheck.
                </p>
                
                <h4>Key Feature: Two Retirement Strategies</h4>
                <div className="strategy-comparison-grid">
                  <div className="strategy-comparison-card">
                    <h4>🔽 "Sell for Income"</h4>
                    <p>Gradually sell portions of your Bitcoin to fund retirement</p>
                    <ul>
                      <li>Simple and straightforward</li>
                      <li>No debt or interest payments</li>
                      <li>Bitcoin holdings decrease over time</li>
                    </ul>
                  </div>
                  <div className="strategy-comparison-card">
                    <h4>💰 "Borrow for Income"</h4>
                    <p>Use Bitcoin as collateral for loans instead of selling</p>
                    <ul>
                      <li>Preserve your Bitcoin holdings</li>
                      <li>Benefit from continued appreciation</li>
                      <li>Requires careful LTV management</li>
                    </ul>
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button 
                    className="calculate-button"
                    onClick={() => navigateToCalculator('/retirement')}
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    Open Retirement Calculator →
                  </button>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>3. 📈 The Interest Calculator</h3>
              <div className="overview-card">
                <h4>Purpose</h4>
                <p>
                  A simple, powerful tool for running quick compound interest projections without creating a formal goal. 
                  Perfect when you want to:
                </p>
                <ul>
                  <li>Explore "what if" scenarios</li>
                  <li>Understand the power of compound growth</li>
                  <li>Calculate potential returns quickly</li>
                  <li>Compare different investment amounts</li>
                </ul>
                
                <h4>Best For</h4>
                <p>
                  Quick calculations that don't need to be saved or tracked. Use this when you're 
                  brainstorming or want to see how different variables affect growth.
                </p>
                
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button 
                    className="calculate-button"
                    onClick={() => navigateToCalculator('/interest')}
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    Open Interest Calculator →
                  </button>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>4. 🏦 The LTV Calculator</h3>
              <div className="overview-card">
                <h4>Purpose</h4>
                <p>
                  Analyzes the risks and opportunities of taking a Bitcoin-backed loan. Essential for understanding:
                </p>
                <ul>
                  <li>Safe borrowing amounts based on your Bitcoin holdings</li>
                  <li>Liquidation risks at different price levels</li>
                  <li>How market volatility affects your loan</li>
                  <li>Margin call scenarios and safety buffers</li>
                </ul>
                
                <h4>When to Use</h4>
                <p>
                  Before taking any Bitcoin-backed loan, or if you're considering the "Borrow for Income" 
                  retirement strategy.
                </p>
                
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button 
                    className="calculate-button"
                    onClick={() => navigateToCalculator('/ltv')}
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    Open LTV Calculator →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="guide-content">
            <h2>⛏️ My Dashboard: Tracking Your Progress</h2>
            <p>
              Your dashboard transforms financial planning from a chore into an engaging journey. 
              Using a Bitcoin mining metaphor, you'll "mine" blocks of progress each month as you work toward your goals.
            </p>
            
            <div className="guide-section">
              <h3>Step 1: Creating and Saving a Plan</h3>
              <div className="step">
                <p>
                  After you've used either the <strong>Goal Planner</strong> or <strong>Retirement Calculator</strong> to 
                  create your perfect plan, you'll see a prominent button:
                </p>
                <div style={{ 
                  textAlign: 'center', 
                  padding: '1rem', 
                  background: 'linear-gradient(135deg, #FF8C00, #FFA500)',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: 'bold',
                  margin: '1rem 0'
                }}>
                  🚀 Start My Plan
                </div>
                <p>
                  Clicking this button does two important things:
                </p>
                <ol>
                  <li>It saves your goal details to your browser's local storage (completely private)</li>
                  <li>It takes you directly to your dashboard where you can begin tracking progress</li>
                </ol>
                <div className="tip-item success">
                  <strong>Pro Tip:</strong> You can save multiple goals! Create plans for different objectives 
                  and track them all simultaneously on your dashboard.
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Step 2: Understanding Your Dashboard</h3>
              <p>
                Your dashboard uses a fun "Proof-of-Work" mining metaphor to make tracking progress engaging and rewarding. 
                Here's what each element means:
              </p>
              
              <div className="metric-explanation">
                <h4>⛏️ Your Hash Rate</h4>
                <p>
                  This is your planned monthly contribution - the "computational power" you're dedicating to mining your goal. 
                  The higher your hash rate (monthly contribution), the faster you'll mine blocks and reach your target.
                </p>
              </div>
              
              <div className="metric-explanation">
                <h4>🎯 Goal Difficulty</h4>
                <p>
                  This is your final target amount - the "difficulty" of the mining challenge you've set for yourself. 
                  Just like Bitcoin mining, bigger goals require more work, but the reward is worth it!
                </p>
              </div>
              
              <div className="metric-explanation">
                <h4>⛏️ Blocks Mined</h4>
                <p>
                  Shows how many months you've completed versus the total months in your plan. Each month you contribute 
                  is like successfully mining a block in your personal blockchain.
                </p>
              </div>
              
              <div className="metric-explanation">
                <h4>⛓️ Personal Blockchain</h4>
                <p>
                  A visual representation of your journey! Orange blocks with the ₿ symbol are "mined" (completed months), 
                  while gray blocks are waiting to be mined. Watch your blockchain grow month by month!
                </p>
              </div>
            </div>

            <div className="guide-section">
              <h3>Step 3: The Monthly Ritual</h3>
              <p>
                Here's where the magic happens! Each month, after you've made your contribution to your goal 
                (whether it's buying Bitcoin, saving cash, or investing), return to your dashboard for a 
                satisfying ritual:
              </p>
              
              <div className="step">
                <h4>The Mining Button</h4>
                <p>
                  You'll see a prominent green button for each active goal:
                </p>
                <div style={{ 
                  textAlign: 'center', 
                  padding: '1rem', 
                  background: 'linear-gradient(135deg, #28a745, #20c997)',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: 'bold',
                  margin: '1rem 0'
                }}>
                  ⛏️ Confirm This Month's Contribution & Mine Next Block
                </div>
                
                <h4>What Happens When You Click</h4>
                <ol>
                  <li><strong>Progress Updates:</strong> Your "Blocks Mined" counter increases</li>
                  <li><strong>Visual Feedback:</strong> A new block in your blockchain turns orange</li>
                  <li><strong>Percentage Complete:</strong> Watch your progress percentage grow</li>
                  <li><strong>Motivation Boost:</strong> Feel the satisfaction of tangible progress!</li>
                </ol>
                
                <h4>Why This Matters</h4>
                <p>
                  This simple monthly action transforms abstract financial planning into a concrete, visual, 
                  and emotionally rewarding experience. You're not just saving money - you're mining your 
                  future, one block at a time!
                </p>
                
                <div className="tip-item warning">
                  <strong>Remember:</strong> The dashboard doesn't verify actual contributions - it trusts you! 
                  Click the button only after you've actually made your monthly contribution to keep your 
                  tracking accurate.
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3>Celebrating Success</h3>
              <p>
                When you complete all the blocks in your goal (reach 100%), your mining button transforms into a 
                celebration message! You've successfully "mined" your entire goal. Time to enjoy the fruits of 
                your disciplined saving and either:
              </p>
              <ul>
                <li>Use your savings for their intended purpose</li>
                <li>Create a new, even more ambitious goal</li>
                <li>Let your Bitcoin continue growing beyond your target</li>
              </ul>
              
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button 
                  className="calculate-button"
                  onClick={() => navigateToCalculator('/dashboard')}
                  style={{ 
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #FF8C00, #FFA500)' 
                  }}
                >
                  View My Dashboard →
                </button>
              </div>
            </div>
          </div>
        );

      case 'glossary':
        return (
          <div className="guide-content">
            <h2>📚 Glossary</h2>
            <p>Key terms to help you navigate your Bitcoin wealth-building journey:</p>
            
            <div className="glossary-grid">
              <div className="glossary-item">
                <strong>DCA (Dollar-Cost Averaging)</strong>
                <p>
                  Investing a fixed amount regularly regardless of price. Reduces the impact of volatility 
                  and builds wealth steadily over time.
                </p>
              </div>
              
              <div className="glossary-item">
                <strong>LTV (Loan-to-Value) Ratio</strong>
                <p>
                  The percentage of your Bitcoin's value that you've borrowed against. Lower is safer. 
                  Example: $20,000 loan against $100,000 Bitcoin = 20% LTV.
                </p>
              </div>
              
              <div className="glossary-item">
                <strong>Compound Interest</strong>
                <p>
                  Earning returns on both your initial investment and previously earned returns. 
                  The secret sauce of long-term wealth building.
                </p>
              </div>
              
              <div className="glossary-item">
                <strong>Liquidation Price</strong>
                <p>
                  The Bitcoin price at which your collateral would be sold to repay a loan. 
                  Stay well above this to avoid losing your Bitcoin.
                </p>
              </div>
              
              <div className="glossary-item">
                <strong>Hash Rate (Dashboard)</strong>
                <p>
                  In our dashboard metaphor, this represents your monthly contribution amount - 
                  your "mining power" toward your financial goal.
                </p>
              </div>
              
              <div className="glossary-item">
                <strong>Goal Difficulty (Dashboard)</strong>
                <p>
                  In our dashboard metaphor, this is your target amount - how "difficult" your 
                  financial goal is to achieve.
                </p>
              </div>
              
              <div className="glossary-item">
                <strong>CAGR</strong>
                <p>
                  Compound Annual Growth Rate - the average yearly growth rate of an investment 
                  over a period of time, accounting for compounding.
                </p>
              </div>
              
              <div className="glossary-item">
                <strong>Margin Call</strong>
                <p>
                  A demand from a lender to add more collateral when your LTV ratio gets too high. 
                  Failure to respond can trigger liquidation.
                </p>
              </div>
              
              <div className="glossary-item">
                <strong>Volatility</strong>
                <p>
                  How much an asset's price fluctuates. Bitcoin is known for high volatility, 
                  which creates both opportunities and risks.
                </p>
              </div>
              
              <div className="glossary-item">
                <strong>Time Horizon</strong>
                <p>
                  The length of time you plan to hold an investment before needing the funds. 
                  Longer horizons can weather more volatility.
                </p>
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
                <h3>Getting Started</h3>
                <p><strong>Q: Where should I start if I'm new to Bitcoin investing?</strong></p>
                <p>
                  A: Start with the Goal Planner to create a simple savings goal. Set a modest target 
                  and monthly contribution you're comfortable with. As you gain confidence, you can create 
                  more ambitious goals.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>About the Dashboard</h3>
                <p><strong>Q: Is my financial data stored somewhere online?</strong></p>
                <p>
                  A: No! All your goals and progress are stored locally in your browser. We never see or 
                  store your financial information. This means your data is completely private, but also 
                  means you'll lose it if you clear your browser data.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>Goal Planning</h3>
                <p><strong>Q: Can I have multiple goals at the same time?</strong></p>
                <p>
                  A: Absolutely! You can create and track as many goals as you want. Many users have 
                  separate goals for emergency funds, house down payments, and retirement all running 
                  simultaneously.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>Mining Blocks</h3>
                <p><strong>Q: What if I miss a month's contribution?</strong></p>
                <p>
                  A: No problem! Simply don't click the "Mine Block" button for that month. You can 
                  catch up later with a double contribution, or adjust your timeline. The dashboard 
                  is flexible to match real life.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>Growth Scenarios</h3>
                <p><strong>Q: Which growth scenario should I choose?</strong></p>
                <p>
                  A: Start with "Moderate" (45% annual growth) for balanced projections. Conservative 
                  (20%) is safer for short-term goals, while Optimistic (70%) reflects Bitcoin's 
                  historical best years. You can always recalculate with different scenarios.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>Retirement Strategies</h3>
                <p><strong>Q: Should I choose "Sell" or "Borrow" for retirement?</strong></p>
                <p>
                  A: It depends on your risk tolerance and belief in Bitcoin's future. "Sell" is simpler 
                  and safer but depletes your Bitcoin over time. "Borrow" preserves your Bitcoin but 
                  requires careful management and involves debt. Many retirees use a combination.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>Updating Progress</h3>
                <p><strong>Q: Can I edit my goals after creating them?</strong></p>
                <p>
                  A: Currently, goals can't be edited once created. If your situation changes significantly, 
                  you can delete the old goal and create a new one with updated parameters.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>Calculator Accuracy</h3>
                <p><strong>Q: How accurate are these projections?</strong></p>
                <p>
                  A: These are mathematical projections based on your chosen growth rates. Bitcoin's actual 
                  performance will vary significantly from any projection. Use these tools for planning 
                  purposes, not as guarantees of future returns.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>Privacy & Security</h3>
                <p><strong>Q: Is this tool really free? What's the catch?</strong></p>
                <p>
                  A: Yes, it's completely free! This is an open-source tool built by the Bitcoin community 
                  for the Bitcoin community. There's no catch, no ads, and no data collection. We believe 
                  everyone should have access to quality financial planning tools.
                </p>
              </div>
              
              <div className="faq-item">
                <h3>Technical Issues</h3>
                <p><strong>Q: What if the calculators aren't working properly?</strong></p>
                <p>
                  A: Try refreshing your browser first. If issues persist, try clearing your browser cache 
                  or using a different browser. The tool works best on modern browsers like Chrome, Firefox, 
                  or Safari.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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