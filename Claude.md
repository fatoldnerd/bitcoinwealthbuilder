# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bitcoin Wealth Builder is a React-based single-page application that provides Bitcoin financial calculators. The app focuses on privacy-first calculations (all computations performed client-side) and offers three core modules:

1. **Interest Calculator**: Projects Bitcoin investment growth with compound interest
2. **LTV Calculator**: Calculates loan-to-value ratios for Bitcoin-backed loans  
3. **Retirement Calculator**: Bitcoin retirement planning calculations

## Development Commands

- `npm start` - Start development server (runs on http://localhost:3000)
- `npm run build` - Build production bundle
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (one-way operation)

## Architecture & Technology Stack

### Core Technologies
- **React 19** - Main UI framework
- **React Router DOM** - Client-side routing between calculators
- **Recharts** - Data visualization for growth charts
- **Axios** - HTTP client for Bitcoin price API calls

### Application Structure
```
src/
├── App.js                 - Main app component with routing
├── InterestCalculator.js  - Compound interest calculations
├── LTVCalculator.js      - Loan-to-value calculations
├── RetirementCalculator.js - Retirement planning
└── App.css               - Global styles
```

### Key Integrations
- **CoinGecko API**: Fetches live Bitcoin prices for LTV calculations
- **Client-side calculations**: All financial computations happen in browser for privacy

### Component Patterns
- Each calculator is a standalone React component with its own state
- Uses React hooks (useState, useEffect) for state management
- Form inputs control calculation parameters
- Results display in structured format with charts where applicable

## Standard Workflow
1. First think through the problem, read the codebase for relevant files, and write a plan to todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.