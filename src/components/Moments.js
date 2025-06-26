import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../utils/i18n';
import '../styles/Moments.css';
import logoSimple from '../assets/images/logo_simple.png';
import qrCode from '../assets/images/qr-code.png';
import instagramIcon from '../assets/images/instagram_icon.png';
import tiktokIcon from '../assets/images/tiktok_icon.png';
import whatsappIcon from '../assets/images/whatsapp_icon.png';
import { database, authenticateAnonymously } from '../utils/firebase';
import { ref, get } from 'firebase/database';
import * as countryCoder from '@rapideditor/country-coder';
import FaqModal from './FaqModal'; // Import the FaqModal component
import AboutUsModal from './AboutUsModal'; // Import the AboutUsModal component
import PrivacyPolicyModal from './PrivacyPolicyModal'; // Import PrivacyPolicyModal
import TermsConditionsModal from './TermsConditionsModal'; // Import TermsConditionsModal

function Moments() {
  const { t, language } = useLanguage();
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedMoments, setGroupedMoments] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('');
  const [processingMoments, setProcessingMoments] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentMomentIndex, setCurrentMomentIndex] = useState(0);
  const [currentGroup, setCurrentGroup] = useState('');
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const MOMENTS_LIMIT = 12; // Límite de momentos a mostrar
  const INITIAL_MOMENTS_PER_GROUP = 6;

  const [visibleMomentsPerGroup, setVisibleMomentsPerGroup] = useState({});
  const [loadingMorePerGroup, setLoadingMorePerGroup] = useState({});

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false); // State for FAQ Modal
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false); // State for About Us Modal
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false); // State for Privacy Policy Modal
  const [isTermsConditionsModalOpen, setIsTermsConditionsModalOpen] = useState(false); // State for Terms & Conditions Modal

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const getLocalizedCountryName = (countryNameEn) => {
    if (language === 'es') {
      // Simple translation for common cases, expand as needed
      const translations = {
        "Spain": "España",
        "United States": "Estados Unidos",
        "United Kingdom": "Reino Unido",
        "France": "Francia",
        "Germany": "Alemania",
        "Italy": "Italia",
        // Add more translations as required
      };
      return translations[countryNameEn] || capitalizeFirstLetter(countryNameEn);
    }
    return capitalizeFirstLetter(countryNameEn);
  };

  const isPurelyNumeric = (str) => {
    if (typeof str !== 'string' || str.trim() === '') return false;
    // Check if the string consists only of digits after trimming
    return /^\d+$/.test(str.trim());
  };
  
  useEffect(() => {
    if (Object.keys(groupedMoments).length > 0) {
      const initialVisibility = {};
      Object.keys(groupedMoments).forEach(key => {
        if (groupedMoments[key] && groupedMoments[key].length > 0) {
          initialVisibility[key] = INITIAL_MOMENTS_PER_GROUP;
        }
      });
      setVisibleMomentsPerGroup(initialVisibility);
      setLoadingMorePerGroup({}); // Reset loading states when groups change
    }
  }, [groupedMoments]);

  const handleShowMore = (locationKey) => {
    setLoadingMorePerGroup(prev => ({ ...prev, [locationKey]: true }));
    setTimeout(() => {
      setVisibleMomentsPerGroup(prev => ({
        ...prev,
        [locationKey]: groupedMoments[locationKey]?.length || INITIAL_MOMENTS_PER_GROUP
      }));
      setLoadingMorePerGroup(prev => ({ ...prev, [locationKey]: false }));
    }, 750); // Simulate loading
  };

  // Obtener la ubicación del usuario basada en IP
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        setLoadingStep(t('loadingLocation'));
        setLoadingProgress(10);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const countryCode = countryCoder.iso1A2Code([longitude, latitude]);
              const countryName = countryCoder.feature([longitude, latitude])?.properties.nameEn || 'Unknown Country';
              
              if (countryCode && countryName) {
                setUserLocation({
                  country: countryName,
                  state: '', // State is not reliably available with this library, set to empty or handle differently
                  countryCode: countryCode,
                  city: '' // City is not provided by this library at country level
                });
                console.log('Ubicación del usuario (navegador + country-coder):', countryName, countryCode);
              } else {
                throw new Error('No se pudo determinar el país desde las coordenadas.');
              }
              setLoadingProgress(20);
            },
            (error) => {
              console.error('Error al obtener geolocalización del navegador:', error);
              // Fallback a ubicación predeterminada si falla la geolocalización
              setUserLocation({
                country: 'España', 
                state: 'Madrid',
                countryCode: 'ES',
                city: 'Madrid'
              });
              setLoadingProgress(20);
            }
          );
        } else {
          throw new Error('Geolocalización no soportada por este navegador.');
        }
      } catch (error) {
        console.error('Error al obtener ubicación del usuario:', error);
        setUserLocation({
          country: 'España', // Valor predeterminado
          state: 'Madrid',
          countryCode: 'ES',
          city: 'Madrid'
        });
        setLoadingProgress(20);
      }
    };
    
    getUserLocation();
  }, [t]);
  
  // Verificar si un momento ha expirado (según hora de Madrid)
  const hasExpired = (expirationDate) => {
    if (!expirationDate) return false; // Si no tiene fecha de expiración, no expira
    
    try {
      // Crear fecha de expiración
      const expDate = new Date(expirationDate);
      
      // Obtener fecha actual en hora de Madrid (UTC+1 o UTC+2 en verano)
      const madridOptions = { timeZone: 'Europe/Madrid' };
      const madridTimeStr = new Date().toLocaleString('en-US', madridOptions);
      const currentMadridTime = new Date(madridTimeStr);
      
      // Comparar fechas
      return currentMadridTime > expDate;
    } catch (error) {
      console.error('Error al verificar expiración:', error);
      return false; // En caso de error, asumimos que no ha expirado
    }
  };
  
  // Función para obtener información de ubicación (país/estado) a partir de coordenadas
  const getLocationInfo = async (latitude, longitude) => {
    try {
      const countryCode = countryCoder.iso1A2Code([longitude, latitude]);
      const countryName = countryCoder.feature([longitude, latitude])?.properties.nameEn;

      if (countryName && countryCode) {
        return {
          country: countryName,
          state: '', // State is not reliably provided by country-coder for this purpose
          countryCode: countryCode,
          fullAddress: countryName // Or construct as needed
        };
      } else {
        // Fallback if country-coder doesn't return a result
        console.warn(`country-coder no pudo determinar el país para ${latitude}, ${longitude}`);
        return {
          country: 'Desconocido',
          state: 'Desconocido',
          countryCode: 'XX',
          fullAddress: 'Ubicación desconocida'
        };
      }
    } catch (error) {
      console.error('Error en country-coder getLocationInfo:', error);
      return {
        country: 'Desconocido',
        state: 'Desconocido',
        countryCode: 'XX',
        fullAddress: 'Error obteniendo ubicación'
      };
    }
  };
  
  // Calcular la distancia entre dos puntos usando la fórmula haversine
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distancia en km
    return distance;
  };

  // Función para agrupar momentos por ubicación, priorizando la ubicación del usuario
  const groupMomentsByLocation = async (momentsArray) => {
    if (!userLocation) {
      console.log('Esperando ubicación del usuario...');
      return []; // Si no tenemos ubicación del usuario, esperamos
    }
    
    setProcessingMoments(true);
    setLoadingStep(t('filteringMoments'));
    setLoadingProgress(40);
    
    // Dividir momentos en expirados y no expirados
    const nonExpiredMoments = momentsArray.filter(moment => !hasExpired(moment.expirationDate));
    const expiredMoments = momentsArray.filter(moment => hasExpired(moment.expirationDate));
    
    // Ordenar momentos expirados por tiempo de expiración (los más recientes primero)
    expiredMoments.sort((a, b) => {
      const dateA = a.expirationDate ? new Date(a.expirationDate) : new Date(0);
      const dateB = b.expirationDate ? new Date(b.expirationDate) : new Date(0);
      return dateB - dateA; // Los que menos tiempo llevan expirados primero
    });
    
    console.log(`Momentos no expirados: ${nonExpiredMoments.length} de ${momentsArray.length}`);
    
    // Si no hay suficientes momentos no expirados, añadir algunos expirados
    let momentsToProcess = [...nonExpiredMoments];
    if (nonExpiredMoments.length < MOMENTS_LIMIT && expiredMoments.length > 0) {
      const needToAdd = MOMENTS_LIMIT - nonExpiredMoments.length;
      const additionalMoments = expiredMoments.slice(0, needToAdd);
      console.log(`Añadiendo ${additionalMoments.length} momentos expirados para completar ${MOMENTS_LIMIT}`);
      momentsToProcess = [...nonExpiredMoments, ...additionalMoments];
    }
    
    setLoadingProgress(45);
    setLoadingStep(t('calculatingDistance'));
    
    // Obtener coordenadas del usuario si es posible
    let userLatitude = null;
    let userLongitude = null;
    
    try {
      // Intentar obtener coordenadas del usuario a partir de su ubicación
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(userLocation.country)}&state=${encodeURIComponent(userLocation.state)}&format=json&limit=1`);
      const geoData = await geoResponse.json();
      
      if (geoData && geoData.length > 0) {
        userLatitude = parseFloat(geoData[0].lat);
        userLongitude = parseFloat(geoData[0].lon);
        console.log(`Coordenadas del usuario obtenidas: ${userLatitude}, ${userLongitude}`);
      }
    } catch (error) {
      console.error('Error al obtener coordenadas del usuario:', error);
    }
    
    // Si no se pudieron obtener coordenadas, usar valores por defecto
    if (userLatitude === null || userLongitude === null) {
      console.log('Usando coordenadas por defecto para el usuario');
      // Usar el centro de España como punto por defecto
      userLatitude = 40.4168;
      userLongitude = -3.7038;
    }
    
    // Calcular distancia para cada momento que tenga coordenadas
    const momentsWithDistance = momentsToProcess.map(moment => {
      if (moment.latitude && moment.longitude) {
        const distance = calculateDistance(
          userLatitude, 
          userLongitude, 
          moment.latitude, 
          moment.longitude
        );
        return { ...moment, distance };
      } else {
        // Si no tiene coordenadas, asignar distancia muy grande (999999 km)
        return { ...moment, distance: 999999 };
      }
    });
    
    // Ordenar momentos por distancia (los más cercanos primero)
    momentsWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Tomar los 12 más cercanos
    const closestMoments = momentsWithDistance.slice(0, MOMENTS_LIMIT);
    
    setLoadingProgress(50);
    setLoadingStep(t('groupingMoments'));
    
    const groupedData = {};
    
    // Categorías de agrupación
    const userCountry = userLocation.country;
    const otherCountries = t('otherCountries');
    
    // Inicializar grupos
    groupedData[userCountry] = [];
    groupedData[otherCountries] = [];
    
    // Separar momentos con coordenadas y sin coordenadas
    const momentsWithCoords = closestMoments.filter(moment => moment.latitude && moment.longitude);
    const momentsWithoutCoords = closestMoments.filter(moment => !moment.latitude || !moment.longitude);
    
    // Procesar primero los momentos sin coordenadas (no requieren geolocalización)
    momentsWithoutCoords.forEach(moment => {
      groupedData[otherCountries].push(moment);
    });
    
    // Actualizar grupos en tiempo real con los momentos sin coordenadas
    if (momentsWithoutCoords.length > 0) {
      const currentGroups = { ...groupedData };
      Object.keys(currentGroups).forEach(key => {
        if (currentGroups[key].length === 0) {
          delete currentGroups[key];
        }
      });
      setGroupedMoments(currentGroups);
    }
    
    // Definir el tamaño del lote para procesamiento en paralelo
    const BATCH_SIZE = 3; // Procesar 3 solicitudes a la vez
    const batches = [];
    
    // Dividir los momentos con coordenadas en lotes
    for (let i = 0; i < momentsWithCoords.length; i += BATCH_SIZE) {
      batches.push(momentsWithCoords.slice(i, i + BATCH_SIZE));
    }
    
    // Procesar los lotes secuencialmente, pero los momentos dentro de cada lote en paralelo
    const processedMoments = [...momentsWithoutCoords];
    const progressPerBatch = 40 / Math.max(batches.length, 1);
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      setLoadingStep(t('processingCoordinates') + ` (${processedMoments.length}/${MOMENTS_LIMIT})`);
      
      try {
        // Procesar el lote actual en paralelo
        const batchPromises = batch.map(moment => 
          getLocationInfo(moment.latitude, moment.longitude)
            .then(locationInfo => {
              // Determinar en qué grupo va este momento
              if (locationInfo.country === userLocation.country) {
                // Mismo país que el usuario
                return { ...moment, locationInfo, group: userCountry };
              } else {
                // Diferente país
                return { ...moment, locationInfo, group: otherCountries };
              }
            })
        );
        
        // Esperar a que todas las promesas del lote se completen
        const resolvedMoments = await Promise.all(batchPromises);
        
        // Agregar los momentos a sus respectivos grupos
        resolvedMoments.forEach(moment => {
          groupedData[moment.group].push(moment);
          processedMoments.push(moment);
        });
        
        // Actualizar grupos en tiempo real
        const currentGroups = { ...groupedData };
        Object.keys(currentGroups).forEach(key => {
          if (currentGroups[key].length === 0) {
            delete currentGroups[key];
          }
        });
        setGroupedMoments(currentGroups);
        
        // Actualizar progreso
        setLoadingProgress(55 + (batchIndex + 1) * progressPerBatch);
        
        // Pequeña pausa entre lotes para no sobrecargar la API
        if (batchIndex < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error('Error procesando lote de coordenadas:', error);
      }
    }
    
    const MIN_MOMENTS_PER_GROUP = 2;

    // 1. Asegurar mínimo en "Otros países"
    if (groupedData[otherCountries].length < MIN_MOMENTS_PER_GROUP) {
      const neededForOtherCountries = MIN_MOMENTS_PER_GROUP - groupedData[otherCountries].length;
      let canMoveFromUserCountry = Math.max(0, groupedData[userCountry].length - MIN_MOMENTS_PER_GROUP);
      let momentsToMoveCount = Math.min(neededForOtherCountries, canMoveFromUserCountry);

      if (momentsToMoveCount > 0) {
        console.log(`Moviendo ${momentsToMoveCount} momentos de '${userCountry}' a '${otherCountries}'`);
        const momentsToMove = groupedData[userCountry]
          .sort((a, b) => (b.distance || 999999) - (a.distance || 999999)) // Mover los más lejanos primero
          .slice(0, momentsToMoveCount);
        
        groupedData[userCountry] = groupedData[userCountry].filter(m => !momentsToMove.some(tm => tm.id === m.id));
        groupedData[otherCountries] = [...groupedData[otherCountries], ...momentsToMove];
      }

      // Si aún no es suficiente para "Otros países", añadir expirados genéricos
      if (groupedData[otherCountries].length < MIN_MOMENTS_PER_GROUP) {
        const stillNeededForOthers = MIN_MOMENTS_PER_GROUP - groupedData[otherCountries].length;
        const usedIds = new Set(processedMoments.map(m => m.id));
        const additionalExpired = expiredMoments
          .filter(m => !usedIds.has(m.id))
          .slice(0, stillNeededForOthers);

        if (additionalExpired.length > 0) {
          console.log(`Añadiendo ${additionalExpired.length} momentos expirados adicionales a '${otherCountries}'`);
          additionalExpired.forEach(m => groupedData[otherCountries].push({ ...m, group: otherCountries, locationInfo: { country: 'Desconocido', state: 'Desconocido'} }));
        }
      }
    }

    // 2. Asegurar mínimo en el país del usuario
    if (groupedData[userCountry].length < MIN_MOMENTS_PER_GROUP) {
      const neededForUserCountry = MIN_MOMENTS_PER_GROUP - groupedData[userCountry].length;
      const usedIds = new Set(processedMoments.map(m => m.id).concat(groupedData[otherCountries].map(m => m.id)));
      const potentialExpired = expiredMoments.filter(m => !usedIds.has(m.id));
      let addedCount = 0;

      console.log(`Intentando añadir ${neededForUserCountry} momentos expirados a '${userCountry}'`);
      for (const moment of potentialExpired) {
        if (addedCount >= neededForUserCountry) break;
        if (moment.latitude && moment.longitude) {
          try {
            const locationInfo = await getLocationInfo(moment.latitude, moment.longitude);
            if (locationInfo.country === userLocation.country) {
              console.log(`Añadiendo momento expirado ${moment.id} a '${userCountry}'`);
              groupedData[userCountry].push({ ...moment, locationInfo, group: userCountry });
              addedCount++;
            }
          } catch (error) {
            console.error(`Error geolocalizando momento expirado ${moment.id} para '${userCountry}':`, error);
          }
        }
      }
    }
    
    // Ordenar momentos dentro de cada grupo por fecha (más recientes primero)
    Object.keys(groupedData).forEach(key => {
      if (groupedData[key].length > 0) {
        groupedData[key].sort((a, b) => {
          return new Date(b.datetime) - new Date(a.datetime);
        });
      }
    });
    
    // Eliminar grupos vacíos del resultado final
    Object.keys(groupedData).forEach(key => {
      if (groupedData[key].length === 0) {
        delete groupedData[key];
      }
    });
    
    setLoadingProgress(95);
    setProcessingMoments(false);
    setLoadingStep(t('finishingUp'));
    
    return processedMoments;
  };
  
  useEffect(() => {
    // Función para obtener momentos y usuarios de Firebase en una operación
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Esperar a tener la ubicación del usuario
        if (!userLocation) {
          console.log('Esperando a obtener la ubicación del usuario...');
          return; // Salir y esperar a que userLocation se establezca
        }
        
        // Autenticarse anónimamente
        setLoadingStep(t('authenticating'));
        setLoadingProgress(25);
        await authenticateAnonymously();
        console.log("Autenticación anónima completada, obteniendo datos...");
        
        // Obtener todos los momentos y usuarios en una sola operación
        setLoadingStep(t('loadingData'));
        setLoadingProgress(30);
        const dbRef = ref(database);
        const snapshot = await get(dbRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedMoments = [];
          const usersData = data.users || {};
          
          // Procesar los datos de momentos
          setLoadingStep(t('processingData'));
          setLoadingProgress(35);
          
          if (data.moments) {
            Object.keys(data.moments).forEach(userId => {
              const userMoments = data.moments[userId];
              // Obtener el nombre del usuario si existe
              const userName = usersData[userId]?.name || 
                              usersData[userId]?.displayName || 
                              'Usuario';
              
              Object.keys(userMoments).forEach(momentId => {
                const moment = userMoments[momentId];
                if (moment && moment.imageUrl) {
                  formattedMoments.push({
                    id: momentId,
                    userId: userId,
                    address: moment.address || '',
                    datetime: moment.datetime || '',
                    imageUrl: moment.imageUrl || '',
                    name: moment.name || userName,
                    latitude: moment.latitude || null,
                    longitude: moment.longitude || null,
                    expirationDate: moment.expirationDate || null,
                    ...moment
                  });
                }
              });
            });
          }
          
          // Ordenar por fecha (más recientes primero)
          formattedMoments.sort((a, b) => {
            return new Date(b.datetime) - new Date(a.datetime);
          });
          
          // Filtrar expirados y agrupar por ubicación del usuario
          const processedMomentsData = await groupMomentsByLocation(formattedMoments);
          setMoments(processedMomentsData);
          console.log(`Moments loaded and filtered: ${processedMomentsData.length}`);
          
          setLoadingProgress(100);
          setTimeout(() => {
            setLoading(false);
          }, 500); // Pequeño retraso para que se vea el 100%
          
        } else {
          console.log("No data found");
          setError("No se encontraron datos disponibles");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al cargar datos: " + error.message);
        setLoading(false);
      }
    };
    
    if (userLocation) {
      fetchData();
    }
  }, [userLocation, t]); // Ejecutar cuando se obtenga la ubicación del usuario

  // Función para formatear la fecha
  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr.split('+')[0].trim());
      const formattedDate = date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${formattedDate} ${hours}:${minutes}h`;
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateTimeStr;
    }
  };
  
  // Componente para el skeleton loader de un momento
  const MomentSkeleton = () => (
    <div className="moment-card skeleton">
      <div className="moment-thumbnail skeleton-thumbnail">
        <div className="moment-overlay skeleton-overlay">
          <div className="moment-location skeleton-text"></div>
          <div className="moment-date skeleton-text skeleton-text-short"></div>
          <div className="moment-username skeleton-text skeleton-text-short"></div>
        </div>
      </div>
    </div>
  );
  
  // Función para abrir el modal con una imagen o video
  const openModal = (moment, groupKey, index) => {
    setSelectedMedia(moment);
    setCurrentGroup(groupKey);
    setCurrentMomentIndex(index);
    setModalOpen(true);
    
    // Evitar scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  };
  
  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedia(null);
    setCurrentGroup('');
    setCurrentMomentIndex(0);
    
    // Reestablecer scroll del body
    document.body.style.overflow = 'auto';
    
    // Pausar video si está reproduciéndose
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };
  
  // Función para navegar al momento anterior
  const goToPreviousMoment = (e) => {
    e.stopPropagation(); // Prevenir que el click cierre el modal
    
    if (currentGroup && groupedMoments[currentGroup]) {
      const groupMoments = groupedMoments[currentGroup];
      let newIndex = currentMomentIndex - 1;
      
      // Si estamos en el primer momento, ir al último
      if (newIndex < 0) {
        newIndex = groupMoments.length - 1;
      }
      
      // Actualizar el momento seleccionado
      setSelectedMedia(groupMoments[newIndex]);
      setCurrentMomentIndex(newIndex);
      
      // Pausar video si está reproduciéndose
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  };
  
  // Función para navegar al momento siguiente
  const goToNextMoment = (e) => {
    e.stopPropagation(); // Prevenir que el click cierre el modal
    
    if (currentGroup && groupedMoments[currentGroup]) {
      const groupMoments = groupedMoments[currentGroup];
      let newIndex = currentMomentIndex + 1;
      
      // Si estamos en el último momento, volver al primero
      if (newIndex >= groupMoments.length) {
        newIndex = 0;
      }
      
      // Actualizar el momento seleccionado
      setSelectedMedia(groupMoments[newIndex]);
      setCurrentMomentIndex(newIndex);
      
      // Pausar video si está reproduciéndose
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  };
  
  // Detectar click fuera del modal para cerrarlo
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('media-modal-overlay')) {
      closeModal();
    }
  };
  
  // Detectar tecla Escape para cerrar el modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [modalOpen]);
  
  // Función para manejar el evento de buffering del video
  const handleVideoWaiting = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }, 1500);
    }
  };

  // Componente para mostrar la imagen o video en el modal
  const MediaContent = ({ media }) => {
    const isVideo = media.mediaUrl && (
      media.mediaUrl.includes('.mp4') || 
      media.mediaUrl.includes('.mov') || 
      media.mediaUrl.includes('.webm') ||
      media.mediaType === 'video'
    );
    
    // Updated logic for displayLocation in Modal
    let displayLocationInModal = '';
    const localizedCountry = media.locationInfo?.country ? getLocalizedCountryName(media.locationInfo.country) : '';
    const fullAddress = media.address ? media.address.trim() : '';

    if (localizedCountry && fullAddress) {
      displayLocationInModal = `${localizedCountry}, ${fullAddress}`;
    } else if (localizedCountry) {
      displayLocationInModal = localizedCountry;
    } else if (fullAddress) {
      displayLocationInModal = fullAddress;
    } else {
      displayLocationInModal = t('unknownLocation');
    }
    
    useEffect(() => {
      if (isVideo && videoRef.current) {
        videoRef.current.muted = isMuted;
      }
    }, [isVideo]);
    
    if (isVideo) {
      return (
        <div className="media-content-container">
          <video 
            ref={videoRef}
            controls 
            autoPlay 
            playsInline
            muted={isMuted}
            className="media-content video"
            src={media.mediaUrl || media.imageUrl}
            onWaiting={handleVideoWaiting}
            onVolumeChange={() => {
              if (videoRef.current) {
                setIsMuted(videoRef.current.muted);
              }
            }}
          />
          <div className="media-info">
            <div className="media-location media-location-modal-custom-size">
              {displayLocationInModal}
            </div>
            <div className="media-date">{formatDateTime(media.datetime)}</div>
            <div className="media-user">{t('capturedBy')} {media.name}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="media-content-container">
          <img 
            src={media.mediaUrl || media.imageUrl} 
            alt={media.name || 'Lokdis moment'} 
            className="media-content image"
          />
          <div className="media-info">
            <div className="media-location media-location-modal-custom-size">
              {displayLocationInModal}
            </div>
            <div className="media-date">{formatDateTime(media.datetime)}</div>
            <div className="media-user">{t('capturedBy')} {media.name}</div>
          </div>
        </div>
      );
    }
  };
  
  const handleOpenFaqModal = () => {
    setIsFaqModalOpen(true);
  };

  const handleCloseFaqModal = () => {
    setIsFaqModalOpen(false);
  };

  const handleOpenAboutUsModal = () => { // Handler for About Us Modal
    setIsAboutUsModalOpen(true);
  };

  const handleCloseAboutUsModal = () => { // Handler for About Us Modal
    setIsAboutUsModalOpen(false);
  };

  const handleOpenPrivacyPolicyModal = () => { // Handler for Privacy Policy Modal
    setIsPrivacyPolicyModalOpen(true);
  };

  const handleClosePrivacyPolicyModal = () => { // Handler for Privacy Policy Modal
    setIsPrivacyPolicyModalOpen(false);
  };

  const handleOpenTermsConditionsModal = () => { // Handler for Terms & Conditions Modal
    setIsTermsConditionsModalOpen(true);
  };

  const handleCloseTermsConditionsModal = () => { // Handler for Terms & Conditions Modal
    setIsTermsConditionsModalOpen(false);
  };

  return (
    <div className="moments-page">
      {/* Sección principal con fondo */}
      <div className="moments-hero-section">
        <div className="moments-background"></div>
        <div className="moments-content">
          <h1 className="moments-title">{t('momentsTitle', { countryName: userLocation?.country || 'Zaragoza' })}</h1>
          <p className="moments-subtitle moments-hero-text-justified" dangerouslySetInnerHTML={{ __html: t('momentsHeroText') }}></p>
          <button className="moments-button">{t('momentsButton')}</button>
        </div>
      </div>
      
      {/* Sección blanca azulada */}
      <div className="moments-white-section">
        <div className="moments-gallery-container">
          <h2 className="moments-subtitle-left">{t('exploreMoments')}</h2>
          
          {/* Indicador de carga con progreso */}
          {loading && (
            <div className="moments-loading-container">
              <div className="moments-loading">{loadingStep}</div>
              <div className="progress-circular-container">
                <div className="progress-circular">
                  <svg viewBox="0 0 100 100">
                    <circle 
                      className="progress-circular-bg" 
                      cx="50" 
                      cy="50" 
                      r="40"
                    />
                    <circle 
                      className="progress-circular-fill" 
                      cx="50" 
                      cy="50" 
                      r="40"
                      style={{
                        strokeDashoffset: 251.2 * (1 - loadingProgress / 100)
                      }}
                    />
                  </svg>
                  <div className="progress-percentage">{Math.round(loadingProgress)}%</div>
                </div>
              </div>
            </div>
          )}
          
          {error && <div className="moments-error">{error}</div>}
          
          {/* Momentos agrupados por ubicación */}
          {!loading && !error && Object.keys(groupedMoments).length === 0 && (
            <div className="moments-message">No se encontraron momentos activos</div>
          )}
          
          {userLocation && groupedMoments[userLocation.country] && (
            <div key={userLocation.country} className="location-group">
              <h3 className="location-title">{userLocation.country}</h3>
              <div className="moments-grid">
                {groupedMoments[userLocation.country]
                  .slice(0, visibleMomentsPerGroup[userLocation.country] || INITIAL_MOMENTS_PER_GROUP)
                  .map((moment, index) => {
                    // New address formatting logic for preview
                    const countryName = moment.locationInfo?.country ? getLocalizedCountryName(moment.locationInfo.country) : '';
                    let truncatedAddress = '';

                    if (moment.address) {
                      const parts = moment.address.split(',').map(p => p.trim()).filter(p => p); // Filter out empty strings

                      if (parts.length === 0) {
                        truncatedAddress = '';
                      } else if (parts.length === 1) {
                        truncatedAddress = parts[0];
                      } else { // parts.length >= 2
                        let chosenPair = parts.slice(0, 2).join(', '); // Default to first two
                        for (let i = 0; i < parts.length - 1; i++) {
                          const part1 = parts[i];
                          const part2 = parts[i+1];
                          if (isPurelyNumeric(part1) && isPurelyNumeric(part2)) {
                            if (i + 2 < parts.length) { // If there's a next pair to check
                              chosenPair = parts.slice(i + 1, i + 3).join(', ');
                              // Continue to check the next pair
                            } else {
                              // This is the last possible pair, and it's numeric. Use it.
                              chosenPair = [part1, part2].join(', ');
                              break; 
                            }
                          } else {
                            // Found a pair that's not purely numeric. Use this one.
                            chosenPair = [part1, part2].join(', ');
                            break;
                          }
                        }
                        truncatedAddress = chosenPair;
                      }
                    }

                    let finalDisplayAddressPreview = '';
                    if (countryName && truncatedAddress) {
                      finalDisplayAddressPreview = `${countryName}, ${truncatedAddress}`;
                    } else if (countryName) {
                      finalDisplayAddressPreview = countryName;
                    } else if (truncatedAddress) {
                      finalDisplayAddressPreview = truncatedAddress;
                    } else {
                      finalDisplayAddressPreview = t('unknownLocation'); // Fallback
                    }

                    return (
                      <div 
                        key={moment.id || `moment-${userLocation.country}-item-${index}`} 
                        className="moment-card"
                        onClick={() => openModal(moment, userLocation.country, index)}
                      >
                        <div 
                          className="moment-thumbnail" 
                          style={{ backgroundImage: `url(${moment.imageUrl})` }}
                        >
                          <div className="moment-overlay">
                            <div className="moment-location">
                              {finalDisplayAddressPreview}
                            </div>
                            <div className="moment-date">
                              {moment.datetime ? formatDateTime(moment.datetime) : ''}
                            </div>
                            <div className="moment-username">{moment.name || ''}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {/* Render skeletons if loading and not enough real moments */}
                {loading && 
                  Array(Math.max(0, (visibleMomentsPerGroup[userLocation.country] || INITIAL_MOMENTS_PER_GROUP) - (groupedMoments[userLocation.country]?.length || 0)))
                    .fill(null)
                    .map((_, index) => (
                      <MomentSkeleton key={`skeleton-${userLocation.country}-dyn-${index}`} />
                    ))}
              </div>
              {loadingMorePerGroup[userLocation.country] && (
                <div className="loading-more-indicator">{t('loadingMore') || 'Cargando más...'}</div>
              )}
              {!loadingMorePerGroup[userLocation.country] && 
                groupedMoments[userLocation.country].length > (visibleMomentsPerGroup[userLocation.country] || INITIAL_MOMENTS_PER_GROUP) && (
                <button className="show-more-button" onClick={() => handleShowMore(userLocation.country)}>
                  {t('showMore') || 'Mostrar más'}
                </button>
              )}
              
              {/* Texto promocional después del grupo del país del usuario */}
              <div className="promo-section">
                <h2 className="promo-title">{t('promoTitle')}</h2>
                <p className="promo-subtitle">{t('promoSubtitle')}</p>
                <p className="promo-description" dangerouslySetInnerHTML={{ __html: t('promoDescription') }}></p>
                <h3 className="promo-discover">{t('promoDiscover')}</h3>
              </div>
            </div>
          )}
          
          {groupedMoments[t('otherCountries')] && (
            <div key={t('otherCountries')} className="location-group">
              <h3 className="location-title">{t('otherCountries')}</h3>
              <div className="moments-grid">
                {groupedMoments[t('otherCountries')]
                  .slice(0, visibleMomentsPerGroup[t('otherCountries')] || INITIAL_MOMENTS_PER_GROUP)
                  .map((moment, index) => {
                    // New address formatting logic for preview
                    const countryName = moment.locationInfo?.country ? getLocalizedCountryName(moment.locationInfo.country) : '';
                    let truncatedAddress = '';

                    if (moment.address) {
                      const parts = moment.address.split(',').map(p => p.trim()).filter(p => p); // Filter out empty strings

                      if (parts.length === 0) {
                        truncatedAddress = '';
                      } else if (parts.length === 1) {
                        truncatedAddress = parts[0];
                      } else { // parts.length >= 2
                        let chosenPair = parts.slice(0, 2).join(', '); // Default to first two
                        for (let i = 0; i < parts.length - 1; i++) {
                          const part1 = parts[i];
                          const part2 = parts[i+1];
                          if (isPurelyNumeric(part1) && isPurelyNumeric(part2)) {
                            if (i + 2 < parts.length) { // If there's a next pair to check
                              chosenPair = parts.slice(i + 1, i + 3).join(', ');
                              // Continue to check the next pair
                            } else {
                              // This is the last possible pair, and it's numeric. Use it.
                              chosenPair = [part1, part2].join(', ');
                              break; 
                            }
                          } else {
                            // Found a pair that's not purely numeric. Use this one.
                            chosenPair = [part1, part2].join(', ');
                            break;
                          }
                        }
                        truncatedAddress = chosenPair;
                      }
                    }

                    let finalDisplayAddressPreview = '';
                    if (countryName && truncatedAddress) {
                      finalDisplayAddressPreview = `${countryName}, ${truncatedAddress}`;
                    } else if (countryName) {
                      finalDisplayAddressPreview = countryName;
                    } else if (truncatedAddress) {
                      finalDisplayAddressPreview = truncatedAddress;
                    } else {
                      finalDisplayAddressPreview = t('unknownLocation'); // Fallback
                    }

                    return (
                      <div 
                        key={moment.id || `moment-${t('otherCountries')}-item-${index}`} 
                        className="moment-card"
                        onClick={() => openModal(moment, t('otherCountries'), index)}
                      >
                        <div 
                          className="moment-thumbnail" 
                          style={{ backgroundImage: `url(${moment.imageUrl})` }}
                        >
                          <div className="moment-overlay">
                            <div className="moment-location">
                              {finalDisplayAddressPreview}
                            </div>
                            <div className="moment-date">
                              {moment.datetime ? formatDateTime(moment.datetime) : ''}
                            </div>
                            <div className="moment-username">{moment.name || ''}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {/* Render skeletons if loading and not enough real moments */}
                {loading && 
                  Array(Math.max(0, (visibleMomentsPerGroup[t('otherCountries')] || INITIAL_MOMENTS_PER_GROUP) - (groupedMoments[t('otherCountries')]?.length || 0)))
                    .fill(null)
                    .map((_, index) => (
                      <MomentSkeleton key={`skeleton-${t('otherCountries')}-dyn-${index}`} />
                    ))}
              </div>
              {loadingMorePerGroup[t('otherCountries')] && (
                <div className="loading-more-indicator">{t('loadingMore') || 'Cargando más...'}</div>
              )}
              {!loadingMorePerGroup[t('otherCountries')] && 
                groupedMoments[t('otherCountries')].length > (visibleMomentsPerGroup[t('otherCountries')] || INITIAL_MOMENTS_PER_GROUP) && (
                <button className="show-more-button" onClick={() => handleShowMore(t('otherCountries'))}>
                  {t('showMore')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para ver imagen/video */}
      {modalOpen && selectedMedia && (
        <div 
          className="media-modal-overlay" 
          onClick={handleOutsideClick}
        >
          <div className="media-modal">
            <button 
              className="modal-close-btn"
              onClick={closeModal}
              aria-label="Cerrar"
            >
              ×
            </button>
            
            {/* Botón para navegación anterior */}
            <button 
              className="modal-nav-btn modal-nav-prev"
              onClick={goToPreviousMoment}
              aria-label={t('previousMoment')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            {/* Botón para navegación siguiente */}
            <button 
              className="modal-nav-btn modal-nav-next"
              onClick={goToNextMoment}
              aria-label={t('nextMoment')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            
            <MediaContent media={selectedMedia} />
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="moments-footer-container">
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
                        src={require('../assets/images/googleplay_icon.png')} 
                        alt="Google Play" 
                        width="60" 
                        height="60" 
                      />
                    </a>
                    <a href="https://www.apple.com/app-store/" className="store-badge-footer">
                      <img 
                        src={require('../assets/images/applestore_icon.png')} 
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

      {/* FAQ Modal */}
      <FaqModal 
        isOpen={isFaqModalOpen} 
        onClose={handleCloseFaqModal} 
        language={language}
      />

      {/* About Us Modal */}
      <AboutUsModal
        isOpen={isAboutUsModalOpen}
        onClose={handleCloseAboutUsModal}
        language={language}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyModalOpen}
        onClose={handleClosePrivacyPolicyModal}
        language={language}
      />

      {/* Terms & Conditions Modal */}
      <TermsConditionsModal
        isOpen={isTermsConditionsModalOpen}
        onClose={handleCloseTermsConditionsModal}
        language={language}
      />
    </div>
  );
}

export default Moments; 