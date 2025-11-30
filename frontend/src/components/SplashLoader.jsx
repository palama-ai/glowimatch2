import React, { useEffect, useState } from 'react';

const SplashLoader = ({ isVisible, onComplete }) => {
  const [stage, setStage] = useState('drawing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    // Stage 1: Drawing animation (0-1.2s)
    const drawingTimer = setTimeout(() => {
      setProgress(30);
    }, 100);

    // Stage 2: Coloring animation (1.2-2s)
    const coloringTimer = setTimeout(() => {
      setProgress(70);
      setStage('coloring');
    }, 1200);

    // Stage 3: Loading complete (2-2.8s)
    const loadingTimer = setTimeout(() => {
      setProgress(100);
      setStage('complete');
    }, 2000);

    // Stage 4: Fade out (2.8-3.8s)
    const fadeTimer = setTimeout(() => {
      onComplete && onComplete();
    }, 2800);

    return () => {
      clearTimeout(drawingTimer);
      clearTimeout(coloringTimer);
      clearTimeout(loadingTimer);
      clearTimeout(fadeTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const fadeOutClass = progress === 100 && stage === 'complete' ? 'opacity-0 scale-95' : 'opacity-100 scale-100';

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center z-[9999] transition-all duration-1000 ${fadeOutClass}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-20 w-36 h-36 bg-rose-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center gap-12 z-10">
        {/* Animated Logo Container */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Middle glow ring */}
          <div className="absolute inset-8 rounded-full border border-accent/10" />

          {/* Inner glow */}
          <div className="absolute inset-16 rounded-full bg-gradient-to-r from-accent/10 to-pink-500/10 blur-xl" />

          {/* SVG Logo */}
          <svg
            width="180"
            height="180"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-2xl relative z-10"
          >
            {/* Animated circle background */}
            <g>
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="url(#bgGradient)"
                opacity="0.1"
              />
            </g>

            {/* Letter "G" - Stroke */}
            <g className={`transition-all duration-500 ${progress >= 30 ? 'opacity-100' : 'opacity-0'}`}>
              <path
                d="M 70 75 Q 65 60 85 55 Q 105 50 110 70 Q 115 85 100 95 L 105 95"
                stroke="url(#gradientStroke)"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="200"
                strokeDashoffset="200"
                style={{
                  animation: progress >= 30 ? 'drawPath 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
                }}
              />
            </g>

            {/* Letter "G" - Fill */}
            <g className={`transition-all duration-700 ${progress >= 70 ? 'opacity-100' : 'opacity-0'}`}>
              <path
                d="M 70 75 Q 65 60 85 55 Q 105 50 110 70 Q 115 85 100 95 L 105 95"
                stroke="url(#gradientFill)"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Sparkle stars */}
            <g className={`transition-all duration-700 ${progress >= 70 ? 'opacity-100' : 'opacity-0'}`}>
              {/* Top sparkle */}
              <g style={{ animation: progress >= 70 ? 'twinkle 2s ease-in-out 0.2s infinite' : 'none' }}>
                <circle cx="100" cy="25" r="3" fill="url(#sparkleGradient)" />
                <line x1="100" y1="18" x2="100" y2="12" stroke="url(#sparkleGradient)" strokeWidth="2" strokeLinecap="round" />
                <line x1="107" y1="22" x2="112" y2="17" stroke="url(#sparkleGradient)" strokeWidth="2" strokeLinecap="round" />
                <line x1="93" y1="22" x2="88" y2="17" stroke="url(#sparkleGradient)" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Right sparkle */}
              <g style={{ animation: progress >= 70 ? 'twinkle 2s ease-in-out 0.4s infinite' : 'none' }}>
                <circle cx="155" cy="70" r="2.5" fill="url(#sparkleGradient)" />
                <line x1="162" y1="70" x2="168" y2="70" stroke="url(#sparkleGradient)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="158" y1="63" x2="162" y2="58" stroke="url(#sparkleGradient)" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Bottom left sparkle */}
              <g style={{ animation: progress >= 70 ? 'twinkle 2s ease-in-out 0.6s infinite' : 'none' }}>
                <circle cx="45" cy="150" r="2" fill="url(#sparkleGradient)" />
                <line x1="38" y1="150" x2="32" y2="150" stroke="url(#sparkleGradient)" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="1" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="gradientFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fb7185" stopOpacity="0.8" />
              </linearGradient>
              <radialGradient id="sparkleGradient">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
              </radialGradient>
              <radialGradient id="bgGradient">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Brand Text */}
        <div className="text-center space-y-4">
          <div className={`transition-all duration-700 ${progress >= 70 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <h1 className="text-6xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
              GlowMatch
            </h1>
          </div>

          {/* Underline */}
          <div className={`flex justify-center transition-all duration-700 ${progress >= 70 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transformOrigin: 'center' }}>
            <div className="h-1 w-32 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-full" />
          </div>

          <p className="text-sm text-muted-foreground/80 mt-3 font-medium tracking-wide">
            Discover Your Perfect Skincare Journey
          </p>
        </div>

        {/* Progress bar */}
        <div className={`w-64 h-1.5 bg-muted rounded-full overflow-hidden transition-opacity duration-500 ${progress === 100 ? 'opacity-0' : 'opacity-100'}`}>
          <div
            className="h-full bg-gradient-to-r from-accent via-pink-500 to-rose-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading text */}
        <div className={`transition-all duration-500 ${progress < 100 ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs text-muted-foreground/60 font-medium">
            {progress < 30 && 'Preparing your experience...'}
            {progress >= 30 && progress < 70 && 'Enhancing your look...'}
            {progress >= 70 && 'Almost ready...'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashLoader;
