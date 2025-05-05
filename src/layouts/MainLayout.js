import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Navbar.css';
import BackgroundImage from '../components/BackgroundImage';
import { useLanguage } from '../utils/i18n';

function MainLayout({ children }) {
  const { t } = useLanguage();
  
  return (
    <div className="App">
      {/* Fondo y overlay */}
      <div className="background-wrapper">
        <BackgroundImage />
        <div className="background-gradient"></div>
      </div>
      
      {/* Barra de navegación */}
      <Navbar />
      
      {/* Sección principal hero */}
      <div className="lokdis-container">
        {children}
      </div>
    </div>
  );
}

export default MainLayout; 