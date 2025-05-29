import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import '../styles/PrivacyPolicyModal.css'; // We will create this CSS file next
import { useLanguage } from '../utils/i18n';
import logoSimple from '../assets/images/logo_simple.png'; // Lokdis logo

const privacyPolicyContent = {
  lastUpdated: {
    es: "1 de Agosto de 2024",
    en: "August 1, 2024"
  },
  es: {
    title: 'Política de Privacidad',
    sections: [
      { 
        key: 'introduction',
        title: 'Introducción',
        text: "Bienvenido a Lokdis. Su privacidad es de suma importancia para nosotros. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando utiliza nuestra aplicación móvil (la \"Aplicación\"). Lea atentamente esta política. Si no está de acuerdo con los términos de esta política de privacidad, no acceda a la Aplicación."
      },
      {
        key: 'info_collect',
        title: 'Información que Recopilamos',
        text: "Podemos recopilar información sobre usted de varias maneras. La información que podemos recopilar a través de la Aplicación incluye:\n\n*   **Datos Personales:** Información de identificación personal, como su nombre y dirección de correo electrónico, e información demográfica, como su edad, ciudad natal e intereses, que nos proporciona voluntariamente cuando se registra en la Aplicación o cuando elige participar en diversas actividades relacionadas con la Aplicación, como la publicación de contenido multimedia y tableros de mensajes.\n*   **Datos de Ubicación:** Recopilamos información de ubicación basada en la geolocalización de su dispositivo móvil para proporcionar servicios basados en la ubicación y para mostrarle contenido local relevante. Puede desactivar los servicios de ubicación en la configuración de su dispositivo.\n*   **Contenido del Usuario:** Información, como fotos, vídeos y comentarios, que publica en la Aplicación.\n*   **Datos Derivados:** Información que nuestros servidores recopilan automáticamente cuando accede a la Aplicación, como su dirección IP, sistema operativo y tiempos de acceso.\n*   **Datos del Dispositivo Móvil:** Información del dispositivo, como el ID, modelo y fabricante de su dispositivo móvil, y la información sobre la ubicación de su dispositivo, si accede a la Aplicación desde un dispositivo móvil."
      },
      {
        key: 'how_use_info',
        title: 'Cómo Utilizamos su Información',
        text: "Tener información precisa sobre usted nos permite ofrecerle una experiencia fluida, eficiente y personalizada. Específicamente, podemos usar la información recopilada sobre usted a través de la Aplicación para:\n\n*   Crear y gestionar su cuenta.\n*   Permitir la comunicación entre usuarios.\n*   Enviarle correos electrónicos sobre su cuenta o pedido.\n*   Mejorar la eficiencia y el funcionamiento de la Aplicación.\n*   Monitorear y analizar el uso y las tendencias para mejorar su experiencia con la Aplicación.\n*   Notificarle actualizaciones de la Aplicación.\n*   Ofrecer nuevos productos, servicios y/o recomendaciones.\n*   Realizar otras actividades comerciales según sea necesario.\n*   Solicitar comentarios y contactarlo sobre su uso de la Aplicación.\n*   Resolver disputas y solucionar problemas.\n*   Responder a solicitudes de productos y servicio al cliente."
      },
      {
        key: 'sharing_info',
        title: 'Cómo Compartimos su Información',
        text: "Podemos compartir la información que hemos recopilado sobre usted en determinadas situaciones. Su información puede ser divulgada de la siguiente manera:\n\n*   **Por Ley o para Proteger Derechos:** Si creemos que la divulgación de información sobre usted es necesaria para responder a un proceso legal, para investigar o remediar posibles violaciones de nuestras políticas, o para proteger los derechos, la propiedad y la seguridad de otros, podemos compartir su información según lo permita o exija cualquier ley, norma o regulación aplicable.\n*   **Proveedores de Servicios de Terceros:** Podemos compartir su información con terceros que realizan servicios para nosotros o en nuestro nombre, incluido el procesamiento de pagos, análisis de datos, entrega de correo electrónico, servicios de alojamiento, servicio al cliente y asistencia de marketing.\n*   **Con su Consentimiento:** Podemos divulgar su información personal para cualquier otro propósito con su consentimiento."
      },
      {
        key: 'data_retention',
        title: 'Retención de Datos',
        text: "Conservaremos su información personal solo durante el tiempo que sea necesario para los fines establecidos en esta Política de Privacidad. Conservaremos y utilizaremos su información en la medida necesaria para cumplir con nuestras obligaciones legales, resolver disputas y hacer cumplir nuestras políticas."
      },
      {
        key: 'your_rights',
        title: 'Sus Derechos (GDPR)',
        text: "Si es residente del Espacio Económico Europeo (EEE), tiene ciertos derechos de protección de datos. Lokdis tiene como objetivo tomar medidas razonables para permitirle corregir, modificar, eliminar o limitar el uso de sus Datos Personales. Si desea que se le informe qué Datos Personales tenemos sobre usted y si desea que se eliminen de nuestros sistemas, contáctenos."
      },
      {
        key: 'children_privacy',
        title: 'Privacidad de los Niños',
        text: "Nuestra Aplicación no está dirigida a ninguna persona menor de 13 años. No recopilamos deliberadamente información de identificación personal de niños menores de 13 años. Si es padre o tutor y sabe que su hijo nos ha proporcionado Datos Personales, contáctenos."
      },
      {
        key: 'security',
        title: 'Seguridad de su Información',
        text: "Utilizamos medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger su información personal. Si bien hemos tomado medidas razonables para proteger la información personal que nos proporciona, tenga en cuenta que, a pesar de nuestros esfuerzos, ninguna medida de seguridad es perfecta o impenetrable, y ningún método de transmisión de datos puede garantizarse contra cualquier intercepción u otro tipo de uso indebido."
      },
      {
        key: 'changes_policy',
        title: 'Cambios a esta Política de Privacidad',
        text: "Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página. Se le recomienda revisar esta Política de Privacidad periódicamente para detectar cualquier cambio. Los cambios a esta Política de Privacidad son efectivos cuando se publican en esta página."
      },
      {
        key: 'contact_us',
        title: 'Contáctenos',
        text: "Si tiene preguntas o comentarios sobre esta Política de Privacidad, contáctenos en: info@lokdis.com."
      }
    ]
  },
  en: {
    title: 'Privacy Policy',
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        text: "Welcome to Lokdis. Your privacy is of utmost importance to us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our mobile application (the \"Application\"). Please read this policy carefully. If you do not agree with the terms of this privacy policy, do not access the Application."
      },
      {
        key: 'info_collect',
        title: 'Information We Collect',
        text: "We may collect information about you in various ways. The information we may collect through the Application includes:\n\n*   **Personal Data:** Personally identifiable information, such as your name and email address, and demographic information, such as your age, hometown, and interests, that you voluntarily provide to us when you register with the Application or when you choose to participate in various activities related to the Application, such as posting media content and message boards.\n*   **Location Data:** We collect location information based on your mobile device's geolocation to provide location-based services and to show you relevant local content. You can disable location services in your device settings.\n*   **User Content:** Information, such as photos, videos, and comments, that you post to the Application.\n*   **Derivative Data:** Information our servers automatically collect when you access the Application, such as your IP address, operating system, and access times.\n*   **Mobile Device Data:** Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the Application from a mobile device."
      },
      {
        key: 'how_use_info',
        title: 'How We Use Your Information',
        text: "Having accurate information about you allows us to provide you with a smooth, efficient, and personalized experience. Specifically, we may use information collected about you through the Application to:\n\n*   Create and manage your account.\n*   Enable user-to-user communication.\n*   Email you regarding your account or order.\n*   Improve the efficiency and operation of the Application.\n*   Monitor and analyze usage and trends to improve your experience with the Application.\n*   Notify you of Application updates.\n*   Offer new products, services, and/or recommendations.\n*   Perform other business activities as needed.\n*   Request feedback and contact you about your use of the Application.\n*   Resolve disputes and troubleshoot problems.\n*   Respond to product and customer service requests."
      },
      {
        key: 'sharing_info',
        title: 'How We Share Your Information',
        text: "We may share information we have collected about you in certain situations. Your information may be disclosed as follows:\n\n*   **By Law or to Protect Rights:** If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.\n*   **Third-Party Service Providers:** We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.\n*   **With Your Consent:** We may disclose your personal information for any other purpose with your consent."
      },
      {
        key: 'data_retention',
        title: 'Data Retention',
        text: "We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies."
      },
      {
        key: 'your_rights',
        title: 'Your Rights (GDPR)',
        text: "If you are a resident of the European Economic Area (EEA), you have certain data protection rights. Lokdis aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us."
      },
      {
        key: 'children_privacy',
        title: 'Children\'s Privacy',
        text: "Our Application does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us."
      },
      {
        key: 'security',
        title: 'Security of Your Information',
        text: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse."
      },
      {
        key: 'changes_policy',
        title: 'Changes to This Privacy Policy',
        text: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page."
      },
      {
        key: 'contact_us',
        title: 'Contact Us',
        text: "If you have any questions or comments about this Privacy Policy, please contact us at: info@lokdis.com."
      }
    ]
  }
};

