## **Product Requirements Document: Bitcoin Wealth Builder (v1.0)**

### **1\. Introduction**

This document outlines the product requirements for the initial version of the **Bitcoin Wealth Builder** mobile application. The app will launch with two core financial tools: a Bitcoin Compound Interest Calculator and a Bitcoin Loan LTV Calculator. The primary goal is to provide essential, high-value calculators for Bitcoin holders to project wealth and manage risk.

### **2\. Overarching Principles**

* **Focused Functionality:** The app will excel at its two core functions, providing a reliable and intuitive user experience.  
* **Clear UI/UX:** The interface will be clean and straightforward, allowing users to perform calculations quickly and understand the results at a glance.  
* **Data Privacy:** All calculations will be performed on the user's device. No personal financial data will be stored or transmitted.

---

### **3\. Module 1: Compound Interest Calculator**

This module projects the future growth of a Bitcoin investment.

* **User Inputs:**  
  * **Initial Investment Amount:** The starting principal (in BTC or local currency).  
  * **Regular Monthly Addition:** The recurring amount to be invested.  
  * **Time in Years:** The total investment duration.  
  * **Annual Interest Rate (%):** The anticipated annual yield.  
  * **Compounding Frequency:** How often interest is calculated (e.g., Daily, Monthly, Annually).  
* **Calculated Outputs:**  
  * **Total Future Value:** The final projected value of the investment.  
  * **Total Principal Invested:** The sum of the initial and all monthly additions.  
  * **Total Interest Earned:** The profit generated from compounding.  
  * **Growth Chart:** A line graph visualizing the investment's growth over time.

---

### **4\. Module 2: Bitcoin Loan LTV Calculator**

This module helps users understand the dynamics of a Bitcoin-backed loan.

* **User Inputs:**  
  * **Collateral Amount (BTC):** The amount of Bitcoin to be used as collateral.  
  * **Current Bitcoin Price:** The market price of Bitcoin (can have a manual override).  
  * **Desired Loan Amount:** The amount of cash the user wants to borrow.  
* **Calculated Outputs:**  
  * **Loan-to-Value (LTV) Ratio:** The ratio of the loan amount to the value of the collateral, displayed prominently with a color code (e.g., green for safe, yellow for caution, red for high-risk).  
  * **Liquidation Price:** The Bitcoin price at which the collateral would be at risk of liquidation.  
  * **Total Collateral Value:** The current value of the user's collateral in their local currency.

---

### **5\. Next Steps: Streamlined Task List**

Here is the updated task list for building version 1.0 of the app:

* \[ \] **Task 1: Setup & Core App Structure:**  
  * Set up the development environment for iOS and Android.  
  * Build the main navigation to switch between the two calculator modules.  
* \[ \] **Task 2: Develop Module 1 (Compound Interest):**  
  * Build the user interface for all inputs.  
  * Implement the compound interest formula and display the outputs and growth chart.  
* \[ \] **Task 3: Develop Module 2 (LTV Calculator):**  
  * Build the user interface for the LTV inputs.  
  * Implement the LTV and liquidation price calculations.  
  * (Optional but Recommended) Integrate a cryptocurrency API (e.g., CoinGecko, CoinMarketCap) to fetch the live Bitcoin price automatically.  
* \[ \] **Task 4: Testing & Deployment:**  
  * Thoroughly test both modules for calculation accuracy and usability on various devices.  
  * Fix any identified bugs and refine the UI.  
  * Prepare app store listings (screenshots, description) and submit for review.

