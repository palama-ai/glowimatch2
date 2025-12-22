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

    // Slower, smoother animation progress
    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Slower increment for smoother drawing
        return prev + 0.8;
      });
    }, 50);

    // Longer fade out for smoother transition
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 4000);

    const completeTimer = setTimeout(() => {
      setShouldRender(false);
      onComplete && onComplete();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [isVisible, shouldRender, onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-[9999]`}
      style={{
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-20 w-36 h-36 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center gap-8 z-10">
        {/* SVG Text with smooth drawing effect */}
        <svg
          width="550"
          height="120"
          viewBox="0 0 550 120"
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
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glowimatch text - outlined/hollow style with smooth drawing */}
          <text
            x="275"
            y="80"
            textAnchor="middle"
            style={{
              fontSize: '72px',
              fontWeight: 900,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fill: 'none',
              stroke: 'url(#textGradient)',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeDasharray: 1000,
              strokeDashoffset: 1000 - (1000 * animationProgress / 100),
              filter: 'url(#glow)',
              transition: 'stroke-dashoffset 0.1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Glowimatch
          </text>
        </svg>

        {/* Tagline with smooth fade in */}
        <p
          className="text-white/60 text-sm font-medium tracking-wide"
          style={{
            opacity: animationProgress > 60 ? 1 : 0,
            transform: animationProgress > 60 ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
          }}
        >
          Discover Your Perfect Skincare
        </p>

        {/* Progress dots with smooth animation */}
        <div
          className="flex gap-3"
          style={{
            opacity: animationProgress < 95 ? 1 : 0,
            transition: 'opacity 0.5s ease-out'
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: '#ec4899',
                animation: 'dotPulse 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default SplashLoader;
