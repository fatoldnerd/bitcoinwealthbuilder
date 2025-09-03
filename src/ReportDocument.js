import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// PDF styles using React PDF styling system with professional dark theme
const styles = StyleSheet.create({
  // Page styles
  page: {
    flexDirection: 'column',
    backgroundColor: '#1E1E1E',
    color: '#EAEAEA',
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    padding: 0,
  },
  
  // Header and Footer styles
  header: {
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
    paddingBottom: 15,
    borderBottom: '2px solid #FF8C00',
    marginBottom: 20,
  },
  
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    paddingTop: 10,
    borderTop: '1px solid #444',
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
  },
  
  // Content area (between header and footer)
  content: {
    marginTop: 80,
    marginBottom: 60,
    marginLeft: 40,
    marginRight: 40,
    flex: 1,
  },
  
  // Title page styles
  titlePage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#1E1E1E',
  },
  
  appLogo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 20,
  },
  
  titlePageSubtitle: {
    fontSize: 16,
    color: '#BDBDBD',
    marginBottom: 10,
  },
  
  titlePageGoal: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EAEAEA',
    marginBottom: 30,
    textAlign: 'center',
  },
  
  titlePageDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 40,
  },
  
  // Section styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 15,
    marginTop: 25,
    borderLeft: '4px solid #FF8C00',
    paddingLeft: 10,
  },
  
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 12,
    marginTop: 20,
  },
  
  // Premium two-column layout styles
  twoColumnContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    gap: 20,
  },
  
  leftColumn: {
    flex: 1,
    paddingRight: 10,
  },
  
  rightColumn: {
    flex: 1,
    paddingLeft: 10,
  },
  
  // Enhanced chart styles for two-column layout
  chartContainer: {
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 12,
    border: '1px solid #444',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  chartImage: {
    maxWidth: '100%',
    maxHeight: 280,
  },
  
  chartPlaceholder: {
    backgroundColor: '#2A2A2A',
    padding: 25,
    textAlign: 'center',
    border: '1px solid #444',
    borderRadius: 12,
    color: '#B0B0B0',
  },
  
  // Premium financial data table styles
  financialTable: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    border: '1px solid #444',
    padding: 20,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 20,
    textAlign: 'center',
    paddingBottom: 10,
    borderBottom: '2px solid #FF8C00',
  },
  
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottom: '1px solid #444',
    alignItems: 'center',
  },
  
  tableRowLast: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
  },
  
  tableLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    flex: 1,
    paddingRight: 15,
    fontWeight: '500',
  },
  
  tableValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EAEAEA',
    flex: 1,
    textAlign: 'right',
  },
  
  tableValueHighlight: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FF8C00',
    flex: 1,
    textAlign: 'right',
  },
  
  // Premium Investment Strategy styles
  investmentStrategyContainer: {
    marginTop: 30,
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 12,
    border: '1px solid #444',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  
  // Premium AI Analysis styles
  aiContainer: {
    backgroundColor: '#2A2A2A',
    padding: 25,
    borderRadius: 12,
    border: '1px solid #444',
    marginTop: 15,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 20,
    textAlign: 'center',
    paddingBottom: 10,
    borderBottom: '2px solid #FF8C00',
  },
  
  aiHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 10,
    marginTop: 20,
    paddingLeft: 5,
  },
  
  aiText: {
    fontSize: 11,
    lineHeight: 1.7,
    color: '#EAEAEA',
    marginBottom: 15,
    textAlign: 'justify',
    paddingLeft: 5,
    paddingRight: 5,
  },
  
  aiBulletPoint: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#EAEAEA',
    marginBottom: 10,
    marginLeft: 20,
  },
  
  // Disclaimer styles
  disclaimer: {
    fontSize: 9,
    color: '#888',
    marginTop: 25,
    padding: 15,
    backgroundColor: '#252525',
    border: '1px solid #333',
    borderRadius: 4,
    textAlign: 'center',
    lineHeight: 1.4,
  },
  
  // Utility styles
  spacer: {
    height: 15,
  },
  
  bitcoinIcon: {
    fontSize: 14,
    color: '#FF8C00',
  },
});

