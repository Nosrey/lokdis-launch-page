import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo_simple.png';
import { useLanguage } from '../utils/i18n';

function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Detectar scroll para cambiar apariencia del navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo-container">
            <img src={logo} alt="Lokdis Logo" className="navbar-logo" />
            <h2 className="navbar-brand">LOKDIS</h2>
          </div>
          <button className="navbar-cta navbar-cta-desktop">
            {t('ctaButton')}
          </button>
        </div>
        
        <div className="navbar-right">
          <div className="navbar-desktop-links">
            <button 
              className="navbar-link" 
              onClick={toggleLanguage}
            >
              {t('languageButton')}
            </button>
            <button className="navbar-link">
              {t('loginButton')}
            </button>
          </div>
          
          <button 
            className="navbar-mobile-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className={`menu-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`menu-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`menu-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      <div className={`navbar-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="navbar-mobile-menu-content">
          <button className="navbar-mobile-link" onClick={toggleLanguage}>
            {t('languageButton')}
          </button>
          <button className="navbar-mobile-link">
            {t('loginButton')}
          </button>
          <button className="navbar-cta navbar-cta-mobile">
            {t('ctaButton')}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 