const webpack = require('webpack');

module.exports = {
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Add Express JSON middleware for parsing request bodies
      devServer.app.use(require('express').json());
      
      // Mock API endpoint for development when Vercel is not available
      devServer.app.post('/api/generateReport', (req, res) => {
        try {
          console.log('Mock API called with data:', req.body);
          
          // Safely extract data with fallbacks
          const body = req.body || {};
          const goalName = body.goalName || 'Financial Plan';
          const timeHorizon = body.timeHorizon || 10;
          const monthlyContribution = body.monthlyContribution || 0;
          const finalValue = body.finalValue || 0;
          const retirementStrategy = body.retirementStrategy || null;
          
          // Create realistic mock AI response
          const generateMockSummary = () => {
            let summary = `### Executive Summary\n\nYour ${goalName} demonstrates a systematic approach to building wealth through Bitcoin investment over ${timeHorizon} years. With monthly contributions of $${monthlyContribution.toLocaleString()} and a projected final value of $${Math.round(finalValue).toLocaleString()}, this plan positions you well for achieving your financial objectives.\n\n`;
            
            summary += `### Analysis of Strategy\n\nYour Dollar-Cost Averaging (DCA) approach represents a disciplined investment methodology specifically designed to navigate Bitcoin's inherent volatility. By committing to regular contributions of $${monthlyContribution.toLocaleString()} monthly, you're implementing a strategy that removes emotional decision-making from your investment process.\n\n`;
            
            if (retirementStrategy) {
              summary += `### Retirement Strategy Analysis\n\nYour chosen "${retirementStrategy === 'sell' ? 'Sell for Income' : 'Borrow for Income'}" strategy ${retirementStrategy === 'sell' ? 'involves gradually liquidating Bitcoin holdings to fund retirement expenses' : 'preserves your Bitcoin holdings by using them as collateral for loans'}. This approach ${retirementStrategy === 'borrow' ? 'allows you to maintain exposure to potential Bitcoin appreciation while accessing needed liquidity' : 'provides predictable income but reduces your Bitcoin holdings over time'}.\n\n`;
            }
            
            summary += `### Risk Management & Volatility Considerations\n\nBitcoin markets exhibit significant volatility and remain inherently unpredictable. However, your ${timeHorizon}-year time horizon is specifically designed to navigate this volatility effectively, potentially smoothing out short-term price fluctuations through consistent accumulation over time.\n\n`;
            
            summary += `### Actionable Insight & Concluding Remark\n\nMaintain consistency in your monthly contributions regardless of price movements. Your disciplined, systematic approach combined with the long-term time horizon creates a robust framework for wealth building through Bitcoin investment.`;
            
            return summary;
          };
          
          // Return mock response after simulated delay
          setTimeout(() => {
            res.json({
              success: true,
              summary: generateMockSummary()
            });
          }, 1500); // Simulate network delay
          
        } catch (error) {
          console.error('Mock API error:', error);
          res.status(500).json({
            success: false,
            error: 'Mock API processing error'
          });
        }
      });
      
      return middlewares;
    }
  },
  webpack: {
    configure: (webpackConfig) => {
      // Add fallbacks for Node.js modules that aren't available in browsers
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "buffer": require.resolve("buffer"),
        "process": require.resolve("process"),
      };
      
      return webpackConfig;
    },
    plugins: {
      add: [
        // Provide Node.js globals so @react-pdf/renderer can use them
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process',
        })
      ]
    }
  }
};