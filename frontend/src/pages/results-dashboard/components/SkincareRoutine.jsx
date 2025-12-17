import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SkincareRoutine = ({ skinType, routineSteps }) => {
  const [activeRoutine, setActiveRoutine] = useState('morning');
  const [expandedStep, setExpandedStep] = useState(null);

  const getStepIcon = (stepType) => {
    switch (stepType) {
      case 'cleanser': return 'Droplets';
      case 'toner': return 'Spray';
      case 'serum': return 'FlaskConical';
      case 'moisturizer': return 'Heart';
      case 'sunscreen': return 'Shield';
      case 'treatment': return 'Zap';
      default: return 'Circle';
    }
  };

  const getStepColor = (stepType) => {
    switch (stepType) {
      case 'cleanser': return 'bg-blue-500';
      case 'toner': return 'bg-purple-500';
      case 'serum': return 'bg-amber-500';
      case 'moisturizer': return 'bg-rose-500';
      case 'sunscreen': return 'bg-orange-500';
      case 'treatment': return 'bg-emerald-500';
      default: return 'bg-accent';
    }
  };

  const currentRoutine = routineSteps?.[activeRoutine] || [];

  const toggleStep = (index) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className="animate-fade-in">
      {/* Toggle Button */}
      <div className="flex p-1 bg-muted/50 rounded-2xl mb-6 max-w-md">
        <button
          onClick={() => setActiveRoutine('morning')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${activeRoutine === 'morning'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          <Icon name="Sun" size={18} />
          Morning
        </button>
        <button
          onClick={() => setActiveRoutine('evening')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${activeRoutine === 'evening'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          <Icon name="Moon" size={18} />
          Evening
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent" />

        {/* Steps */}
        <div className="space-y-4 stagger-children">
          {currentRoutine?.map((step, index) => (
            <div key={index} className="relative pl-14">
              {/* Step Number Circle */}
              <div className={`absolute left-0 w-12 h-12 rounded-full ${getStepColor(step?.type)} flex items-center justify-center shadow-lg`}>
                <Icon name={getStepIcon(step?.type)} size={20} className="text-white" />
              </div>

              {/* Step Card */}
              <div
                className="glass rounded-2xl overflow-hidden cursor-pointer card-hover"
                onClick={() => toggleStep(index)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                        Step {index + 1}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {step?.timing}
                      </span>
                    </div>
                    <Icon
                      name={expandedStep === index ? 'ChevronUp' : 'ChevronDown'}
                      size={18}
                      className="text-muted-foreground"
                    />
                  </div>

                  <h4 className="font-semibold text-foreground mt-2">{step?.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{step?.description}</p>
                </div>

                {/* Expanded Content */}
                {expandedStep === index && step?.tips && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <div className="p-3 bg-accent/5 rounded-xl border border-accent/10">
                      <div className="flex items-start gap-2">
                        <Icon name="Lightbulb" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground leading-relaxed">{step.tips}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tip */}
      <div className="mt-8 p-5 gradient-soft rounded-2xl border border-accent/10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Icon name="Star" size={18} className="text-accent" />
          </div>
          <div>
            <h5 className="font-medium text-foreground mb-1">Pro Tip for {skinType} Skin</h5>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {skinType === 'oily' && "Use oil-free products and don't skip moisturizer - hydration helps regulate oil production!"}
              {skinType === 'dry' && "Layer products from thinnest to thickest and seal with an occlusive moisturizer."}
              {skinType === 'sensitive' && "Patch test new products and choose fragrance-free, hypoallergenic formulas."}
              {skinType === 'combination' && "Use different products for different zones - lighter on T-zone, richer on cheeks."}
              {!['oily', 'dry', 'sensitive', 'combination'].includes(skinType) && "Consistency is key! Stick to your routine for at least 4-6 weeks to see results."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkincareRoutine;