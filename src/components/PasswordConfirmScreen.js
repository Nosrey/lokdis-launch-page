import React, { useState, useEffect } from 'react';
import { usePasswordConfirmation, completeRegistration } from './VerificationCodeLogic';
import '../styles/HeroContent.css';

const PasswordConfirmScreen = ({ email, verificationCode, onComplete, onBack, themeColor = 'dark' }) => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    validatePassword,
    passwordsMatch,
    checkPasswordsMatch
  } = usePasswordConfirmation();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (!validatePassword(password)) {
      return;
    }
    
    // Check if passwords match
    if (!checkPasswordsMatch()) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    // Call API to complete registration
    const result = await completeRegistration(
      email,
      verificationCode,
      password
    );
    
    setIsLoading(false);
    
    if (result.success) {
      onComplete && onComplete();
    } else {
      setErrorMessage(result.message || 'Failed to complete registration');
    }
  };

  return (
    <div className="password-confirm-container">
      <h2 style={{ color: themeColor === 'dark' ? '#fff' : '#333' }}>
        Create a Password
      </h2>
      
      <p className="password-instructions" style={{ color: themeColor === 'dark' ? '#ccc' : '#666' }}>
        Please create a secure password for your account
      </p>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="password-form">
        <div className="password-input-group">
          <label htmlFor="password" style={{ color: themeColor === 'dark' ? '#fff' : '#333' }}>
            Password
          </label>
          <div className="password-field">
            <input
              type={showPassword1 ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{
                backgroundColor: themeColor === 'dark' ? '#333' : '#f5f5f5',
                color: themeColor === 'dark' ? '#fff' : '#333',
                borderColor: themeColor === 'dark' ? '#444' : '#ddd'
              }}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword1(!showPassword1)}
              className="toggle-password"
              aria-label={showPassword1 ? "Hide password" : "Show password"}
            >
              {showPassword1 ? "Hide" : "Show"}
            </button>
          </div>
          {passwordError && <small className="password-error">{passwordError}</small>}
        </div>
        
        <div className="password-input-group">
          <label htmlFor="confirmPassword" style={{ color: themeColor === 'dark' ? '#fff' : '#333' }}>
            Confirm Password
          </label>
          <div className="password-field">
            <input
              type={showPassword2 ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              style={{
                backgroundColor: themeColor === 'dark' ? '#333' : '#f5f5f5',
                color: themeColor === 'dark' ? '#fff' : '#333',
                borderColor: themeColor === 'dark' ? '#444' : '#ddd'
              }}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword2(!showPassword2)}
              className="toggle-password"
              aria-label={showPassword2 ? "Hide password" : "Show password"}
            >
              {showPassword2 ? "Hide" : "Show"}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <small className="password-error">Passwords do not match</small>
          )}
        </div>
        
        <div className="password-form-buttons">
          <button
            type="submit"
            className="confirm-button"
            disabled={isLoading || !password || !confirmPassword || !passwordsMatch}
            style={{
              backgroundColor: themeColor === 'dark' ? '#2c7be5' : '#1a56cc',
              color: 'white', /* Asegurar contraste del texto */
              opacity: (isLoading || !password || !confirmPassword || !passwordsMatch) ? 0.7 : 1
            }}
          >
            {isLoading ? 'Processing...' : 'Complete Registration'}
          </button>
        </div>
      </form>
      
      <div className="password-requirements">
        <p style={{ color: themeColor === 'dark' ? '#aaa' : '#666' }}>
          Password must:
        </p>
        <ul>
          <li style={{ color: themeColor === 'dark' ? '#aaa' : '#666' }}>
            Be at least 8 characters long
          </li>
          <li style={{ color: themeColor === 'dark' ? '#aaa' : '#666' }}>
            Include at least one uppercase letter
          </li>
          <li style={{ color: themeColor === 'dark' ? '#aaa' : '#666' }}>
            Include at least one lowercase letter
          </li>
          <li style={{ color: themeColor === 'dark' ? '#aaa' : '#666' }}>
            Include at least one number
          </li>
        </ul>
      </div>
      
      <button 
        className="mobile-back-arrow" 
        onClick={onBack}
        aria-label="Go back"
      >
        <span>&larr;</span>
      </button>
    </div>
  );
};

export default PasswordConfirmScreen; 