// Helper function to dynamically render financial overview rows
const renderFinancialOverviewRows = (planData, formatCurrency) => {
  const rows = [];
  let rowIndex = 0;
  
  // Define the data mapping with labels and formatting
  const dataConfig = [
    { 
      key: 'goalName', 
      label: 'Plan Name', 
      format: (value) => value,
      condition: () => true 
    },
    { 
      key: 'timeHorizon', 
      label: 'Time Horizon', 
      format: (value) => `${value} years`,
      condition: () => true 
    },
    { 
      key: 'monthlyContribution', 
      label: 'Monthly Contribution', 
      format: (value) => formatCurrency(value),
      condition: () => true 
    },
    { 
      key: 'startingCapital', 
      label: 'Starting Capital', 
      format: (value) => formatCurrency(value),
      condition: (value) => value && value > 0 
    },
    { 
      key: 'targetAmount', 
      label: 'Target Amount', 
      format: (value) => formatCurrency(value),
      condition: (value) => value && value > 0 
    },
    { 
      key: 'growthScenario', 
      label: 'Growth Scenario', 
      format: (value) => value,
      condition: () => true 
    },
    { 
      key: 'retirementStrategy', 
      label: 'Strategy', 
      format: (value) => value === 'sell' ? 'Sell for Income' : 'Borrow for Income',
      condition: (value) => value 
    },
    { 
      key: 'finalValue', 
      label: 'Projected Final Value', 
      format: (value) => formatCurrency(value),
      condition: () => true,
      isHighlight: true 
    }
  ];
  
  // Filter and render rows based on conditions
  const validRows = dataConfig.filter(config => {
    const value = planData[config.key];
    return config.condition(value);
  });
  
  validRows.forEach((config, index) => {
    const value = planData[config.key];
    const isLastRow = index === validRows.length - 1;
    
    rows.push(
      <View key={rowIndex} style={isLastRow ? styles.tableRowLast : styles.tableRow}>
        <Text style={styles.tableLabel}>{config.label}</Text>
        <Text style={config.isHighlight ? styles.tableValueHighlight : styles.tableValue}>
          {config.format(value)}
        </Text>
      </View>
    );
    rowIndex++;
  });
  
  return rows;
};

