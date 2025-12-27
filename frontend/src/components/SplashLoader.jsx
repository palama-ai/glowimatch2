import React, { useEffect, useState } from 'react';

const SplashLoader = ({ isVisible, onComplete }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [fadeOut, setFadeOut] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !shouldRender) return;

    // Animate drawing progress
    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);

    // Fade out after drawing complete
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    // Complete after fade
    const completeTimer = setTimeout(() => {
      setShouldRender(false);
      onComplete && onComplete();
    }, 3500);

    return () => {
      clearInterval(interval);
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
      <svg
        width="400"
        height="100"
        viewBox="0 0 400 100"
        className="overflow-visible"
      >
        {/* Hollow/Outline Glowimatch text with drawing animation */}
        <text
          x="200"
          y="70"
          textAnchor="middle"
          style={{
            fontSize: '56px',
            fontWeight: 800,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fill: 'none',
            stroke: '#ec4899',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeDasharray: 800,
            strokeDashoffset: 800 - (800 * animationProgress / 100),
            transition: 'stroke-dashoffset 0.05s ease-out'
          }}
        >
          Glowimatch
        </text>
      </svg>
    </div>
  );
};

export default SplashLoader;

