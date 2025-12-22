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

    // Animate progress for stroke drawing effect
    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Fade out after animation completes
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    const completeTimer = setTimeout(() => {
      setShouldRender(false);
      onComplete && onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [isVisible, shouldRender, onComplete]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-[9999] transition-all duration-500 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-20 w-36 h-36 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center gap-8 z-10">
        {/* SVG Text with drawing effect */}
        <svg
          width="400"
          height="80"
          viewBox="0 0 400 80"
          className="overflow-visible"
        >
          <defs>
            {/* Gradient for the stroke */}
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glowimatch text - outlined/hollow style */}
          <text
            x="200"
            y="55"
            textAnchor="middle"
            className="splash-text"
            style={{
              fontSize: '52px',
              fontWeight: 900,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fill: 'none',
              stroke: 'url(#textGradient)',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeDasharray: 600,
              strokeDashoffset: 600 - (600 * animationProgress / 100),
              filter: 'url(#glow)',
              transition: 'stroke-dashoffset 0.04s ease-out'
            }}
          >
            Glowimatch
          </text>

          {/* Fill effect that appears after drawing completes */}
          {animationProgress >= 100 && (
            <text
              x="200"
              y="55"
              textAnchor="middle"
              style={{
                fontSize: '52px',
                fontWeight: 900,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fill: 'none',
                stroke: 'url(#textGradient)',
                strokeWidth: '2',
                opacity: 0,
                animation: 'fadeIn 0.5s ease-out forwards'
              }}
            >
              Glowimatch
            </text>
          )}
        </svg>

        {/* Tagline */}
        <p
          className="text-white/60 text-sm font-medium tracking-wide transition-opacity duration-500"
          style={{ opacity: animationProgress > 50 ? 1 : 0 }}
        >
          Discover Your Perfect Skincare
        </p>

        {/* Progress dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-pink-500/30"
              style={{
                animation: animationProgress < 100 ? 'pulse 1.5s ease-in-out infinite' : 'none',
                animationDelay: `${i * 0.2}s`,
                backgroundColor: animationProgress >= 100 ? '#ec4899' : undefined
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SplashLoader;
