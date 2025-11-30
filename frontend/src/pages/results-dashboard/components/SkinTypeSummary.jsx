import React from 'react';
import Icon from '../../../components/AppIcon';

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

  const getSkinTypeColor = (type) => {
    switch (type) {
      case 'oily': return 'text-blue-600';
      case 'dry': return 'text-orange-600';
      case 'sensitive': return 'text-red-600';
      case 'combination': return 'text-purple-600';
      default: return 'text-accent';
    }
  };

  const getSkinTypeDescription = (type) => {
    switch (type) {
      case 'oily':
        return "Your skin produces excess sebum, particularly in the T-zone area. This can lead to enlarged pores and occasional breakouts.";
      case 'dry':
        return "Your skin lacks moisture and natural oils, which may cause tightness, flaking, or rough texture.";
      case 'sensitive':
        return "Your skin reacts easily to products and environmental factors, requiring gentle, fragrance-free formulations.";
      case 'combination':
        return "Your skin has both oily and dry areas, typically with an oily T-zone and drier cheeks.";
      default:
        return "Your unique skin type has been analyzed based on your responses and image analysis.";
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center ${getSkinTypeColor(skinType)}`}>
            <Icon name={getSkinTypeIcon(skinType)} size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground capitalize mb-1">
              {skinType} Skin
            </h2>
            <p className="text-muted-foreground">
              Analysis completed on {new Date()?.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Confidence</span>
          </div>
          <div className="text-2xl font-bold text-accent">{confidence}%</div>
        </div>
      </div>
      <div className="mb-6">
        <p className="text-foreground leading-relaxed">
          {getSkinTypeDescription(skinType)}
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="CheckCircle" size={20} className="text-accent mr-2" />
          Key Characteristics Identified
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {characteristics?.map((characteristic, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
              <span className="text-sm text-foreground">{characteristic}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkinTypeSummary;