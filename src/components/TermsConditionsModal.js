import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import '../styles/TermsConditionsModal.css'; // We will create this CSS file next
import { useLanguage } from '../utils/i18n';
import logoSimple from '../assets/images/logo_simple.png';

const termsContent = {
  lastUpdated: {
    es: "1 de Agosto de 2024",
    en: "August 1, 2024"
  },
  es: {
    title: 'Términos y Condiciones',
    sections: [
      { key: 'acceptance', title: '1. Aceptación de los Términos', text: "Al acceder y utilizar la aplicación móvil Lokdis (la \"Aplicación\"), usted acepta y se compromete a cumplir estos Términos y Condiciones (los \"Términos\"). Si no está de acuerdo con estos Términos, no debe utilizar la Aplicación. Nos reservamos el derecho de modificar estos Términos en cualquier momento." },
      { key: 'use_app', title: '2. Uso de la Aplicación', text: "Usted se compromete a utilizar la Aplicación de acuerdo con todas las leyes y regulaciones aplicables. Es responsable de asegurar que su uso de la Aplicación sea legal. No debe utilizar la Aplicación para ningún propósito ilegal o no autorizado. Se compromete a no transmitir contenido inapropiado o que pueda ser considerado ofensivo." },
      { key: 'user_accounts', title: '3. Cuentas de Usuario', text: "Para acceder a ciertas funciones de la Aplicación, necesario que se registre para obtener una cuenta. Al registrarse, se compromete a proporcionar información precisa, actual y completa. Es responsable de mantener la confidencialidad de la contraseña de su cuenta y de todas las actividades que ocurran bajo su cuenta." },
      { key: 'user_content', title: '4. Contenido del Usuario', text: "Usted es el único responsable de todo el contenido, incluyendo fotos, vídeos, comentarios y otra información (colectivamente, \"Contenido del Usuario\") que publique, suba, envíe o transmita de otro modo a través de la Aplicación. Al publicar Contenido del Usuario, nos otorga una licencia mundial, no exclusiva, libre de regalías, sublicenciable y transferible para usar, reproducir, distribuir, preparar trabajos derivados, mostrar y ejecutar el Contenido del Usuario en relación con la Aplicación y nuestro negocio." },
      { key: 'ip_rights', title: '5. Derechos de Propiedad Intelectual', text: "La Aplicación y su contenido original (excluyendo el Contenido del Usuario), características y funcionalidad son y seguirán siendo propiedad exclusiva de Lokdis y sus licenciantes. La Aplicación está protegida por derechos de autor, marcas comerciales y otras leyes tanto de España como de países extranjeros. Nuestras marcas comerciales y nuestra imagen comercial no pueden utilizarse en relación con ningún producto o servicio sin el consentimiento previo por escrito de Lokdis." },
      { key: 'prohibited_conduct', title: '6. Conducta Prohibida', text: "Usted se compromete a no participar en ninguna de las siguientes actividades prohibidas: (i) copiar, distribuir o divulgar cualquier parte de la Aplicación en cualquier medio; (ii) usar cualquier sistema automatizado, incluyendo \"robots\", \"spiders\", \"lectores offline\", etc., para acceder a la Aplicación; (iii) transmitir spam, cartas en cadena u otro correo electrónico no solicitado; (iv) intentar interferir, comprometer la integridad o seguridad del sistema o descifrar cualquier transmisión hacia o desde los servidores que ejecutan la Aplicación; (v) hacerse pasar por otra persona o tergiversar de otro modo su afiliación con una persona o entidad." },
      { key: 'disclaimers', title: '7. Descargos de Responsabilidad', text: "La Aplicación se proporciona \"TAL CUAL\" y \"SEGÚN DISPONIBILIDAD\". El uso de la Aplicación es bajo su propio riesgo. En la máxima medida permitida por la ley aplicable, Lokdis renuncia a todas las garantías, expresas o implícitas, en relación con la Aplicación y su uso de la misma, incluyendo, entre otras, las garantías implícitas de comerciabilidad, idoneidad para un propósito particular y no infracción." },
      { key: 'limitation_liability', title: '8. Limitación de Responsabilidad', text: "En ningún caso Lokdis, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo, incluyendo, sin limitación, la pérdida de beneficios, datos, uso, fondo de comercio u otras pérdidas intangibles, resultantes de (i) su acceso o uso o incapacidad para acceder o usar la Aplicación; (ii) cualquier conducta o contenido de cualquier tercero en la Aplicación; (iii) cualquier contenido obtenido de la Aplicación; y (iv) el acceso no autorizado, uso o alteración de sus transmisiones o contenido, ya sea basado en garantía, contrato, agravio (incluyendo negligencia) o cualquier otra teoría legal, ya sea que hayamos sido informados o no de la posibilidad de dicho daño." },
      { key: 'termination', title: '9. Terminación', text: "Podemos terminar o suspender su acceso a la Aplicación inmediatamente, sin previo aviso ni responsabilidad, por cualquier motivo, incluyendo, sin limitación, si incumple los Términos. Todas las disposiciones de los Términos que por su naturaleza deberían sobrevivir a la terminación sobrevivirán a la terminación, incluyendo, sin limitación, las disposiciones de propiedad, las renuncias de garantía, la indemnización y las limitaciones de responsabilidad." },
      { key: 'governing_law', title: '10. Ley Aplicable', text: "Estos Términos se regirán e interpretarán de acuerdo con las leyes de España, sin tener en cuenta sus disposiciones sobre conflicto de leyes. Nuestra incapacidad para hacer cumplir cualquier derecho o disposición de estos Términos no se considerará una renuncia a esos derechos. Si alguna disposición de estos Términos se considera inválida o inaplicable por un tribunal, las disposiciones restantes de estos Términos seguirán vigentes. Estos Términos constituyen el acuerdo completo entre nosotros con respecto a nuestra Aplicación, y sustituyen y reemplazan cualquier acuerdo anterior que pudiéramos tener entre nosotros con respecto a la Aplicación." },
      { key: 'changes_terms', title: '11. Cambios a estos Términos', text: "Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar al menos 30 días de aviso antes de que entren en vigor los nuevos términos. Lo que constituye un cambio material se determinará a nuestra entera discreción. Al continuar accediendo o utilizando nuestra Aplicación después de que esas revisiones entren en vigor, usted acepta estar sujeto a los términos revisados." },
      { key: 'contact_us_terms', title: '12. Contáctenos', text: "Si tiene alguna pregunta sobre estos Términos, contáctenos en: info@lokdis.com." }
    ]
  },
  en: {
    title: 'Terms and Conditions',
    sections: [
      { key: 'acceptance', title: '1. Acceptance of Terms', text: "By accessing and using the Lokdis mobile application (the \"Application\"), you agree to and undertake to comply with these Terms and Conditions (the \"Terms\"). If you do not agree with these Terms, you must not use the Application. We reserve the right to modify these Terms at any time." },
      { key: 'use_app', title: '2. Use of the Application', text: "You agree to use the Application in accordance with all applicable laws and regulations. You are responsible for ensuring that your use of the Application is lawful. You must not use the Application for any illegal or unauthorized purpose. You agree not to transmit inappropriate content or content that may be considered offensive." },
      { key: 'user_accounts', title: '3. User Accounts', text: "To access certain features of the Application, you must register for an account. By registering, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account." },
      { key: 'user_content', title: '4. User Content', text: "You are solely responsible for all content, including photos, videos, comments, and other information (collectively, \"User Content\") that you post, upload, submit, or otherwise transmit through the Application. By posting User Content, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the Application and our business." },
      { key: 'ip_rights', title: '5. Intellectual Property Rights', text: "The Application and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Lokdis and its licensors. The Application is protected by copyright, trademark, and other laws of both Spain and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Lokdis." },
      { key: 'prohibited_conduct', title: '6. Prohibited Conduct', text: "You agree not to engage in any of the following prohibited activities: (i) copying, distributing, or disclosing any part of the Application in any medium; (ii) using any automated system, including \"robots\", \"spiders\", \"offline readers\", etc., to access the Application; (iii) transmitting spam, chain letters, or other unsolicited email; (iv) attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Application; (v) impersonating another person or otherwise misrepresenting your affiliation with a person or entity." },
      { key: 'disclaimers', title: '7. Disclaimers', text: "The Application is provided \"AS IS\" and \"AS AVAILABLE\". Your use of the Application is at your own risk. To the maximum extent permitted by applicable law, Lokdis disclaims all warranties, express or implied, in connection with the Application and your use thereof, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement." },
      { key: 'limitation_liability', title: '8. Limitation of Liability', text: "In no event shall Lokdis, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including, without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Application; (ii) any conduct or content of any third party on the Application; (iii) any content obtained from the Application; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage." },
      { key: 'termination', title: '9. Termination', text: "We may terminate or suspend your access to the Application immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability." },
      { key: 'governing_law', title: '10. Governing Law', text: "These Terms shall be governed and construed in accordance with the laws of Spain, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Application, and supersede and replace any prior agreements we might have had between us regarding the Application." },
      { key: 'changes_terms', title: '11. Changes to These Terms', text: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Application after those revisions become effective, you agree to be bound by the revised terms." },
      { key: 'contact_us_terms', title: '12. Contact Us', text: "If you have any questions about these Terms, please contact us at: info@lokdis.com." }
    ]
  }
};

const TermsConditionsModal = ({ isOpen, onClose, language = 'es' }) => {
  const modalRef = useRef();
  const currentContent = termsContent[language] || termsContent.en;
  const lastUpdatedText = termsContent.lastUpdated[language] || termsContent.lastUpdated.en;

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

  const renderFormattedText = (text) => {
    return text.split('\n').map((line, index, arr) => (
      <React.Fragment key={index}>
        <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        {index < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const modalJSX = (
    <div className="termsconditions-modal-overlay">
      <div className="termsconditions-modal-content" ref={modalRef}>
        <div className="termsconditions-modal-header">
          <img src={logoSimple} alt="Lokdis Logo" className="termsconditions-modal-logo" />
          <h2>{currentContent.title}</h2>
          <button onClick={onClose} className="termsconditions-modal-close-btn" aria-label={language === 'es' ? 'Cerrar' : 'Close'}>
            &times;
          </button>
        </div>
        <div className="termsconditions-modal-body">
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

export default TermsConditionsModal; 