const PrivacyPolicyModal = ({ isOpen, onClose, language = 'es' }) => {
  const modalRef = useRef();
  const currentContent = privacyPolicyContent[language] || privacyPolicyContent.en;
  const lastUpdatedText = privacyPolicyContent.lastUpdated[language] || privacyPolicyContent.lastUpdated.en;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    } else {
      window.removeEventListener('keydown', handleEscKey);
    }
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Helper to render text with newlines and allow bolding via <strong>
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, index, arr) => (
      <React.Fragment key={index}>
        <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        {index < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const modalJSX = (
    <div className="privacypolicy-modal-overlay">
      <div className="privacypolicy-modal-content" ref={modalRef}>
        <div className="privacypolicy-modal-header">
          <img src={logoSimple} alt="Lokdis Logo" className="privacypolicy-modal-logo" />
          <h2>{currentContent.title}</h2>
          <button onClick={onClose} className="privacypolicy-modal-close-btn" aria-label={language === 'es' ? 'Cerrar' : 'Close'}>
            &times;
          </button>
        </div>
        <div className="privacypolicy-modal-body">
          <p className="last-updated"><em>{language === 'es' ? 'Última actualización: ' : 'Last updated: '}{lastUpdatedText}</em></p>
          {currentContent.sections.map(section => (
            <div key={section.key} className="policy-section">
              <h3>{section.title}</h3>
              {renderFormattedText(section.text)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalJSX, document.getElementById('modal-root'));
};

export default PrivacyPolicyModal; 