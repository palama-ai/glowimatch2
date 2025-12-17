import React from 'react';
import Icon from '../../../components/AppIcon';

// Circular Progress Component
const CircularProgress = ({ value, size = 80, strokeWidth = 6, color = 'var(--color-accent)' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="circular-progress-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="circular-progress-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-foreground">{value}%</span>
      </div>
    </div>
  );
};

const SkinTypeSummary = ({ skinType, confidence, characteristics }) => {
  const getSkinTypeIcon = (type) => {
    switch (type) {
      case 'oily': return 'Droplets';
      case 'dry': return 'Sun';
      case 'sensitive': return 'Heart';
      case 'combination': return 'Layers';
      default: return 'Sparkles';
    }
  };

  const getSkinTypeGradient = (type) => {
    switch (type) {
      case 'oily': return 'from-blue-400/20 to-cyan-400/20';
      case 'dry': return 'from-orange-400/20 to-amber-400/20';
      case 'sensitive': return 'from-rose-400/20 to-pink-400/20';
      case 'combination': return 'from-purple-400/20 to-violet-400/20';
      default: return 'from-accent/20 to-secondary/20';
    }
  };

  const getSkinTypeColor = (type) => {
    switch (type) {
      case 'oily': return 'text-blue-500';
      case 'dry': return 'text-orange-500';
      case 'sensitive': return 'text-rose-500';
      case 'combination': return 'text-purple-500';
      default: return 'text-accent';
    }
  };

  const getSkinTypeBg = (type) => {
    switch (type) {
      case 'oily': return 'bg-blue-500/10';
      case 'dry': return 'bg-orange-500/10';
      case 'sensitive': return 'bg-rose-500/10';
      case 'combination': return 'bg-purple-500/10';
      default: return 'bg-accent/10';
    }
  };

  const getSkinTypeDescription = (type) => {
    switch (type) {
      case 'oily':
        return "Your skin produces excess sebum, particularly in the T-zone. We recommend oil-control products.";
      case 'dry':
        return "Your skin needs extra moisture. Focus on hydrating and nourishing products.";
      case 'sensitive':
        return "Your skin requires gentle care. Choose fragrance-free, hypoallergenic formulas.";
      case 'combination':
        return "Your skin has both oily and dry areas. Use targeted products for each zone.";
      default:
        return "Your personalized skincare plan is ready based on your unique skin profile.";
    }
  };

  // Limit characteristics to first 4 for cleaner look
  const displayCharacteristics = characteristics?.slice(0, 4) || [];

  return (
    <div className="relative overflow-hidden rounded-2xl mb-8 animate-fade-in">
      {/* Glassmorphism Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getSkinTypeGradient(skinType)} opacity-60`} />
      <div className="absolute inset-0 glass" />

      {/* Content */}
      <div className="relative p-6 md:p-8">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          {/* Skin Type Info */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${getSkinTypeBg(skinType)} flex items-center justify-center animate-float`}>
              <Icon name={getSkinTypeIcon(skinType)} size={36} className={getSkinTypeColor(skinType)} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground capitalize">
                {skinType} <span className="text-muted-foreground font-normal">Skin</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Analyzed on {new Date()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="flex items-center gap-4">
            <CircularProgress value={confidence || 87} />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Confidence</p>
              <p className="text-sm font-medium text-foreground">Match Score</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-foreground/80 mb-6 max-w-2xl">
          {getSkinTypeDescription(skinType)}
        </p>

        {/* Characteristics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-children">
          {displayCharacteristics.map((characteristic, index) => (
            <div
              key={index}
              className="bg-background/60 backdrop-blur-sm rounded-xl p-3 border border-border/50 card-hover"
            >
              <div className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${getSkinTypeBg(skinType).replace('/10', '')} mt-2 flex-shrink-0`} />
                <span className="text-sm text-foreground leading-tight">{characteristic}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkinTypeSummary;