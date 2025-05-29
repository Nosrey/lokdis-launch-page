import React, { useEffect } from 'react';
import '../styles/NotificationModal.css';

const NotificationModal = ({ isOpen, onClose, title, message, duration = 3500 }) => {
  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) {
    return null;
  }

  // Cierra el modal si se hace clic directamente en el overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Cierra el modal si se hace clic en el contenido del modal
  const handleContentClick = () => {
    onClose();
  };

  return (
    <div className="notification-modal-overlay" onClick={handleOverlayClick}>
      <div className="notification-modal-content" onClick={handleContentClick}>
        {title && <h2 className="notification-modal-title">{title}</h2>}
        <p className="notification-modal-message">{message}</p>
      </div>
    </div>
  );
};

export default NotificationModal; 