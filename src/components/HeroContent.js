import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../utils/i18n';
import PhoneImage from '../assets/svg/phone.svg';
import qrCode from '../assets/images/qr-code.png';
import avatar1 from '../assets/images/avatar1.png';
import avatar2 from '../assets/images/avatar2.png';
import avatar3 from '../assets/images/avatar3.png';
import logoSimple from '../assets/images/logo_simple.png';
import instagramIcon from '../assets/images/instagram_icon.png';
import tiktokIcon from '../assets/images/tiktok_icon.png';
import emailIcon from '../assets/images/email_icon.png';

function HeroContent() {
  const { t, language } = useLanguage();
  const [phoneLoaded, setPhoneLoaded] = useState(false);
  const testimonialsRef = useRef(null);
  
  useEffect(() => {
    // Add a small delay to make the animation more noticeable
    const timer = setTimeout(() => {
      setPhoneLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Lu',
      age: 33,
      location: 'Almería',
      avatar: avatar1,
      quote: t('testimonial1'),
    },
    {
      id: 2,
      name: 'Ca_lop',
      age: 36,
      location: 'Zaragoza',
      avatar: avatar2,
      quote: t('testimonial2'),
    },
    {
      id: 3,
      name: 'Carlita',
      age: 26,
      location: 'Madrid',
      avatar: avatar3,
      quote: t('testimonial3'),
    },
  ];
  
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
          <h1 className="hero-title-desktop">{t('heroTitle')}</h1>
          <p>{t('heroSubtitle')}</p>
          <p className="hero-description">{t('heroDescription')}</p>
          <button className="try-button">
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
      
      <div className="testimonials-section" ref={testimonialsRef}>
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card">
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
                <a href="#" className="social-icon instagram">
                  <img src={instagramIcon} alt="Instagram" className="footer-social-img footer-social-img--small" />
                </a>
                <a href="#" className="social-icon tiktok">
                  <img src={tiktokIcon} alt="TikTok" className="footer-social-img footer-social-img--small" />
                </a>
                <a href="#" className="social-icon email">
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
                    <a href="#" className="store-badge-footer">
                      <img 
                        src={require('../assets/images/googleplay_icon.png')} 
                        alt="Google Play" 
                        width="60" 
                        height="60" 
                      />
                    </a>
                    <a href="#" className="store-badge-footer">
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
    </>
  );
}

export default HeroContent; 