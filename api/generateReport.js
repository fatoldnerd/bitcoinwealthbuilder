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

    // User-Specified Skeptic-Focused AI Prompt
    const systemPrompt = `
You are a seasoned wealth management strategist with deep expertise in digital assets. Your task is to write a clear, objective, and insightful analysis of a client's Bitcoin investment plan for an appendix in a financial report.
The intended audience is an intelligent but skeptical party (e.g., a spouse, parent, or traditional financial advisor) who is concerned about the risks of Bitcoin.
Your tone must be that of a fiduciary: calm, measured, and focused on the long-term. Do not use hype or jargon. Acknowledge the skeptic's concerns as valid before addressing them with data and logic. Use simple analogies to explain complex concepts.

Here is the client's data:
- Goal Name: ${goalName}
- Time Horizon: ${timeHorizon} years
- Starting Capital: ${formatCurrency(startingCapital)}
- Monthly Contribution: ${formatCurrency(monthlyContribution)}
- Growth Scenario Used: ${growthScenario}
- Final Projected Value: ${formatCurrency(finalValue)}

Please structure your response with the following four sections, using markdown for formatting:

### 1. Executive Summary
Start with a brief, one-paragraph summary of the plan's objective. Clearly state the goal, the time horizon, and the projected outcome based on the chosen scenario.

### 2. The Strategy: A Disciplined, Long-Term Approach
In this section, explain the 'how'. Describe the core strategy of Dollar-Cost Averaging (DCA). Explain *why* the plan to consistently invest ${formatCurrency(monthlyContribution)} every month is a sound method for mitigating risk over a ${timeHorizon}-year period. Use an analogy, for example: "Think of this as turning volatility from an enemy into an ally. By buying consistently, the plan automatically acquires more Bitcoin when the price is low and less when the price is high."

### 3. Addressing the Primary Concern: Volatility
Directly address the skeptic's main fear. Acknowledge that Bitcoin's price is famously volatile and that the journey will not be a straight line. Explain that this projection is based on a **${growthScenario}** growth model and is a long-term average; the actual value will fluctuate significantly. Frame the ${timeHorizon}-year time horizon as the primary tool for managing this risk, allowing the plan to ride out market cycles.

### 4. Concluding Analysis
Provide a final, concluding paragraph that summarizes the plan's viability. Reiterate that while no investment is without risk and this projection is not a guarantee, the plan's foundation in consistent, long-term saving represents a robust and well-considered strategy for achieving the stated goal of reaching **${formatCurrency(finalValue)}**.
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