const ReportDocument = ({ planData, aiSummary, chartImageData }) => {
  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get current date for report
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Parse AI summary with markdown-style formatting
  const parseAiSummary = (summary) => {
    if (!summary) return [];
    
    const sections = [];
    const lines = summary.split('\n').filter(line => line.trim());
    
    let currentSection = null;
    let currentText = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('### ')) {
        // Save previous section
        if (currentSection) {
          sections.push({
            ...currentSection,
            text: currentText.trim()
          });
        }
        
        // Start new section
        currentSection = {
          type: 'heading',
          title: trimmedLine.replace('### ', ''),
        };
        currentText = '';
      } else if (trimmedLine.startsWith('- ')) {
        // Bullet point
        if (currentSection) {
          sections.push({
            ...currentSection,
            text: currentText.trim()
          });
          currentText = '';
        }
        
        sections.push({
          type: 'bullet',
          text: trimmedLine.replace('- ', '')
        });
        currentSection = null;
      } else if (trimmedLine) {
        // Regular text
        currentText += (currentText ? ' ' : '') + trimmedLine;
      }
    }
    
    // Add final section
    if (currentSection && currentText) {
      sections.push({
        ...currentSection,
        text: currentText.trim()
      });
    }
    
    return sections;
  };

  const aiSections = parseAiSummary(aiSummary);

  return (
    <Document title={`${planData.goalName} - Financial Plan Report`} creator="Bitcoin Wealth Builder">
      
      {/* Title Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={{fontSize: 12, color: '#FF8C00', textAlign: 'center'}}>bitcoinwealthbuilder.ai</Text>
        </View>
        
        <View style={styles.titlePage}>
          <Text style={styles.appLogo}>₿</Text>
          <Text style={styles.titlePageSubtitle}>Bitcoin Wealth Builder</Text>
          <Text style={styles.titlePageSubtitle}>Professional Financial Report</Text>
          
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          
          <Text style={styles.titlePageGoal}>{planData.goalName}</Text>
          
          <Text style={styles.titlePageDate}>Generated on {currentDate}</Text>
        </View>
        
        <View style={styles.footer}>
          <Text>bitcoinwealthbuilder.ai • Professional Financial Planning • Page 1</Text>
        </View>
      </Page>

      {/* Page 1: Your Personalized Plan */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FF8C00'}}>Your Personalized Plan</Text>
          <Text style={{fontSize: 10, color: '#BDBDBD'}}>{planData.goalName}</Text>
        </View>

        <View style={styles.content}>
          
          {/* Premium Two-Column Layout: Chart Left, Financial Overview Right */}
          <View style={styles.twoColumnContainer}>
            
            {/* Left Column: Chart */}
            <View style={styles.leftColumn}>
              {chartImageData ? (
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Growth Projection Chart</Text>
                  <Image src={chartImageData} style={styles.chartImage} />
                </View>
              ) : (
                <View style={styles.chartPlaceholder}>
                  <Text>Growth projection chart showing your financial plan progression over {planData.timeHorizon} years</Text>
                </View>
              )}
            </View>
            
            {/* Right Column: Financial Overview Table */}
            <View style={styles.rightColumn}>
              <View style={styles.financialTable}>
                <Text style={styles.tableHeader}>Financial Overview</Text>
                
                {/* Dynamic table rendering based on plan data */}
                {renderFinancialOverviewRows(planData, formatCurrency)}
              </View>
            </View>
          </View>

          {/* Investment Strategy Section - Now below the two-column layout */}
          <View style={styles.investmentStrategyContainer}>
            <Text style={styles.subsectionTitle}>Investment Strategy</Text>
            <Text style={styles.aiText}>
              <Text style={styles.bitcoinIcon}>₿</Text> Bitcoin Dollar-Cost Averaging (DCA) Strategy
            </Text>
            <Text style={styles.aiText}>
              This plan utilizes systematic, regular investments to build Bitcoin wealth over time. 
              By investing consistently regardless of price movements, this approach helps smooth out 
              volatility and builds discipline in your investment journey.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>bitcoinwealthbuilder.ai • Your Financial Future with Bitcoin • Page 2</Text>
        </View>
      </Page>

      {/* Page 2: AI-Powered Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FF8C00'}}>AI-Powered Analysis</Text>
          <Text style={{fontSize: 10, color: '#BDBDBD'}}>An Appendix for Skeptics</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.aiContainer}>
            <Text style={styles.aiTitle}>
              Professional Analysis of Your Bitcoin Investment Strategy
            </Text>
            
            {aiSections.length > 0 ? (
              aiSections.map((section, index) => {
                if (section.type === 'heading') {
                  return (
                    <View key={index}>
                      <Text style={styles.aiHeading}>{section.title}</Text>
                      {section.text && <Text style={styles.aiText}>{section.text}</Text>}
                    </View>
                  );
                } else if (section.type === 'bullet') {
                  return <Text key={index} style={styles.aiBulletPoint}>• {section.text}</Text>;
                } else {
                  return <Text key={index} style={styles.aiText}>{section.text}</Text>;
                }
              })
            ) : (
              <View>
                <Text style={styles.aiHeading}>Executive Summary</Text>
                <Text style={styles.aiText}>
                  This analysis provides comprehensive insights into your Bitcoin investment strategy, addressing common 
                  concerns while highlighting the strengths of your disciplined, systematic approach to wealth building.
                </Text>
                
                <Text style={styles.aiHeading}>Strategic Assessment</Text>
                <Text style={styles.aiText}>
                  Your Dollar-Cost Averaging (DCA) approach represents a time-tested investment methodology specifically 
                  designed to navigate Bitcoin's inherent volatility. By committing to regular contributions regardless 
                  of price fluctuations, you're implementing a strategy that removes emotional decision-making from your 
                  investment process.
                </Text>
                
                <Text style={styles.aiHeading}>Key Investment Principles</Text>
                <Text style={styles.aiBulletPoint}>• Dollar-Cost Averaging systematically reduces the impact of volatility over extended periods</Text>
                <Text style={styles.aiBulletPoint}>• Long-term perspective enables you to benefit from multiple market cycles</Text>
                <Text style={styles.aiBulletPoint}>• Consistent contributions harness the power of compound growth over time</Text>
                <Text style={styles.aiBulletPoint}>• Disciplined methodology eliminates emotional market timing decisions</Text>
                <Text style={styles.aiBulletPoint}>• Systematic approach builds sustainable wealth-building habits</Text>
                
                <Text style={styles.aiHeading}>Risk Management & Volatility Considerations</Text>
                <Text style={styles.aiText}>
                  Bitcoin markets exhibit significant volatility and remain inherently unpredictable. These projections 
                  represent mathematical models based on historical patterns and reasonable assumptions—they are not 
                  guarantees of future performance. However, your long-term, systematic investment approach is 
                  specifically designed to navigate this volatility effectively, potentially smoothing out short-term 
                  price fluctuations through consistent accumulation over time.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.disclaimer}>
            <Text>
              DISCLAIMER: This report is for informational purposes only and does not constitute financial advice. 
              Bitcoin investments are highly volatile and speculative. Past performance does not guarantee future results. 
              Please consult with a qualified financial advisor before making investment decisions. 
              The AI analysis is generated using artificial intelligence and should be considered alongside professional financial guidance.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>bitcoinwealthbuilder.ai • Intelligent Bitcoin Investment Planning • Page 3</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReportDocument;