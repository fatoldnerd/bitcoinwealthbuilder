import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyDashboard = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for wallet tracking
  const [wallets, setWallets] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [loadingWallets, setLoadingWallets] = useState(new Set());
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  
  // State for modal and editing
  const [showNamingModal, setShowNamingModal] = useState(false);
  const [pendingAddress, setPendingAddress] = useState('');
  const [walletName, setWalletName] = useState('');
  const [editingWalletId, setEditingWalletId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Load goals and wallets from localStorage on component mount
  useEffect(() => {
    loadGoals();
    loadWallets();
    fetchBitcoinPrice();
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

  // Load tracked wallets from localStorage with backwards compatibility
  const loadWallets = async () => {
    try {
      const savedData = localStorage.getItem('trackedBitcoinAddresses');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Check if it's the old format (array of strings) or new format (array of objects)
        let walletsData;
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          if (typeof parsedData[0] === 'string') {
            // Old format - convert to new format
            walletsData = parsedData.map((addr, index) => ({
              id: Date.now().toString() + index,
              address: addr,
              name: `Wallet ${index + 1}`,
              balance: null,
              lastUpdated: null,
              error: null
            }));
            // Save the converted data
            localStorage.setItem('trackedBitcoinAddresses', JSON.stringify(walletsData));
          } else {
            // New format - use as is
            walletsData = parsedData;
          }
        } else {
          walletsData = [];
        }
        
        setWallets(walletsData);
        
        // Fetch initial balances for all loaded wallets
        for (const wallet of walletsData) {
          await fetchBalance(wallet.id, wallet.address);
        }
      }
    } catch (error) {
      console.error('Error loading wallets:', error);
    }
  };

  // Fetch current Bitcoin price from CoinGecko
  const fetchBitcoinPrice = async () => {
    setIsLoadingPrice(true);
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      const price = response.data.bitcoin.usd;
      setBitcoinPrice(price);
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      setBitcoinPrice(50000); // Fallback price
    } finally {
      setIsLoadingPrice(false);
    }
  };

  // Fetch wallet balance from Blockstream API
  const fetchBalance = async (walletId, address) => {
    // Add to loading set
    setLoadingWallets(prev => new Set(prev).add(walletId));
    
    try {
      const response = await axios.get(
        `https://blockstream.info/api/address/${address}`
      );
      
      // Calculate balance in BTC from satoshis
      const balanceInSatoshis = 
        (response.data.chain_stats.funded_txo_sum || 0) - 
        (response.data.chain_stats.spent_txo_sum || 0);
      const balanceInBTC = balanceInSatoshis / 100000000;
      
      // Update wallet with balance
      setWallets(prev => prev.map(wallet => 
        wallet.id === walletId
          ? {
              ...wallet,
              balance: balanceInBTC,
              lastUpdated: new Date().toISOString(),
              error: null
            }
          : wallet
      ));
      
    } catch (error) {
      console.error(`Error fetching balance for ${address}:`, error);
      
      // Update wallet with error
      setWallets(prev => prev.map(wallet => 
        wallet.id === walletId
          ? {
              ...wallet,
              error: 'Failed to fetch balance',
              lastUpdated: new Date().toISOString()
            }
          : wallet
      ));
    } finally {
      // Remove from loading set
      setLoadingWallets(prev => {
        const newSet = new Set(prev);
        newSet.delete(walletId);
        return newSet;
      });
    }
  };

  // Handle adding a new address - opens modal
  const handleAddAddress = () => {
    // Basic validation
    if (!newAddress.trim()) {
      alert('Please enter a Bitcoin address');
      return;
    }
    
    // Check if address already exists
    if (wallets.some(w => w.address === newAddress)) {
      alert('This address is already being tracked');
      return;
    }
    
    // Open naming modal
    setPendingAddress(newAddress);
    setWalletName('');
    setShowNamingModal(true);
  };

  // Handle saving wallet with name from modal
  const handleSaveWallet = () => {
    if (!walletName.trim()) {
      alert('Please enter a name for this wallet');
      return;
    }
    
    // Create new wallet object
    const newWallet = {
      id: Date.now().toString(),
      address: pendingAddress,
      name: walletName.trim(),
      balance: null,
      lastUpdated: null,
      error: null
    };
    
    // Add to state
    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);
    
    // Save to localStorage
    localStorage.setItem('trackedBitcoinAddresses', JSON.stringify(updatedWallets));
    
    // Fetch balance for the new wallet
    fetchBalance(newWallet.id, newWallet.address);
    
    // Close modal and clear inputs
    setShowNamingModal(false);
    setPendingAddress('');
    setWalletName('');
    setNewAddress('');
  };

  // Handle updating wallet name (inline editing)
  const handleUpdateWalletName = (walletId, newName) => {
    if (!newName.trim()) {
      // If empty, revert to original name
      setEditingWalletId(null);
      setEditingName('');
      return;
    }
    
    // Update wallet name
    const updatedWallets = wallets.map(wallet =>
      wallet.id === walletId
        ? { ...wallet, name: newName.trim() }
        : wallet
    );
    
    setWallets(updatedWallets);
    
    // Save to localStorage
    localStorage.setItem('trackedBitcoinAddresses', JSON.stringify(updatedWallets));
    
    // Clear editing state
    setEditingWalletId(null);
    setEditingName('');
  };

  // Handle deleting a wallet
  const handleDeleteWallet = (walletId, walletName) => {
    if (window.confirm(`Are you sure you want to stop tracking "${walletName}"?`)) {
      // Remove from state
      const updatedWallets = wallets.filter(w => w.id !== walletId);
      setWallets(updatedWallets);
      
      // Update localStorage
      localStorage.setItem('trackedBitcoinAddresses', JSON.stringify(updatedWallets));
    }
  };

  // Handle refreshing a wallet balance
  const handleRefreshWallet = (walletId, address) => {
    fetchBalance(walletId, address);
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
      
      {/* Naming Modal */}
      {showNamingModal && (
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
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            border: '2px solid #FF8C00',
            boxShadow: '0 10px 30px rgba(255, 140, 0, 0.3)'
          }}>
            <h3 style={{ color: '#FF8C00', marginBottom: '1.5rem' }}>
              Name Your Wallet
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#AAAAAA', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                Bitcoin Address:
              </label>
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#2A2A2A',
                borderRadius: '8px',
                color: '#EAEAEA',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                wordBreak: 'break-all'
              }}>
                {pendingAddress}
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#AAAAAA', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                Wallet Name:
              </label>
              <input
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveWallet()}
                placeholder="e.g., Cold Storage, Savings, Trading"
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#2A2A2A',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#EAEAEA',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowNamingModal(false);
                  setPendingAddress('');
                  setWalletName('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2A2A2A',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#EAEAEA',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2A2A2A'}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWallet}
                className="calculate-button"
                style={{
                  background: 'linear-gradient(135deg, #FF8C00, #FFA500)',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem'
                }}
              >
                Save Wallet
              </button>
            </div>
          </div>
        </div>
      )}
      
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

          {/* On-Chain Balance Tracker */}
          <div className="mining-dashboard" style={{ marginTop: '3rem' }}>
            <div className="dashboard-header">
              <h3 className="goal-title">
                ⛓️ On-Chain Balance Tracker
              </h3>
            </div>

            <p style={{ 
              color: '#BDBDBD', 
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              Track your Bitcoin wallet balances in real-time. Add any public Bitcoin address to monitor its balance 
              and total value. All data is stored locally in your browser for maximum privacy.
            </p>

            {/* Add Address Form */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              <input
                type="text"
                placeholder="Enter Bitcoin address (e.g., bc1q...)"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAddress()}
                style={{
                  flex: '1',
                  minWidth: '300px',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  backgroundColor: '#2A2A2A',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#EAEAEA',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleAddAddress}
                className="calculate-button"
                style={{
                  background: 'linear-gradient(135deg, #FF8C00, #FFA500)',
                  padding: '0.75rem 2rem',
                  fontSize: '1rem'
                }}
              >
                ➕ Add Address
              </button>
            </div>

            {/* Wallet List */}
            {wallets.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: '#2A2A2A',
                borderRadius: '8px',
                color: '#AAAAAA'
              }}>
                <p>No wallets tracked yet. Add a Bitcoin address above to get started!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {wallets.map((wallet) => {
                  const isLoading = loadingWallets.has(wallet.id);
                  const usdValue = wallet.balance && bitcoinPrice 
                    ? (wallet.balance * bitcoinPrice).toFixed(2)
                    : null;
                  const isEditing = editingWalletId === wallet.id;
                  
                  return (
                    <div 
                      key={wallet.id}
                      className="metric-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        padding: '1.5rem'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                          {/* Wallet Name - Clickable for editing */}
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateWalletName(wallet.id, editingName);
                                } else if (e.key === 'Escape') {
                                  setEditingWalletId(null);
                                  setEditingName('');
                                }
                              }}
                              onBlur={() => handleUpdateWalletName(wallet.id, editingName)}
                              autoFocus
                              style={{
                                fontSize: '1.2rem',
                                fontWeight: '600',
                                color: '#EAEAEA',
                                backgroundColor: '#2A2A2A',
                                border: '1px solid #FF8C00',
                                borderRadius: '4px',
                                padding: '0.25rem 0.5rem',
                                width: '100%',
                                outline: 'none'
                              }}
                            />
                          ) : (
                            <div 
                              onClick={() => {
                                setEditingWalletId(wallet.id);
                                setEditingName(wallet.name);
                              }}
                              style={{
                                fontSize: '1.2rem',
                                fontWeight: '600',
                                color: '#EAEAEA',
                                cursor: 'pointer',
                                marginBottom: '0.5rem',
                                transition: 'color 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.color = '#FF8C00'}
                              onMouseLeave={(e) => e.target.style.color = '#EAEAEA'}
                              title="Click to edit name"
                            >
                              {wallet.name}
                            </div>
                          )}
                          
                          {/* Bitcoin Address */}
                          <div style={{ 
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            color: '#AAAAAA',
                            wordBreak: 'break-all'
                          }}>
                            {wallet.address.slice(0, 12)}...{wallet.address.slice(-12)}
                          </div>
                        </div>

                        {isLoading ? (
                          <div style={{ 
                            color: '#FFA500',
                            fontSize: '0.9rem',
                            fontStyle: 'italic'
                          }}>
                            ⏳ Fetching balance...
                          </div>
                        ) : wallet.error ? (
                          <div style={{ 
                            color: '#dc3545',
                            fontSize: '0.9rem'
                          }}>
                            ⚠️ {wallet.error}
                          </div>
                        ) : wallet.balance !== null ? (
                          <div style={{ 
                            display: 'flex', 
                            gap: '2rem',
                            alignItems: 'center'
                          }}>
                            <div>
                              <div style={{ 
                                color: '#FF8C00', 
                                fontSize: '0.8rem',
                                marginBottom: '0.25rem'
                              }}>
                                BALANCE
                              </div>
                              <div style={{ 
                                fontSize: '1.2rem',
                                fontWeight: '600',
                                color: '#EAEAEA'
                              }}>
                                ₿ {wallet.balance.toFixed(8)}
                              </div>
                            </div>
                            
                            {usdValue && (
                              <div>
                                <div style={{ 
                                  color: '#FF8C00', 
                                  fontSize: '0.8rem',
                                  marginBottom: '0.25rem'
                                }}>
                                  USD VALUE
                                </div>
                                <div style={{ 
                                  fontSize: '1.2rem',
                                  fontWeight: '600',
                                  color: '#28a745'
                                }}>
                                  ${formatCurrency(usdValue).replace('$', '')}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #444',
                        paddingTop: '1rem'
                      }}>
                        <div style={{ 
                          fontSize: '0.75rem',
                          color: '#AAAAAA'
                        }}>
                          {wallet.lastUpdated && (
                            <>Last updated: {new Date(wallet.lastUpdated).toLocaleString()}</>
                          )}
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          gap: '0.5rem' 
                        }}>
                          <button
                            onClick={() => handleRefreshWallet(wallet.id, wallet.address)}
                            disabled={isLoading}
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.85rem',
                              backgroundColor: '#2A2A2A',
                              border: '1px solid #444',
                              borderRadius: '6px',
                              color: '#EAEAEA',
                              cursor: isLoading ? 'not-allowed' : 'pointer',
                              opacity: isLoading ? 0.5 : 1,
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#333')}
                            onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#2A2A2A')}
                          >
                            🔄 Refresh
                          </button>
                          
                          <button
                            onClick={() => handleDeleteWallet(wallet.id, wallet.name)}
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.85rem',
                              backgroundColor: '#dc3545',
                              border: 'none',
                              borderRadius: '6px',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDashboard;