import React, { useState, useEffect } from 'react';
import animatedBackground from '../assets/images/background-animated.gif';
import staticBackground from '../assets/images/background.jpg';

function BackgroundImage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Handle the gif loading state
  useEffect(() => {
    const img = new Image();
    img.src = animatedBackground;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
  }, []);
  
  return (
    <div className="background-image" style={{position: 'relative', width: '100%', height: '100%'}}>
      {!hasError ? (
        <img 
          src={animatedBackground} 
          alt="Animated Background" 
          style={{ 
            display: isLoaded ? 'block' : 'none',
            filter: 'blur(4px)',
            transform: 'scale(1.05)' // Slightly scale up to avoid blur edges
          }}
        />
      ) : null}
      {/* Fallback: solo mientras el gif no cargue */}
      {(!isLoaded || hasError) && (
        <>
          <img 
            src={staticBackground} 
            alt="Background" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(18,5,41,0.5)',
            zIndex: 2
          }} />
        </>
      )}
    </div>
  );
}

export default BackgroundImage; 