import React from 'react';
import './styles/App.css';
import MainLayout from './layouts/MainLayout';
import HeroContent from './components/HeroContent';
import './styles/HeroContent.css';
import { LanguageProvider } from './utils/i18n';

function App() {
  return (
    <LanguageProvider>
      <MainLayout>
        <HeroContent />
      </MainLayout>
    </LanguageProvider>
  );
}

export default App;
