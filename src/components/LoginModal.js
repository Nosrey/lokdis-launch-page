import React, { useEffect, useState, useRef } from 'react';
import '../styles/LoginModal.css';
import QRCode from '../assets/images/qr-code.png';
import GoogleIcon from '../assets/images/google_round_icon.png';
import EmailIcon from '../assets/images/email_round_icon.png';
// Importando los mismos iconos que se usan en HeroContent
import GooglePlayIcon from '../assets/images/googleplay_icon.png';
import AppStoreIcon from '../assets/images/applestore_icon.png';
import GooglePlayIconEN from '../assets/images/googleplay_icon_en.png'; // English Google Play icon
import AppStoreIconEN from '../assets/images/applestore_icon_en.png'; // English App Store icon
import LogoSimple from '../assets/images/logo_simple.png';
import UserProfileModal from './UserProfileModal';
import NotificationModal from './NotificationModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsConditionsModal from './TermsConditionsModal';
import { signInWithGoogle, getBirthdateFromFirebase, storeBirthdateInFirebase } from '../utils/firebase';
import { updateUser, getCurrentFormattedDate, validateBirthdate } from '../utils/userApi';

// API endpoint URL - use proxy in development, full URL as fallback
const API_URL = 'https://www.lokdis.com/back-end-lokdis-app'; // Always use production URL

