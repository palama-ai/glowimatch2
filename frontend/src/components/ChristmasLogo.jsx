import React, { useEffect, useState, useMemo } from 'react';
import santaHat from '../assets/santa-hat.png';

const ChristmasLogo = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate snowflakes
  const snowflakes = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 3,
      size: 2 + Math.random() * 2,
      drift: -10 + Math.random() * 20,
    })), []
  );

  return (
    <div className="relative inline-flex items-center">
      {/* Animation Styles */}
      <style>{`
        @keyframes snowFall {
          0% {
            opacity: 0;
            transform: translateY(-5px) translateX(0);
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            opacity: 0;
            transform: translateY(50px) translateX(var(--drift));
          }
        }
        
        @keyframes gentleBounce {
          0%, 100% { transform: rotate(15deg) translateY(0); }
          50% { transform: rotate(15deg) translateY(-2px); }
        }
        
        .snow-dot {
          animation: snowFall linear infinite;
        }
        
        .hat-bounce {
          animation: gentleBounce 2s ease-in-out infinite;
        }
      `}</style>

      {/* Logo + Hat Container */}
      <div className="relative flex items-center">

        {/* Santa Hat - positioned over the "h" letter, tilted to the right */}
        <img
          src={santaHat}
          alt=""
          className="absolute pointer-events-none select-none"
          style={{
            top: '-14px',
            right: '-15px',  /* Position over the "h" at the end */  /* Position over the "h" at the end */
            width: '35px',
            height: 'auto',
            zIndex: 10,
            transformOrigin: 'bottom center',
            transform: 'rotate(15deg)',
          }}
        />

        {/* Logo Text */}
        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
          Glowimatch
        </span>
      </div>

      {/* Snow Effect */}
      {mounted && (
        <div
          className="absolute pointer-events-none overflow-hidden"
          style={{
            top: '-25px',
            left: '-20px',
            width: 'calc(100% + 40px)',
            height: '80px'
          }}
        >
          {snowflakes.map((flake) => (
            <div
              key={flake.id}
              className="snow-dot absolute rounded-full bg-white"
              style={{
                left: `${flake.left}%`,
                top: '0',
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                '--drift': `${flake.drift}px`,
                animationDuration: `${flake.duration}s`,
                animationDelay: `${flake.delay}s`,
                boxShadow: '0 0 3px rgba(255,255,255,0.8)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChristmasLogo;
