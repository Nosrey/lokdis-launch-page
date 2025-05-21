import React, { useState } from 'react';
import { useVerificationCode, useVerificationInput } from './VerificationCodeLogic';
import PasswordConfirmScreen from './PasswordConfirmScreen';
import '../styles/HeroContent.css';

// Registration steps
const STEPS = {
  EMAIL: 'email',
  VERIFICATION: 'verification',
  PASSWORD: 'password',
  COMPLETE: 'complete'
};

const RegistrationFlow = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(STEPS.EMAIL);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  // Use verification hooks
  const {
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
  } = useVerificationCode();
  
  const {
    verificationCode,
    updateCode,
    clearCode,
    isCodeComplete,
    getFullCode
  } = useVerificationInput();
  
  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) return;
    
    const success = await sendVerificationCode();
    if (success) {
      setCurrentStep(STEPS.VERIFICATION);
    }
  };
  
  // Handle verification code submission
  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    
    if (!isCodeComplete) return;
    
    // In a real app, you would verify the code here before proceeding
    // For now, we'll simulate a successful verification
    setCurrentStep(STEPS.PASSWORD);
  };
  
  // Handle password confirmation completion
  const handlePasswordComplete = () => {
    setRegistrationComplete(true);
    setCurrentStep(STEPS.COMPLETE);
    
    // Add a delay before closing the modal
    setTimeout(() => {
      onClose && onClose();
    }, 3000);
  };
  
  // Handle code input change
  const handleCodeChange = (index, value) => {
    updateCode(index, value);
    
    // Auto-advance to next input if current one is filled
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };
  
  // Handle input keydown for backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };
  
  // Render email entry step
  const renderEmailStep = () => (
    <div className="registration-container">
      <h2 style={{ color: themeColor === 'dark' ? '#fff' : '#333' }}>
        Create Your Account
      </h2>
      
      <p className="registration-instructions" style={{ color: themeColor === 'dark' ? '#ccc' : '#666' }}>
        Enter your email to get started
      </p>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleEmailSubmit} className="registration-form">
        <div className="input-group">
          <label htmlFor="email" style={{ color: themeColor === 'dark' ? '#fff' : '#333' }}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              backgroundColor: themeColor === 'dark' ? '#333' : '#f5f5f5',
              color: themeColor === 'dark' ? '#fff' : '#333',
              borderColor: themeColor === 'dark' ? '#444' : '#ddd'
            }}
          />
        </div>
        
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading || !enableButton || !email}
          style={{
            backgroundColor: themeColor === 'dark' ? '#2c7be5' : '#1a56cc',
            color: 'white', /* Asegurar contraste del texto */
            opacity: (isLoading || !enableButton || !email) ? 0.7 : 1
          }}
        >
          {isLoading ? 'Sending...' : 'Continue'}
        </button>
      </form>
      
      <div className="form-footer" style={{ color: themeColor === 'dark' ? '#aaa' : '#666' }}>
        Already have an account? <button 
          className="form-link" 
          onClick={onClose}
          style={{ color: themeColor === 'dark' ? '#4d96f0' : '#1a56cc' }}
        >
          Sign In
        </button>
      </div>
      
      <img 
        src="/src/assets/images/logo_simple.png" 
        alt="Lokdis Logo" 
        className="form-logo"
        style={{ opacity: themeColor === 'dark' ? 0.9 : 0.7 }}
      />
      
      <button 
        className="mobile-back-arrow" 
        onClick={onClose}
        aria-label="Go back"
      >
        <span>&larr;</span>
      </button>
    </div>
  );
  
  // Render verification code step
  const renderVerificationStep = () => (
    <div className="registration-container">
      <h2 style={{ color: themeColor === 'dark' ? '#fff' : '#333' }}>
        Verify Your Email
      </h2>
      
      <p className="registration-instructions" style={{ color: themeColor === 'dark' ? '#ccc' : '#666' }}>
        Enter the 4-digit code sent to {email}
      </p>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleVerificationSubmit} className="verification-form">
        <div className="code-input-container">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength="1"
              value={verificationCode[index]}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="code-input"
              required
              style={{
                backgroundColor: themeColor === 'dark' ? '#333' : '#f5f5f5',
                color: themeColor === 'dark' ? '#fff' : '#333',
                borderColor: themeColor === 'dark' ? '#444' : '#ddd'
              }}
            />
          ))}
        </div>
        
        <div className="resend-container">
          {canResend ? (
          <button
            type="button"
              onClick={resendCode}
              className="resend-button"
              disabled={isLoading}
              style={{ color: themeColor === 'dark' ? '#4d96f0' : '#1a56cc' }}
          >
              Resend Code
          </button>
          ) : (
            <p className="resend-timer" style={{ color: themeColor === 'dark' ? '#aaa' : '#888' }}>
              Resend available in {countdown} seconds
            </p>
          )}
        </div>
          
          <button
            type="submit"
            className="submit-button"
          disabled={!isCodeComplete || isLoading}
          style={{
            backgroundColor: themeColor === 'dark' ? '#2c7be5' : '#1a56cc',
            color: 'white', /* Asegurar contraste del texto */
            opacity: (!isCodeComplete || isLoading) ? 0.7 : 1
          }}
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
      
      <button 
        className="mobile-back-arrow" 
        onClick={() => setCurrentStep(STEPS.EMAIL)}
        aria-label="Go back"
      >
        <span>&larr;</span>
      </button>
    </div>
  );
  
  // Render completion step
  const renderCompletionStep = () => (
    <div className="registration-container">
      <div className="success-animation">
        <div className="checkmark"></div>
      </div>
      
      <h2 style={{ color: themeColor === 'dark' ? '#fff' : '#333' }}>
        Registration Complete!
      </h2>
      
      <p className="completion-message" style={{ color: themeColor === 'dark' ? '#ccc' : '#666' }}>
        Your account has been successfully created. You can now log in with your email and password.
      </p>
      
      <button
        onClick={onClose}
        className="submit-button"
        style={{
          backgroundColor: themeColor === 'dark' ? '#2c7be5' : '#1a56cc',
          color: 'white' /* Asegurar contraste del texto */
        }}
      >
        Sign In
      </button>
    </div>
  );
  
  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.EMAIL:
        return renderEmailStep();
      case STEPS.VERIFICATION:
        return renderVerificationStep();
      case STEPS.PASSWORD:
        return (
          <PasswordConfirmScreen 
            email={email}
            verificationCode={getFullCode()}
            onComplete={handlePasswordComplete}
            onBack={() => setCurrentStep(STEPS.VERIFICATION)}
            themeColor={themeColor}
          />
        );
      case STEPS.COMPLETE:
        return renderCompletionStep();
      default:
        return renderEmailStep();
    }
  };
  
  return (
    <div className="registration-modal" style={{
      backgroundColor: themeColor === 'dark' ? '#222' : '#fff',
      color: themeColor === 'dark' ? '#fff' : '#333',
      borderColor: themeColor === 'dark' ? '#444' : '#ddd'
    }}>
      {renderCurrentStep()}
    </div>
  );
};

export default RegistrationFlow;
 