import React, { useState } from 'react';
import UserProfileModal from './UserProfileModal';

const UserProfileExample = ({ language = 'es' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleProfileComplete = (profileData) => {
    setUserProfile(profileData);
    console.log('Profile data:', profileData);
  };
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button 
        onClick={openModal}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3c145a',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        {language === 'es' ? 'Crear Perfil' : 'Create Profile'}
      </button>
      
      {userProfile && (
        <div style={{ marginTop: '20px' }}>
          <h3>{language === 'es' ? 'Perfil Creado' : 'Profile Created'}</h3>
          <p>{language === 'es' ? 'Alias' : 'Username'}: {userProfile.username}</p>
          <p>{language === 'es' ? 'Avatar' : 'Avatar'}: {userProfile.avatar}</p>
        </div>
      )}
      
      <UserProfileModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        language={language}
        onComplete={handleProfileComplete}
      />
    </div>
  );
};

export default UserProfileExample; 