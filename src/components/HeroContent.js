import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../utils/i18n';
import PhoneImage from '../assets/svg/phone.svg';
import qrCode from '../assets/images/qr-code.png';
import avatar1 from '../assets/images/avatar1.png';
import avatar2 from '../assets/images/avatar2.png';
import avatar3 from '../assets/images/avatar3.png';
import avatar4 from '../assets/images/avatar4.png';
import avatar5 from '../assets/images/avatar5.png';
import avatar6 from '../assets/images/avatar6.png';
import logoSimple from '../assets/images/logo_simple.png';
import instagramIcon from '../assets/images/instagram_icon.png';
import tiktokIcon from '../assets/images/tiktok_icon.png';
import emailIcon from '../assets/images/email_icon.png';
import '../styles/HeroContent.css';
import LoginModal from './LoginModal';
import UserProfileModal from './UserProfileModal';
import AccountSuccessModal from './AccountSuccessModal';

function HeroContent() {
  const { t, language } = useLanguage();
  const [phoneLoaded, setPhoneLoaded] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const testimonialsRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Define testimonials array first before any hooks that use it
  const testimonials = [
    {
      id: 1,
      name: 'Lu',
      age: 33,
      location: 'Almería',
      avatar: avatar1,
      quote: "Como hay muchas noticias falsas, uso LokDis para verificar si algo es verdad o no.",
    },
    {
      id: 2,
      name: 'Ca_lop',
      age: 36,
      location: 'Zaragoza',
      avatar: avatar2,
      quote: "Con LokDis puedo ver en tiempo real lo que está pasando cerca de mi casa.",
    },
    {
      id: 3,
      name: 'Carlita',
      age: 26,
      location: 'Madrid',
      avatar: avatar3,
      quote: "LokDis me ha salvado de ir a sitios llenos de gente. Pido fotos y evito colas.",
    },
    {
      id: 4,
      name: 'Álvaro',
      age: 32,
      location: 'Valencia',
      avatar: avatar4,
      quote: "LokDis me ayuda a encontrar rutas de senderismo poco concurridas. Genial.",
    },
    {
      id: 5,
      name: 'Mariaaa',
      age: 20,
      location: 'País Vasco',
      avatar: avatar5,
      quote: "Antes de ir a un restaurante, compruebo en LokDis cómo está el ambiente.",
    },
    {
      id: 6,
      name: 'Ser.29',
      age: 23,
      location: 'Islas Canarias',
      avatar: avatar6,
      quote: "Gracias a LokDis pude ver mi barrio durante las inundaciones. Muy útil.",
    },
  ];
  
  // Effect para detectar cambios en el ancho de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Animación para el teléfono
  useEffect(() => {
    // Add a small delay to make the animation more noticeable
    const timer = setTimeout(() => {
      setPhoneLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Ensure testimonials are properly scrollable on mount
  useEffect(() => {
    if (testimonialsRef.current) {
      // Reset scroll position to start
      testimonialsRef.current.scrollLeft = 0;
      
      // Force a small delay to ensure layout is complete
      setTimeout(() => {
        testimonialsRef.current.scrollLeft = 0;
      }, 100);
    }
  }, [windowWidth]);
  
  // Add handler for opening the login modal
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  // Add handler for closing the login modal
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  
  // Add handler for when login is complete
  const handleLoginComplete = (profileData) => {
    console.log('🔴 HeroContent: handleLoginComplete llamado con:', profileData);
    // Check if this is a complete profile (from UserProfileModal)
    if (profileData && profileData.success) {
      console.log('🔴 HeroContent: Detectado success=true, mostrando AccountSuccessModal');
      // If it's a completed profile with success, show success modal directly
      setUserProfile(profileData);
      setIsSuccessModalOpen(true);
    } else {
      // Original flow - just email
      console.log('🔴 HeroContent: Email recibido, mostrando UserProfileModal');
      // Save the email from login
      setUserEmail(profileData);
      // Close the login modal (should already be closed)
      setIsLoginModalOpen(false);
      // Open the profile modal for the next step
      setIsProfileModalOpen(true);
    }
  };
  
  // Add handler for closing the profile modal
  const closeProfileModal = () => {
    console.log('🔴 HeroContent: closeProfileModal llamado');
    setIsProfileModalOpen(false);
  };
  
  // Add handler for when profile setup is complete
  const handleProfileComplete = (profileData) => {
    console.log('🔵 HeroContent: handleProfileComplete llamado con:', profileData);
    
    // Save the profile data
    setUserProfile(profileData);
    
    // Close the profile modal
    setIsProfileModalOpen(false);
    
    // Show success modal ONLY if success flag is true
    if (profileData && profileData.success) {
      console.log('🔵 HeroContent: Success=true, mostrando AccountSuccessModal');
      setIsSuccessModalOpen(true);
      console.log('🔵 AccountSuccessModal debería mostrarse ahora (isSuccessModalOpen =', true, ')');
    } else {
      console.log('🔵 HeroContent: No hay success flag, no se muestra AccountSuccessModal');
    }
    
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
    <div className="hero-content">
        <div className="hero-title-mobile">
        <h1>{t('heroTitle')}</h1>
        </div>
        
        <div className="hero-image">
          <div className="phone-container">
            <img 
              src={PhoneImage} 
              alt="Lokdis App"
              className={`phone-image ${phoneLoaded ? 'phone-loaded' : ''}`}
            />
            <div className="phone-glow"></div>
          </div>
        </div>
        
        <div className="hero-text">
          <h1 className="hero-title-desktop landscape-title">{t('heroTitle')}</h1>
          <p>{t('heroSubtitle')}</p>
          <p className="hero-description">{t('heroDescription')}</p>
          <button className="try-button" onClick={openLoginModal}>
            {t('tryButton')}
          </button>
          
        <div className="app-stores">
            <button className="store-badge">
              <img 
                src={require('../assets/images/googleplay_icon.png')} 
                alt="Google Play" 
                width="60" 
                height="60" 
              />
            </button>
            <button className="store-badge">
              <img 
                src={require('../assets/images/applestore_icon.png')} 
                alt="App Store" 
                width="60" 
                height="60" 
              />
            </button>
          <div className="qr-code">
              <img 
                src={qrCode} 
                alt="QR Code" 
                width="90" 
                height="90"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="testimonials-background">
        <div 
          className="testimonials-section" 
          ref={testimonialsRef} 
        >
          <div className="testimonials-wrapper">
            <div className="testimonials-container">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="testimonial-card"
                >
        <img 
              src={testimonial.avatar} 
              alt={`${testimonial.name}'s avatar`} 
              className="testimonial-avatar" 
            />
            <blockquote className="testimonial-quote">
              {testimonial.quote}
            </blockquote>
            <div className="testimonial-author">
              <strong>{testimonial.name}</strong> {testimonial.age} {t('years')}
            </div>
            <div className="testimonial-location">
              {testimonial.location}
            </div>
          </div>
        ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="main-content">
        <footer className="footer-section">
          <div className="footer-content-wrapper">
            <div className="footer-row">
                <button className="footer-link">{t('aboutUs')}</button>
                <button className="footer-link">{t('privacyPolicy')}</button>
                <button className="footer-link">{t('termsConditions')}</button>
                <button className="footer-link">{t('faqs')}</button>
                <button className="footer-link">{t('siteMap')}</button>
              <div className="footer-social">
                <a href="https://www.instagram.com/" className="social-icon instagram">
                  <img src={instagramIcon} alt="Instagram" className="footer-social-img footer-social-img--small" />
                </a>
                <a href="https://www.tiktok.com/" className="social-icon tiktok">
                  <img src={tiktokIcon} alt="TikTok" className="footer-social-img footer-social-img--small" />
                </a>
                <a href="mailto:info@lokdis.com" className="social-icon email">
                  <img src={emailIcon} alt="Email" className="footer-social-img" />
                </a>
              </div>
            </div>
            
            <div className="footer-main">
              <div className="footer-main-content">
              <div className="footer-logo">
                <img 
                  src={logoSimple} 
                  alt="Lokdis Logo" 
                  className="footer-logo-simple" 
                />
                  <div className="footer-logo-text">LOKDIS</div>
              </div>
              <div className="footer-download">
                <div className="footer-stores">
                  <a href="https://play.google.com/store/" className="store-badge-footer">
                    <img 
                        src={require('../assets/images/googleplay_icon.png')} 
                        alt="Google Play" 
                        width="60" 
                        height="60" 
                    />
                  </a>
                  <a href="https://www.apple.com/app-store/" className="store-badge-footer">
                    <img 
                        src={require('../assets/images/applestore_icon.png')} 
                        alt="App Store" 
                        width="60" 
                        height="60" 
                    />
                  </a>
                </div>
                <div className="footer-qr">
                  <img src={qrCode} alt="QR Code" />
                </div>
              </div>
            </div>
              <div className="footer-copyright-row">
            <div className="footer-copyright">
                  {t('copyright')}
                </div>
              </div>
            </div>
          </div>
        </footer>
    </div>

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

export default HeroContent; 