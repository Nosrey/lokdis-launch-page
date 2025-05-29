import React, { useEffect, useState, useRef } from 'react';
import '../styles/UserProfileModal.css';
import DefaultAvatar from '../assets/images/avatar-default.png';
import LogoSimple from '../assets/images/logo_simple.png';
import AvatarSelectionModal from './AvatarSelectionModal';
import SuccessImage from '../assets/images/success.png';
import '../styles/AccountSuccessModal.css';
import { updateUser } from '../utils/userApi';

// API endpoint URL - use proxy in development, full URL as fallback
const API_URL = 'https://www.lokdis.com/back-end-lokdis-app'; // Always use production URL

const UserProfileModal = ({ isOpen, onClose, language = 'es', onComplete, email, password, birthdate, coordinates, rol, uId, isGoogleAuth, onCloseAll }) => {
  const currentLang = language;

  // Translations must be defined before they are used in useEffect
  const translations = {
    es: {
      title: 'Nombre de usuario',
      subtitle: 'Elige tu avatar y el alias que quieres mostrar',
      aliasLabel: 'Alias',
      usernamePlaceholder: 'Tu alias',
      continueButton: 'Continuar',
      cancelButton: 'Cancelar',
      emptyUsername: 'Por favor, introduce un alias',
      usernameTooShort: 'El alias debe tener al menos 3 caracteres',
      usernameTooLong: 'El alias debe tener menos de 24 caracteres',
      errorTitle: 'Error',
      successTitle: '¡Éxito!',
      selectAvatarError: 'Por favor, selecciona un avatar.',
      // Traducciones para la pantalla de éxito
      accountCreatedTitle: '¡Cuenta creada con éxito!',
      accountCreatedSubtitle: 'Ya puedes enviar y recibir tus momentos con LokDis.',
      letsGoButton: '¡Vamos allá!',
    },
    en: {
      title: 'Username',
      subtitle: 'Choose your avatar and the username you want to display',
      aliasLabel: 'Username',
      usernamePlaceholder: 'Your username',
      continueButton: 'Continue',
      cancelButton: 'Cancel',
      emptyUsername: 'Please enter a username',
      usernameTooShort: 'Username must be at least 3 characters long',
      usernameTooLong: 'Username must be less than 24 characters long',
      errorTitle: 'Error',
      successTitle: 'Success!',
      selectAvatarError: 'Please select an avatar.',
      // Translations for success screen
      accountCreatedTitle: 'Account created successfully!',
      accountCreatedSubtitle: 'You can now send and receive your moments with LokDis.',
      letsGoButton: 'Let\'s go!',
    }
  };

  const t = translations[currentLang];

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState({ id: 'default', src: DefaultAvatar, alt: 'Default Avatar' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState('');
  const [successModal, setSuccessModal] = useState('');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  
  // Referencia al input de username para acceder directamente a su valor
  const usernameInputRef = useRef(null);
  
  // Flag to detect Google authentication flow (from prop or uId)
  const isGoogleAuthentication = isGoogleAuth || !!uId;
  
  // Get data from props or sessionStorage as fallback
  const getEmail = () => {
    const emailFromProps = email;
    const emailFromSession = sessionStorage.getItem('tempUserEmail');
    console.log('🔍 getEmail() - Props:', emailFromProps, 'SessionStorage:', emailFromSession);
    
    // Return the first non-null, non-undefined, non-empty value
    const result = emailFromProps || emailFromSession || null;
    console.log('🔍 getEmail() resultado final:', result);
    return result;
  };
  
  const getUid = () => {
    const uidFromProps = uId;
    const uidFromSession = sessionStorage.getItem('tempUserId');
    console.log('🔍 getUid() - Props:', uidFromProps, 'SessionStorage:', uidFromSession);
    
    // Return the first non-null, non-undefined, non-empty value
    const result = uidFromProps || uidFromSession || null;
    console.log('🔍 getUid() resultado final:', result);
    return result;
  };
  
  // Set initial username from session storage if available for Google Auth flow
  useEffect(() => {
    if (isGoogleAuthentication && isOpen) {
      const storedName = sessionStorage.getItem('tempUserName');
      if (storedName && username === '') {
        setUsername(storedName);
      }
    }
  }, [isOpen, isGoogleAuthentication, username]);
  
  // Reset all state when modal is closed, and add a check if opened without essential data
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
    } else {
      // Log props when component opens
      console.log('🔎 UserProfileModal opened with props:', {
        hasEmail: !!email,
        emailProp: email, // Renombrado para evitar confusión con variable email del scope
        hasUId: !!uId,
        uIdProp: uId,
        hasBirthdate: !!birthdate,
        isGoogleAuthProp: isGoogleAuth, // Renombrado
        isGoogleAuthenticationState: isGoogleAuthentication, // Estado calculado interno
        sessionStorageData: {
          tempUserId: sessionStorage.getItem('tempUserId'),
          tempUserEmail: sessionStorage.getItem('tempUserEmail'),
          tempUserName: sessionStorage.getItem('tempUserName'),
          tempBirthdate: sessionStorage.getItem('tempBirthdate'),
        }
      });

      // Si el UserProfileModal se abre, pero es un flujo de Google y no tenemos uId (ni en props ni en session), 
      // o no es Google pero no tenemos email (ni en props ni en session) Y TAMPOCO tenemos password (indicando que no es flujo de email válido)
      // es probable que LoginModal ya haya manejado un usuario existente y este modal no debería estar aquí.
      const effectiveEmail = email || sessionStorage.getItem('tempUserEmail');
      const effectiveUid = uId || sessionStorage.getItem('tempUserId');

      if (isGoogleAuthentication && !effectiveUid) {
        console.warn('⚠️ UserProfileModal (Google Flow) opened without uId. Closing.');
        if (onClose) onClose();
        return;
      }
      if (!isGoogleAuthentication && !effectiveEmail && !password) {
        // Si no es Google, no hay email efectivo, y tampoco hay password (que vendría del LoginModal en flujo email)
        console.warn('⚠️ UserProfileModal (Email Flow) opened without email and password. Closing.');
        if (onClose) onClose();
        return;
      }
    }
  }, [isOpen, email, password, uId, isGoogleAuth, isGoogleAuthentication, onClose]);
  
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
    } else if (username.length > 24) {
      setUsernameError(t.usernameTooLong);
      setIsUsernameValid(false);
    } else {
      setUsernameError('');
      setIsUsernameValid(true);
    }
  }, [username, t]);
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      if (showSuccessScreen) {
        // Si estamos en la pantalla de éxito, cerrar todo
        console.log('👋 Cerrando modales desde overlay click en pantalla de éxito');
        if (onCloseAll) {
          onCloseAll();
        } else if (onClose) {
          onClose();
        }
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

    // Validaciones más específicas
    if (!isUsernameValid) {
      console.error("Submit failed: Username is not valid.");
      // El error de username ya se muestra bajo el input.
      return;
    }
    // Asumimos que selectedAvatar siempre tiene un valor, incluso el default.
    // Si quieres forzar que elijan uno diferente al default, la lógica sería:
    // if (!selectedAvatar || selectedAvatar.id === 'default') {
    //   console.error("Submit failed: A non-default avatar must be selected.");
    //   setErrorModal(t.selectAvatarError); 
    //   return;
    // }
    if (!email) {
      console.error("Submit failed: Email is missing.");
      setErrorModal("Email is missing. Please report this issue."); // Should not happen
      return;
    }
    if (!birthdate) {
      console.error("Submit failed: Birthdate is missing.");
      setErrorModal("Birthdate is missing. Please report this issue."); // Should not happen
      return;
    }

    if (isGoogleAuth) { // isGoogleAuth es la prop
      if (!uId) {
        console.error("Submit failed (Google Auth): uId is missing.");
        setErrorModal("User ID is missing for Google Sign-In. Please report this issue."); // Should not happen
        return;
      }
      // Para Google Auth, el 'password' no se recoge en este modal, así que no lo validamos aquí.
      // El backend se encarga o ya fue manejado por Firebase.
    } else { // Flujo de Email
      if (!password) {
        console.error("Submit failed (Email Auth): Password is missing.");
        setErrorModal("Password is missing. Please report this issue."); // Should not happen if flow is correct
        return;
      }
    }

    setIsLoading(true);
    setErrorModal('');

    try {
      const endpoint = isGoogleAuth ? '/update-user' : '/create-user';
      console.log(`🔍 Using endpoint: ${endpoint} for ${isGoogleAuth ? 'Google' : 'Email'} auth`);

      const payload = {
        name: username.trim(),
        email: email,
        birthdate: birthdate,
        birthday: birthdate,
        coordinates: coordinates || '',
        rol: rol || 'user',
        routeImg: getRouteImg(),
      };

      if (isGoogleAuth) {
        payload.uId = uId;
      } else {
        payload.password = password;
        payload.date = getCurrentDate();
      }

      console.log('📦 Payload to be sent:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.ok && (data.sucesfull === true || data.success === true)) {
        console.log('✅ Profile setup successful:', data);
        setShowSuccessScreen(true);
      } else {
        console.error('❌ API Error or non-successful response:', data);
        setErrorModal(data.message || (currentLang === 'es' ? 'Error al configurar el perfil.' : 'Error setting up profile.'));
      }
    } catch (error) {
      console.error('❌ Network/Fetch Error in profile setup:', error);
      setErrorModal(currentLang === 'es' ? 'Error de conexión. Inténtalo de nuevo.' : 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    onClose();
  };
  
  // Handle Let's Go button on success screen
  const handleLetsGo = () => {
    console.log('👋 Usuario hizo clic en Let\'s Go, pasando datos al componente padre');
    // Primero notifico al padre
    if (onComplete) {
      const inputUsername = usernameInputRef.current ? usernameInputRef.current.value : '';
      const userEmail = getEmail();
      const userId = getUid();
      onComplete({
        success: true,
        username: inputUsername,
        email: userEmail,
        uid: userId
      });
    }
    // Luego cierro todos los modales
    if (onCloseAll) {
      onCloseAll();
    } else if (onClose) {
      onClose();
    }
  };
  
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
  
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 UserProfileModal - Abriendo modal con props:', {
        isOpen,
        email,
        uId,
        birthdate,
        isGoogleAuth,
        sessionStorage: {
          tempUserId: sessionStorage.getItem('tempUserId'),
          tempUserEmail: sessionStorage.getItem('tempUserEmail'),
          tempUserName: sessionStorage.getItem('tempUserName'),
          tempBirthdate: sessionStorage.getItem('tempBirthdate')
        }
      });
    }
  }, [isOpen, email, uId, birthdate, isGoogleAuth]);
  
  if (!isOpen) return null;
  
  // Render success screen if account was created successfully
  if (showSuccessScreen) {
    return (
      <div className="modal-overlay" onClick={(e) => {
        if (e.target.className === 'modal-overlay') {
          window.location.reload();
        }
      }}>
        <div className="success-modal">
          <button className="modal-close" onClick={() => window.location.reload()}>
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
              onClick={() => window.location.reload()}
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
                onClick={() => window.location.reload()}
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
              maxLength="24"
              autoComplete="off"
              disabled={isLoading}
              ref={usernameInputRef}
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