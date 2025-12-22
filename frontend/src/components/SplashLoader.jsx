import React, { useEffect, useState } from 'react';

const SplashLoader = ({ isVisible, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !shouldRender) return;

    // Simple loading progress (0-100% over 1.5s)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 75);

    // Fade out and complete after 1.8s
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    const completeTimer = setTimeout(() => {
      setShouldRender(false);
      onComplete && onComplete();
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [isVisible, shouldRender, onComplete]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center z-[9999] transition-all duration-500 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-20 w-36 h-36 bg-rose-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center gap-10 z-10">
        {/* Logo Container */}
        <div className="relative flex items-center justify-center">
          {/* Glow effect */}
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 blur-2xl animate-pulse" />

          {/* Logo icon */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-2xl shadow-pink-500/30">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Sparkles icon */}
              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
              <path d="M19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
              <path d="M5 17l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
            </svg>
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
            Glowimatch
          </h1>

          {/* Underline */}
          <div className="flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-full" />
          </div>

          <p className="text-sm text-muted-foreground/80 font-medium">
            Discover Your Perfect Skincare
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashLoader;
