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
    // Validate environment variable
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing REACT_APP_GEMINI_API_KEY environment variable');
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error. API key not found.' 
      });
    }

    // Validate request body with enhanced data
    const { 
      goalName, 
      timeHorizon, 
      finalValue, 
      monthlyContribution, 
      startingCapital = 0,
      growthScenario = 'Moderate',
      targetAmount,
      retirementStrategy,
      projectionMode
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

    // Master System Prompt - Premium AI Analysis (4-Section Structure)
    const systemPrompt = `
You are a senior financial strategist and Bitcoin investment analyst at a premier wealth management firm. You are writing a professional analysis for an intelligent client who may have concerns about Bitcoin as an investment vehicle. Your analysis should be sophisticated, balanced, and thoroughly professional—avoiding both crypto hype and unnecessary skepticism. Write as you would for a discerning investor who values nuanced, evidence-based insights.

CLIENT INVESTMENT PARAMETERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Investment Goal: ${goalName}
• Investment Timeline: ${timeHorizon} years
• Initial Capital Deployment: ${formatCurrency(startingCapital)}
• Systematic Monthly Allocation: ${formatCurrency(monthlyContribution)}
• Market Growth Assumption: ${growthScenario} scenario
• Projected Portfolio Value: ${formatCurrency(finalValue)}${targetAmount ? `
• Target Wealth Objective: ${formatCurrency(targetAmount)}` : ''}${retirementStrategy ? `
• Exit Strategy Framework: ${retirementStrategy === 'sell' ? 'Systematic liquidation for income generation' : 'Collateralized borrowing to preserve holdings'}` : ''}${projectionMode ? `
• Calculation Methodology: ${projectionMode}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROFESSIONAL ANALYSIS FRAMEWORK:
Structure your analysis using the following four sections with markdown headers. Each section should demonstrate sophisticated financial reasoning:

### Executive Summary
Provide a comprehensive overview of this investment strategy's objectives, methodology, and expected outcomes. Address both the strategic rationale and the practical implementation approach in 2-3 substantive paragraphs that establish credibility and demonstrate deep understanding.

### Strategic Investment Assessment
Analyze the systematic investment approach in detail. Discuss dollar-cost averaging methodology, the significance of the chosen time horizon, how the monthly allocation strategy mitigates timing risk, and why this systematic approach aligns with both behavioral finance principles and Bitcoin's unique market characteristics. Include insights about portfolio construction and risk-adjusted return expectations.

### Volatility Management & Risk Framework
Address Bitcoin's volatility profile directly and professionally. Explain how systematic accumulation strategies are specifically designed to navigate high-volatility assets, discuss the mathematical principles behind volatility smoothing through regular investments, and analyze both the challenges and opportunities presented by Bitcoin's price dynamics. Address tail risks and stress-test scenarios.

### Concluding Professional Assessment
Synthesize the analysis into actionable insights. Evaluate the overall strategy's alignment with modern portfolio theory adaptations for alternative assets, discuss implementation considerations, and provide a balanced professional judgment on the approach's strengths and areas requiring ongoing monitoring. Conclude with forward-looking strategic considerations.

TONE & STYLE REQUIREMENTS:
• Write with the authority of a seasoned institutional investment strategist
• Use precise financial terminology while maintaining accessibility
• Demonstrate quantitative sophistication without overwhelming with jargon
• Balance optimism with appropriate professional caution
• Address skepticism through evidence-based reasoning rather than dismissive language
• Maintain intellectual rigor throughout—this should read like premium financial advisory content
    `.trim();

    // Prepare the request payload for Gemini API
    const requestPayload = {
      contents: [
        {
          parts: [
            {
              text: systemPrompt
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