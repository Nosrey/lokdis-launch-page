import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../../utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './styles/PageView.css';
import { useLanguage } from '../../utils/i18n';
import logoSimple from '../../assets/images/logo_simple.png';
import instagramIcon from '../../assets/images/instagram_icon.png';
import tiktokIcon from '../../assets/images/tiktok_icon.png';
import whatsappIcon from '../../assets/images/whatsapp_icon.png';
import qrCode from '../../assets/images/qr-code.png';
import FaqModal from '../../components/FaqModal';
import AboutUsModal from '../../components/AboutUsModal';
import PrivacyPolicyModal from '../../components/PrivacyPolicyModal';
import TermsConditionsModal from '../../components/TermsConditionsModal';
import DownloadAppModal from '../../components/DownloadAppModal';

const PageView = () => {
  const { country, state, area, page } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [similarPages, setSimilarPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const [isTermsConditionsModalOpen, setIsTermsConditionsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tocItems, setTocItems] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [modifiedHtmlContent, setModifiedHtmlContent] = useState('');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleOpenDownloadModal = () => setIsDownloadModalOpen(true);
  const handleCloseDownloadModal = () => setIsDownloadModalOpen(false);

  const handleContentClick = (e) => {
    if (e.target.closest('.moment-card-from-html')) {
      handleOpenDownloadModal();
    }
  };

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

  const handleBackClick = () => {
    console.log('🔙 Botón Volver clickeado - navegando a /map');
    navigate('/map');
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('image-modal-overlay')) {
      handleCloseImageModal();
    }
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        handleCloseImageModal();
      }
    };
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedImage]);

  // Add meta tags to head for SEO - Universal for all content types (countries, states, areas, pages)
  useEffect(() => {
    if (pageData && pageData.metaTags && pageData.metaTags.length > 0) {
      // Create meta keywords tag
      const keywordsTag = document.createElement('meta');
      keywordsTag.name = 'keywords';
      keywordsTag.content = pageData.metaTags.join(', ');
      
      // Create meta description tag with tags if no existing description
      let descriptionTag = document.querySelector('meta[name="description"]');
      if (!descriptionTag) {
        descriptionTag = document.createElement('meta');
        descriptionTag.name = 'description';
        document.head.appendChild(descriptionTag);
      }
      
      // Update description to include tags if it doesn't already contain them
      const currentDescription = descriptionTag.content || '';
      const tagsString = pageData.metaTags.join(', ');
      if (!currentDescription.includes(tagsString)) {
        const newDescription = currentDescription 
          ? `${currentDescription} - ${tagsString}` 
          : `${pageData.titulo || 'Lokdis'} - ${tagsString}`;
        descriptionTag.content = newDescription;
      }
      
      // Add keywords tag to head
      document.head.appendChild(keywordsTag);
      
      // Cleanup function to remove tags when component unmounts or data changes
      return () => {
        if (keywordsTag.parentNode) {
          keywordsTag.parentNode.removeChild(keywordsTag);
        }
      };
    }
  }, [pageData]);

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

  // Generate Table of Contents from HTML content and add IDs
  const generateTOC = (htmlContent) => {
    if (!htmlContent) return { toc: [], modifiedHtml: htmlContent };
    
    // First, enhance images with moment data
    const locationName = area || state || country || 'Mundo';
    const enhancedHtml = enhanceImagesWithMoments(htmlContent, locationName.replace(/-/g, ' '));
    
    // Then remove tags sections for display purposes
    const cleanedHtml = removeTagsSections(enhancedHtml);
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanedHtml, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3');
    
    const toc = [];
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent.trim();
      const id = `heading-${index}`;
      
      // Add ID to heading for navigation
      heading.id = id;
      
      toc.push({
        id,
        text,
        level
      });
    });
    
    // Return modified HTML with IDs added and tags removed
    const modifiedHtml = doc.body.innerHTML;
    
    return { toc, modifiedHtml };
  };

  // Handle TOC link click
  const handleTocClick = (id) => {
    console.log('TOC click for ID:', id);
    
    // First try to find the element by ID
    let element = document.getElementById(id);
    console.log('Element found initially:', !!element);
    
    // If not found, try to add IDs again and then find
    if (!element) {
      const contentContainer = document.querySelector('.dynamic-html-content');
      console.log('Content container found:', !!contentContainer);
      
      if (contentContainer) {
        const headings = contentContainer.querySelectorAll('h1, h2, h3');
        console.log('Headings found:', headings.length);
        
        headings.forEach((heading, index) => {
          const headingId = `heading-${index}`;
          heading.id = headingId;
          console.log(`Added ID ${headingId} to heading:`, heading.textContent.trim());
        });
        element = document.getElementById(id);
        console.log('Element found after adding IDs:', !!element);
      }
    }
    
    if (element) {
      // Use scrollIntoView which is more reliable
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Add additional offset by scrolling up a bit more
      setTimeout(() => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const offset = 120;
        window.scrollTo({ 
          top: Math.max(0, currentScroll - offset), 
          behavior: 'smooth' 
        });
      }, 100);
      
      // Update active section
      setActiveSection(id);
      console.log('Scrolled to element:', element.textContent.trim());
    } else {
      console.warn(`Element with ID ${id} not found`);
    }
  };

  // Navigation function for back to content
  const handleBackToTop = () => {
    console.log('⬆️ Botón Ir al inicio clickeado - scrolling to content-section');
    const contentSection = document.querySelector('.content-section');
    if (contentSection) {
      contentSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to page header if no content section
      const pageHeader = document.querySelector('.page-header');
      if (pageHeader) {
        pageHeader.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (tocItems.length === 0) return;
      
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const offset = 150; // Offset for navbar
      
      // Find the current active section
      let currentSection = '';
      
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const element = document.getElementById(tocItems[i].id);
        if (element) {
          const elementRect = element.getBoundingClientRect();
          const elementTop = elementRect.top + scrollPosition;
          
          if (elementTop <= scrollPosition + offset) {
            currentSection = tocItems[i].id;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tocItems]);

  // Generate TOC when pageData changes - Universal for all content types
  useEffect(() => {
    if (pageData?.content) {
      const { toc, modifiedHtml } = generateTOC(pageData.content);
      setTocItems(toc);
      setModifiedHtmlContent(modifiedHtml);
    } else {
      setTocItems([]);
      setModifiedHtmlContent('');
    }
  }, [pageData]);

  // Add IDs to headings after content is rendered
  useEffect(() => {
    if (tocItems.length > 0) {
      const addIds = () => {
        const contentContainer = document.querySelector('.dynamic-html-content');
        if (contentContainer) {
          const headings = contentContainer.querySelectorAll('h1, h2, h3');
          headings.forEach((heading, index) => {
            if (!heading.id) {
              heading.id = `heading-${index}`;
            }
          });
        }
      };

      // Try immediately
      addIds();
      
      // Also try after a short delay to ensure DOM is ready
      const timeout = setTimeout(addIds, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [tocItems, modifiedHtmlContent]);

  // Function to fetch similar pages with universal hierarchical proximity
  const fetchSimilarPages = async (currentData, currentType) => {
    try {
      // Load all data once to avoid multiple queries
      const [paisesSnapshot, estadosSnapshot, areasSnapshot, paginasSnapshot] = await Promise.all([
        getDocs(collection(firestore, 'website/main/paises')),
        getDocs(collection(firestore, 'website/main/estados')),
        getDocs(collection(firestore, 'website/main/areas')),
        getDocs(collection(firestore, 'website/main/paginas'))
      ]);

      const allCountries = paisesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'country' }));
      const allStates = estadosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'state' }));
      const allAreas = areasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'area' }));
      const allPages = paginasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'page' }));

      // Helper function to get hierarchy info for any item
      const getHierarchyInfo = (item, itemType) => {
        let country = '', state = '', area = '';
        
        if (itemType === 'page') {
          area = item.nombreArea;
          const areaDoc = allAreas.find(a => a.nombre === item.nombreArea);
          if (areaDoc) {
            state = areaDoc.nombreEstado;
            const stateDoc = allStates.find(s => s.nombre === areaDoc.nombreEstado);
            if (stateDoc) {
              country = stateDoc.nombrePais;
            }
          }
        } else if (itemType === 'area') {
          area = item.nombre;
          state = item.nombreEstado;
          const stateDoc = allStates.find(s => s.nombre === item.nombreEstado);
          if (stateDoc) {
            country = stateDoc.nombrePais;
          }
        } else if (itemType === 'state') {
          state = item.nombre;
          country = item.nombrePais;
        } else if (itemType === 'country') {
          country = item.nombre;
        }
        
        return { country, state, area };
      };

      // Get current item hierarchy
      const currentHierarchy = getHierarchyInfo(currentData, currentType);
      
      // Collect all possible items with their proximity scores
      const allItems = [];
      
      // Add all countries (except current if it's a country)
      allCountries.forEach(country => {
        if (currentType === 'country' && country.id === currentData.id) return;
        const hierarchy = getHierarchyInfo(country, 'country');
        let proximityScore = 0;
        
        if (hierarchy.country === currentHierarchy.country) {
          proximityScore = 100; // Same country (shouldn't happen for countries, but just in case)
        } else {
          proximityScore = 10; // Different country
        }
        
        allItems.push({ ...country, proximityScore, hierarchy });
      });

      // Add all states (except current if it's a state)
      allStates.forEach(state => {
        if (currentType === 'state' && state.id === currentData.id) return;
        const hierarchy = getHierarchyInfo(state, 'state');
        let proximityScore = 0;
        
        if (hierarchy.country === currentHierarchy.country) {
          if (hierarchy.state === currentHierarchy.state) {
            proximityScore = 1000; // Same state (shouldn't happen for states, but just in case)
          } else {
            proximityScore = 500; // Same country, different state
          }
        } else {
          proximityScore = 50; // Different country
        }
        
        allItems.push({ ...state, proximityScore, hierarchy });
      });

      // Add all areas (except current if it's an area)
      allAreas.forEach(area => {
        if (currentType === 'area' && area.id === currentData.id) return;
        const hierarchy = getHierarchyInfo(area, 'area');
        let proximityScore = 0;
        
        if (hierarchy.country === currentHierarchy.country) {
          if (hierarchy.state === currentHierarchy.state) {
            if (hierarchy.area === currentHierarchy.area) {
              proximityScore = 10000; // Same area (shouldn't happen for areas, but just in case)
            } else {
              proximityScore = 2000; // Same state, different area
            }
          } else {
            proximityScore = 800; // Same country, different state
          }
        } else {
          proximityScore = 80; // Different country
        }
        
        allItems.push({ ...area, proximityScore, hierarchy });
      });

      // Add all pages (except current if it's a page)
      allPages.forEach(page => {
        if (currentType === 'page' && page.id === currentData.id) return;
        const hierarchy = getHierarchyInfo(page, 'page');
        let proximityScore = 0;
        
        if (hierarchy.country === currentHierarchy.country) {
          if (hierarchy.state === currentHierarchy.state) {
            if (hierarchy.area === currentHierarchy.area) {
              proximityScore = 5000; // Same area
            } else {
              proximityScore = 3000; // Same state, different area
            }
          } else {
            proximityScore = 1000; // Same country, different state
          }
        } else {
          proximityScore = 100; // Different country
        }
        
        allItems.push({ ...page, proximityScore, hierarchy });
      });

      // Sort by proximity score (higher = more similar) and take top 6
      const similarItems = allItems
        .sort((a, b) => b.proximityScore - a.proximityScore)
        .slice(0, 6);

      // Transform data for display
      const transformedSimilarPages = similarItems.map((item) => {
        let displayData = {
          id: item.id,
          titulo: item.titulo || item.nombre,
          imagenes: item.imagenes || [],
          area: item.hierarchy.area,
          estado: item.hierarchy.state,
          country: item.hierarchy.country,
          contentType: item.type // Add the type information
        };
        
        return displayData;
      });
      
      setSimilarPages(transformedSimilarPages);
      
    } catch (error) {
      console.error('Error fetching similar pages:', error);
      setSimilarPages([]);
    }
  };

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      setError(null);
      setPageData(null);
      setSimilarPages([]);

      try {
        let foundData = null;
        let contentType = '';

        // Determine what type of content we're looking for based on URL parameters
        if (page) {
          // Full hierarchy: /map/country/state/area/page
          contentType = 'page';
          const pageTitle = decodeURIComponent(page).replace(/-/g, ' ').trim().toLowerCase();
          
          // Search in /website/main/paginas for the page
          const paginasRef = collection(firestore, 'website/main/paginas');
          const paginasSnapshot = await getDocs(paginasRef);
          
          const matchingPageDoc = paginasSnapshot.docs.find(doc => 
            doc.data().titulo && doc.data().titulo.trim().toLowerCase() === pageTitle
          );
          
          if (matchingPageDoc) {
            foundData = { 
              id: matchingPageDoc.id, 
              ...matchingPageDoc.data(),
              type: 'page'
            };
          }
        } else if (area) {
          // Area level: /map/country/state/area
          contentType = 'area';
          const areaName = decodeURIComponent(area).replace(/-/g, ' ').trim().toLowerCase();
          
          // Search in /website/main/areas for the area
          const areasRef = collection(firestore, 'website/main/areas');
          const areasSnapshot = await getDocs(areasRef);
          
          const matchingAreaDoc = areasSnapshot.docs.find(doc => 
            doc.data().nombre && doc.data().nombre.trim().toLowerCase() === areaName
          );
          
          if (matchingAreaDoc) {
            foundData = { 
              id: matchingAreaDoc.id, 
              ...matchingAreaDoc.data(),
              type: 'area',
              titulo: matchingAreaDoc.data().nombre
            };
          }
        } else if (state) {
          // State level: /map/country/state
          contentType = 'state';
          const stateName = decodeURIComponent(state).replace(/-/g, ' ').trim().toLowerCase();
          
          // Search in /website/main/estados for the state
          const estadosRef = collection(firestore, 'website/main/estados');
          const estadosSnapshot = await getDocs(estadosRef);
          
          const matchingStateDoc = estadosSnapshot.docs.find(doc => 
            doc.data().nombre && doc.data().nombre.trim().toLowerCase() === stateName
          );
          
          if (matchingStateDoc) {
            foundData = { 
              id: matchingStateDoc.id, 
              ...matchingStateDoc.data(),
              type: 'state',
              titulo: matchingStateDoc.data().nombre
            };
          }
        } else if (country) {
          // Country level: /map/country
          contentType = 'country';
          const countryName = decodeURIComponent(country).replace(/-/g, ' ').trim().toLowerCase();
          
          // Search in /website/main/paises for the country
          const paisesRef = collection(firestore, 'website/main/paises');
          const paisesSnapshot = await getDocs(paisesRef);
          
          const matchingCountryDoc = paisesSnapshot.docs.find(doc => 
            doc.data().nombre && doc.data().nombre.trim().toLowerCase() === countryName
          );
          
          if (matchingCountryDoc) {
            foundData = { 
              id: matchingCountryDoc.id, 
              ...matchingCountryDoc.data(),
              type: 'country',
              titulo: matchingCountryDoc.data().nombre
            };
          }
        }

        if (foundData) {
          setPageData(foundData);
          
          // Fetch similar pages with hierarchical proximity
          await fetchSimilarPages(foundData, contentType);
        } else {
          setError(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} no encontrado. Revisa la URL.`);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar el contenido.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchContentData();
  }, [country, state, area, page]);

  useEffect(() => {
    if (pageData) {
      // Build title based on available data - works for all content types
      let titleParts = [pageData.titulo || pageData.nombre];
      
      // Add hierarchical context based on content type
      if (pageData.type === 'page' && pageData.nombreArea) {
        titleParts.push(pageData.nombreArea);
      } else if (pageData.type === 'area' && pageData.nombreEstado) {
        titleParts.push(pageData.nombreEstado);
      } else if (pageData.type === 'state' && pageData.nombrePais) {
        titleParts.push(pageData.nombrePais);
      } else if (pageData.type === 'country') {
        titleParts.push('País');
      }
      
      document.title = `${titleParts.join(' - ')} | Lokdis`;
      
      // Set meta description - works for all content types
      const metaDescription = document.querySelector('meta[name="description"]');
      const description = pageData.metaDescription || 
                         (pageData.descriptions && pageData.descriptions[0]) || 
                         `Descubre ${pageData.titulo || pageData.nombre} en Lokdis`;
      
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [pageData]);

  const handleSimilarPageClick = (p) => {
    let url = '/map';
    
    // Use the contentType that was passed from the similarity function
    const contentType = p.contentType;
    
    // Build URL based on content type
    if (p.country) {
      const countryName = p.country.replace(/\s+/g, '-');
      url += `/${encodeURIComponent(countryName)}`;
      
      if (contentType !== 'country' && p.estado) {
        const stateName = p.estado.replace(/\s+/g, '-');
        url += `/${encodeURIComponent(stateName)}`;
        
        if (contentType !== 'state' && p.area) {
          const areaName = p.area.replace(/\s+/g, '-');
          url += `/${encodeURIComponent(areaName)}`;
          
          // Only add page title if it's actually a page (not an area)
          if (contentType === 'page') {
            const pageTitle = p.titulo.replace(/\s+/g, '-');
            url += `/${encodeURIComponent(pageTitle)}`;
          }
        }
      }
    }
    
    navigate(url);
  };

  return (
    <div className="page-view">
      {loading && (
        <div className="page-content">
          <div className="loading">Cargando...</div>
        </div>
      )}

      {error && (
        <div className="page-content">
          <div className="error">{error}</div>
        </div>
      )}

      {pageData && (
        <div className="page-content">

            <div className="page-layout">
              <div className="main-content">

            {/* Header Section - Universal for all content types */}
            <div className="page-header">
              <div className="breadcrumb">
                <span className="breadcrumb-item">{country?.replace(/-/g, ' ')}</span>
                {state && (
                  <>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-item">{state.replace(/-/g, ' ')}</span>
                  </>
                )}
                {area && (
                  <>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-item">{area.replace(/-/g, ' ')}</span>
                  </>
                )}
              </div>
              <h1 className="page-title">{pageData.titulo || pageData.nombre}</h1>
              
              {/* Dynamic subtitle based on content type and hierarchy */}
              {pageData.type === 'page' && pageData.nombreArea && (
                <div className="page-subtitle">{pageData.nombreArea}</div>
              )}
              {pageData.type === 'area' && pageData.nombreEstado && (
                <div className="page-subtitle">{pageData.nombreEstado}</div>
              )}
              {pageData.type === 'state' && pageData.nombrePais && (
                <div className="page-subtitle">{pageData.nombrePais}</div>
              )}
              {pageData.type === 'country' && (
                <div className="page-subtitle">País</div>
              )}
            </div>


            
            {/* Images Gallery - Universal for all content types */}
            {pageData.imagenes && pageData.imagenes.length > 0 && (
              <div className="gallery-section">
                <div className="images-container">
                  {pageData.imagenes.map((imagen, index) => (
                    <div key={index} className="image-wrapper" onClick={() => handleImageClick(imagen)}>
                      <img src={imagen} alt={`${pageData.titulo} - Imagen ${index + 1}`} />
                      <div className="image-overlay">
                        <svg className="zoom-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                          <path d="21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Section - Universal for all content types */}
            {(pageData.content || (pageData.descriptions && pageData.descriptions.length > 0)) && (
              <div className="content-section">
                {/* Dynamic HTML Content */}
                {pageData.content && (
                  <div className="dynamic-html-content" onClick={handleContentClick}>
                    <div 
                      dangerouslySetInnerHTML={{ __html: modifiedHtmlContent || pageData.content }}
                    />
                  </div>
                )}
                
                {/* Fallback to descriptions if no HTML content */}
                {!pageData.content && pageData.descriptions && pageData.descriptions.length > 0 && (
                  <div className="descriptions-container">
                    {pageData.descriptions.map((description, index) => (
                      <React.Fragment key={index}>
                        <p className="description">{description}</p>
                        {index < pageData.descriptions.length - 1 && (
                          <hr className="description-divider" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Similar Pages Section */}
            <div className="similar-pages-section">
              <div className="section-header">
                <h2 className="similar-pages-title">Lugares similares</h2>
                <div className="section-subtitle">Descubre más lugares increíbles</div>
              </div>
              {similarPages.length > 0 ? (
                <div className="similar-pages-grid">
                  {similarPages.map((similarPage) => (
                    <div key={similarPage.id} className="similar-page-card" onClick={() => handleSimilarPageClick(similarPage)}>
                      {similarPage.imagenes && similarPage.imagenes.length > 0 && (
                        <div className="similar-page-image">
                          <img src={similarPage.imagenes[0]} alt={similarPage.titulo} />
                        </div>
                      )}
                      <div className="similar-page-info">
                        <h3>{similarPage.titulo}</h3>
                        <p>
                          {similarPage.area && similarPage.estado && similarPage.country && 
                            `${similarPage.area}, ${similarPage.estado}, ${similarPage.country}`}
                          {similarPage.area && similarPage.estado && !similarPage.country && 
                            `${similarPage.area}, ${similarPage.estado}`}
                          {!similarPage.area && similarPage.estado && similarPage.country && 
                            `${similarPage.estado}, ${similarPage.country}`}
                          {!similarPage.area && !similarPage.estado && similarPage.country && 
                            similarPage.country}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-similars-container">
                  <div className="no-similars-icon">🗺️</div>
                  <p className="no-similars-message">No hay otros lugares disponibles en este momento</p>
                  <p className="no-similars-submessage">¡Pronto agregaremos más destinos increíbles!</p>
                </div>
              )}
            </div>
              </div>

              {/* Table of Contents - Universal for all content types with HTML content */}
              {tocItems.length > 0 && (
                <div className="toc-container">
                                  <div className="toc-card">
                  <div className="toc-header">
                    <h3 className="toc-title">
                      <svg className="toc-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Tabla de Contenido
                    </h3>
                    <button onClick={handleBackToTop} className="toc-back-to-top-button" title={t('backToTop')}>
                      <svg className="toc-back-to-top-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                    <ul className="toc-list">
                      {tocItems.map((item) => (
                        <li key={item.id} className="toc-item">
                          <button
                            className={`toc-link level-${item.level} ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => handleTocClick(item.id)}
                          >
                            {item.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Back to Map Button - Below TOC */}
                  <div className="toc-actions">
                    <button onClick={handleBackClick} className="toc-back-button" title={t('backToMap')}>
                      <svg className="toc-back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="toc-back-text">{t('backToMap')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
        </div>
      )}

      {selectedImage && (
        <div className="image-modal-overlay" onClick={handleOverlayClick}>
          <div className="image-modal">
            <button className="modal-close-btn" onClick={handleCloseImageModal} aria-label="Cerrar">×</button>
            <img src={selectedImage} alt="Imagen ampliada" />
          </div>
        </div>
      )}

      <footer className="footer-section">
        <div className="footer-content-wrapper">
          <div className="footer-row">
            <button className="footer-link" onClick={handleOpenAboutUsModal}>{t('aboutUs')}</button>
            <button className="footer-link" onClick={handleOpenPrivacyPolicyModal}>{t('privacyPolicy')}</button>
            <button className="footer-link" onClick={handleOpenTermsConditionsModal}>{t('termsConditions')}</button>
            <button className="footer-link" onClick={handleOpenFaqModal}>{t('faqs')}</button>
            <a href="#/map" className="footer-link">{t('areaMap')}</a>
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
          <div className="footer-main-content">
            <div className="footer-logo">
              <img src={logoSimple} alt="Lokdis Logo" className="footer-logo-simple" />
              <div className="footer-logo-text">LOKDIS</div>
            </div>
            <div className="footer-download">
              <div className="footer-stores">
                <a href="https://play.google.com/store/" className="store-badge-footer">
                  <img src={require('../../assets/images/googleplay_icon.png')} alt="Google Play" width="60" height="60" />
                </a>
                <a href="https://www.apple.com/app-store/" className="store-badge-footer">
                  <img src={require('../../assets/images/applestore_icon.png')} alt="App Store" width="60" height="60" />
                </a>
              </div>
              <div className="footer-qr">
                <img src={qrCode} alt="QR Code" />
              </div>
            </div>
          </div>
          <div className="footer-copyright-row">
            <div className="footer-copyright">{t('copyright')}</div>
          </div>
        </div>
      </footer>
      <FaqModal isOpen={isFaqModalOpen} onClose={handleCloseFaqModal} />
      <AboutUsModal isOpen={isAboutUsModalOpen} onClose={handleCloseAboutUsModal} />
      <PrivacyPolicyModal isOpen={isPrivacyPolicyModalOpen} onClose={handleClosePrivacyPolicyModal} />
      <TermsConditionsModal isOpen={isTermsConditionsModalOpen} onClose={handleCloseTermsConditionsModal} />
      <DownloadAppModal isOpen={isDownloadModalOpen} onClose={handleCloseDownloadModal} />
    </div>
  );
};

export default PageView; 