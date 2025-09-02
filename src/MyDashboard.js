import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyDashboard = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load goals from localStorage on component mount
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    try {
      const savedGoals = localStorage.getItem('bitcoinGoals');
      const parsedGoals = savedGoals ? JSON.parse(savedGoals) : [];
      setGoals(parsedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mine next block - increment monthsCompleted for specific goal
  const mineNextBlock = (goalId) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId && goal.monthsCompleted < goal.totalMonths) {
        const newMonthsCompleted = goal.monthsCompleted + 1;
        const newProgress = (newMonthsCompleted / goal.totalMonths) * 100;
        
        return {
          ...goal,
          monthsCompleted: newMonthsCompleted,
          currentProgress: newProgress
        };
      }
      return goal;
    });

    // Update state and save to localStorage
    setGoals(updatedGoals);
    localStorage.setItem('bitcoinGoals', JSON.stringify(updatedGoals));
  };

  // Generate blockchain visualization blocks
  const generateBlockchain = (goal) => {
    const totalBlocks = Math.min(goal.totalMonths, 60); // Cap at 60 blocks for visual purposes
    const blocksPerRow = 12; // 12 blocks per row
    const minedBlocks = Math.floor((goal.monthsCompleted / goal.totalMonths) * totalBlocks);
    
    const blocks = [];
    for (let i = 0; i < totalBlocks; i++) {
      const isMined = i < minedBlocks;
      blocks.push(
        <div
          key={i}
          className={`blockchain-block ${isMined ? 'mined' : 'unmined'}`}
          title={isMined ? `Block ${i + 1} - Mined ✅` : `Block ${i + 1} - Pending ⏳`}
        >
          {isMined ? '₿' : '⬜'}
        </div>
      );
    }

    // Group blocks into rows
    const rows = [];
    for (let i = 0; i < blocks.length; i += blocksPerRow) {
      rows.push(
        <div key={i / blocksPerRow} className="blockchain-row">
          {blocks.slice(i, i + blocksPerRow)}
        </div>
      );
    }

    return rows;
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

  // Delete goal
  const deleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      localStorage.setItem('bitcoinGoals', JSON.stringify(updatedGoals));
    }
  };

  if (isLoading) {
    return (
      <div className="calculator-container">
        <div style={{ textAlign: 'center', padding: '4rem', color: '#EAEAEA' }}>
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="calculator-container">
      <h2 className="calculator-title">⛏️ My Dashboard</h2>
      
      {goals.length === 0 ? (
        <div className="dashboard-empty">
          <div className="empty-state">
            <h3>No Goals Yet</h3>
            <p>Start by creating a financial goal and saving it to begin your Bitcoin wealth-building journey!</p>
            <button 
              className="calculate-button"
              onClick={() => navigate('/goal-planner')}
              style={{ marginTop: '1rem' }}
            >
              Create Your First Goal
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard-content">
          <p className="dashboard-intro">
            Track your progress toward financial freedom with your personal Bitcoin mining dashboard. 
            Each month's contribution mines a new block in your financial blockchain!
          </p>

          {goals.map((goal, index) => (
            <div key={goal.id} className="mining-dashboard">
              {/* Dashboard Header */}
              <div className="dashboard-header">
                <h3 className="goal-title">
                  {goal.goalName}
                  <span className="goal-strategy">
                    ({goal.strategy === 'sell' ? '🔽 Sell Strategy' : '💰 Borrow Strategy'})
                  </span>
                </h3>
                <button 
                  className="delete-goal-btn"
                  onClick={() => deleteGoal(goal.id)}
                  title="Delete Goal"
                >
                  🗑️
                </button>
              </div>

              {/* Mining Metrics */}
              <div className="mining-metrics">
                <div className="metric-card hash-rate">
                  <div className="metric-icon">⛏️</div>
                  <div className="metric-content">
                    <div className="metric-label">YOUR HASH RATE</div>
                    <div className="metric-value">{formatCurrency(goal.monthlyContribution)}/month</div>
                  </div>
                </div>

                <div className="metric-card difficulty">
                  <div className="metric-icon">🎯</div>
                  <div className="metric-content">
                    <div className="metric-label">GOAL DIFFICULTY</div>
                    <div className="metric-value">{formatCurrency(goal.targetAmount)}</div>
                  </div>
                </div>

                <div className="metric-card blocks-mined">
                  <div className="metric-icon">⛏️</div>
                  <div className="metric-content">
                    <div className="metric-label">BLOCKS MINED</div>
                    <div className="metric-value">
                      {goal.monthsCompleted}/{goal.totalMonths}
                      <div className="progress-percentage">
                        ({Math.round(goal.currentProgress)}% complete)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${goal.currentProgress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {goal.monthsCompleted} months of {goal.totalMonths} months completed
                </div>
              </div>

              {/* Blockchain Visualization */}
              <div className="blockchain-section">
                <h4 className="blockchain-title">Personal Blockchain</h4>
                <div className="blockchain-container">
                  {generateBlockchain(goal)}
                </div>
                <div className="blockchain-legend">
                  <div className="legend-item">
                    <span className="legend-icon mined">₿</span>
                    <span>Mined Block (Month Completed)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-icon unmined">⬜</span>
                    <span>Unmined Block (Pending Month)</span>
                  </div>
                </div>
              </div>

              {/* Mining Action */}
              <div className="mining-action">
                <button
                  className="mine-button"
                  onClick={() => mineNextBlock(goal.id)}
                  disabled={goal.monthsCompleted >= goal.totalMonths}
                >
                  {goal.monthsCompleted >= goal.totalMonths 
                    ? '🎉 Goal Completed!' 
                    : '⛏️ Confirm This Month\'s Contribution & Mine Next Block'
                  }
                </button>
                
                {goal.monthsCompleted >= goal.totalMonths && (
                  <div className="completion-message">
                    <h4>🎯 Congratulations!</h4>
                    <p>You've successfully completed your "{goal.goalName}" goal! 
                       Your consistency and dedication have built a solid foundation for your financial future.</p>
                  </div>
                )}
              </div>

              {/* Goal Details */}
              <div className="goal-details">
                <div className="detail-item">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">
                    {new Date(goal.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Time Frame:</span>
                  <span className="detail-value">
                    {Math.round(goal.totalMonths / 12)} years ({goal.totalMonths} months)
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Contributions:</span>
                  <span className="detail-value">
                    {formatCurrency(goal.monthsCompleted * goal.monthlyContribution)} of {formatCurrency(goal.totalMonths * goal.monthlyContribution)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Goal Button */}
          <div className="add-goal-section">
            <button 
              className="calculate-button"
              onClick={() => navigate('/goal-planner')}
              style={{ 
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                marginTop: '2rem'
              }}
            >
              ➕ Create New Goal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDashboard;