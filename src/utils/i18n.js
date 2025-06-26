import { createContext, useState, useContext } from 'react';

// Traducciones
const translations = {
  es: {
    ctaButton: 'Quiero probar la app',
    welcomeTitle: 'Lokdis',
    languageButton: 'Idioma',
    loginButton: 'Crear cuenta',
    goToButton: 'Ir a',
    goToHome: 'Inicio',
    goToMoments: 'Momentos lokdis',
    goToMap: 'Mapa de la zona',
    heroTitle: 'Solicita y comparte fotos y videos en tiempo real',
    heroMainTitle: 'Solicita y comparte fotos y videos en tiempo real',
    heroSubtitle: 'Una app para explorar la realidad de rincones de todo el mundo, sin filtros ni ediciones 🗺️ 📸',
    heroDescription: 'Busca el lugar que quieres ver, solicita un vídeo o una foto a alguien cerca y... ¡viaja desde tu teléfono!',
    heroDescription2: 'Una app para explorar la realidad de rincones de todo el mundo, sin filtros ni ediciones 🗺️ 📸',
    tryButton: 'Prueba Lokdis',
    discoverTitle: 'Descubre más sobre Lokdis',
    discoverDescription: 'Desliza hacia abajo para explorar todas las características y beneficios que Lokdis tiene para ofrecerte.',
    // Moments page
    momentsTitle: 'Mira momentos LokDis en %{countryName}',
    momentsHeroText: 'Una app para explorar la realidad de rincones de todo el mundo, sin filtros ni ediciones 🗺️ 📸<br /><br />Busca el lugar que quieres ver, solicita un vídeo o una foto a alguien cerca y... ¡viaja desde tu teléfono!',
    momentsButton: 'Únete ahora a Lokdis',
    exploreMoments: 'Explora momentos Lokdis en tiempo real',
    testSectionTitle: 'Prueba o así',
    momentsGallery: 'Galería de Momentos',
    // Mensajes de carga
    loadingLocation: 'Obteniendo tu ubicación...',
    filteringMoments: 'Filtrando momentos por fecha...',
    groupingMoments: 'Agrupando momentos por ubicación...',
    authenticating: 'Conectando con Lokdis...',
    loadingData: 'Descargando datos...',
    processingData: 'Procesando información...',
    processingCoordinates: 'Geolocalizando momento...',
    calculatingDistance: 'Calculando distancias y cercanía...',
    finishingUp: 'Finalizando...',
    // Modal de visualización
    unknownLocation: 'Ubicación desconocida',
    capturedBy: 'Capturado por',
    previousMoment: 'Momento anterior',
    nextMoment: 'Siguiente momento',
    // Show more button
    showMore: 'Mostrar más',
    loadingMore: 'Cargando más...',
    // Sección promocional
    promoTitle: 'Pide y comparte fotos y vídeos en tiempo real',
    promoSubtitle: 'Una app para explorar la realidad de rincones de todo el mundo, sin filtros ni ediciones 🗺️ 📸',
    promoDescription: 'Busca el lugar que quieres ver, solicita un vídeo o una foto a alguien cerca y... ¡viaja desde tu teléfono!',
    promoDiscover: 'Descubre momentos en otras ciudades',
    otherCountries: 'Otros países',
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
    copyright: '© 2025 LOKDIS. Todos los derechos reservados.',
    years: 'años',
    areaMap: 'Mapa de la zona',
    exploreTitle: '¡Explora tus lugares favoritos!',
    exploreSubtitle: 'Mapa de la zona',
    mapSubtitle: 'Mapa de la zona',
    // Download App Modal
    downloadModalTitle: 'Descubre más momentos',
    downloadModalText: 'Para explorar más contenido exclusivo y vivir la experiencia completa, descarga la aplicación de Lokdis.',
    downloadModalButton: 'Ir a la página de inicio'
  },
  en: {
    ctaButton: 'I want to try the app',
    welcomeTitle: 'Lokdis',
    languageButton: 'Language',
    loginButton: 'Create account',
    goToButton: 'Go to',
    goToHome: 'Home',
    goToMoments: 'Lokdis moments',
    goToMap: 'Area map',
    heroTitle: 'Request and share photos and videos in real time',
    heroMainTitle: 'Request and share photos and videos in real time',
    heroSubtitle: 'An app to explore the reality of places around the world, without filters or edits 🗺️ 📸',
    heroDescription: 'Find the place you want to see, request a video or photo from someone who is there and... travel from your phone!',
    heroDescription2: 'An app to explore the reality of places around the world, without filters or edits 🗺️ 📸',
    tryButton: 'Try Lokdis',
    discoverTitle: 'Discover more about Lokdis',
    discoverDescription: 'Scroll down to explore all the features and benefits that Lokdis has to offer you.',
    // Moments page
    momentsTitle: 'See LokDis moments in %{countryName}',
    momentsHeroText: 'An app to explore the reality of places around the world, without filters or edits 🗺️ 📸<br /><br />Find the place you want to see, request a video or photo from someone who is there and... travel from your phone!',
    momentsButton: 'Join Lokdis now',
    exploreMoments: 'Explore Lokdis moments in real time',
    testSectionTitle: 'Test or something',
    momentsGallery: 'Moments Gallery',
    // Loading messages
    loadingLocation: 'Getting your location...',
    filteringMoments: 'Filtering moments by date...',
    groupingMoments: 'Grouping moments by location...',
    authenticating: 'Connecting to Lokdis...',
    loadingData: 'Downloading data...',
    processingData: 'Processing information...',
    processingCoordinates: 'Geolocating moment...',
    calculatingDistance: 'Calculating distances and proximity...',
    finishingUp: 'Finishing up...',
    // Media viewing modal
    unknownLocation: 'Unknown location',
    capturedBy: 'Captured by',
    previousMoment: 'Previous moment',
    nextMoment: 'Next moment',
    // Show more button
    showMore: 'Show more',
    loadingMore: 'Loading more...',
    // Promo section
    promoTitle: 'Request and share photos and videos in real time',
    promoSubtitle: 'An app to explore the reality of places around the world, without filters or edits 🗺️ 📸',
    promoDescription: 'Find the place you want to see, request a video or photo from someone who is there and... travel from your phone!',
    promoDiscover: 'Discover moments in other cities',
    otherCountries: 'Other countries',
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
    copyright: '© 2025 LOKDIS. All rights reserved.',
    years: 'years',
    areaMap: 'Area Map',
    exploreTitle: 'Explore your favorite places!',
    exploreSubtitle: 'Area Map',
    mapSubtitle: 'Area Map',
    // Download App Modal
    downloadModalTitle: 'Discover more moments',
    downloadModalText: 'To explore more exclusive content and live the full experience, download the Lokdis application.',
    downloadModalButton: 'Go to the homepage'
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
  
  const t = (key, params = {}) => {
    let translation = translations[language][key] || key;
    Object.keys(params).forEach(paramKey => {
      const placeholder = `%{${paramKey}}`;
      translation = translation.replace(new RegExp(placeholder, 'g'), params[paramKey]);
    });
    return translation;
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