import React from 'react';
import '../styles/AccountSuccessModal.css';
import SuccessImage from '../assets/images/success.png';

const AccountSuccessModal = ({ isOpen, onClose, onContinue, language = 'es' }) => {
  const currentLang = language;
  
  // Add overflow hidden to body when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };
  
  // Translations
  const translations = {
    es: {
      title: '¡Cuenta creada con éxito!',
      subtitle: 'Ya puedes enviar y recibir tus momentos con LokDis.',
      continueButton: '¡Vamos allá!',
    },
    en: {
      title: 'Account created successfully!',
      subtitle: 'You can now send and receive your moments with LokDis.',
      continueButton: 'Let\'s go!',
    }
  };
  
  const t = translations[currentLang];
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="success-modal">
        <button className="modal-close" onClick={onClose}>
          <span>×</span>
        </button>
        
        {/* Este div solo es visible en modo vertical/desktop */}
        <div className="success-content-portrait">
          <h2 className="success-title">{t.title}</h2>
          <p className="success-text">{t.subtitle}</p>
          <div className="success-image-container">
            <img src={SuccessImage} alt="Success" className="success-image" />
          </div>
          <button 
            className="success-button"
            onClick={onContinue || onClose}
          >
            {t.continueButton}
          </button>
        </div>
        
        {/* Este div solo es visible en modo landscape */}
        <div className="success-content-landscape">
          <div className="landscape-left">
            <h2 className="success-title">{t.title}</h2>
            <p className="success-text">{t.subtitle}</p>
            <button 
              className="success-button"
              onClick={onContinue || onClose}
            >
              {t.continueButton}
            </button>
          </div>
          <div className="landscape-right">
            <div className="success-image-container">
              <img src={SuccessImage} alt="Success" className="success-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSuccessModal; 