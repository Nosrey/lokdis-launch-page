import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import '../styles/AboutUsModal.css';
import { useLanguage } from '../utils/i18n';
import logoSimple from '../assets/images/logo_simple.png'; // Lokdis logo

const aboutUsContent = {
  es: {
    title: 'Sobre Nosotros',
    paragraphs: [
      "En Lokdis, creemos en el <strong>poder de la autenticidad</strong>. Nuestra misión es ofrecer una ventana al mundo tal como es, en <strong>tiempo real, sin filtros ni distorsiones</strong>. Somos una plataforma <strong>impulsada por la curiosidad</strong>, diseñada para aquellos que buscan conectar con la realidad de cualquier rincón del planeta, al instante.",
      "Nuestros valores fundamentales son la <strong>transparencia, la inmediatez y la exploración genuina</strong>. Aspiramos a construir una comunidad global donde compartir y descubrir momentos auténticos sea la norma, fomentando una comprensión más profunda y veraz de nuestro entorno. Con Lokdis, tu <strong>curiosidad no tiene límites</strong>; explora, verifica y vive el mundo sin barreras.",
      "Únete a Lokdis y sé parte de una revolución en la forma en que experimentamos y compartimos la realidad. <strong>Redescubre el mundo, un momento real a la vez.</strong>"
    ]
  },
  en: {
    title: 'About Us',
    paragraphs: [
      "At Lokdis, we believe in the <strong>power of authenticity</strong>. Our mission is to provide a window to the world as it truly is, in <strong>real-time, free from filters and distortions</strong>. We are a platform <strong>driven by curiosity</strong>, designed for those who seek to connect with the reality of any corner of the globe, instantly.",
      "Our core values are <strong>transparency, immediacy, and genuine exploration</strong>. We aspire to build a global community where sharing and discovering authentic moments is the norm, fostering a deeper and more truthful understanding of our surroundings. With Lokdis, your <strong>curiosity knows no bounds</strong>; explore, verify, and experience the world without barriers.",
      "Join Lokdis and be part of a revolution in how we experience and share reality. <strong>Rediscover the world, one real moment at a time.</strong>"
    ]
  }
};

const AboutUsModal = ({ isOpen, onClose, language = 'es' }) => {
  const { t } = useLanguage(); // Can be used for other UI elements if needed
  const modalRef = useRef();
  const content = aboutUsContent[language] || aboutUsContent.en;

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    } else {
      window.removeEventListener('keydown', handleEscKey);
    }
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalJSX = (
    <div className="aboutus-modal-overlay">
      <div className="aboutus-modal-content" ref={modalRef}>
        <div className="aboutus-modal-header">
          <img src={logoSimple} alt="Lokdis Logo" className="aboutus-modal-logo" />
          <h2>{content.title}</h2>
          <button onClick={onClose} className="aboutus-modal-close-btn" aria-label={language === 'es' ? 'Cerrar' : 'Close'}>
            &times;
          </button>
        </div>
        <div className="aboutus-modal-body">
          {content.paragraphs.map((paragraph, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalJSX, document.getElementById('modal-root'));
};

export default AboutUsModal; 