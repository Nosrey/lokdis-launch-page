import React, { useState } from 'react';
import LoginModal from './LoginModal';

const LoginExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="login-example">
      <button 
        className="try-button" 
        onClick={openModal}
      >
        Crear cuenta
      </button>
      
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        language="es" // Default language, can be "es" or "en"
      />
    </div>
  );
};

export default LoginExample; 