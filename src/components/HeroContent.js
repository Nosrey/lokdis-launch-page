import React, { useState, useEffect } from 'react';
import { useLanguage } from '../utils/i18n';
import PhoneImage from '../assets/svg/phone.svg';
import qrCode from '../assets/images/qr-code.png';
import avatar1 from '../assets/images/avatar1.png';
import avatar2 from '../assets/images/avatar2.png';
import avatar3 from '../assets/images/avatar3.png';

function HeroContent() {
  const { t, language } = useLanguage();
  const [phoneLoaded, setPhoneLoaded] = useState(false);
  
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
        <div className="hero-text">
          <h1>{t('heroTitle')}</h1>
          <p>
            {t('heroSubtitle')}
          </p>
          <p>
            {t('heroDescription')}
          </p>
          <button className="try-button">{t('tryButton')}</button>
          
          <div className="app-stores">
            <button className="store-badge">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/es_badge_web_generic.png" 
                   alt="Disponible en Google Play" 
                   width="150" />
            </button>
            <button className="store-badge">
              <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/es-es?size=250x83" 
                   alt="Descargar en App Store" 
                   width="130" />
            </button>
            <div className="qr-code">
              <img src={qrCode} alt="QR Code" width="90" height="90" />
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="phone-container">
            <img 
              src={PhoneImage} 
              alt="Lokdis App" 
              className={`phone-image ${phoneLoaded ? 'phone-loaded' : ''}`} 
              onLoad={() => setPhoneLoaded(true)}
            />
            <div className="phone-glow"></div>
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="testimonials-section">
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

        <footer className="footer-section">
          <div className="footer-links">
            <button className="footer-link">{t('aboutUs')}</button>
            <button className="footer-link">{t('privacyPolicy')}</button>
            <button className="footer-link">{t('termsConditions')}</button>
            <button className="footer-link">{t('faqs')}</button>
            <button className="footer-link">{t('siteMap')}</button>
          </div>
          
          <div className="footer-logo">
            <img src={PhoneImage} alt="Lokdis Logo" />
            <h3>LOKDIS</h3>
          </div>
          
          <div className="footer-stores">
            <button className="store-badge">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/es_badge_web_generic.png" 
                   alt="Disponible en Google Play" 
                   width="150" />
            </button>
            <button className="store-badge">
              <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/es-es?size=250x83" 
                   alt="Descargar en App Store" 
                   width="130" />
            </button>
          </div>
          
          <div className="footer-qr">
            <img src={qrCode} alt="QR Code" />
          </div>
          
          <div className="footer-copyright">
            {t('copyright')}
          </div>
        </footer>
      </div>
    </>
  );
}

export default HeroContent; 