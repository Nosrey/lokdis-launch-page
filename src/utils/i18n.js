import { createContext, useState, useContext } from 'react';

// Traducciones
const translations = {
  es: {
    ctaButton: 'Quiero probar la app',
    welcomeTitle: 'Lokdis',
    languageButton: 'Idioma',
    loginButton: 'Inicia sesión',
    heroTitle: 'Solicita y comparte fotos y videos en tiempo real',
    heroSubtitle: 'Una app para explorar la realidad de rincones de todo el mundo, sin filtros ni ediciones 🗺️ 📸',
    heroDescription: 'Busca el lugar que quieres ver, solicita un vídeo o una foto a alguien que esté en él y... ¡viaja desde tu teléfono!',
    tryButton: 'Prueba Lokdis',
    discoverTitle: 'Descubre más sobre Lokdis',
    discoverDescription: 'Desliza hacia abajo para explorar todas las características y beneficios que Lokdis tiene para ofrecerte.',
    // Testimonios
    testimonial1: 'Con LokDis puedo saber cuánta gente hay en cada playa, así sé la mejor hora para ir.',
    testimonial2: 'Uso LokDis para ver si hay aparcamiento en la calle a la que quiero ir, pido un momento real y lo veo.',
    testimonial3: 'Como hay muchas noticias falsas en las redes sociales, utilizo LokDis para verificar si algo que he leído es verdad o no.',
    testimonial4: 'LokDis me ha permitido encontrar sitios poco concurridos para hacer senderismo. Pido vídeos de diferentes rutas y elijo la que está más tranquila.',
    testimonial5: 'Antes de ir a un restaurante, siempre compruebo en LokDis cómo está el ambiente real y si hay mucha cola. Me ahorra tiempo y disgustos.',
    testimonial6: 'Gracias a LokDis pude ver el estado de mi barrio durante las inundaciones cuando estaba fuera de la isla. Fue muy útil para preparar mi regreso.',
    swipeForMore: 'Desliza para más',
    // Footer
    aboutUs: 'Sobre nosotros',
    privacyPolicy: 'Política de privacidad',
    termsConditions: 'Términos y condiciones',
    faqs: 'FAQs',
    siteMap: 'Mapa del sitio',
    copyright: '© 2024 LOKDIS. Todos los derechos reservados.',
    years: 'años'
  },
  en: {
    ctaButton: 'I want to try the app',
    welcomeTitle: 'Lokdis',
    languageButton: 'Language',
    loginButton: 'Log in',
    heroTitle: 'Request and share photos and videos in real time',
    heroSubtitle: 'An app to explore the reality of places around the world, without filters or edits 🗺️ 📸',
    heroDescription: 'Find the place you want to see, request a video or photo from someone who is there and... travel from your phone!',
    tryButton: 'Try Lokdis',
    discoverTitle: 'Discover more about Lokdis',
    discoverDescription: 'Scroll down to explore all the features and benefits that Lokdis has to offer you.',
    // Testimonials
    testimonial1: 'With LokDis I can know how many people are at each beach, so I know the best time to go.',
    testimonial2: 'I use LokDis to see if there is parking on the street I want to go to, I request a real-time view and I see it.',
    testimonial3: 'As there is a lot of fake news on social media, I use LokDis to verify if something I read is true or not.',
    testimonial4: 'LokDis has allowed me to find uncrowded places for hiking. I request videos of different trails and choose the most peaceful one.',
    testimonial5: 'Before going to a restaurant, I always check on LokDis what the real atmosphere is like and if there\'s a long queue. It saves me time and disappointment.',
    testimonial6: 'Thanks to LokDis I was able to see the condition of my neighborhood during the floods when I was away from the island. It was very useful to prepare for my return.',
    swipeForMore: 'Swipe for more',
    // Footer
    aboutUs: 'About Us',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    faqs: 'FAQs',
    siteMap: 'Site Map',
    copyright: '© 2024 LOKDIS. All rights reserved.',
    years: 'years'
  }
};

// Crear el contexto
const LanguageContext = createContext();

// Proveedor de lenguaje
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es'); // Por defecto español
  
  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar el idioma
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser usado dentro de un LanguageProvider');
  }
  return context;
}; 