const LoginModal = ({ isOpen, onClose, language = 'es', onComplete }) => {
  // Usando el idioma proporcionado por el contexto de idioma en lugar de tener un selector propio
  const currentLang = language;
  const [isLandscape, setIsLandscape] = useState(false);
  const [isCompactDesktop, setIsCompactDesktop] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showBirthdateForm, setShowBirthdateForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Google auth specific state
  const [googleAuthData, setGoogleAuthData] = useState(null);
  
  // Estados para la verificación
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [isCodeComplete, setIsCodeComplete] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const codeInputRefs = useRef([]);
  
  // Estados para el cumpleaños
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthdateError, setBirthdateError] = useState('');
  const [isValidAge, setIsValidAge] = useState(false);
  
  // Estados para la contraseña
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estado para mensajes de verificación
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState('');
  
  // Referencias para los inputs de contraseña
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  // Referencias para los inputs de cumpleaños
  const dayInputRef = useRef(null);
  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);
  
  // Add state for showing the profile modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Add state for coordinates and rol (for demo, rol='user')
  const [coordinates, setCoordinates] = useState('');
  const [rol, setRol] = useState('user');
  
  // Estados para el NotificationModal
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  // Nuevo estado para controlar el cierre de LoginModal después de la notificación
  const [closeLoginModalAfterNotification, setCloseLoginModalAfterNotification] = useState(false);
  
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const [isTermsConditionsModalOpen, setIsTermsConditionsModalOpen] = useState(false);
  
  useEffect(() => {
    // When modal is open, prevent background scrolling
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setShowProfileModal(false); // Limpiar estado cuando el modal se cierra
    }
    
    // Check if we're in landscape mode or compact desktop
    const checkScreenSize = () => {
      setIsLandscape(window.innerHeight < 500 && window.innerWidth > window.innerHeight);
      // Check for compact desktop (height between 501-570px)
      setIsCompactDesktop(
        window.innerHeight >= 501 && 
        window.innerHeight <= 570 && 
        window.innerWidth >= 500
      );
    };
    
    // Check on mount and when window resizes
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('resize', checkScreenSize);
      setShowProfileModal(false); // Limpiar estado cuando el componente se desmonta
    };
  }, [isOpen]);
  
  // Clean up any Google auth data in session storage
  const cleanupGoogleAuthData = () => {
    console.log('🧹 Cleaning up Google auth data from sessionStorage');
    sessionStorage.removeItem('tempUserId');
    sessionStorage.removeItem('tempUserName');
    sessionStorage.removeItem('tempUserEmail');
    sessionStorage.removeItem('tempBirthdate');
  };
  
  // Manejar cierre al hacer clic en el fondo
  const handleOverlayClick = (e) => {
    // Solo cerrar si el clic fue directamente en el overlay, no en sus hijos
    if (e.target.className === 'modal-overlay') {
      console.log('🧹 Cerrando LoginModal desde overlay click');
      cleanupGoogleAuthData();
      onClose();
    }
  };
  
  // Reset all state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setShowNotification(false); 
      setCloseLoginModalAfterNotification(false); // Resetear este flag también
      console.log('🧹 Limpiando completamente todos los estados de LoginModal');
      
      // Clean up Google auth data
      cleanupGoogleAuthData();
      
      // Reset all form states
      setShowEmailForm(false);
      setShowVerificationForm(false);
      setShowBirthdateForm(false);
      setShowPasswordForm(false);
      setShowProfileModal(false);
      
      // Reset email states
      setEmail('');
      setEmailError('');
      setIsEmailValid(false);
      
      // Reset verification states
      setVerificationCode(['', '', '', '']);
      setIsCodeComplete(false);
      setResendDisabled(true);
      setCountdown(10);
      
      // Reset verification messages
      setVerificationError('');
      setVerificationSuccess('');
      
      // Reset password states
      setPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setConfirmPasswordError('');
      setPasswordsMatch(false);
      setPasswordStrength(0);
      setShowPassword(false);
      setShowConfirmPassword(false);
      
      // Reset birthdate states
      setBirthDay('');
      setBirthMonth('');
      setBirthYear('');
      setBirthdateError('');
      setIsValidAge(false);

      // Reset geographical data
      setCoordinates('');
    }
  }, [isOpen]);
  
  // Iniciar el contador cuando se muestra el formulario de verificación
  useEffect(() => {
    let timer;
    if (showVerificationForm && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    
    if (countdown === 0) {
      setResendDisabled(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [countdown, showVerificationForm]);
  
  // Verificar si el código está completo
  useEffect(() => {
    const isComplete = verificationCode.every(digit => digit !== '');
    setIsCodeComplete(isComplete);
  }, [verificationCode]);
  
  // Validar el correo cada vez que cambia
  useEffect(() => {
    if (email.trim() === '') {
      setEmailError('');
      setIsEmailValid(false);
      return;
    }
    
    if (validateEmail(email)) {
      setEmailError('');
      setIsEmailValid(true);
    } else {
      setEmailError(t.invalidEmail);
      setIsEmailValid(false);
    }
  }, [email]);
  
  // Verificar la fuerza de la contraseña y si las contraseñas coinciden
  useEffect(() => {
    // Comprobar si las contraseñas coinciden
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setConfirmPasswordError('');
        setPasswordsMatch(true);
      } else {
        setConfirmPasswordError(t.passwordsDoNotMatch);
        setPasswordsMatch(false);
      }
    } else {
      setPasswordsMatch(false);
    }
    
    // Calcular la fuerza de la contraseña
    if (password) {
      const strength = calculatePasswordStrength(password);
      setPasswordStrength(strength);
      
      if (strength < 50) {
        setPasswordError(t.weakPassword);
      } else if (strength < 80) {
        setPasswordError(t.moderatePassword);
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordStrength(0);
      setPasswordError('');
    }
  }, [password, confirmPassword]);
  
  // Calcular la fuerza de la contraseña (0-100)
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    // Longitud mínima
    if (password.length >= 8) {
      strength += 25;
    } else {
      return 10; // Si la contraseña es muy corta, es débil por defecto
    }
    
    // Complejidad
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
    
    if (hasUppercase) strength += 15;
    if (hasLowercase) strength += 15;
    if (hasDigits) strength += 20;
    if (hasSpecialChars) strength += 25;
    
    return Math.min(100, strength);
  };
  
  // Comprobar requisitos individuales de la contraseña
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
  
  // Validar el formato del correo electrónico
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  // Manejar el envío del formulario de correo
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError(t.emptyEmail);
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError(t.invalidEmail);
      return;
    }
    
    setEmailError('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          isCreated: true,
          language: currentLang
        }),
      });
      
      const data = await response.json();
      
      if (response.status === 409 && data.error === 'USER_ALREADY_EXISTS') { 
        console.log('❌ USUARIO EXISTENTE (Email) - MOSTRANDO NOTIFICACIÓN');
        setIsLoading(false);
        setEmailError(''); 
        setCloseLoginModalAfterNotification(false); // Asegurar que no se cierra LoginModal
        displayNotification(
          t.accountExistsTitle || (currentLang === 'es' ? 'Cuenta Existente' : 'Account Exists'),
          t.emailAccountExists || (currentLang === 'es' ? 'Ya existe una cuenta registrada con este correo electrónico.' : 'An account registered with this email already exists.')
        );
        return;
      } else if (response.status >= 200 && response.status < 300 && data.sucessful) {
        setShowEmailForm(false);
        setShowVerificationForm(true);
        setCountdown(10);
        setResendDisabled(true);
      } else {
        setEmailError(data.message || t.invalidEmail);
      }
    } catch (error) {
      setEmailError(t.invalidEmail);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar cambio en el input de correo
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  // Manejar cambio en los inputs de código
  const handleCodeChange = (index, e) => {
    const value = e.target.value;
    
    // Solo permitir dígitos
    if (!/^\d*$/.test(value)) return;
    
    // Solo permitir un dígito por input
    if (value.length > 1) return;
    
    // Actualizar el código
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Mover al siguiente input si hay un valor y no es el último
    if (value && index < 3) {
      codeInputRefs.current[index + 1].focus();
    }
  };
  
  // Manejar teclas especiales en los inputs de código
  const handleKeyDown = (index, e) => {
    // Si se presiona backspace y no hay valor, mover al input anterior
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1].focus();
    }
  };
  
  // Manejar reenvío de código
  const handleResendCode = async () => {
    if (resendDisabled) return;
    
    setCountdown(10);
    setResendDisabled(true);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          isCreated: true,
          language: currentLang
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.sucessful) {
        // If there was an error, show it to the user
        setEmailError(data.message || `Error al reenviar el código a ${email}`);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      setEmailError(`Error al reenviar el código: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Añadir un efecto para limpiar los mensajes de error/éxito después de 5 segundos
  useEffect(() => {
    let timer;
    // Si hay un mensaje de error o éxito, configurar un temporizador para limpiarlo
    if (verificationError || verificationSuccess) {
      timer = setTimeout(() => {
        setVerificationError('');
        setVerificationSuccess('');
      }, 5000); // 5 segundos
    }
    
    // Limpiar el temporizador cuando el componente se desmonte o cuando los mensajes cambien
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [verificationError, verificationSuccess]);
  
  // Añadir un efecto para validar la edad
  useEffect(() => {
    validateBirthdate();
  }, [birthDay, birthMonth, birthYear]);
  
  // Función para validar la fecha de nacimiento
  const validateBirthdate = () => {
    setBirthdateError('');
    
    // Verificar que todos los campos estén completos
    if (!birthDay || !birthMonth || !birthYear) {
      setIsValidAge(false);
      return;
    }
    
    // Convertir a números
    const day = parseInt(birthDay, 10);
    const month = parseInt(birthMonth, 10);
    const year = parseInt(birthYear, 10);
    
    // Verificar que sean números válidos
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      setBirthdateError(currentLang === 'es' ? 'Por favor, introduce una fecha válida' : 'Please enter a valid date');
      setIsValidAge(false);
      return;
    }
    
    // Verificar que sean valores válidos para día, mes y año
    if (month < 1 || month > 12) {
      setBirthdateError(currentLang === 'es' ? 'Mes inválido' : 'Invalid month');
      setIsValidAge(false);
      return;
    }
    
    // Verificar días según el mes
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      setBirthdateError(currentLang === 'es' ? 'Día inválido para el mes seleccionado' : 'Invalid day for selected month');
      setIsValidAge(false);
      return;
    }
    
    // Verificar que el año esté en un rango razonable
    const currentYear = new Date().getFullYear();
    if (year < currentYear - 120 || year > currentYear) {
      setBirthdateError(currentLang === 'es' ? 'Año inválido' : 'Invalid year');
      setIsValidAge(false);
      return;
    }
    
    // Verificar que el usuario tenga al menos 14 años
    const birthdate = new Date(year, month - 1, day);
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
    
    if (birthdate > minAgeDate) {
      setBirthdateError(currentLang === 'es' ? 'Debes tener al menos 14 años para registrarte' : 'You must be at least 14 years old to register');
      setIsValidAge(false);
      return;
    }
    
    // Si llegamos hasta aquí, la fecha es válida y el usuario tiene al menos 14 años
    setIsValidAge(true);
  };
  
  // Funciones para manejar cambios en los inputs de cumpleaños
  const handleBirthDayChange = (e) => {
    const value = e.target.value;
    // Solo permitir números y limitar a 2 dígitos
    if (/^\d{0,2}$/.test(value)) {
      setBirthDay(value);
      // Si se introdujeron 2 dígitos, mover al siguiente campo
      if (value.length === 2 && monthInputRef.current) {
        monthInputRef.current.focus();
      }
    }
  };
  
  const handleBirthMonthChange = (e) => {
    const value = e.target.value;
    // Solo permitir números y limitar a 2 dígitos
    if (/^\d{0,2}$/.test(value)) {
      setBirthMonth(value);
      // Si se introdujeron 2 dígitos, mover al siguiente campo
      if (value.length === 2 && yearInputRef.current) {
        yearInputRef.current.focus();
      }
    }
  };
  
  const handleBirthYearChange = (e) => {
    const value = e.target.value;
    // Solo permitir números y limitar a 4 dígitos
    if (/^\d{0,4}$/.test(value)) {
      setBirthYear(value);
    }
  };
  
  // Manejar teclas especiales en los inputs de cumpleaños
  const handleBirthdateKeyDown = (field, e) => {
    if (e.key === 'Backspace') {
      if (field === 'month' && !birthMonth && dayInputRef.current) {
        dayInputRef.current.focus();
      } else if (field === 'year' && !birthYear && monthInputRef.current) {
        monthInputRef.current.focus();
      }
    }
  };
  
  // Manejar el envío del formulario de cumpleaños
  const handleBirthdateSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔍 handleBirthdateSubmit called, isValidAge:', isValidAge);
    
    if (!isValidAge) {
      return;
    }
    
    // Format the birthdate
    const formattedBirthdate = `${birthDay.padStart(2, '0')}/${birthMonth.padStart(2, '0')}/${birthYear}`;
    console.log('🔍 Formatted birthdate:', formattedBirthdate);
    
    // If we came from Google Auth (there's a tempUserId in session storage)
    const tempUserId = sessionStorage.getItem('tempUserId');
    const tempUserName = sessionStorage.getItem('tempUserName');
    const tempUserEmail = sessionStorage.getItem('tempUserEmail');
    
    console.log('🔍 Session storage data for Google auth flow:', { 
      tempUserId, 
      tempUserName, 
      tempUserEmail,
      hasStateEmail: Boolean(email)
    });
    
    if (tempUserId && tempUserName) {
      console.log('🔍 Google auth flow detected');
      
      // Update googleAuthData with the birthdate
      if (googleAuthData) {
        updateGoogleAuthData({
          ...googleAuthData,
          birthdate: formattedBirthdate
        });
      } else {
        // Initialize googleAuthData if not already set
        updateGoogleAuthData({
          name: tempUserName,
          email: tempUserEmail || email,
          uid: tempUserId,
          birthdate: formattedBirthdate,
          isGoogle: true
        });
      }
      
      try {
        setIsLoading(true);
        
        // Store birthdate in Firebase
        try {
          await storeBirthdateInFirebase(tempUserId, formattedBirthdate);
          console.log('✅ Birthdate saved to Firebase successfully');
          // Store locally too for future use
          sessionStorage.setItem('tempBirthdate', formattedBirthdate);
        } catch (firebaseError) {
          console.error('❌ Error storing birthdate in Firebase:', firebaseError);
          // Continue anyway - we can still try to show the profile setup
        }
        
        // Proceed to profile setup without checking birthdate again
        setIsLoading(false);
        setShowBirthdateForm(false);
        setShowProfileModal(true);
      } catch (error) {
        console.error('❌ Error in Google auth flow:', error);
        setBirthdateError(currentLang === 'es' 
          ? 'Error al procesar la fecha de nacimiento. Inténtalo de nuevo.' 
          : 'Error processing birthdate. Please try again.');
        setIsLoading(false);
      }
    } else {
      // Regular flow (not from Google Auth)
      console.log('🔍 Regular flow detected - proceeding to password step');
      // Original code for advancing to password setup
      setShowBirthdateForm(false);
      setShowPasswordForm(true);
    }
  };
  
  // Manejar verificación de código
  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    setIsLoading(true);
    setVerificationError('');
    setVerificationSuccess('');
    try {
      const response = await fetch(`${API_URL}/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: code,
          language: currentLang
        }),
      });
      const data = await response.json();
      if (response.status >= 200 && response.status < 300 && data.success === true) {
        setVerificationSuccess(currentLang === 'es' ? 'Código verificado exitosamente' : 'Code successfully verified');
        setTimeout(() => {
    setShowVerificationForm(false);
          setShowBirthdateForm(true);
          setVerificationSuccess('');
          setIsLoading(false);
        }, 1000);
      } else {
        setVerificationError(data.message || (currentLang === 'es' ? 'Código inválido o expirado' : 'Invalid or expired code'));
        setIsLoading(false);
      }
    } catch (error) {
      setVerificationError(currentLang === 'es' ? 'Error de conexión' : 'Connection error');
      setIsLoading(false);
    }
  };
  
  // Manejar cambio en el input de contraseña
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  
  // Manejar cambio en el input de confirmación de contraseña
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  
  // Alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Alternar la visibilidad de la confirmación de contraseña
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // Manejar el envío del formulario de contraseña
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setPasswordError(t.emptyPassword);
      return;
    }
    if (passwordStrength < 50) {
      setPasswordError(t.weakPassword);
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError(t.emptyConfirmPassword);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(t.passwordsDoNotMatch);
      return;
    }
    
    // Guardar el password en el estado y abrir el modal de perfil
    setShowPasswordForm(false);
    setShowProfileModal(true);
  };
  
  // Handle profile completion
  const handleProfileComplete = (profileData) => {
    console.log('🔵 LoginModal: handleProfileComplete llamado con:', profileData);
    // Primero limpio todos los estados
    setShowProfileModal(false);
    setShowEmailForm(false);
    setShowVerificationForm(false);
    setShowBirthdateForm(false);
    setShowPasswordForm(false);
    setEmail('');
    setPassword('');
    cleanupGoogleAuthData();

    // Luego notifico al padre
    if (onComplete) {
      onComplete(profileData);
    }
    // Finalmente cierro el modal
    if (onClose) {
      onClose();
    }
  };
  
  // Volver a la vista de verificación desde la pantalla de cumpleaños
  const handleBackToVerification = () => {
    setShowBirthdateForm(false);
    setShowVerificationForm(true);
  };
  
  // Volver a la vista de formulario de correo
  const handleBackToEmail = () => {
    setShowVerificationForm(false);
    setShowEmailForm(true);
    setVerificationCode(['', '', '', '']);
    setIsCodeComplete(false);
  };
  
  // Volver a la vista de cumpleaños desde la contraseña
  const handleBackToBirthdate = () => {
    setShowPasswordForm(false);
    setShowBirthdateForm(true);
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setConfirmPasswordError('');
  };
  
  // Modificar la función handleBack para incluir la vista de cumpleaños
  const handleBack = () => {
    // Limpiar todos los estados
    setShowEmailForm(false);
    setShowVerificationForm(false);
    setShowBirthdateForm(false);
    setShowPasswordForm(false);
    setEmail('');
    setEmailError('');
    setIsEmailValid(false);
    setVerificationCode(['', '', '', '']);
    setIsCodeComplete(false);
    setBirthDay('');
    setBirthMonth('');
    setBirthYear('');
    setBirthdateError('');
    setIsValidAge(false);
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setConfirmPasswordError('');
    // Limpiar datos de Google Auth
    cleanupGoogleAuthData();
  };
  
  // Get coordinates (optional, can be improved)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates(`${position.coords.latitude},${position.coords.longitude}`);
        },
        () => {
          setCoordinates('');
        }
      );
    }
  }, []);
  
  // Update googleAuthData in state and sessionStorage
  const updateGoogleAuthData = (data) => {
    setGoogleAuthData(data);
    
    // Store individual fields in sessionStorage for persistence
    if (data) {
      if (data.name) sessionStorage.setItem('tempUserName', data.name);
      if (data.email) sessionStorage.setItem('tempUserEmail', data.email);
      if (data.uid) sessionStorage.setItem('tempUserId', data.uid);
      if (data.birthdate) sessionStorage.setItem('tempBirthdate', data.birthdate);
    }
  };
  
  // Update the handleGoogleSignIn function to store email in sessionStorage
  const handleGoogleSignIn = async () => {
    try {
      console.log('🔍 Iniciando Google Sign In');
      setIsLoading(true);
      setEmailError('');
      
      const { user, token } = await signInWithGoogle();
      const name = user.displayName || '';
      const userEmail = user.email;
      const uid = user.uid;
      
      console.log('🔍 Datos de usuario de Google:', { name, userEmail, uid });
      
      if (!userEmail) {
        console.log('🔍 No se pudo obtener el correo electrónico de tu cuenta de Google. Intenta con otro método.');
        setIsLoading(false);
        displayNotification(t.errorTitle, currentLang === 'es' ? 'No se pudo obtener el correo de Google.' : 'Could not get email from Google.');
        return;
      }
      
      console.log('🔍 Verificando birthdate en Firebase para uid:', uid);
      let birthdate = await getBirthdateFromFirebase(uid);
      console.log('🔍 Birthdate encontrado:', birthdate);
      
      if (birthdate) {
        console.log('❌ USUARIO EXISTENTE (Google) - MOSTRANDO NOTIFICACIÓN Y LUEGO CERRANDO LOGINMODAL');
        cleanupGoogleAuthData(); 
        setIsLoading(false);
        
        setCloseLoginModalAfterNotification(true); // Marcar que LoginModal debe cerrarse después
        displayNotification(
          t.accountExistsTitle || (currentLang === 'es' ? 'Cuenta Existente' : 'Account Exists'),
          t.googleAccountExists || (currentLang === 'es' ? 'Ya existe una cuenta asociada a este correo de Google.' : 'An account associated with this Google email already exists.')
        );
        // No llamar a onClose() para LoginModal aquí directamente
        return;
      }
      
      // SOLO si es un usuario nuevo continuamos
      console.log('✨ USUARIO NUEVO - Continuando con registro');
      setEmail(userEmail);
      sessionStorage.setItem('tempUserEmail', userEmail);
      sessionStorage.setItem('tempUserName', name);
      sessionStorage.setItem('tempUserId', uid);
      
      updateGoogleAuthData({
        name,
        email: userEmail,
        uid,
        isGoogle: true
      });
      
      setShowBirthdateForm(true);
      setIsLoading(false);
      
    } catch (error) {
      console.error('❌ Error en Google sign-in:', error);
      let errorMessage = currentLang === 'es' ? 'Error al iniciar sesión con Google. Inténtalo de nuevo.' : 'Error signing in with Google. Please try again.';
      if (error.code === 'auth/popup-closed-by-user' || error.message.includes('popup_closed_by_user')) {
        errorMessage = currentLang === 'es' ? 'El inicio de sesión con Google fue cancelado.' : 'Google sign-in was cancelled.';
      }
      displayNotification(t.errorTitle, errorMessage);
      setIsLoading(false);
      cleanupGoogleAuthData();
    }
  };
  
  // Función para mostrar notificaciones
  const displayNotification = (title, message) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotification(true);
  };
  
  const handleOpenPrivacyPolicyModal = () => {
    setIsPrivacyPolicyModalOpen(true);
  };
  const handleClosePrivacyPolicyModal = () => setIsPrivacyPolicyModalOpen(false);

  const handleOpenTermsConditionsModal = () => {
    setIsTermsConditionsModalOpen(true);
  };
  const handleCloseTermsConditionsModal = () => setIsTermsConditionsModalOpen(false);
  
  const translations = {
    es: {
      welcome: 'Te damos la bienvenida',
      continueText: 'Al continuar el proceso, aceptas nuestros',
      terms: 'Términos y condiciones',
      privacyInfo: 'Obtén más información sobre cómo procesamos tus datos en nuestra',
      privacyPolicy: 'Política de privacidad',
      loginGmail: 'Iniciar sesión con Gmail',
      loginEmail: 'Iniciar sesión con Email',
      troubleLogin: '¿No consigues iniciar sesión?',
      getApp: '¡Consigue la app!',
      downloadOn: 'DISPONIBLE EN',
      googlePlay: 'Google Play',
      appStore: 'App Store',
      getOnAppStore: 'Consíguelo en la',
      emailPlaceholder: 'Introduce tu correo electrónico',
      submitEmail: 'Continuar',
      back: 'Volver',
      enterEmail: 'Introduce tu correo para crear una cuenta',
      invalidEmail: 'Por favor, introduce un correo electrónico válido',
      emptyEmail: 'Por favor, introduce tu correo electrónico',
      verifyTitle: 'Verifica tu correo electrónico',
      verifyMessage: 'Introduce el código de 4 dígitos que hemos enviado al correo',
      resendMessage: 'No he recibido el código',
      resendTimerPrefix: 'Reenviar en',
      resendTimerSuffix: 'segundos',
      resendButton: 'Reenviar código',
      verifyButton: 'Validar código',
      cancelButton: 'Cancelar',
      codeInputLabel: 'Código de verificación',
      // Password translations
      passwordTitle: 'Crea tu contraseña',
      passwordMessage: 'Indica una contraseña segura para tu cuenta',
      passwordPlaceholder: 'Contraseña',
      confirmPasswordPlaceholder: 'Confirma tu contraseña',
      continueButton: 'Siguiente',
      emptyPassword: 'Por favor, introduce una contraseña',
      emptyConfirmPassword: 'Por favor, confirma tu contraseña',
      passwordsDoNotMatch: 'Las contraseñas no coinciden',
      weakPassword: 'Contraseña débil',
      moderatePassword: 'Contraseña media',
      strongPassword: 'Contraseña fuerte',
      requirementsTitle: 'Tu contraseña debe incluir:',
      requirementLength: 'Al menos 8 caracteres',
      requirementUppercase: 'Al menos una letra mayúscula',
      requirementLowercase: 'Al menos una letra minúscula',
      requirementNumber: 'Al menos un número',
      requirementSpecial: 'Al menos un carácter especial',
      // Birthdate translations
      birthdateTitle: 'Fecha de nacimiento',
      birthdateMessage: 'Por favor, introduce tu fecha de nacimiento',
      dayPlaceholder: 'DD',
      monthPlaceholder: 'MM',
      yearPlaceholder: 'AAAA',
      minAgeMessage: 'Debes tener al menos 14 años para registrarte',
      errorTitle: 'Error',
      accountExistsTitle: 'Cuenta Existente',
      googleAccountExists: 'Ya existe una cuenta asociada a este correo de Google.',
      emailAccountExists: 'Ya existe una cuenta registrada con este correo electrónico.',
    },
    en: {
      welcome: 'Welcome',
      continueText: 'By continuing, you accept our',
      terms: 'Terms and Conditions',
      privacyInfo: 'Get more information about how we process your data in our',
      privacyPolicy: 'Privacy Policy',
      loginGmail: 'Login with Gmail',
      loginEmail: 'Login with Email',
      troubleLogin: 'Having trouble logging in?',
      getApp: 'Get the app!',
      downloadOn: 'AVAILABLE ON',
      googlePlay: 'Google Play',
      appStore: 'App Store',
      getOnAppStore: 'Get it on',
      emailPlaceholder: 'Enter your email',
      submitEmail: 'Continue',
      back: 'Back',
      enterEmail: 'Enter your email to create an account',
      invalidEmail: 'Please enter a valid email address',
      emptyEmail: 'Please enter your email address',
      verifyTitle: 'Verify your email',
      verifyMessage: 'Enter the 4-digit code we sent to your email',
      resendMessage: 'Didn\'t receive the code?',
      resendTimerPrefix: 'Resend in',
      resendTimerSuffix: 'seconds',
      resendButton: 'Resend code',
      verifyButton: 'Verify code',
      cancelButton: 'Cancel',
      codeInputLabel: 'Verification code',
      // Password translations
      passwordTitle: 'Create your password',
      passwordMessage: 'Enter a secure password for your account',
      passwordPlaceholder: 'Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      continueButton: 'Next',
      emptyPassword: 'Please enter a password',
      emptyConfirmPassword: 'Please confirm your password',
      passwordsDoNotMatch: 'Passwords do not match',
      weakPassword: 'Weak password',
      moderatePassword: 'Moderate password',
      strongPassword: 'Strong password',
      requirementsTitle: 'Your password must include:',
      requirementLength: 'At least 8 characters',
      requirementUppercase: 'At least one uppercase letter',
      requirementLowercase: 'At least one lowercase letter',
      requirementNumber: 'At least one number',
      requirementSpecial: 'At least one special character',
      // Birthdate translations
      birthdateTitle: 'Date of birth',
      birthdateMessage: 'Please enter your date of birth',
      dayPlaceholder: 'DD',
      monthPlaceholder: 'MM',
      yearPlaceholder: 'YYYY',
      minAgeMessage: 'You must be at least 14 years old to register',
      errorTitle: 'Error',
      accountExistsTitle: 'Account Exists',
      googleAccountExists: 'An account associated with this Google email already exists.',
      emailAccountExists: 'An account registered with this email already exists.',
    }
  };
  
  const t = translations[currentLang] || translations.es;
  
  if (!isOpen) return null;
  
  // Renderizar el formulario de cumpleaños
  const renderBirthdateForm = () => {
    return (
      <>
        <button 
          className="mobile-back-arrow" 
          onClick={handleBackToVerification}
          aria-label="Go back"
        >
          <span>&larr;</span>
        </button>
        
        <div className="modal-logo">
          <div className="logo-circle">
            <img src={LogoSimple} alt="Logo" className="logo-icon" />
          </div>
        </div>
        
        <h2 className="modal-title">{t.birthdateTitle}</h2>
        
        <div className="birthdate-container">
          <p className="birthdate-message">
            {t.birthdateMessage}
          </p>
          
          <form className="birthdate-form" onSubmit={handleBirthdateSubmit}>
            <div className="birthdate-input-group" aria-label="Date of birth">
              <div className="birthdate-input-container">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="2"
                  className="birthdate-input day-input"
                  placeholder={t.dayPlaceholder}
                  value={birthDay}
                  onChange={handleBirthDayChange}
                  ref={dayInputRef}
                  autoFocus
                />
                <span className="date-separator">/</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="2"
                  className="birthdate-input month-input"
                  placeholder={t.monthPlaceholder}
                  value={birthMonth}
                  onChange={handleBirthMonthChange}
                  onKeyDown={(e) => handleBirthdateKeyDown('month', e)}
                  ref={monthInputRef}
                />
                <span className="date-separator">/</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="4"
                  className="birthdate-input year-input"
                  placeholder={t.yearPlaceholder}
                  value={birthYear}
                  onChange={handleBirthYearChange}
                  onKeyDown={(e) => handleBirthdateKeyDown('year', e)}
                  ref={yearInputRef}
                />
              </div>
            </div>
            
            {birthdateError && (
              <div className="error-message birthdate-error">
                {birthdateError}
              </div>
            )}
            
            <button 
              type="submit" 
              className="continue-button"
              disabled={!isValidAge}
            >
              {t.continueButton}
            </button>
          </form>
        </div>
      </>
    );
  };
  
  // Renderizar el formulario de verificación
  const renderVerificationForm = () => {
    return (
      <>
        <button 
          className="mobile-back-arrow" 
          onClick={handleBackToEmail}
          aria-label="Go back"
        >
          <span>&larr;</span>
        </button>
        
        <div className="modal-logo">
          <div className="logo-circle">
            <img src={LogoSimple} alt="Logo" className="logo-icon" />
          </div>
        </div>
        
        <h2 className="modal-title">{t.verifyTitle}</h2>
        
        <div className="verification-container">
          <p className="verification-message">
            {t.verifyMessage} <span className="verification-email">{email}</span>
          </p>
          
          <div className="code-input-group" aria-label={t.codeInputLabel}>
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => (codeInputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                className="code-input"
                value={verificationCode[index]}
                onChange={(e) => handleCodeChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
                disabled={isLoading}
              />
            ))}
          </div>
          
          <div className="resend-container">
            <p className="resend-message">{t.resendMessage}</p>
            {resendDisabled ? (
              <p className="resend-timer">
                {t.resendTimerPrefix} {countdown} {t.resendTimerSuffix}
              </p>
            ) : (
              <button 
                className="resend-button" 
                onClick={handleResendCode}
                disabled={resendDisabled || isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  t.resendButton
                )}
              </button>
            )}
          </div>
          
          {verificationError && (
            <div className="error-message verification-error">
              {verificationError}
            </div>
          )}
          
          {verificationSuccess && (
            <div 
              className="success-message-verification" 
              style={{
                color: '#4CAF50',
                fontWeight: '500',
                fontSize: '14px',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '4px',
                padding: '8px 12px',
                margin: '10px auto',
                maxWidth: '90%',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <span className="success-icon" style={{marginRight: '8px', fontWeight: 'bold', color: '#4CAF50'}}>✓</span> 
              {verificationSuccess}
            </div>
          )}
          
          <button 
            className="verify-button"
            onClick={handleVerifyCode}
            disabled={!isCodeComplete || isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              t.verifyButton
            )}
          </button>
        </div>
      </>
    );
  };
  
  // Renderizar el formulario de correo electrónico
  const renderEmailForm = () => {
    return (
      <>
        <button 
          className="mobile-back-arrow" 
          onClick={handleBack}
          aria-label="Go back"
        >
          <span>&larr;</span>
        </button>
        
        <div className="modal-logo">
          <div className="logo-circle">
            <img src={LogoSimple} alt="Logo" className="logo-icon" />
          </div>
        </div>
        
        <h2 className="modal-title">{t.welcome}</h2>
        
        <p className="modal-text">
          {t.enterEmail}
        </p>
        
        <form className="email-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="email-input"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={handleEmailChange}
            autoComplete="email"
            autoFocus
            disabled={isLoading}
          />
          {emailError && <div className="error-message">{emailError}</div>}
          
          <p className="terms-text">
            {t.termsAndConditionsTextBeforePrivacy}
            <span className="terms-link" onClick={(e) => { e.preventDefault(); handleOpenPrivacyPolicyModal(); }}>{t.privacyPolicyLinkText}</span>
            {t.termsAndConditionsTextBetween}
            <span className="terms-link" onClick={(e) => { e.preventDefault(); handleOpenTermsConditionsModal(); }}>{t.termsConditionsLinkText}</span>
            {t.termsAndConditionsTextAfter}
          </p>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={!isEmailValid || isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              t.submitEmail
            )}
          </button>
        </form>
      </>
    );
  };
  
  // Renderizar el formulario de contraseña
  const renderPasswordForm = () => {
    return (
      <>
        <button 
          className="mobile-back-arrow" 
          onClick={handleBackToBirthdate}
          aria-label="Go back"
        >
          <span>&larr;</span>
        </button>
        
        <div className="modal-logo">
          <div className="logo-circle">
            <img src={LogoSimple} alt="Logo" className="logo-icon" />
          </div>
        </div>
        
        <h2 className="modal-title">{t.passwordTitle}</h2>
        
        <div className="password-setup-container">
          <p className="password-message">{t.passwordMessage}</p>
          
          <form className="password-form" onSubmit={handlePasswordSubmit}>
            <div className="password-input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="password-input"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={handlePasswordChange}
                ref={passwordInputRef}
                autoFocus
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            
            <div className="password-strength">
              <div className="strength-meter">
                <div 
                  className="strength-fill" 
                  style={{
                    width: `${passwordStrength}%`,
                    backgroundColor: 
                      passwordStrength < 50 ? "#ff4d4d" : 
                      passwordStrength < 80 ? "#ffa64d" : 
                      "#4CAF50"
                  }}
                />
              </div>
              <div className="strength-text">
                {password ? 
                  passwordStrength < 50 ? t.weakPassword : 
                  passwordStrength < 80 ? t.moderatePassword : 
                  t.strongPassword 
                : ""}
              </div>
            </div>
            
            <div className="password-requirements">
              <div>{t.requirementsTitle}</div>
              <div className={`requirement ${passwordRequirements.length ? "fulfilled" : ""}`}>
                {t.requirementLength}
              </div>
              <div className={`requirement ${passwordRequirements.uppercase ? "fulfilled" : ""}`}>
                {t.requirementUppercase}
              </div>
              <div className={`requirement ${passwordRequirements.lowercase ? "fulfilled" : ""}`}>
                {t.requirementLowercase}
              </div>
              <div className={`requirement ${passwordRequirements.number ? "fulfilled" : ""}`}>
                {t.requirementNumber}
              </div>
              <div className={`requirement ${passwordRequirements.special ? "fulfilled" : ""}`}>
                {t.requirementSpecial}
              </div>
            </div>
            
            <div className="password-input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="password-input"
                placeholder={t.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                ref={confirmPasswordInputRef}
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            
            {confirmPasswordError && (
              <div className="error-message">{confirmPasswordError}</div>
            )}
            
            <button 
              type="submit" 
              className="continue-button"
              disabled={!passwordsMatch || passwordStrength < 50}
            >
              {t.continueButton}
            </button>
          </form>
        </div>
      </>
    );
  };
  
  // Render content based on screen size
  const renderContent = () => {
    if (showProfileModal) {
      if (googleAuthData) {
        const { name, email: gEmail, uid: gUid, birthdate: gBirthdate } = googleAuthData;
      return (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
              if (onClose) onClose();
            }}
            language={language}
            onComplete={handleProfileComplete}
            email={gEmail}
            uId={gUid}
            birthdate={gBirthdate}
            isGoogleAuth={true}
            coordinates={coordinates || ''}
            rol="normal"
          />
        );
      } else {
        // Flujo regular: pasar email y password explícitamente
        return (
          <UserProfileModal
            isOpen={showProfileModal}
            onClose={() => {
              setShowProfileModal(false);
              if (onClose) onClose();
          }}
          language={language}
          onComplete={handleProfileComplete}
          email={email}
          password={password}
          birthdate={`${birthDay.padStart(2, '0')}/${birthMonth.padStart(2, '0')}/${birthYear}`}
          coordinates={coordinates}
          rol={rol}
            uId={undefined}
        />
      );
      }
    }
    // Si estamos mostrando el formulario de contraseña
    if (showPasswordForm) {
      return renderPasswordForm();
    }
    
    // Si estamos mostrando el formulario de cumpleaños
    if (showBirthdateForm) {
      return renderBirthdateForm();
    }
    
    // Si estamos mostrando el formulario de verificación
    if (showVerificationForm) {
      return renderVerificationForm();
    }
    
    // Si estamos mostrando el formulario de correo
    if (showEmailForm) {
      return renderEmailForm();
    }
    
    if (isCompactDesktop) {
      // Compact desktop layout (two columns for short heights)
      return (
        <div className="login-modal-content-compact">
          <div className="login-left-column">
            <div className="modal-logo">
              <div className="logo-circle">
                <img src={LogoSimple} alt="Logo" className="logo-icon" />
              </div>
            </div>
            
            <h2 className="modal-title">{t.welcome}</h2>
            
            <p className="modal-text">
              {t.continueText} <span className="modal-link terms-link" onClick={(e) => { e.preventDefault(); handleOpenTermsConditionsModal(); }}>{t.terms}</span>.
              <br />
              {t.privacyInfo} <span className="modal-link terms-link" onClick={(e) => { e.preventDefault(); handleOpenPrivacyPolicyModal(); }}>{t.privacyPolicy}</span>.
            </p>
            
            <div className="login-options">
              <button 
                className="login-button login-gmail"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <img src={GoogleIcon} alt="Google" className="button-icon" />
                {isLoading && <span className="loading-spinner"></span>}
                {!isLoading && t.loginGmail}
              </button>
              
              <button 
                className="login-button login-email"
                onClick={() => {
                  setEmailError('');
                  setShowEmailForm(true);
                }}
              >
                <img src={EmailIcon} alt="Email" className="button-icon email-icon" />
                {t.loginEmail}
              </button>
            </div>
            
            <a href="#" className="trouble-link">{t.troubleLogin}</a>
          </div>
          
          <div className="login-right-column">
            <div className="app-download">
              <p className="app-download-title">{t.getApp}</p>
              
              <div className="app-stores">
                <a href="#" className="store-badge">
                  <img 
                    src={currentLang === 'en' ? GooglePlayIconEN : GooglePlayIcon} 
                    alt="Google Play" 
                    className="store-badge-img"
                  />
                </a>
                
                <a href="#" className="store-badge">
                  <img 
                    src={currentLang === 'en' ? AppStoreIconEN : AppStoreIcon} 
                    alt="App Store" 
                    className="store-badge-img"
                  />
                </a>
              </div>
              
              <div className="qr-code-container">
                <img src={QRCode} alt="QR Code" className="qr-code" />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (isLandscape) {
      // Landscape layout
      return (
        <div className="login-modal-content">
          <div className="login-left-section">
            <div className="modal-logo">
              <div className="logo-circle">
                <img src={LogoSimple} alt="Logo" className="logo-icon" />
              </div>
            </div>
            
            <h2 className="modal-title">{t.welcome}</h2>
            
            <p className="modal-text">
              {t.continueText} <span className="modal-link terms-link" onClick={(e) => { e.preventDefault(); handleOpenTermsConditionsModal(); }}>{t.terms}</span>.
              <br />
              {t.privacyInfo} <span className="modal-link terms-link" onClick={(e) => { e.preventDefault(); handleOpenPrivacyPolicyModal(); }}>{t.privacyPolicy}</span>.
            </p>
            
            <div className="login-options">
              <button 
                className="login-button login-gmail"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <img src={GoogleIcon} alt="Google" className="button-icon" />
                {isLoading && <span className="loading-spinner"></span>}
                {!isLoading && t.loginGmail}
              </button>
              
              <button 
                className="login-button login-email"
                onClick={() => {
                  setEmailError('');
                  setShowEmailForm(true);
                }}
              >
                <img src={EmailIcon} alt="Email" className="button-icon email-icon" />
                {t.loginEmail}
              </button>
            </div>
            
            <a href="#" className="trouble-link">{t.troubleLogin}</a>
          </div>
          
          <div className="login-right-section">
            <div className="app-download">
              <p className="app-download-title">{t.getApp}</p>
              
              <div className="app-stores">
                <a href="#" className="store-badge">
                  <img 
                    src={currentLang === 'en' ? GooglePlayIconEN : GooglePlayIcon} 
                    alt="Google Play" 
                    className="store-badge-img"
                  />
                </a>
                
                <a href="#" className="store-badge">
                  <img 
                    src={currentLang === 'en' ? AppStoreIconEN : AppStoreIcon} 
                    alt="App Store" 
                    className="store-badge-img"
                  />
                </a>
              </div>
              
              <div className="qr-code-container">
                <img src={QRCode} alt="QR Code" className="qr-code" />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Portrait (default) layout
      return (
        <>
          <div className="modal-logo">
            <div className="logo-circle">
              <img src={LogoSimple} alt="Logo" className="logo-icon" />
            </div>
          </div>
          
          <h2 className="modal-title">{t.welcome}</h2>
          
          <p className="modal-text">
            {t.continueText} <span className="modal-link terms-link" onClick={(e) => { e.preventDefault(); handleOpenTermsConditionsModal(); }}>{t.terms}</span>.
            <br />
            {t.privacyInfo} <span className="modal-link terms-link" onClick={(e) => { e.preventDefault(); handleOpenPrivacyPolicyModal(); }}>{t.privacyPolicy}</span>.
          </p>
          
          <div className="login-options">
            <button 
              className="login-button login-gmail"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <img src={GoogleIcon} alt="Google" className="button-icon" />
              {isLoading && <span className="loading-spinner"></span>}
              {!isLoading && t.loginGmail}
            </button>
            
            <button 
              className="login-button login-email"
              onClick={() => {
                setEmailError('');
                setShowEmailForm(true);
              }}
            >
              <img src={EmailIcon} alt="Email" className="button-icon email-icon" />
              {t.loginEmail}
            </button>
          </div>
          
          <a href="#" className="trouble-link">{t.troubleLogin}</a>
          
          <div className="app-download">
            <p className="app-download-title">{t.getApp} 📱</p>
            
            <div className="app-stores">
              <a href="#" className="store-badge">
                <img 
                  src={currentLang === 'en' ? GooglePlayIconEN : GooglePlayIcon} 
                  alt="Google Play" 
                  className="store-badge-img"
                />
              </a>
              
              <a href="#" className="store-badge">
                <img 
                  src={currentLang === 'en' ? AppStoreIconEN : AppStoreIcon} 
                  alt="App Store" 
                  className="store-badge-img"
                />
              </a>
            </div>
            
            <div className="qr-code-container">
              <img src={QRCode} alt="QR Code" className="qr-code" />
            </div>
          </div>
        </>
      );
    }
  };
  
  // Handle modal close and cleanup
  const handleModalClose = () => {
    setShowProfileModal(false); // Limpiar estado de ProfileModal
    cleanupGoogleAuthData();
    onClose();
  };

  // Add code to show ProfileModal directly after birthdate completion for Google Auth users
  if (showBirthdateForm) {
    // Add debug log to check googleAuthData state
    console.log('🧪 En showBirthdateForm, googleAuthData =', googleAuthData);
  }

  if (showProfileModal && googleAuthData) {
    console.log('🧪 Mostrando ProfileModal con googleAuthData:', googleAuthData);
  }
  
  return (
    <>
      <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
        <div className={`login-modal ${showPasswordForm ? 'password-view' : ''} ${isOpen ? 'active' : ''}`}>
          <button className="modal-close" onClick={onClose}> 
            <span>×</span>
          </button>
          {renderContent()}
        </div>
      </div>
      <NotificationModal
        isOpen={showNotification}
        onClose={() => {
          setShowNotification(false); // Siempre cierra la notificación
          if (closeLoginModalAfterNotification) {
            setCloseLoginModalAfterNotification(false); // Resetea el flag
            if (onClose) onClose(); // Ahora cierra LoginModal si estaba marcado
          }
        }}
        title={notificationTitle}
        message={notificationMessage}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyModalOpen}
        onClose={handleClosePrivacyPolicyModal}
        language={language}
      />
      <TermsConditionsModal
        isOpen={isTermsConditionsModalOpen}
        onClose={handleCloseTermsConditionsModal}
        language={language}
      />
    </>
  );
};

export default LoginModal; 