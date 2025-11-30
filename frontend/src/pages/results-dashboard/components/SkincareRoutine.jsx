import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SkincareRoutine = ({ skinType, routineSteps }) => {
  const [activeRoutine, setActiveRoutine] = useState('morning');

  const routineTypes = [
    { id: 'morning', label: 'Morning Routine', icon: 'Sun' },
    { id: 'evening', label: 'Evening Routine', icon: 'Moon' }
  ];

  const getStepIcon = (stepType) => {
    switch (stepType) {
      case 'cleanser': return 'Droplets';
      case 'toner': return 'Spray';
      case 'serum': return 'Beaker';
      case 'moisturizer': return 'Heart';
      case 'sunscreen': return 'Shield';
      case 'treatment': return 'Zap';
      default: return 'Circle';
    }
  };

  const currentRoutine = routineSteps?.[activeRoutine] || [];

  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Clock" size={24} className="text-accent" />
        <h3 className="text-xl font-semibold text-foreground">Recommended Skincare Routine</h3>
      </div>
      <div className="flex space-x-2 mb-6">
        {routineTypes?.map((routine) => (
          <Button
            key={routine?.id}
            variant={activeRoutine === routine?.id ? 'default' : 'outline'}
            onClick={() => setActiveRoutine(routine?.id)}
            iconName={routine?.icon}
            iconPosition="left"
            className="flex-1"
          >
            {routine?.label}
          </Button>
        ))}
      </div>
      <div className="space-y-4">
        {currentRoutine?.map((step, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-full flex-shrink-0">
              <Icon name={getStepIcon(step?.type)} size={20} className="text-accent" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-accent">Step {index + 1}</span>
                <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                  {step?.timing}
                </span>
              </div>
              <h4 className="font-semibold text-foreground mb-1">{step?.name}</h4>
              <p className="text-sm text-muted-foreground mb-2">{step?.description}</p>
              
              {step?.tips && (
                <div className="bg-background/50 p-3 rounded-md">
                  <div className="flex items-start space-x-2">
                    <Icon name="Lightbulb" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground">{step?.tips}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-lg border border-accent/10">
        <div className="flex items-start space-x-3">
          <Icon name="Star" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-foreground mb-1">Pro Tip for {skinType} Skin</h5>
            <p className="text-sm text-muted-foreground">
              {skinType === 'oily' && "Use oil-free, non-comedogenic products and don't skip moisturizer - your skin needs hydration too!"}
              {skinType === 'dry' && "Layer hydrating products from thinnest to thickest consistency and seal with an occlusive moisturizer."}
              {skinType === 'sensitive' && "Introduce new products one at a time and always patch test. Look for fragrance-free, hypoallergenic formulas."}
              {skinType === 'combination' && "Use different products for different areas of your face - lighter formulas for your T-zone, richer ones for dry areas."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkincareRoutine;