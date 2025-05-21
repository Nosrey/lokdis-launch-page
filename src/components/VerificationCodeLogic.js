import { useState, useEffect } from 'react';

// API URL from environment variable
const API_URL = 'https://www.lokdis.com/back-end-lokdis-app';

// Email validation regex (same as Flutter code)
const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

export const useVerificationCode = () => {
  // State variables
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [enableButton, setEnableButton] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [language, setLanguage] = useState('en');
  const [themeColor, setThemeColor] = useState('dark');
  
  // Validate email format
  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  // Check internet connection (simplified version)
  const checkInternetConnection = async () => {
    try {
      // A simple fetch to check connectivity
      await fetch('https://www.google.com', { mode: 'no-cors', cache: 'no-store' });
      return true;
    } catch (error) {
      return false;
    }
  };

  // Send verification code to email
  const sendVerificationCode = async () => {
    // Validate email before sending
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }

    setIsLoading(true);
    setEnableButton(false);
    
    try {
      // Check internet connection first
      const hasConnection = await checkInternetConnection();
      if (!hasConnection) {
        setErrorMessage('Please check your internet connection');
        setIsLoading(false);
        setEnableButton(true);
        return false;
      }

      // Send request to API
      const response = await fetch(`${API_URL}/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          isCreated: true,
          language: language
        }),
      });

      const data = await response.json();
      
      setIsLoading(false);
      setEnableButton(true);
      
      if (response.status === 200) {
        if (!data.sucessful) {
          setErrorMessage(data.message || 'An error occurred');
        } else {
          setErrorMessage('');
          setIsVerified(true);
          return true;
        }
      } else {
        setErrorMessage('Error sending verification code');
        return false;
      }
    } catch (error) {
      setIsLoading(false);
      setEnableButton(true);
      setErrorMessage('Connection error occurred');
      return false;
    }
    
    return false;
  };

  // Resend verification code with cooldown
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const resendCode = async () => {
    if (!canResend) return false;
    
    const success = await sendVerificationCode();
    
    if (success) {
      setCanResend(false);
      setCountdown(10); // 10 second cooldown
    }
    
    return success;
  };

  // Handle countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // Load theme and language preferences (from localStorage in web)
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme_lokdis') || 'dark';
    const storedLanguage = localStorage.getItem('language') || 'en';
    
    setThemeColor(storedTheme);
    setLanguage(storedLanguage);
  }, []);

  return {
    email,
    setEmail,
    isLoading,
    errorMessage,
    enableButton,
    validateEmail,
    sendVerificationCode,
    isVerified,
    themeColor,
    language,
    resendCode,
    canResend,
    countdown
  };
};

// Verification code input handling
export const useVerificationInput = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [isCodeComplete, setIsCodeComplete] = useState(false);

  // Update verification code
  const updateCode = (index, value) => {
    if (value.length > 1) {
      // If pasting multiple digits
      const chars = value.split('');
      const newCode = [...verificationCode];
      
      for (let i = 0; i < chars.length && i + index < 4; i++) {
        if (/^\d$/.test(chars[i])) {
          newCode[i + index] = chars[i];
        }
      }
      
      setVerificationCode(newCode);
    } else if (/^\d$/.test(value) || value === '') {
      // For single digit or deletion
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
    }
    
    // Check if code is complete after update
    setTimeout(() => {
      setIsCodeComplete(verificationCode.every(digit => digit !== ''));
    }, 0);
  };

  // Clear verification code
  const clearCode = () => {
    setVerificationCode(['', '', '', '']);
    setIsCodeComplete(false);
  };

  // Get full code as string
  const getFullCode = () => verificationCode.join('');

  return {
    verificationCode,
    updateCode,
    clearCode,
    isCodeComplete,
    getFullCode
  };
};

// Password handling and validation
export const usePasswordConfirmation = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // Validate password strength
  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    
    // Check for at least one uppercase letter, one lowercase letter, and one number
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasUppercase || !hasLowercase || !hasNumber) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  // Check if passwords match
  const checkPasswordsMatch = () => {
    const match = password === confirmPassword && password !== '';
    setPasswordsMatch(match);
    return match;
  };

  // Update whenever passwords change
  useEffect(() => {
    if (password && confirmPassword) {
      checkPasswordsMatch();
    }
  }, [password, confirmPassword]);

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    validatePassword,
    passwordsMatch,
    checkPasswordsMatch
  };
};

// API call to complete registration with password
export const completeRegistration = async (email, code, password, language = 'en') => {
  try {
    const response = await fetch(`${API_URL}/complete-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        code,
        password,
        language
      }),
    });

    const data = await response.json();
    
    if (response.status === 200 && data.successful) {
      return { success: true };
    } else {
      return { 
        success: false, 
        message: data.message || 'Registration failed' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: 'Connection error occurred' 
    };
  }
}; 