import React, { useState } from 'react';

const GrowthProjector = () => {
  // State management
  const [selectedScenario, setSelectedScenario] = useState('moderate');
  const [customRate, setCustomRate] = useState(45);
  const [customVolatility, setCustomVolatility] = useState(70);
  const [projectionData, setProjectionData] = useState([]);

  // Scenario configurations
  const scenarios = {
    conservative: { name: 'Conservative', rate: 0.20, volatility: 0.40 },
    moderate:     { name: 'Moderate',     rate: 0.45, volatility: 0.70 },
    optimistic:   { name: 'Optimistic',   rate: 0.70, volatility: 0.90 }
  };

  // Handle scenario selection
  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
  };

  // Run the 10-year Bitcoin growth projection
  const runProjection = () => {
    // Determine which rate and volatility to use
    let rate, volatility;
    
    if (selectedScenario === 'custom') {
      rate = customRate / 100; // Convert percentage to decimal
      volatility = customVolatility / 100; // Convert percentage to decimal
    } else {
      rate = scenarios[selectedScenario].rate;
      volatility = scenarios[selectedScenario].volatility;
    }

    // Starting values
    const startingPrice = 60000; // Starting Bitcoin price
    const years = 10;
    const projection = [];

    // Generate year-by-year projection with volatility
    let currentPrice = startingPrice;
    
    for (let year = 0; year <= years; year++) {
      if (year === 0) {
        // Starting year
        projection.push({
          year: year,
          price: currentPrice,
          growth: 0
        });
      } else {
        // Generate random variation using volatility
        // Standard normal distribution approximation
        const randomVariation = (Math.random() - 0.5) * 2 * volatility;
        
        // Apply growth rate with random variation
        const yearlyGrowth = rate + randomVariation;
        const newPrice = currentPrice * (1 + yearlyGrowth);
        
        projection.push({
          year: year,
          price: Math.round(newPrice),
          growth: (yearlyGrowth * 100).toFixed(1)
        });
        
        currentPrice = newPrice;
      }
    }

    // Store the projection data
    setProjectionData(projection);
    
    // Log results to console
    console.log('Bitcoin Growth Projection Results:');
    console.log(`Scenario: ${selectedScenario === 'custom' ? 'Custom' : scenarios[selectedScenario].name}`);
    console.log(`Growth Rate: ${(rate * 100).toFixed(1)}%`);
    console.log(`Volatility: ${(volatility * 100).toFixed(1)}%`);
    console.log('Year-by-year projection:', projection);
    console.log(`Final Result: $${startingPrice.toLocaleString()} → $${projection[years].price.toLocaleString()} (${years} years)`);
    
    const totalGrowth = ((projection[years].price - startingPrice) / startingPrice) * 100;
    console.log(`Total Growth: ${totalGrowth.toFixed(1)}%`);
    console.log(`Annualized Return: ${(Math.pow(projection[years].price / startingPrice, 1/years) - 1).toFixed(3) * 100}%`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Bitcoin Growth Projector</h2>
      
      {/* Scenario Selector Buttons */}
      <div style={styles.scenarioButtons}>
        {Object.keys(scenarios).map((scenario) => (
          <button
            key={scenario}
            onClick={() => handleScenarioChange(scenario)}
            style={{
              ...styles.scenarioButton,
              ...(selectedScenario === scenario ? styles.activeButton : {})
            }}
          >
            {scenarios[scenario].name}
          </button>
        ))}
        <button
          onClick={() => handleScenarioChange('custom')}
          style={{
            ...styles.scenarioButton,
            ...(selectedScenario === 'custom' ? styles.activeButton : {})
          }}
        >
          Custom
        </button>
      </div>

      {/* Custom Inputs - Only visible when custom scenario is selected */}
      {selectedScenario === 'custom' && (
        <div style={styles.customInputs}>
          <div style={styles.warningMessage}>
            ⚠️ You are in Custom Mode - set your own parameters below
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Average Annual Growth (%):</label>
            <input
              type="number"
              value={customRate}
              onChange={(e) => setCustomRate(Number(e.target.value))}
              style={styles.input}
              min="0"
              max="200"
              step="1"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Volatility Factor (%):</label>
            <input
              type="number"
              value={customVolatility}
              onChange={(e) => setCustomVolatility(Number(e.target.value))}
              style={styles.input}
              min="0"
              max="200"
              step="1"
            />
          </div>
        </div>
      )}

      {/* Calculate Button */}
      <button onClick={runProjection} style={styles.calculateButton}>
        Calculate 10-Year Projection
      </button>

      {/* Results Preview */}
      {projectionData.length > 0 && (
        <div style={styles.results}>
          <h3 style={styles.resultsTitle}>Projection Results (Check Console for Details)</h3>
          <div style={styles.resultsSummary}>
            <p><strong>Starting Price:</strong> ${projectionData[0]?.price.toLocaleString()}</p>
            <p><strong>Final Price (Year 10):</strong> ${projectionData[10]?.price.toLocaleString()}</p>
            <p><strong>Total Growth:</strong> {projectionData.length > 0 ? (((projectionData[10]?.price - projectionData[0]?.price) / projectionData[0]?.price) * 100).toFixed(1) : 0}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#1E1E1E',
    borderRadius: '12px',
    border: '1px solid #333',
    fontFamily: 'Inter, sans-serif',
    color: '#EAEAEA'
  },
  title: {
    textAlign: 'center',
    color: '#FF8C00',
    marginBottom: '2rem',
    fontSize: '1.8rem',
    fontWeight: '600'
  },
  scenarioButtons: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  scenarioButton: {
    padding: '0.75rem 1rem',
    backgroundColor: '#333',
    color: '#EAEAEA',
    border: '2px solid #555',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: '500',
    minWidth: '100px'
  },
  activeButton: {
    backgroundColor: '#FF8C00',
    color: '#1E1E1E',
    borderColor: '#FF8C00',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(255, 140, 0, 0.3)'
  },
  customInputs: {
    backgroundColor: '#2A2A2A',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    border: '1px solid #444'
  },
  warningMessage: {
    color: '#FFC107',
    textAlign: 'center',
    marginBottom: '1rem',
    fontWeight: '500',
    fontSize: '0.9rem'
  },
  inputGroup: {
    marginBottom: '1rem'
  },
  inputLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#EAEAEA',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#1A1A1A',
    border: '2px solid #444',
    borderRadius: '6px',
    color: '#EAEAEA',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease'
  },
  calculateButton: {
    width: '100%',
    padding: '1rem 2rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '2rem'
  },
  results: {
    backgroundColor: '#2A2A2A',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #444'
  },
  resultsTitle: {
    color: '#FF8C00',
    marginBottom: '1rem',
    fontSize: '1.2rem'
  },
  resultsSummary: {
    display: 'grid',
    gap: '0.5rem'
  }
};

export default GrowthProjector;