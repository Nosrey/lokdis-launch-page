import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import MainLayout from './layouts/MainLayout';
import HeroContent from './components/HeroContent';
import MapPage from './pages/MapPage';

import Moments from './components/Moments';
import Navbar from './components/Navbar';
import PageView from './pages/MapPage/PageView';
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
          <Route path="/map" element={
            <>
              <Navbar />
              <MapPage />
            </>
          } />
          <Route path="map/:country" element={
            <>
              <Navbar />
              <PageView />
            </>
          } />
          <Route path="map/:country/:state" element={
            <>
              <Navbar />
              <PageView />
            </>
          } />
          <Route path="map/:country/:state/:area" element={
            <>
              <Navbar />
              <PageView />
            </>
          } />
          <Route path="map/:country/:state/:area/:page" element={
            <>
              <Navbar />
              <PageView />
            </>
          } />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
