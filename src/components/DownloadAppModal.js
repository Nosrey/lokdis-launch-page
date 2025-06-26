import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoSimple from '../assets/images/logo_simple.png';
import googlePlayBadgeES from '../assets/images/googleplay_icon.png';
import appStoreBadgeES from '../assets/images/applestore_icon.png';
import googlePlayBadgeEN from '../assets/images/googleplay_icon_en.png';
import appStoreBadgeEN from '../assets/images/applestore_icon_en.png';
import { useLanguage } from '../utils/i18n';

const DownloadAppModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  if (!isOpen) {
    return null;
  }

  const googlePlayBadge = language === 'es' ? googlePlayBadgeES : googlePlayBadgeEN;
  const appStoreBadge = language === 'es' ? appStoreBadgeES : appStoreBadgeEN;

  const handleRedirect = () => {
    navigate('/');
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'download-modal-overlay') {
      onClose();
    }
  };
  
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(18, 18, 18, 0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
    },
    modal: {
      background: '#000000',
      color: '#ffffff',
      padding: '35px 45px',
      borderRadius: '20px',
      border: '1px solid #2a2a2a',
      boxShadow: '0 12px 50px rgba(0, 0, 0, 0.6)',
      textAlign: 'center',
      width: '90%',
      maxWidth: '480px',
      position: 'relative',
    },
    closeBtn: {
      position: 'absolute',
      top: '15px',
      right: '20px',
      background: 'none',
      border: 'none',
      fontSize: '2.2rem',
      color: '#777',
      cursor: 'pointer',
    },
    logo: {
      width: '80px',
      height: '80px',
      marginBottom: '25px',
    },
    title: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '2rem',
      fontWeight: 700,
      color: '#ffffff',
      margin: '0 0 18px',
    },
    text: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '1.1rem',
      color: '#b0b0b0',
      lineHeight: 1.7,
      marginBottom: '30px',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '25px',
      marginBottom: '30px',
    },
    storeBadge: {
      height: '55px',
    },
    redirectBtn: {
      fontFamily: "'Poppins', sans-serif",
      background: 'transparent',
      color: '#0099ff',
      border: 'none',
      padding: '10px 20px',
      fontSize: '1rem',
      fontWeight: 500,
      cursor: 'pointer',
      textDecoration: 'underline',
    }
  };

  return (
    <div id="download-modal-overlay" style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
        <div>
          <img src={logoSimple} alt="Lokdis" style={styles.logo} />
          <h2 style={styles.title}>{t('downloadModalTitle')}</h2>
          <p style={styles.text}>
            {t('downloadModalText')}
          </p>
          <div style={styles.buttonsContainer}>
            <a href="https://play.google.com/store/" target="_blank" rel="noopener noreferrer">
              <img src={googlePlayBadge} alt="Google Play" style={styles.storeBadge} />
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <img src={appStoreBadge} alt="App Store" style={styles.storeBadge} />
            </a>
          </div>
          <button style={styles.redirectBtn} onClick={handleRedirect}>
            {t('downloadModalButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppModal; 