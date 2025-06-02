import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import '../styles/FaqModal.css';
import { useLanguage } from '../utils/i18n'; // Assuming you might use this for "Preguntas frecuentes" title
import logoSimple from '../assets/images/logo_simple.png'; // Lokdis logo

const faqItemsData = [
  {
    id: 'q1',
    question: {
      es: "¿Cómo puedo solicitar un vídeo o una foto?",
      en: "How can I request a video or a photo?"
    },
    answer: {
      es: "En el mapa de inicio encontrarás avatares de las personas que están conectadas. Pulsando en cualquiera de ellos, podrás enviar una solicitud de momento real. La persona tendrá dos minutos para aceptar solicitud y si no lo hace, te mostraremos a otras personas que estén cerca para que puedas enviar otra solicitud.",
      en: "On the home map, you will find avatars of people who are connected. By tapping on any of them, you can send a real-time request. The person will have two minutes to accept the request, and if they don't, we will show you other people nearby so you can send another request."
    }
  },
  {
    id: 'q2',
    question: {
      es: "¿Cómo sé que alguien me ha enviado una solicitud?",
      en: "How do I know someone has sent me a request?"
    },
    answer: {
      es: "Cuando alguien te envía una solicitud, en tu pantalla aparecerá un mensaje de notificación. Cuando la App esté en segundo plano, te aparecerá una notificación en el teléfono. Es importante que tengas activadas las notificaciones, puedes hacerlo entrando en Ajustes. Tendrás dos minutos como máximo para aceptar la solicitud. Una vez que lo hagas, podrás enviar el momento real que estás viendo, en formato de vídeo o foto a tu elección.",
      en: "When someone sends you a request, a notification message will appear on your screen. When the app is in the background, you will receive a notification on your phone. It is important to have notifications enabled, which you can do in Settings. You will have a maximum of two minutes to accept the request. Once you do, you can send the real-time moment you are seeing, in video or photo format of your choice."
    }
  },
  {
    id: 'q3',
    question: {
      es: "¿Qué hago si no puedo enviar mi momento cuando me envían solicitud?",
      en: "What do I do if I can't send my moment when I receive a request?"
    },
    answer: {
      es: "En el caso de que no puedas, tendrás la opción de rechazar la solicitud. Aparecerá una pantalla en la que te pediremos que marques entre varias posibles opciones el motivo por el que no puedes aceptar la solicitud. Este es un dato que nos sirve de mejora continua con la interacción de la App. Después podrás volver al mapa o si, en algún momento del proceso cambias de opinión, podrás aceptar y enviar el momento solicitado.",
      en: "If you can't, you will have the option to reject the request. A screen will appear asking you to mark one of several possible reasons why you can't accept the request. This data helps us continuously improve the app's interaction. You can then return to the map or, if you change your mind at any point, you can accept and send the requested moment."
    }
  },
  {
    id: 'q4',
    question: {
      es: "¿Se guardan en algún sitio los momentos que envío? ¿Y los que me envían?",
      en: "Are the moments I send saved somewhere? What about the ones I receive?"
    },
    answer: {
      es: "Los momentos enviados y recibidos se quedan guardados en la pestaña Historial. Además, se compartirán en la pestaña Explora con el momento y el lugar donde fueron hechos.",
      en: "The moments sent and received are saved in the History tab. Additionally, they will be shared in the Explore tab with the moment and place where they were made."
    }
  },
  {
    id: 'q5',
    question: {
      es: "¿Puedo descargar mis momentos?",
      en: "Can I download my moments?"
    },
    answer: {
      es: "Puedes descargar los momentos que tú has enviado, no los que te han enviado y podrás verlos en el historial tantas veces como quieras.",
      en: "You can download the moments you have sent, not the ones sent to you, and you can view them in the history as many times as you want."
    }
  },
  {
    id: 'q6',
    question: {
      es: "¿Cómo funciona Explora?",
      en: "How does Explore work?"
    },
    answer: {
      es: "En Explora podrás ver lugares del mundo que han compartido otras personas, de forma aleatoria, con el momento y el lugar donde fueron hechos.",
      en: "In Explore, you can see places around the world that other people have shared, randomly, with the moment and place where they were made."
    }
  },
  {
    id: 'q7',
    question: {
      es: "¿Cómo compartir imágenes o videos de calidad?",
      en: "How to share quality images or videos?"
    },
    answer: {
      es: "",
      en: ""
    }
  },
  {
    id: 'q8',
    question: {
      es: "¿Qué puedo hacer si me comparten un video o una foto que es inapropiado?",
      en: "What can I do if someone shares an inappropriate video or photo with me?"
    },
    answer: {
      es: "Cuando recibas un momento, te pediremos una valoración de la experiencia vivida. Podrás elegir entre las 3 caras cuál piensas que representa tu vivencia con la aplicación y también tendrás un botón para reportar una incidencia. La pantalla de incidencia es inteligente y detecta el nombre de la persona y el material que te ha enviado, por lo que solo tendrás que rellenar el campo de incidencia para contarnos qué fue lo negativo durante la experiencia. Es importante para nosotros que nos lo cuentes con detalle para poder tomar medidas oportunas.",
      en: "When you receive a moment, we will ask you to rate the experience. You can choose between the 3 faces which one you think represents your experience with the app, and you will also have a button to report an incident. The incident screen is smart and detects the person's name and the material they sent you, so you only need to fill in the incident field to tell us what was negative during the experience. It is important for us that you tell us in detail so we can take appropriate measures."
    }
  }
];

const FaqModal = ({ isOpen, onClose, language = 'es' }) => {
  const { t } = useLanguage(); // For modal title and potentially other static text
  const [openItemId, setOpenItemId] = useState(null);
  const modalRef = useRef();

  const handleToggleItem = (itemId) => {
    setOpenItemId(openItemId === itemId ? null : itemId);
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto'; // Restore background scroll
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Close modal on Escape key
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

  const currentLanguage = language; // Use the prop directly

  const modalJSX = (
    <div className="faq-modal-overlay">
      <div className="faq-modal-content" ref={modalRef}>
        <div className="faq-modal-header">
          <img src={logoSimple} alt="Lokdis Logo" className="faq-modal-logo" />
          <h2>{t('faqs')}</h2> {/* Using t hook for title from i18n */}
          <button onClick={onClose} className="faq-modal-close-btn" aria-label={currentLanguage === 'es' ? 'Cerrar' : 'Close'}>
            &times;
          </button>
        </div>
        <div className="faq-modal-body">
          {faqItemsData.map(item => (
            <div key={item.id} className="faq-item">
              <button
                className="faq-question"
                onClick={() => handleToggleItem(item.id)}
                aria-expanded={openItemId === item.id}
              >
                <span>{item.question[currentLanguage]}</span>
                <span className={`faq-icon ${openItemId === item.id ? 'open' : ''}`}>
                  {/* Simple Chevron Icon (can be replaced with SVG) */}
                  {openItemId === item.id ? '\u25B2' : '\u25BC'}
                </span>
              </button>
              {openItemId === item.id && (
                <div className="faq-answer">
                  <p>{item.answer[currentLanguage]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalJSX, document.getElementById('modal-root'));
};

export default FaqModal; 