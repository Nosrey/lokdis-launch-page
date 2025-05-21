import React from 'react';
import RegistrationFlow from './RegistrationFlow';
import { useLanguage } from '../utils/i18n';

const RegistrationExample = () => {
  const { language } = useLanguage();
  
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginBottom: '20px' }}>
        {language === 'es' ? 'Ejemplo de Flujo de Registro' : 'Registration Flow Example'}
      </h1>
      
      <p style={{ marginBottom: '30px' }}>
        {language === 'es' 
          ? 'Este ejemplo muestra cómo integrar los modales de Login y Perfil en un flujo de registro completo.' 
          : 'This example shows how to integrate the Login and Profile modals in a complete registration flow.'}
      </p>
      
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ccc',
        borderRadius: '8px',
        background: '#f9f9f9'
      }}>
        <RegistrationFlow language={language} />
      </div>
      
      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <p>
          {language === 'es'
            ? 'Nota: Este es solo un ejemplo. En una aplicación real, el flujo de registro estaría integrado en el resto de la aplicación.'
            : 'Note: This is just an example. In a real application, the registration flow would be integrated with the rest of the application.'}
        </p>
      </div>
    </div>
  );
};

export default RegistrationExample; 