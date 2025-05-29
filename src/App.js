import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import MainLayout from './layouts/MainLayout';
import HeroContent from './components/HeroContent';
import Moments from './components/Moments';
import Navbar from './components/Navbar';
import './styles/HeroContent.css';
import './styles/Navbar.css';
import { LanguageProvider } from './utils/i18n';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/moments" element={
            <>
              <Navbar />
              <Moments />
            </>
          } />
          <Route path="/" element={
            <MainLayout>
              <HeroContent />
            </MainLayout>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
