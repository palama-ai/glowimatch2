import React, { useEffect, useState } from 'react';

const SplashLoader = ({ isVisible, onComplete }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !shouldRender) return;

    // Fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Complete after fade animation
    const completeTimer = setTimeout(() => {
      setShouldRender(false);
      onComplete && onComplete();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [isVisible, shouldRender, onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 bg-white flex items-center justify-center z-[9999]"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out'
      }}
    >
      <h1
        className="text-6xl md:text-7xl font-bold tracking-tight"
        style={{ color: '#ec4899' }}
      >
        Glowimatch
      </h1>
    </div>
  );
};

export default SplashLoader;

