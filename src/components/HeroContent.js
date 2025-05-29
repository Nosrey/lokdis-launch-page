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
import whatsappIcon from '../assets/images/whatsapp_icon.png';
import '../styles/HeroContent.css';
import LoginModal from './LoginModal';
import UserProfileModal from './UserProfileModal';
import AccountSuccessModal from './AccountSuccessModal';
import FaqModal from './FaqModal';
import AboutUsModal from './AboutUsModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsConditionsModal from './TermsConditionsModal';
import playStoreBadge from '../assets/images/googleplay_icon.png';
import appStoreBadge from '../assets/images/applestore_icon.png';
import playStoreBadgeEN from '../assets/images/googleplay_icon_en.png';
import appStoreBadgeEN from '../assets/images/applestore_icon_en.png';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const [isTermsConditionsModalOpen, setIsTermsConditionsModalOpen] = useState(false);
  const [isTallDevicePortrait, setIsTallDevicePortrait] = useState(false);
  
  // Define testimonials array first before any hooks that use it
  const baseTestimonials = [
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

  const testimonials = [
    ...baseTestimonials.map(t => ({ ...t, id: `${t.id}-clone-start` }) ),
    ...baseTestimonials,
    ...baseTestimonials.map(t => ({ ...t, id: `${t.id}-clone-end` }) ),
  ];
  
  // Función para establecer la altura real del viewport
  const setViewportHeight = () => {
    // Obtener la altura real del viewport
    let vh = window.innerHeight * 0.01;
    // Establecer la variable CSS personalizada --vh
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  // Effect para detectar cambios en el ancho de la ventana
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowWidth(width);
      const currentIsMobile = width < 768;
      setIsMobile(currentIsMobile);
      const currentIsLandscape = width > height;
      setIsLandscape(currentIsLandscape);
      
      // Actualizar la altura del viewport real
      setViewportHeight();
      
      // Agregar una clase al body para dispositivos Redmi Note Pro 13 y similares en landscape
      if ((width >= 1080 && height <= 600 && width > height) || 
          (width >= 2400 && height <= 1080 && width > height)) {
        document.body.classList.add('redmi-note-pro-landscape');
      } else {
        document.body.classList.remove('redmi-note-pro-landscape');
      }

      // New logic for tall devices in portrait
      const aspectRatio = height / width;
      const isCurrentlyTallDevicePortrait = 
        !currentIsLandscape && // Make sure it's portrait
        width >= 350 && width <= 450 && // CSS pixel width range for these devices
        aspectRatio >= 2.1; // Tall screen aspect ratio
      
      setIsTallDevicePortrait(isCurrentlyTallDevicePortrait);
    };
    
    // Ejecutar al cargar
    setViewportHeight();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    handleResize(); // Llamar inicialmente para establecer los valores correctos
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
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
  
  useEffect(() => {
    const scroller = testimonialsRef.current;
    if (!scroller) return;

    const itemWidth = scroller.scrollWidth / testimonials.length;
    // Start scrolling at the beginning of the "middle" set of testimonials
    const initialScrollLeft = baseTestimonials.length * itemWidth;
    scroller.scrollLeft = initialScrollLeft;

    let isScrolling = false; // Flag to prevent re-triggering while auto-scrolling

    const handleScroll = () => {
      if (isScrolling) return;

      const scrollLeft = scroller.scrollLeft;
      const totalWidth = scroller.scrollWidth;
      const clientWidth = scroller.clientWidth;

      // Threshold should be at least one item width to make the jump less noticeable
      const threshold = itemWidth; 

      // Check if near the end of the combined list (end of the third set)
      // We want to jump back to the end of the second set (the "actual" items)
      if (scrollLeft + clientWidth >= totalWidth - threshold) {
        isScrolling = true;
        // Jump to the corresponding position at the end of the second set
        scroller.scrollLeft = initialScrollLeft + (scrollLeft - initialScrollLeft * 2) ; 
        setTimeout(() => { isScrolling = false; }, 50); // Small delay to prevent immediate re-trigger
      } 
      // Check if near the beginning of the combined list (beginning of the first set)
      // We want to jump to the beginning of the second set (the "actual" items)
      else if (scrollLeft <= threshold) { 
        isScrolling = true;
        // Jump to the corresponding position at the beginning of the second set
        scroller.scrollLeft = initialScrollLeft + scrollLeft;
        setTimeout(() => { isScrolling = false; }, 50); // Small delay
      }
    };

    scroller.addEventListener('scroll', handleScroll);
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [baseTestimonials, testimonials.length]);
  
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
    
    // Close the profile modal FIRST
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
  
  // Handler para cerrar ambos modales (profile y success)
  const closeAllModals = () => {
    setIsProfileModalOpen(false);
    setIsSuccessModalOpen(false);
  };

  const handleOpenFaqModal = () => {
    setIsFaqModalOpen(true);
  };

  const handleCloseFaqModal = () => {
    setIsFaqModalOpen(false);
  };

  const handleOpenAboutUsModal = () => {
    setIsAboutUsModalOpen(true);
  };

  const handleCloseAboutUsModal = () => {
    setIsAboutUsModalOpen(false);
  };

  const handleOpenPrivacyPolicyModal = () => {
    setIsPrivacyPolicyModalOpen(true);
  };

  const handleClosePrivacyPolicyModal = () => {
    setIsPrivacyPolicyModalOpen(false);
  };

  const handleOpenTermsConditionsModal = () => {
    setIsTermsConditionsModalOpen(true);
  };

  const handleCloseTermsConditionsModal = () => {
    setIsTermsConditionsModalOpen(false);
  };
  
  return (
    <>
    <div className={`hero-content ${isMobile ? 'mobile-view' : ''} ${isLandscape && isMobile ? 'landscape-mobile' : ''} ${isTallDevicePortrait ? 'tall-device-no-top-padding' : ''}`}>
        {!isLandscape && (
        <div className="hero-title-mobile">
        <h1>{t('heroTitle')}</h1>
        </div>
        )}
        
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
          <p className="hero-description" dangerouslySetInnerHTML={{ __html: t('heroDescription') }}></p>
          <button className="try-button" onClick={openLoginModal}>
            {t('tryButton')}
          </button>
          
        <div className="app-stores">
            <button className="store-badge">
              <img 
                src={language === 'en' ? playStoreBadgeEN : playStoreBadge} 
                alt={t('getItOnGooglePlay')} 
                width="60" 
                height="60" 
              />
            </button>
            <button className="store-badge">
              <img 
                src={language === 'en' ? appStoreBadgeEN : appStoreBadge} 
                alt={t('downloadOnAppStore')} 
                width="60" 
                height="60" 
              />
            </button>
            {!isMobile && (
          <div className="qr-code">
              <img 
                src={qrCode} 
                alt="QR Code" 
                width="90" 
                height="90"
              />
            </div>
            )}
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
              <strong>{testimonial.name}</strong>, {testimonial.age} {t('years')}
            </div>
            <div className="testimonial-location">
              {testimonial.location}, España
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
                <button className="footer-link" onClick={handleOpenAboutUsModal}>{t('aboutUs')}</button>
                <button className="footer-link" onClick={handleOpenPrivacyPolicyModal}>{t('privacyPolicy')}</button>
                <button className="footer-link" onClick={handleOpenTermsConditionsModal}>{t('termsConditions')}</button>
                <button className="footer-link" onClick={handleOpenFaqModal}>{t('faqs')}</button>
                {/* <button className="footer-link">{t('siteMap')}</button> */}
              <div className="footer-social">
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                  <img src={instagramIcon} alt="Instagram" className="footer-social-img footer-social-img--small" />
                </a>
                <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="social-icon tiktok">
                  <img src={tiktokIcon} alt="TikTok" className="footer-social-img footer-social-img--small" />
                </a>
                <a href="https://wa.me/34622444319" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
                  <img src={whatsappIcon} alt="WhatsApp" className="footer-social-img" />
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
                        src={language === 'en' ? playStoreBadgeEN : playStoreBadge} 
                        alt="Google Play" 
                        width="60" 
                        height="60" 
                    />
                  </a>
                  <a href="https://www.apple.com/app-store/" className="store-badge-footer">
                    <img 
                        src={language === 'en' ? appStoreBadgeEN : appStoreBadge} 
                        alt="App Store" 
                        width="60" 
                        height="60" 
                    />
                  </a>
                </div>
                {!isMobile && (
                <div className="footer-qr">
                  <img src={qrCode} alt="QR Code" />
                </div>
                )}
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
      onCloseAll={closeAllModals}
    />

    {/* Success Modal */}
    <AccountSuccessModal 
      isOpen={isSuccessModalOpen}
      onClose={closeAllModals}
      onContinue={closeAllModals}
      language={language}
    />

    {/* FAQ Modal for HeroContent */}
    <FaqModal 
      isOpen={isFaqModalOpen} 
      onClose={handleCloseFaqModal} 
      language={language}
    />

    {/* About Us Modal for HeroContent */}
    <AboutUsModal 
      isOpen={isAboutUsModalOpen} 
      onClose={handleCloseAboutUsModal} 
      language={language}
    />

    {/* Privacy Policy Modal for HeroContent */}
    <PrivacyPolicyModal
      isOpen={isPrivacyPolicyModalOpen}
      onClose={handleClosePrivacyPolicyModal}
      language={language}
    />

    {/* Terms & Conditions Modal for HeroContent */}
    <TermsConditionsModal
      isOpen={isTermsConditionsModalOpen}
      onClose={handleCloseTermsConditionsModal}
      language={language}
    />
    </>
  );
}

export default HeroContent; 