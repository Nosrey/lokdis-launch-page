import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../utils/i18n';
import { useNavigate } from 'react-router-dom';
import './styles/MapPage.css';
import logoSimple from '../../assets/images/logo_simple.png';
import instagramIcon from '../../assets/images/instagram_icon.png';
import tiktokIcon from '../../assets/images/tiktok_icon.png';
import whatsappIcon from '../../assets/images/whatsapp_icon.png';
import qrCode from '../../assets/images/qr-code.png';
import playStoreBadge from '../../assets/images/googleplay_icon.png';
import appStoreBadge from '../../assets/images/applestore_icon.png';
import playStoreBadgeEN from '../../assets/images/googleplay_icon_en.png';
import appStoreBadgeEN from '../../assets/images/applestore_icon_en.png';
import FaqModal from '../../components/FaqModal';
import AboutUsModal from '../../components/AboutUsModal';
import PrivacyPolicyModal from '../../components/PrivacyPolicyModal';
import TermsConditionsModal from '../../components/TermsConditionsModal';
import { firestore } from '../../utils/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import DownloadAppModal from '../../components/DownloadAppModal';

const MapPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Independent column data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [areas, setAreas] = useState([]);
  const [categorizedPages, setCategorizedPages] = useState({});

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const [isTermsConditionsModalOpen, setIsTermsConditionsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  // New state for dynamic content
  const [dynamicContent, setDynamicContent] = useState({
    animatedBackgroundUrl: '',
    content: '',
    metaDescription: '',
    metaTags: [],
    metaTitulo: '',
    subtitulo: '',
    titulo: ''
  });
  const [contentLoading, setContentLoading] = useState(true);

  const randomUsernames = [
    'explorador_urbano', 'viajero_digital', 'mochilero_creativo', 'nomada_moderno', 'aventurero_global',
    'descubridor_de_rutas', 'alma_viajera', 'caminante_digital', 'exploradora_gastronomica', 'fotografo_de_paisajes'
  ];

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const formatRandomDate = () => {
    const hours = Math.floor(Math.random() * 23) + 1; // 1 to 23 hours
    if (hours === 1) {
      return `hace 1 hora`;
    }
    return `hace ${hours} horas`;
  };

  // Function to remove tags sections from HTML content for SEO-only purposes
  const removeTagsSections = (htmlContent) => {
    if (!htmlContent) return htmlContent;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Remove all elements with tag-related classes
    const tagElements = doc.querySelectorAll('.tags-section, .meta-tags, .tag, [class*="tag-"], [class*="meta-tag"]');
    tagElements.forEach(element => element.remove());
    
    // Remove any spans that look like tags (starting with #)
    const allSpans = doc.querySelectorAll('span');
    allSpans.forEach(span => {
      const text = span.textContent.trim();
      if (text.startsWith('#') && text.length > 1) {
        span.remove();
      }
    });
    
    // Remove any divs that contain only tag-related content
    const allDivs = doc.querySelectorAll('div');
    allDivs.forEach(div => {
      const text = div.textContent.trim();
      // If div contains only hashtags or tag-like content, remove it
      if (text.match(/^(#\w+\s*)+$/) || text.match(/^#\d+\s*$/)) {
        div.remove();
      }
    });
    
    // Remove any elements that contain the specific pattern like "#Madrid", "#1", "#2", "#3"
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(element => {
      const text = element.textContent.trim();
      // Check if element contains only hashtag patterns
      if (text.match(/^#(Madrid|[0-9]+)\s*$/) || 
          (element.children.length === 0 && text.startsWith('#') && text.length <= 10)) {
        element.remove();
      }
    });
    
    return doc.body.innerHTML;
  };

  // Function to enhance images with moment-like data
  const enhanceImagesWithMoments = (htmlContent, location) => {
    if (!htmlContent) return htmlContent;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');

    images.forEach(img => {
      // Avoid modifying images that are already part of a special component (e.g., icons)
      if (img.closest('.footer-logo, .social-icon')) return;

      // Ensure the image has no vertical margins that could interfere with the card's fit.
      img.style.marginTop = '0';
      img.style.marginBottom = '0';
      img.style.display = 'block'; // Ensures it behaves as a block and removes bottom space

      const momentCard = document.createElement('div');
      momentCard.className = 'moment-card-from-html';
      momentCard.style.cursor = 'pointer';

      // The image will be inside the card
      img.parentNode.replaceChild(momentCard, img);
      momentCard.appendChild(img);

      const overlay = document.createElement('div');
      overlay.className = 'moment-overlay';

      const momentLocation = document.createElement('div');
      momentLocation.className = 'moment-location';
      momentLocation.textContent = location;

      const momentDate = document.createElement('div');
      momentDate.className = 'moment-date';
      momentDate.textContent = formatRandomDate();

      const momentUsername = document.createElement('div');
      momentUsername.className = 'moment-username';
      momentUsername.textContent = `@${getRandomItem(randomUsernames)}`;

      overlay.appendChild(momentLocation);
      overlay.appendChild(momentDate);
      overlay.appendChild(momentUsername);
      momentCard.appendChild(overlay);
    });

    return doc.body.innerHTML;
  };

  // Fetch dynamic content from Firebase
  useEffect(() => {
    const fetchDynamicContent = async () => {
      try {
        setContentLoading(true);
        const contentDoc = doc(firestore, 'website', 'main', 'principal', 'content');
        const contentSnap = await getDoc(contentDoc);
        
        if (contentSnap.exists()) {
          const data = contentSnap.data();
          const enhancedContent = enhanceImagesWithMoments(data.content || '', 'Descubriendo el mundo');
          setDynamicContent({
            animatedBackgroundUrl: data.animatedBackgroundUrl || '',
            content: removeTagsSections(enhancedContent), // Clean tags from content
            metaDescription: data.metaDescription || '',
            metaTags: data.metaTags || [],
            metaTitulo: data.metaTitulo || '',
            subtitulo: data.subtitulo || '',
            titulo: data.titulo || ''
          });
        } else {
          console.error('No dynamic content found at website/main/principal/content');
        }
      } catch (error) {
        console.error('Error fetching dynamic content:', error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchDynamicContent();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Obtener países de /website/main/paises
        const paisesRef = collection(firestore, 'website/main/paises');
        const paisesSnapshot = await getDocs(paisesRef);
        const countriesData = paisesSnapshot.docs
          .map(doc => ({
            id: doc.id,
            nombre: doc.data().nombre || doc.data().name
          }))
          .filter(country => country.nombre)
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        // Obtener estados de /website/main/estados
        const estadosRef = collection(firestore, 'website/main/estados');
        const estadosSnapshot = await getDocs(estadosRef);
        const statesData = estadosSnapshot.docs
          .map(doc => ({
            id: doc.id,
            nombre: doc.data().nombre || doc.data().name,
            nombrePais: doc.data().nombrePais
          }))
          .filter(state => state.nombre)
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        // Obtener áreas de /website/main/areas
        const areasRef = collection(firestore, 'website/main/areas');
        const areasSnapshot = await getDocs(areasRef);
        const areasData = areasSnapshot.docs
          .map(doc => ({
            id: doc.id,
            nombre: doc.data().nombre || doc.data().name,
            nombrePais: doc.data().nombrePais,
            nombreEstado: doc.data().nombreEstado
          }))
          .filter(area => area.nombre)
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        // Obtener páginas de /website/main/paginas y agrupar por categoría
        const paginasRef = collection(firestore, 'website/main/paginas');
        const paginasSnapshot = await getDocs(paginasRef);
        const paginas = paginasSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(pagina => pagina.titulo && pagina.categoria);

        // Agrupar páginas por categoría (ignorando mayúsculas/minúsculas)
        const categorizedPagesData = {};
        paginas.forEach(pagina => {
          const categoria = pagina.categoria.toLowerCase();
          const categoriaDisplay = pagina.categoria; // Mantener formato original para mostrar
          if (!categorizedPagesData[categoria]) {
            categorizedPagesData[categoria] = {
              name: categoriaDisplay,
              pages: []
            };
          }
          categorizedPagesData[categoria].pages.push(pagina);
        });

        // Ordenar páginas dentro de cada categoría
        Object.keys(categorizedPagesData).forEach(categoria => {
          categorizedPagesData[categoria].pages.sort((a, b) => a.titulo.localeCompare(b.titulo));
        });

        // Actualizar estados
        setCountries(countriesData);
        setStates(statesData);
        setAreas(areasData);
        setCategorizedPages(categorizedPagesData);

      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleCountryClick = (pais) => {
    const countryName = pais.nombre.replace(/\s+/g, '-');
    navigate(`/map/${encodeURIComponent(countryName)}`);
  };

  const handleStateClick = (estado) => {
    // Usar nombrePais del estado para construir la URL jerárquica
    const countryName = estado.nombrePais.replace(/\s+/g, '-');
    const stateName = estado.nombre.replace(/\s+/g, '-');
    navigate(`/map/${encodeURIComponent(countryName)}/${encodeURIComponent(stateName)}`);
  };

  const handleAreaClick = async (area) => {
    try {
      // Buscar el estado para obtener nombrePais
      const estadosRef = collection(firestore, 'website/main/estados');
      const estadosSnapshot = await getDocs(estadosRef);
      const estado = estadosSnapshot.docs.find(doc => doc.data().nombre === area.nombreEstado);
      
      if (!estado) {
        console.error('Estado no encontrado:', area.nombreEstado);
        return;
      }
      
      const estadoData = estado.data();
      const nombrePais = estadoData.nombrePais;
      
              // Construir la URL jerárquica
        const countryName = nombrePais.replace(/\s+/g, '-');
        const stateName = area.nombreEstado.replace(/\s+/g, '-');
        const areaName = area.nombre.replace(/\s+/g, '-');
        navigate(`/map/${encodeURIComponent(countryName)}/${encodeURIComponent(stateName)}/${encodeURIComponent(areaName)}`);
    } catch (error) {
      console.error('Error al construir la URL del área:', error);
    }
  };

  const handlePageClick = async (pagina) => {
    try {
      // Buscar el área para obtener nombreEstado
      const areasRef = collection(firestore, 'website/main/areas');
      const areasSnapshot = await getDocs(areasRef);
      const area = areasSnapshot.docs.find(doc => doc.data().nombre === pagina.nombreArea);
      
      if (!area) {
        console.error('Área no encontrada:', pagina.nombreArea);
        return;
      }
      
      const areaData = area.data();
      const nombreEstado = areaData.nombreEstado;
      
      // Buscar el estado para obtener nombrePais
      const estadosRef = collection(firestore, 'website/main/estados');
      const estadosSnapshot = await getDocs(estadosRef);
      const estado = estadosSnapshot.docs.find(doc => doc.data().nombre === nombreEstado);
      
      if (!estado) {
        console.error('Estado no encontrado:', nombreEstado);
        return;
      }
      
      const estadoData = estado.data();
      const nombrePais = estadoData.nombrePais;
      
              // Construir la URL jerárquica completa
        const countryName = nombrePais.replace(/\s+/g, '-');
        const stateName = nombreEstado.replace(/\s+/g, '-');
        const areaName = pagina.nombreArea.replace(/\s+/g, '-');
        const pageTitle = pagina.titulo.replace(/\s+/g, '-');
        navigate(`/map/${encodeURIComponent(countryName)}/${encodeURIComponent(stateName)}/${encodeURIComponent(areaName)}/${encodeURIComponent(pageTitle)}`);
    } catch (error) {
      console.error('Error al construir la URL de la página:', error);
    }
  };

  const handleOpenFaqModal = () => {
    setIsFaqModalOpen(true);
  };

  const handleCloseFaqModal = () => {
    setIsFaqModalOpen(false);
  };

  const handleOpenAboutUsModal = () => {
    setIsAboutUsModalOpen(true);
  };

  const handleCloseAboutUsModal = () => {
    setIsAboutUsModalOpen(false);
  };

  const handleOpenPrivacyPolicyModal = () => {
    setIsPrivacyPolicyModalOpen(true);
  };

  const handleClosePrivacyPolicyModal = () => {
    setIsPrivacyPolicyModalOpen(false);
  };

  const handleOpenTermsConditionsModal = () => {
    setIsTermsConditionsModalOpen(true);
  };

  const handleCloseTermsConditionsModal = () => {
    setIsTermsConditionsModalOpen(false);
  };

  const handleOpenDownloadModal = () => setIsDownloadModalOpen(true);
  const handleCloseDownloadModal = () => setIsDownloadModalOpen(false);

  const handleContentClick = (e) => {
    if (e.target.closest('.moment-card-from-html')) {
      handleOpenDownloadModal();
    }
  };

  // Add SEO meta tags and update document head
  useEffect(() => {
    // Update page title
    if (dynamicContent.metaTitulo) {
      document.title = `${dynamicContent.metaTitulo} | Lokdis`;
    } else if (dynamicContent.titulo) {
      document.title = `${dynamicContent.titulo} | Lokdis`;
    }

    // Update meta description
    if (dynamicContent.metaDescription) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', dynamicContent.metaDescription);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = dynamicContent.metaDescription;
        document.head.appendChild(metaDescription);
      }
    }

    // Update meta keywords
    if (dynamicContent.metaTags && dynamicContent.metaTags.length > 0) {
      // Remove existing keywords meta tag if it exists
      const existingKeywords = document.querySelector('meta[name="keywords"]');
      if (existingKeywords) {
        existingKeywords.remove();
      }

      // Add new keywords meta tag
      const keywordsMeta = document.createElement('meta');
      keywordsMeta.name = 'keywords';
      keywordsMeta.content = dynamicContent.metaTags.join(', ');
      document.head.appendChild(keywordsMeta);
    }

    // Add Open Graph meta tags for better social sharing
    if (dynamicContent.titulo) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', dynamicContent.titulo);
      } else {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        ogTitle.setAttribute('content', dynamicContent.titulo);
        document.head.appendChild(ogTitle);
      }
    }

    if (dynamicContent.metaDescription) {
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', dynamicContent.metaDescription);
      } else {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        ogDescription.setAttribute('content', dynamicContent.metaDescription);
        document.head.appendChild(ogDescription);
      }
    }

    if (dynamicContent.animatedBackgroundUrl) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', dynamicContent.animatedBackgroundUrl);
      } else {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        ogImage.setAttribute('content', dynamicContent.animatedBackgroundUrl);
        document.head.appendChild(ogImage);
      }
    }
  }, [dynamicContent]);

  return (
    <div className="map-page">
      {/* Sección principal con fondo */}
      <div className="map-hero-section">
        <div 
          className="map-background"
          style={{ 
            backgroundImage: `url('${dynamicContent.animatedBackgroundUrl}')`,
            filter: 'blur(5px)'
          }}
        ></div>
        <div className="map-overlay"></div>
        <div className="map-content">
          {dynamicContent.titulo && <h1 className="map-title">{dynamicContent.titulo}</h1>}
          {dynamicContent.subtitulo && <p className="map-subtitle">{dynamicContent.subtitulo}</p>}
          {dynamicContent.content && (
            <div 
              className="map-dynamic-content" 
              onClick={handleContentClick}
              dangerouslySetInnerHTML={{ __html: dynamicContent.content }}
            />
          )}
        </div>
      </div>
      
      {/* Sección blanca azulada */}
      <div className="map-white-section">
        <div className="map-white-container">
          {/* Dynamic Content Section */}
          {(dynamicContent.content || contentLoading) && (
            <div className="map-content-section">
              {contentLoading ? (
                <div className="content-loading">
                  <div className="loading-spinner"></div>
                  <p>Cargando contenido...</p>
                </div>
              ) : (
                <div className="map-dynamic-content">
                  <div 
                    className="map-html-content"
                    dangerouslySetInnerHTML={{ __html: dynamicContent.content }}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Header Section */}
          <div className="map-header-section">
            <h2 className="map-subtitle">{dynamicContent.subtitulo || t('mapSubtitle')}</h2>
            <div className="map-description">Explora nuestros destinos organizados por ubicación y categoría</div>
          </div>
          
          {/* Navigation Columns */}
          <div className="columns-container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <div className="loading-text">Cargando destinos...</div>
                <div className="loading-subtext">Preparando la mejor experiencia para ti</div>
              </div>
            ) : error ? (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <div className="error-text">Error al cargar los destinos</div>
                <div className="error-subtext">{error}</div>
              </div>
            ) : (
              <div className="columns-grid">
                {/* Columna 1: Países */}
                <div className="column">
                  <div className="column-header">
                    <div className="column-icon">🌍</div>
                    <h3 className="column-title">Países</h3>
                    <div className="column-count">{countries.length}</div>
                  </div>
                  <div className="column-items">
                    {countries.length === 0 ? (
                      <div className="no-items">
                        <div className="no-items-icon">🗺️</div>
                        <div className="no-items-text">No hay países disponibles</div>
                      </div>
                    ) : (
                      countries.map((pais) => (
                        <div 
                          key={pais.id} 
                          className="column-item"
                          onClick={() => handleCountryClick(pais)}
                        >
                          <span className="item-text">{pais.nombre}</span>
                          <svg className="item-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Columna 2: Provincias */}
                <div className="column">
                  <div className="column-header">
                    <div className="column-icon">🏛️</div>
                    <h3 className="column-title">Provincias</h3>
                    <div className="column-count">{states.length}</div>
                  </div>
                  <div className="column-items">
                    {states.length === 0 ? (
                      <div className="no-items">
                        <div className="no-items-icon">🏛️</div>
                        <div className="no-items-text">No hay provincias disponibles</div>
                      </div>
                    ) : (
                      states.map((estado) => (
                        <div 
                          key={estado.id} 
                          className="column-item"
                          onClick={() => handleStateClick(estado)}
                        >
                          <span className="item-text">{estado.nombre}</span>
                          <svg className="item-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Columna 3: Localizaciones */}
                <div className="column">
                  <div className="column-header">
                    <div className="column-icon">📍</div>
                    <h3 className="column-title">Localizaciones</h3>
                    <div className="column-count">{areas.length}</div>
                  </div>
                  <div className="column-items">
                    {areas.length === 0 ? (
                      <div className="no-items">
                        <div className="no-items-icon">📍</div>
                        <div className="no-items-text">No hay localizaciones disponibles</div>
                      </div>
                    ) : (
                      areas.map((area) => (
                        <div 
                          key={area.id} 
                          className="column-item"
                          onClick={() => handleAreaClick(area)}
                        >
                          <span className="item-text">{area.nombre}</span>
                          <svg className="item-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Columnas dinámicas para cada categoría */}
                {Object.entries(categorizedPages).map(([categoryKey, categoryData]) => {
                  // Función para obtener el icono apropiado según la categoría
                  const getCategoryIcon = (categoryName) => {
                    const category = categoryName.toLowerCase();
                    
                    // Playas y costas
                    if (category.includes('playa') || category.includes('playas') || category.includes('beach') || 
                        category.includes('beaches') || category.includes('costa') || category.includes('costas') || 
                        category.includes('litoral') || category.includes('mar') || category.includes('océano') ||
                        category.includes('balneario') || category.includes('balnearios')) return '🏖️';
                    
                    // Parques y naturaleza
                    if (category.includes('parque') || category.includes('parques') || category.includes('park') || 
                        category.includes('parks') || category.includes('jardín') || category.includes('jardines') ||
                        category.includes('garden') || category.includes('gardens') || category.includes('natural') ||
                        category.includes('naturaleza') || category.includes('bosque') || category.includes('bosques') ||
                        category.includes('reserva') || category.includes('reservas') || category.includes('ecológico') ||
                        category.includes('verde') || category.includes('verdes')) return '🌳';
                    
                    // Cines y entretenimiento audiovisual
                    if (category.includes('cine') || category.includes('cines') || category.includes('cinema') || 
                        category.includes('cinemas') || category.includes('movie') || category.includes('movies') ||
                        category.includes('película') || category.includes('películas') || category.includes('film') ||
                        category.includes('films') || category.includes('teatro') || category.includes('teatros') ||
                        category.includes('theater') || category.includes('theatre')) return '🎬';
                    
                    // Estadios y deportes
                    if (category.includes('estadio') || category.includes('estadios') || category.includes('stadium') || 
                        category.includes('stadiums') || category.includes('deporte') || category.includes('deportes') ||
                        category.includes('sport') || category.includes('sports') || category.includes('gimnasio') ||
                        category.includes('gimnasios') || category.includes('gym') || category.includes('gyms') ||
                        category.includes('cancha') || category.includes('canchas') || category.includes('campo') ||
                        category.includes('campos') || category.includes('piscina') || category.includes('piscinas') ||
                        category.includes('pool') || category.includes('pools') || category.includes('fitness')) return '🏟️';
                    
                    // Entretenimiento general
                    if (category.includes('entretenimiento') || category.includes('entertainment') || 
                        category.includes('diversión') || category.includes('fun') || category.includes('ocio') ||
                        category.includes('leisure') || category.includes('recreación') || category.includes('recreation') ||
                        category.includes('espectáculo') || category.includes('espectáculos') || category.includes('show') ||
                        category.includes('shows') || category.includes('evento') || category.includes('eventos') ||
                        category.includes('event') || category.includes('events')) return '🎭';
                    
                    // Restaurantes y comida
                    if (category.includes('restaurante') || category.includes('restaurantes') || category.includes('restaurant') || 
                        category.includes('restaurants') || category.includes('comida') || category.includes('food') ||
                        category.includes('gastronomía') || category.includes('gastronomy') || category.includes('cocina') ||
                        category.includes('cuisine') || category.includes('café') || category.includes('cafés') ||
                        category.includes('coffee') || category.includes('cafetería') || category.includes('cafeterías') ||
                        category.includes('bistro') || category.includes('bistros') || category.includes('pizzería') ||
                        category.includes('pizzerías') || category.includes('panadería') || category.includes('panaderías') ||
                        category.includes('bakery') || category.includes('bakeries')) return '🍽️';
                    
                    // Hoteles y alojamiento
                    if (category.includes('hotel') || category.includes('hoteles') || category.includes('hotels') ||
                        category.includes('hospedaje') || category.includes('hospedajes') || category.includes('alojamiento') ||
                        category.includes('alojamientos') || category.includes('accommodation') || category.includes('accommodations') ||
                        category.includes('posada') || category.includes('posadas') || category.includes('inn') ||
                        category.includes('inns') || category.includes('resort') || category.includes('resorts') ||
                        category.includes('motel') || category.includes('moteles') || category.includes('motels') ||
                        category.includes('hostal') || category.includes('hostales') || category.includes('hostel') ||
                        category.includes('hostels') || category.includes('lodge') || category.includes('lodges')) return '🏨';
                    
                    // Museos y cultura
                    if (category.includes('museo') || category.includes('museos') || category.includes('museum') || 
                        category.includes('museums') || category.includes('cultura') || category.includes('cultural') ||
                        category.includes('culture') || category.includes('galería') || category.includes('galerías') ||
                        category.includes('gallery') || category.includes('galleries') || category.includes('arte') ||
                        category.includes('art') || category.includes('histórico') || category.includes('históricos') ||
                        category.includes('historic') || category.includes('historical') || category.includes('patrimonio') ||
                        category.includes('heritage') || category.includes('monumento') || category.includes('monumentos') ||
                        category.includes('monument') || category.includes('monuments')) return '🏛️';
                    
                    // Shopping y comercio
                    if (category.includes('shopping') || category.includes('tienda') || category.includes('tiendas') ||
                        category.includes('shop') || category.includes('shops') || category.includes('store') ||
                        category.includes('stores') || category.includes('comercio') || category.includes('comercios') ||
                        category.includes('commerce') || category.includes('mercado') || category.includes('mercados') ||
                        category.includes('market') || category.includes('markets') || category.includes('centro comercial') ||
                        category.includes('centros comerciales') || category.includes('mall') || category.includes('malls') ||
                        category.includes('plaza') || category.includes('plazas') || category.includes('bazaar') ||
                        category.includes('bazar') || category.includes('boutique') || category.includes('boutiques')) return '🛍️';
                    
                    // Bares y vida nocturna
                    if (category.includes('bar') || category.includes('bares') || category.includes('bars') ||
                        category.includes('club') || category.includes('clubs') || category.includes('nocturno') ||
                        category.includes('nocturna') || category.includes('nightlife') || category.includes('discoteca') ||
                        category.includes('discotecas') || category.includes('disco') || category.includes('discos') ||
                        category.includes('pub') || category.includes('pubs') || category.includes('cantina') ||
                        category.includes('cantinas') || category.includes('taberna') || category.includes('tabernas') ||
                        category.includes('tavern') || category.includes('taverns') || category.includes('lounge') ||
                        category.includes('lounges') || category.includes('karaoke')) return '🍻';
                    
                    // Aventura y deportes extremos
                    if (category.includes('aventura') || category.includes('aventuras') || category.includes('adventure') || 
                        category.includes('adventures') || category.includes('extremo') || category.includes('extremos') ||
                        category.includes('extreme') || category.includes('montaña') || category.includes('montañas') ||
                        category.includes('mountain') || category.includes('mountains') || category.includes('escalada') ||
                        category.includes('climbing') || category.includes('senderismo') || category.includes('hiking') ||
                        category.includes('trekking') || category.includes('rafting') || category.includes('kayak') ||
                        category.includes('surf') || category.includes('surfing') || category.includes('buceo') ||
                        category.includes('diving') || category.includes('parapente') || category.includes('paragliding')) return '🏔️';
                    
                    // Spa y bienestar
                    if (category.includes('spa') || category.includes('spas') || category.includes('relax') ||
                        category.includes('relajación') || category.includes('wellness') || category.includes('bienestar') ||
                        category.includes('masaje') || category.includes('masajes') || category.includes('massage') ||
                        category.includes('massages') || category.includes('termal') || category.includes('termales') ||
                        category.includes('thermal') || category.includes('sauna') || category.includes('saunas') ||
                        category.includes('jacuzzi') || category.includes('balneario') || category.includes('balnearios')) return '💆';
                    
                    // Transporte
                    if (category.includes('transporte') || category.includes('transportes') || category.includes('transport') ||
                        category.includes('transportation') || category.includes('taxi') || category.includes('taxis') ||
                        category.includes('bus') || category.includes('buses') || category.includes('autobús') ||
                        category.includes('autobuses') || category.includes('metro') || category.includes('subway') ||
                        category.includes('tren') || category.includes('trenes') || category.includes('train') ||
                        category.includes('trains') || category.includes('aeropuerto') || category.includes('aeropuertos') ||
                        category.includes('airport') || category.includes('airports') || category.includes('terminal') ||
                        category.includes('terminales') || category.includes('estación') || category.includes('estaciones') ||
                        category.includes('station') || category.includes('stations')) return '🚗';
                    
                    // Educación
                    if (category.includes('educación') || category.includes('education') || category.includes('escuela') ||
                        category.includes('escuelas') || category.includes('school') || category.includes('schools') ||
                        category.includes('universidad') || category.includes('universidades') || category.includes('university') ||
                        category.includes('universities') || category.includes('colegio') || category.includes('colegios') ||
                        category.includes('college') || category.includes('colleges') || category.includes('instituto') ||
                        category.includes('institutos') || category.includes('institute') || category.includes('institutes') ||
                        category.includes('academia') || category.includes('academias') || category.includes('academy') ||
                        category.includes('academies') || category.includes('biblioteca') || category.includes('bibliotecas') ||
                        category.includes('library') || category.includes('libraries')) return '🎓';
                    
                    // Salud
                    if (category.includes('salud') || category.includes('health') || category.includes('hospital') ||
                        category.includes('hospitales') || category.includes('hospitals') || category.includes('clínica') ||
                        category.includes('clínicas') || category.includes('clinic') || category.includes('clinics') ||
                        category.includes('médico') || category.includes('médicos') || category.includes('medical') ||
                        category.includes('farmacia') || category.includes('farmacias') || category.includes('pharmacy') ||
                        category.includes('pharmacies') || category.includes('consultorio') || category.includes('consultorios') ||
                        category.includes('dentista') || category.includes('dentistas') || category.includes('dental') ||
                        category.includes('veterinaria') || category.includes('veterinarias') || category.includes('veterinary')) return '🏥';
                    
                    // Icono por defecto para categorías no reconocidas
                    return '📍';
                  };

                  return (
                  <div key={categoryKey} className="column">
                    <div className="column-header">
                      <div className="column-icon">{getCategoryIcon(categoryData.name)}</div>
                      <h3 className="column-title">{categoryData.name}</h3>
                      <div className="column-count">{categoryData.pages.length}</div>
                    </div>
                    <div className="column-items">
                      {categoryData.pages.map((pagina) => (
                        <div
                          key={pagina.id}
                          className="column-item"
                          onClick={() => handlePageClick(pagina)}
                        >
                          <span className="item-text">{pagina.titulo}</span>
                          <svg className="item-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="map-footer-container">
        <footer className="footer-section">
          <div className="footer-content-wrapper">
            <div className="footer-row">
              <button className="footer-link" onClick={handleOpenAboutUsModal}>{t('aboutUs')}</button>
              <button className="footer-link" onClick={handleOpenPrivacyPolicyModal}>{t('privacyPolicy')}</button>
              <button className="footer-link" onClick={handleOpenTermsConditionsModal}>{t('termsConditions')}</button>
              <button className="footer-link" onClick={handleOpenFaqModal}>{t('faqs')}</button>
              <a href="/lokdis-launch-page/map" className="footer-link">{t('areaMap')}</a>
              <div className="footer-social">
                <a href="https://www.instagram.com/lokdisapp/" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                  <img src={instagramIcon} alt="Instagram" className="footer-social-img footer-social-img--small" />
                </a>
                <a href="https://www.tiktok.com/@lokdisapp" target="_blank" rel="noopener noreferrer" className="social-icon tiktok">
                  <img src={tiktokIcon} alt="TikTok" className="footer-social-img footer-social-img--small" />
                </a>
                <a href="https://wa.me/34624415165" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
                  <img src={whatsappIcon} alt="WhatsApp" className="footer-social-img footer-social-img--small" />
                </a>
              </div>
            </div>
            
            <div className="footer-main">
              <div className="footer-main-content">
                <div className="footer-logo">
                  <img 
                    src={logoSimple} 
                    alt="Lokdis Logo" 
                    className="footer-logo-simple" 
                  />
                  <div className="footer-logo-text">LOKDIS</div>
                </div>
                <div className="footer-download">
                  <div className="footer-stores">
                    <a href="https://play.google.com/store/" className="store-badge-footer">
                      <img 
                        src={require('../../assets/images/googleplay_icon.png')} 
                        alt="Google Play" 
                        width="60" 
                        height="60" 
                      />
                    </a>
                    <a href="https://www.apple.com/app-store/" className="store-badge-footer">
                      <img 
                        src={require('../../assets/images/applestore_icon.png')} 
                        alt="App Store" 
                        width="60" 
                        height="60" 
                      />
                    </a>
                  </div>
                  <div className="footer-qr">
                    <img src={qrCode} alt="QR Code" />
                  </div>
                </div>
              </div>
              <div className="footer-copyright-row">
                <div className="footer-copyright">
                  {t('copyright')}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <FaqModal isOpen={isFaqModalOpen} onClose={handleCloseFaqModal} />
      <AboutUsModal isOpen={isAboutUsModalOpen} onClose={handleCloseAboutUsModal} />
      <PrivacyPolicyModal isOpen={isPrivacyPolicyModalOpen} onClose={handleClosePrivacyPolicyModal} />
      <TermsConditionsModal isOpen={isTermsConditionsModalOpen} onClose={handleCloseTermsConditionsModal} />
      <DownloadAppModal isOpen={isDownloadModalOpen} onClose={handleCloseDownloadModal} />
    </div>
  );
};

export default MapPage; 