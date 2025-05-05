import React from 'react';
import { useLanguage } from '../utils/i18n';

function LokdisTitle() {
  const { t } = useLanguage();
  
  return (
    <h1 className="lokdis-title">{t('welcomeTitle')}</h1>
  );
}

export default LokdisTitle; 