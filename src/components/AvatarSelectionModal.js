import React, { useEffect, useState } from 'react';
import '../styles/AvatarSelectionModal.css';
import LogoSimple from '../assets/images/logo_simple.png';

// Importar todos los avatares
import Avatar1 from '../assets/images/avatares/avatares-predefinidos-1.png';
import Avatar2 from '../assets/images/avatares/avatares-predefinidos-2.png';
import Avatar3 from '../assets/images/avatares/avatares-predefinidos-3.png';
import Avatar4 from '../assets/images/avatares/avatares-predefinidos-4.png';
import Avatar5 from '../assets/images/avatares/avatares-predefinidos-5.png';
import Avatar6 from '../assets/images/avatares/avatares-predefinidos-6.png';
import Avatar7 from '../assets/images/avatares/avatares-predefinidos-7.png';
import Avatar8 from '../assets/images/avatares/avatares-predefinidos-8.png';
import Avatar9 from '../assets/images/avatares/avatares-predefinidos-9.png';
import Avatar10 from '../assets/images/avatares/avatares-predefinidos-10.png';
import Avatar11 from '../assets/images/avatares/avatares-predefinidos-11.png';
import Avatar12 from '../assets/images/avatares/avatares-predefinidos-12.png';
import Animal1 from '../assets/images/avatares/animals-1.png';
import Animal2 from '../assets/images/avatares/animals-2.png';
import Animal3 from '../assets/images/avatares/animals-3.png';
import Animal4 from '../assets/images/avatares/animals-4.png';
import Animal5 from '../assets/images/avatares/animals-5.png';
import Animal6 from '../assets/images/avatares/animals-6.png';

const AvatarSelectionModal = ({ isOpen, onClose, language = 'es', onSelectAvatar }) => {
  const currentLang = language;
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  
  // Determine if we're in landscape mode for conditional rendering
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia("(orientation: landscape) and (max-height: 500px)").matches
  );
  
  // Lista de todos los avatares disponibles
  const avatars = [
    { id: 'avatar-1', src: Avatar1, alt: 'Avatar 1' },
    { id: 'avatar-2', src: Avatar2, alt: 'Avatar 2' },
    { id: 'avatar-3', src: Avatar3, alt: 'Avatar 3' },
    { id: 'avatar-4', src: Avatar4, alt: 'Avatar 4' },
    { id: 'avatar-5', src: Avatar5, alt: 'Avatar 5' },
    { id: 'avatar-6', src: Avatar6, alt: 'Avatar 6' },
    { id: 'avatar-7', src: Avatar7, alt: 'Avatar 7' },
    { id: 'avatar-8', src: Avatar8, alt: 'Avatar 8' },
    { id: 'avatar-9', src: Avatar9, alt: 'Avatar 9' },
    { id: 'avatar-10', src: Avatar10, alt: 'Avatar 10' },
    { id: 'avatar-11', src: Avatar11, alt: 'Avatar 11' },
    { id: 'avatar-12', src: Avatar12, alt: 'Avatar 12' },
    { id: 'animal-1', src: Animal1, alt: 'Animal 1' },
    { id: 'animal-2', src: Animal2, alt: 'Animal 2' },
    { id: 'animal-3', src: Animal3, alt: 'Animal 3' },
    { id: 'animal-4', src: Animal4, alt: 'Animal 4' },
    { id: 'animal-5', src: Animal5, alt: 'Animal 5' },
    { id: 'animal-6', src: Animal6, alt: 'Animal 6' },
  ];
  
  // Reset selection when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedAvatar(null);
    }
  }, [isOpen]);
  
  // Add overflow hidden to body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Update landscape detection on resize/orientation change
  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: landscape) and (max-height: 500px)");
    
    const handleOrientationChange = (e) => {
      setIsLandscape(e.matches);
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleOrientationChange);
    } 
    // Older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleOrientationChange);
    }
    
    return () => {
      // Cleanup
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleOrientationChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleOrientationChange);
      }
    };
  }, []);
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };
  
  // Handle avatar selection
  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    
    // Extraer el nombre del archivo del avatar
    const avatarUrl = avatar.src;
    // Extraer solo el nombre del archivo
    const fullFileName = avatarUrl.split('/').pop();
    
    // Cortar en el primer punto y añadir .png
    const baseName = fullFileName.split('.')[0]; // Obtiene todo antes del primer punto
    const cleanFileName = `${baseName}.png`;
    
    console.log('🖼️ Avatar seleccionado:', cleanFileName);
    // También podríamos almacenar el nombre del archivo en el estado si es necesario
    // setAvatarFileName(cleanFileName);
  };
  
  // Handle confirm selection button
  const handleConfirmSelection = () => {
    if (selectedAvatar && onSelectAvatar) {
      onSelectAvatar(selectedAvatar);
    }
    onClose();
  };
  
  // Handle back button
  const handleBack = () => {
    onClose();
  };
  
  // Translations
  const translations = {
    es: {
      title: 'Elige tu avatar',
      subtitle: 'Selecciona tu imagen en Lokdis',
      confirmButton: 'Seleccionar avatar',
      backButton: 'Volver',
    },
    en: {
      title: 'Choose your avatar',
      subtitle: 'Select your image in Lokdis',
      confirmButton: 'Select avatar',
      backButton: 'Back',
    }
  };
  
  const t = translations[currentLang];
  
  // ArrowBack icon component
  const ArrowBackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
    </svg>
  );
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="avatar-selection-modal">
        <button className="modal-close" onClick={onClose}>
          <span>×</span>
        </button>
        
        <button className="back-button" onClick={handleBack}>
          <ArrowBackIcon />
        </button>
        
        {isLandscape ? (
          // Landscape layout with left-right sections
          <>
            <div className="modal-content-left">
              <h2 className="modal-title">{t.title}</h2>
              <p className="modal-text">{t.subtitle}</p>
            </div>
            
            <div className="modal-content-right">
              <div className="avatars-grid">
                {avatars.map((avatar) => (
                  <div 
                    key={avatar.id}
                    className={`avatar-option ${selectedAvatar && selectedAvatar.id === avatar.id ? 'selected' : ''}`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    <div className="avatar-option-circle">
                      <img src={avatar.src} alt={avatar.alt} className="avatar-option-image" />
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="confirm-avatar-button"
                onClick={handleConfirmSelection}
                disabled={!selectedAvatar}
              >
                {t.confirmButton}
              </button>
            </div>
          </>
        ) : (
          // Portrait/default layout
          <>
            <h2 className="modal-title">{t.title}</h2>
            
            <p className="modal-text">
              {t.subtitle}
            </p>
            
            <div className="avatars-grid">
              {avatars.map((avatar) => (
                <div 
                  key={avatar.id}
                  className={`avatar-option ${selectedAvatar && selectedAvatar.id === avatar.id ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  <div className="avatar-option-circle">
                    <img src={avatar.src} alt={avatar.alt} className="avatar-option-image" />
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="confirm-avatar-button"
              onClick={handleConfirmSelection}
              disabled={!selectedAvatar}
            >
              {t.confirmButton}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AvatarSelectionModal; 