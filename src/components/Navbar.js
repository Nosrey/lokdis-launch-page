import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo_simple.png';
import { useLanguage } from '../utils/i18n';
import LoginModal from './LoginModal';
import UserProfileModal from './UserProfileModal';
import AccountSuccessModal from './AccountSuccessModal';

function Navbar() {
  const { t, language, toggleLanguage, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  
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
    // Cerrar el menú de idiomas si está abierto
    if (languageMenuOpen) setLanguageMenuOpen(false);
  };
  
  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };
  
  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    setLanguageMenuOpen(false);
  };
  
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    // Cierra el menú móvil si está abierto
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    // Cierra el menú de idiomas si está abierto
    if (languageMenuOpen) {
      setLanguageMenuOpen(false);
    }
  };
  
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  
  // Add handler for when login is complete
  const handleLoginComplete = (email) => {
    // Save the email from login
    setUserEmail(email);
    // Close the login modal
    setIsLoginModalOpen(false);
    // Open the profile modal for the next step
    setIsProfileModalOpen(true);
  };
  
  // Add handler for closing the profile modal
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };
  
  // Add handler for when profile setup is complete
  const handleProfileComplete = (profileData) => {
    // Save the profile data
    setUserProfile(profileData);
    // Close the profile modal
    setIsProfileModalOpen(false);
    // Show success modal
    setIsSuccessModalOpen(true);
    
    // Here you would typically integrate with your API
    console.log('Registration complete with:', {
      email: userEmail,
      username: profileData.username,
      avatar: profileData.avatar
    });
  };
  
  // Add handler for closing the success modal
  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };
  
  // Add handler for continuing from success screen
  const handleSuccessContinue = () => {
    setIsSuccessModalOpen(false);
    // Here you would typically redirect to main app or dashboard
  };
  
  return (
    <>
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
              <div className="navbar-language-container">
                <button 
                  className="navbar-link navbar-language-toggle" 
                >
                  {t('languageButton')}
                  <span className="language-arrow">▼</span>
                </button>
                <div className="navbar-language-dropdown">
                  <button 
                    className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                    onClick={() => setLanguage('en')}
                  >
                    English
                  </button>
                  <button 
                    className={`dropdown-item ${language === 'es' ? 'active' : ''}`}
                    onClick={() => setLanguage('es')}
                  >
                    Español
                  </button>
                </div>
              </div>
              <button className="navbar-link" onClick={openLoginModal}>
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
          <img src={logo} alt="Lokdis Logo" className="navbar-mobile-menu-logo" />
          <div className="navbar-mobile-menu-content">
            <div className="navbar-mobile-language-container">
              <button className="navbar-mobile-link" onClick={toggleLanguageMenu}>
                {t('languageButton')}
                <span className={`language-arrow ${languageMenuOpen ? 'open' : ''}`}>▼</span>
              </button>
              {languageMenuOpen && (
                <div className="navbar-mobile-language-dropdown">
                  <button 
                    className={`mobile-dropdown-item ${language === 'en' ? 'active' : ''}`}
                    onClick={() => handleSelectLanguage('en')}
                  >
                    English
                  </button>
                  <button 
                    className={`mobile-dropdown-item ${language === 'es' ? 'active' : ''}`}
                    onClick={() => handleSelectLanguage('es')}
                  >
                    Español
                  </button>
                </div>
              )}
            </div>
            <button className="navbar-mobile-link" onClick={openLoginModal}>
              {t('loginButton')}
            </button>
            <button className="navbar-cta navbar-cta-mobile">
              {t('ctaButton')}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
        language={language}
        onComplete={handleLoginComplete}
      />
      
      {/* Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        language={language}
        onComplete={handleProfileComplete}
      />
      
      {/* Success Modal */}
      <AccountSuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        onContinue={handleSuccessContinue}
        language={language}
      />
    </>
  );
}

export default Navbar; 