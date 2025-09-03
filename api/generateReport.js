// Vercel serverless function for AI-powered report generation
// This function securely calls the Google Gemini API to generate personalized financial plan explanations

export default async function handler(req, res) {
  // Set CORS headers for development and production
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    // Log incoming raw data for debugging
    console.log("--- RAW INCOMING DATA ---");
    console.log(JSON.stringify(req.body, null, 2));

    // Validate environment variable
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing REACT_APP_GEMINI_API_KEY environment variable');
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error. API key not found.' 
      });
    }

    // Validate request body with enhanced data including projection data
    const { 
      goalName, 
      timeHorizon, 
      finalValue, 
      monthlyContribution, 
      startingCapital = 0,
      growthScenario = 'Moderate',
      targetAmount,
      retirementStrategy,
      projectionMode,
      chartData = []
    } = req.body;
    
    if (!goalName || !timeHorizon || !finalValue || monthlyContribution === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: goalName, timeHorizon, finalValue, monthlyContribution' 
      });
    }

    // Validate data types
    if (typeof goalName !== 'string' || 
        typeof timeHorizon !== 'number' || 
        typeof finalValue !== 'number' || 
        typeof monthlyContribution !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid data types in request body' 
      });
    }

    // Format currency for the prompt
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    // Insight Extraction Functions
    const calculatePeakDrawdownPercentage = (chartData) => {
      if (!chartData || chartData.length < 2) return 0;
      
      let peakValue = chartData[0].portfolioValue || 0;
      let maxDrawdown = 0;
      
      for (let i = 1; i < chartData.length; i++) {
        const currentValue = chartData[i].portfolioValue || 0;
        
        // Update peak if we hit a new high
        if (currentValue > peakValue) {
          peakValue = currentValue;
        } else {
          // Calculate drawdown from peak
          const drawdown = ((peakValue - currentValue) / peakValue) * 100;
          maxDrawdown = Math.max(maxDrawdown, drawdown);
        }
      }
      
      return Math.round(maxDrawdown * 10) / 10; // Round to 1 decimal place
    };

    const calculateContributionVsGrowthRatio = (chartData, monthlyContribution, timeHorizon) => {
      if (!chartData || chartData.length === 0) return "50/50 (estimated)";
      
      const totalMonths = timeHorizon * 12;
      const totalContributions = (monthlyContribution * totalMonths) + (startingCapital || 0);
      const finalValue = chartData[chartData.length - 1]?.portfolioValue || 0;
      
      if (finalValue <= 0) return "Unable to calculate";
      
      const contributionPercentage = Math.round((totalContributions / finalValue) * 100);
      const growthPercentage = 100 - contributionPercentage;
      
      return `${contributionPercentage}% contributions / ${growthPercentage}% market growth`;
    };

    const calculatePeakLtvRatio = (chartData, retirementStrategy) => {
      // Only relevant for retirement plans using "borrow" strategy
      if (retirementStrategy !== 'borrow' || !chartData || chartData.length === 0) {
        return null;
      }
      
      // For borrow strategy, simulate maximum LTV during retirement phase
      // This would typically be calculated during retirement simulation
      // For now, we'll estimate based on common withdrawal rates vs portfolio value
      const finalValue = chartData[chartData.length - 1]?.portfolioValue || 0;
      const estimatedMaxLoan = finalValue * 0.4; // Conservative 40% LTV assumption
      const estimatedLtvRatio = Math.round((estimatedMaxLoan / finalValue) * 100);
      
      return `${estimatedLtvRatio}%`;
    };

    // Calculate insights from projection data
    const peakDrawdownPercentage = calculatePeakDrawdownPercentage(chartData);
    const contributionVsGrowthRatio = calculateContributionVsGrowthRatio(chartData, monthlyContribution, timeHorizon);
    const peakLtvRatio = calculatePeakLtvRatio(chartData, retirementStrategy);

    // Log calculated insight metrics
    console.log("--- CALCULATED INSIGHT METRICS ---");
    console.log(`Peak Drawdown: ${peakDrawdownPercentage}%`);
    console.log(`Contribution vs Growth Ratio: ${contributionVsGrowthRatio}`);
    console.log(`Peak LTV Ratio: ${peakLtvRatio || 'Not applicable'}`);
    console.log(`Chart Data Length: ${chartData?.length || 0} points`);

    // Master AI System Prompt Template (with placeholders to be replaced)
    const systemPromptTemplate = `
You are a seasoned wealth management strategist with deep expertise in digital assets, writing a personalized analysis for a client's report. The audience is an intelligent skeptic. Your tone must be that of a calm, objective fiduciary. Do not use hype. Use markdown for formatting.

Here is the client's plan data:
- Goal: {{goalName}}
- Time Horizon: {{timeHorizon}} years
- Monthly Contribution: $ {{monthlyContribution}}
- Final Projected Value: $ {{finalValue}}

Here is our internal analysis of their simulation:
- Peak Simulated Drawdown: {{peakDrawdownPercentage}}%
- Contribution vs. Growth Ratio: {{contributionVsGrowthRatio}}
- Peak Retirement LTV (if applicable): {{peakLtvRatio}}

Please structure your analysis with the following four sections. **You MUST weave the specific data points from the client's plan AND the internal analysis into your narrative to make your insights tangible and personal.**

### 1. Executive Summary
Summarize the plan's objective and its projected outcome. **You must** mention the specific goal and the final projected value.

### 2. Analysis of Strategy
Explain the core strategy of Dollar-Cost Averaging. **Crucially, you must** use the 'Contribution vs. Growth Ratio' data to explain HOW MUCH of their final wealth is projected to come from their disciplined saving vs. market performance. **You must** reference the specific monthly contribution amount of **$ {{monthlyContribution}}**.

### 3. Stress Test & Volatility Analysis
Directly address risk using the 'Peak Simulated Drawdown' data. **You must** state that the simulation weathered a drop of **{{peakDrawdownPercentage}}%**. Frame their **{{timeHorizon}}-year** time horizon as the key to navigating this volatility. {{ltv_analysis}}

### 4. Actionable Insight & Concluding Remark
Provide a single, actionable piece of advice based on the data provided. For example, if the drawdown is high, advise them to be mentally prepared for the journey. If the LTV is borderline, suggest a lower withdrawal rate. Conclude by summarizing the plan's viability based on its disciplined, long-term nature.
    `.trim();

    // Prepare LTV analysis text if applicable
    const ltvAnalysisText = (peakLtvRatio && peakLtvRatio !== 'Not applicable' && retirementStrategy === 'borrow') 
      ? `If this is a 'Borrow for Income' retirement plan, **you must** analyze the 'Peak Retirement LTV' and comment on its level of safety.`
      : '';

    // Replace all placeholders with actual values
    let finalPrompt = systemPromptTemplate
      .replace(/{{goalName}}/g, goalName)
      .replace(/{{timeHorizon}}/g, timeHorizon.toString())
      .replace(/{{monthlyContribution}}/g, monthlyContribution.toString())
      .replace(/{{finalValue}}/g, finalValue.toString())
      .replace(/{{peakDrawdownPercentage}}/g, peakDrawdownPercentage.toString())
      .replace(/{{contributionVsGrowthRatio}}/g, contributionVsGrowthRatio)
      .replace(/{{peakLtvRatio}}/g, peakLtvRatio || 'Not applicable')
      .replace(/{{ltv_analysis}}/g, ltvAnalysisText);

    // Log final prompt after all replacements
    console.log("--- FINAL AI PROMPT ---");
    console.log("Prompt length:", finalPrompt.length, "characters");
    console.log("Full prompt content:");
    console.log(finalPrompt);

    // Prepare the request payload for Gemini API
    const requestPayload = {
      contents: [
        {
          parts: [
            {
              text: finalPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 4096,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };

    // Log complete API payload before sending
    console.log("--- GEMINI API PAYLOAD ---");
    console.log("API Key present:", !!apiKey);
    console.log("API Key length:", apiKey?.length || 0);
    console.log("Complete request payload:");
    console.log(JSON.stringify(requestPayload, null, 2));

    // Make the API call to Google Gemini
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorData);
      return res.status(500).json({ 
        success: false, 
        error: `AI service error: ${geminiResponse.status}` 
      });
    }

    const geminiData = await geminiResponse.json();
    
    // Extract the generated text from the response
    if (!geminiData.candidates || 
        !geminiData.candidates[0] || 
        !geminiData.candidates[0].content || 
        !geminiData.candidates[0].content.parts || 
        !geminiData.candidates[0].content.parts[0] ||
        !geminiData.candidates[0].content.parts[0].text) {
      console.error('Unexpected Gemini API response structure:', geminiData);
      return res.status(500).json({ 
        success: false, 
        error: 'Invalid response from AI service' 
      });
    }

    const generatedSummary = geminiData.candidates[0].content.parts[0].text;

    // Return the successful response
    return res.status(200).json({
      success: true,
      summary: generatedSummary
    });

  } catch (error) {
    console.error('Server error in generateReport:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error occurred while generating report' 
    });
  }
}