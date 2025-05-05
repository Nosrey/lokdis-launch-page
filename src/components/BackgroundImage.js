import React from 'react';
import backgroundImage from '../assets/images/background.jpg';

function BackgroundImage() {
  return (
    <div className="background-image">
      <img 
        src={backgroundImage} 
        alt="Background" 
      />
    </div>
  );
}

export default BackgroundImage; 