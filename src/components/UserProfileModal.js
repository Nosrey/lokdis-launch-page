import React, { useEffect, useState } from 'react';
import '../styles/UserProfileModal.css';
import DefaultAvatar from '../assets/images/avatar-default.png';
import LogoSimple from '../assets/images/logo_simple.png';
import AvatarSelectionModal from './AvatarSelectionModal';
import SuccessImage from '../assets/images/success.png';
import '../styles/AccountSuccessModal.css';

const API_URL = 'https://www.lokdis.com/back-end-lokdis-app';

const UserProfileModal = ({ isOpen, onClose, language = 'es', onComplete, email, password, birthdate, coordinates, rol }) => {
  const currentLang = language;
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState({ id: 'default', src: DefaultAvatar, alt: 'Default Avatar' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState('');
  const [successModal, setSuccessModal] = useState('');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  
  // Reset all state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setUsernameError('');
      setIsUsernameValid(false);
      setSelectedAvatar({ id: 'default', src: DefaultAvatar, alt: 'Default Avatar' });
      setIsLoading(false);
      setErrorModal('');
      setSuccessModal('');
      setShowSuccessScreen(false);
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
  
  // Validate username when it changes
  useEffect(() => {
    if (username.trim() === '') {
      setUsernameError('');
      setIsUsernameValid(false);
      return;
    }
    
    if (username.length < 3) {
      setUsernameError(t.usernameTooShort);
      setIsUsernameValid(false);
    } else if (username.length > 20) {
      setUsernameError(t.usernameTooLong);
      setIsUsernameValid(false);
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError(t.usernameInvalidChars);
      setIsUsernameValid(false);
    } else {
      setUsernameError('');
      setIsUsernameValid(true);
    }
  }, [username]);
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      if (showSuccessScreen) {
        // Si estamos en la pantalla de éxito, cerrar todo
        console.log('👋 Cerrando modales desde overlay click en pantalla de éxito');
        onClose && onClose();
      } else {
        // Comportamiento normal
        onClose && onClose();
      }
    }
  };
  
  // Handle username change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  
  // Open avatar selection modal
  const openAvatarModal = () => {
    setShowAvatarModal(true);
  };
  
  // Handle avatar selection
  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setShowAvatarModal(false);
  };
  
  // Format date as DD/MM/YYYY
  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  // Format birthdate as DD/MM/YYYY (if not already)
  const formatBirthdate = (birthdate) => {
    if (!birthdate) return '';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(birthdate)) return birthdate;
    // Try to parse ISO or other formats
    const d = new Date(birthdate);
    if (isNaN(d)) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  // Get routeImg value
  const getRouteImg = () => {
    // Si no hay avatar seleccionado o es el default, usar el default
    if (!selectedAvatar || selectedAvatar.id === 'default' || !selectedAvatar.src) {
      return 'assets/images/avatar-default.png';
    }
    
    // Para avatares seleccionados, extraer el nombre del archivo
    const avatarUrl = selectedAvatar.src;
    const fullFileName = avatarUrl.split('/').pop();
    
    // Cortar en el primer punto y añadir .png
    const baseName = fullFileName.split('.')[0]; // Obtiene todo antes del primer punto
    const cleanFileName = `${baseName}.png`;
    
    // Formar la ruta correcta
    const routeImg = `assets/avatares/${cleanFileName}`;
    
    console.log('🖼️ RouteImg para API:', routeImg);
    return routeImg;
  };
  
  // Show error modal for 5 seconds
  useEffect(() => {
    if (errorModal) {
      const timer = setTimeout(() => setErrorModal(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorModal]);
  
  // Show success modal for 2 seconds
  useEffect(() => {
    if (successModal) {
      const timer = setTimeout(() => setSuccessModal(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [successModal]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setUsernameError(t.emptyUsername);
      return;
    }
    
    if (!isUsernameValid) {
      return;
    }
    
    if (!email || !password || !birthdate || !rol) {
      setErrorModal(currentLang === 'es' ? 'Faltan datos para crear la cuenta.' : 'Missing data to create account.');
      return;
    }
    
    setIsLoading(true);
    setErrorModal('');
    setSuccessModal('');
    
    // Compose payload
    const payload = {
      password: password,
      name: username,
      routeImg: getRouteImg(),
      email: email,
      date: getCurrentDate(),
      coordinates: coordinates || '',
      birthdate: formatBirthdate(birthdate),
      rol: rol
    };
    
    try {
      // Check internet connection
      if (!window.navigator.onLine) {
        setErrorModal(currentLang === 'es' ? 'No hay conexión a internet' : 'No internet connection');
        setIsLoading(false);
        return;
      }
      const response = await fetch(`${API_URL}/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      let data = null;
      try {
        data = await response.clone().json();
      } catch (jsonErr) {
        data = null;
      }
      
      console.log('API /create-user response:', { 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok,
        data: data
      });
      
      // Verificar detalladamente si la respuesta es exitosa, corregido para 'sucesfull' (sin 'c' en el medio)
      if (response.ok && data && (
        data.success === true || 
        data.sucesfull === true || 
        data.sucessfull === true ||  // para compatibilidad por si cambia la ortografía
        (data.data && data.data.sucesfull === true)
      )) {
        console.log('✅ Cuenta creada exitosamente, mostrando pantalla de éxito');
        // Mostrar pantalla de éxito directamente en este modal y no hacer nada más
        setShowSuccessScreen(true);
      } else {
        // Solo en caso de error real, mostrar el modal de error
        console.log('❌ Error en la creación de cuenta:', data?.message || 'Unknown error');
        setErrorModal((data && data.message) || (currentLang === 'es' ? 'No se pudo crear la cuenta. Intenta de nuevo.' : 'Could not create account. Please try again.'));
      }
    } catch (err) {
      console.error('Error en la conexión:', err);
      setErrorModal(currentLang === 'es' ? 'No hay conexión a internet' : 'No internet connection');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    onClose();
  };
  
  // Translations
  const translations = {
    es: {
      title: 'Crear nombre de usuario',
      subtitle: 'Elige tu avatar y el alias que quieres mostrar',
      aliasLabel: 'Alias',
      usernamePlaceholder: 'Tu alias',
      continueButton: 'Continuar',
      cancelButton: 'Cancelar',
      emptyUsername: 'Por favor, introduce un alias',
      usernameTooShort: 'El alias debe tener al menos 3 caracteres',
      usernameTooLong: 'El alias debe tener menos de 20 caracteres',
      usernameInvalidChars: 'El alias solo puede contener letras, números y guiones bajos',
      errorTitle: 'Error',
      successTitle: '¡Éxito!',
      // Traducciones para la pantalla de éxito
      accountCreatedTitle: '¡Cuenta creada con éxito!',
      accountCreatedSubtitle: 'Ya puedes enviar y recibir tus momentos con LokDis.',
      letsGoButton: '¡Vamos allá!'
    },
    en: {
      title: 'Create username',
      subtitle: 'Choose your avatar and the username you want to display',
      aliasLabel: 'Username',
      usernamePlaceholder: 'Your username',
      continueButton: 'Continue',
      cancelButton: 'Cancel',
      emptyUsername: 'Please enter a username',
      usernameTooShort: 'Username must be at least 3 characters long',
      usernameTooLong: 'Username must be less than 20 characters long',
      usernameInvalidChars: 'Username can only contain letters, numbers, and underscores',
      errorTitle: 'Error',
      successTitle: 'Success!',
      // Translations for success screen
      accountCreatedTitle: 'Account created successfully!',
      accountCreatedSubtitle: 'You can now send and receive your moments with LokDis.',
      letsGoButton: 'Let\'s go!'
    }
  };
  
  const t = translations[currentLang];
  
  const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.293 2.293L17.707 3.707L3.707 17.707L2.293 16.293L16.293 2.293Z" fill="white"/>
      <path d="M18.7071 5.70708L20.1213 7.12129L7.12132 20.1213L5.70711 18.7071L18.7071 5.70708Z" fill="white"/>
      <path d="M2 22H22V24H2V22Z" fill="white"/>
      <path d="M3 19.001H5V21.001H3V19.001Z" fill="white"/>
    </svg>
  );
  
  // Error/Success Modal
  const renderStatusModal = () => {
    if (!errorModal) return null;
    return (
      <div className="modal-overlay" style={{zIndex: 2000}}>
        <div className="login-modal" style={{maxWidth: 340, textAlign: 'center', padding: 32}}>
          <div className="modal-logo">
            <div className="logo-circle">
              <img src={LogoSimple} alt="Logo" className="logo-icon" />
            </div>
          </div>
          <h2 className="modal-title" style={{color: '#ff4d4d'}}>
            {t.errorTitle}
          </h2>
          <div style={{margin: '18px 0', color: '#ff4d4d', fontWeight: 500, fontSize: 16}}>
            {errorModal}
          </div>
          <button className="continue-button" style={{marginTop: 10}} onClick={() => { setErrorModal(''); }}>
            OK
          </button>
        </div>
      </div>
    );
  };
  
  if (!isOpen) return null;
  
  // Render success screen if account was created successfully
  if (showSuccessScreen) {
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="success-modal">
          <button className="modal-close" onClick={() => {
            console.log('👋 Cerrando modales desde botón X en pantalla de éxito');
            onClose && onClose();
          }}>
            <span>×</span>
          </button>
          
          {/* Este div solo es visible en modo vertical/desktop */}
          <div className="success-content-portrait">
            <h2 className="success-title">{t.accountCreatedTitle}</h2>
            <p className="success-text">{t.accountCreatedSubtitle}</p>
            <div className="success-image-container">
              <img src={SuccessImage} alt="Success" className="success-image" />
            </div>
            <button 
              className="success-button"
              onClick={() => {
                console.log('👋 Cerrando modales desde botón "Vamos allá" en pantalla de éxito');
                onClose && onClose();
              }}
            >
              {t.letsGoButton}
            </button>
          </div>
          
          {/* Este div solo es visible en modo landscape */}
          <div className="success-content-landscape">
            <div className="landscape-left">
              <h2 className="success-title">{t.accountCreatedTitle}</h2>
              <p className="success-text">{t.accountCreatedSubtitle}</p>
              <button 
                className="success-button"
                onClick={() => {
                  console.log('👋 Cerrando modales desde botón "Vamos allá" en modo landscape');
                  onClose && onClose();
                }}
              >
                {t.letsGoButton}
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
  }
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="profile-modal">
        <button className="modal-close" onClick={onClose}>
          <span>×</span>
        </button>
        {renderStatusModal()}
        <div className="modal-logo">
          <div className="logo-circle">
            <img src={LogoSimple} alt="Logo" className="logo-icon" />
          </div>
        </div>
        
        <h2 className="modal-title">{t.title}</h2>
        
        <p className="modal-text">
          {t.subtitle}
        </p>
        
        <div className="avatar-container">
          <div className="avatar-circle">
            <img src={selectedAvatar.src} alt="Avatar" className="avatar-image" />
            <button 
              className="edit-avatar-button" 
              type="button" 
              aria-label="Edit avatar"
              onClick={openAvatarModal}
            >
              <EditIcon />
            </button>
          </div>
        </div>
        
        <form className="profile-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label className="input-label">{t.aliasLabel}</label>
            <input
              type="text"
              className="username-input"
              placeholder={t.usernamePlaceholder}
              value={username}
              onChange={handleUsernameChange}
              autoFocus
              maxLength="20"
              autoComplete="off"
              disabled={isLoading}
            />
            {usernameError && <div className="error-message">{usernameError}</div>}
          </div>
          
          <button 
            type="submit" 
            className="continue-button"
            disabled={!isUsernameValid || isLoading}
          >
            {isLoading ? (currentLang === 'es' ? 'Creando...' : 'Creating...') : t.continueButton}
          </button>
          
          <button 
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {t.cancelButton}
          </button>
        </form>
      </div>
      
      {/* Modal de selección de avatar */}
      <AvatarSelectionModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        language={currentLang}
        onSelectAvatar={handleAvatarSelect}
      />
    </div>
  );
};

export default UserProfileModal; 