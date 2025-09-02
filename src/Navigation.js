import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  // Get current location to determine active calculator page
  const location = useLocation();
  
  // State management for dropdown and mobile menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Calculator dropdown items
  const calculatorItems = [
    { path: '/retirement', label: 'Retirement Calculator', icon: '🏖️' },
    { path: '/ltv', label: 'LTV Calculator', icon: '🏦' },
    { path: '/interest', label: 'Interest Calculator', icon: '📈' },
    { path: '/opportunity-cost', label: 'Opportunity Cost', icon: '💸' }
  ];

  // Check if current page is a calculator page
  const calculatorPaths = ['/retirement', '/ltv', '/interest', '/opportunity-cost'];
  const isCalculatorPage = calculatorPaths.includes(location.pathname);

  // Handle dropdown hover for desktop
  const handleDropdownEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    setIsDropdownOpen(false);
  };

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="app-header">
      <nav className="nav-container">
        {/* Logo - Now clickable to return home */}
        <Link to="/" className="logo-link">
          <div className="logo">
            <h1>₿ Bitcoin Wealth Builder</h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-nav">
          {/* Home Link - First item in navigation */}
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>

          {/* Goal Planner - Now with unified styling */}
          <NavLink to="/goal-planner" className="nav-link">
            🎯 Goal Planner
          </NavLink>

          {/* Calculators Dropdown */}
          <div 
            className="dropdown-container"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
            ref={dropdownRef}
          >
            <button className={`dropdown-trigger nav-link ${isCalculatorPage ? 'active' : ''}`}>
              Calculators ▾
            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {calculatorItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="dropdown-item"
                    onClick={handleLinkClick}
                  >
                    <span className="dropdown-icon">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Standard Navigation Links */}
          <NavLink to="/dashboard" className="nav-link">
            ⛏️ My Dashboard
          </NavLink>
          <NavLink to="/guide" className="nav-link">
            📚 User Guide
          </NavLink>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu" ref={mobileMenuRef}>
            <div className="mobile-nav-links">
              {/* Goal Planner - Mobile CTA */}
              <NavLink 
                to="/goal-planner" 
                className="mobile-nav-cta"
                onClick={handleLinkClick}
              >
                🎯 Goal Planner
              </NavLink>

              {/* Calculators Section */}
              <div className="mobile-dropdown-section">
                <div className="mobile-section-header">
                  📊 Calculators
                </div>
                {calculatorItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="mobile-nav-item mobile-sub-item"
                    onClick={handleLinkClick}
                  >
                    <span className="mobile-nav-icon">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* Standard Links */}
              <NavLink 
                to="/dashboard" 
                className="mobile-nav-item"
                onClick={handleLinkClick}
              >
                ⛏️ My Dashboard
              </NavLink>
              <NavLink 
                to="/guide" 
                className="mobile-nav-item"
                onClick={handleLinkClick}
              >
                📚 User Guide
              </NavLink>

              {/* Home link for mobile (since we removed it from desktop) */}
              <NavLink 
                to="/" 
                className="mobile-nav-item"
                onClick={handleLinkClick}
              >
                🏠 Home
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;