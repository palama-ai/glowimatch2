import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AnalysisProgress = ({ isAnalyzing, onAnalysisComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const analysisSteps = [
    {
      icon: "Scan",
      title: "Image Processing",
      description: "Analyzing image quality and preparing for skin detection"
    },
    {
      icon: "Brain",
      title: "AI Analysis",
      description: "Detecting skin type characteristics and identifying concerns"
    },
    {
      icon: "Target",
      title: "Pattern Recognition",
      description: "Identifying oily, dry, sensitive, or combination skin patterns"
    },
    {
      icon: "CheckCircle",
      title: "Results Generation",
      description: "Compiling analysis results with confidence percentages"
    }
  ];

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    const stepDuration = 2000; // 2 seconds per step
    const progressInterval = 50; // Update every 50ms

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (stepDuration / progressInterval));
        
        if (newProgress >= 100) {
          setCurrentStep(prevStep => {
            const nextStep = prevStep + 1;
              if (nextStep >= analysisSteps?.length) {
              clearInterval(timer);
              // Notify parent that analysis steps finished. Parent will perform the real remote analysis
              setTimeout(() => {
                try {
                  onAnalysisComplete();
                } catch (e) {
                  // swallow any error from parent callback to avoid UI crash
                  console.error('onAnalysisComplete callback failed', e);
                }
              }, 500);
              return prevStep;
            }
            return nextStep;
          });
          return 0;
        }
        
        return newProgress;
      });
    }, progressInterval);

    return () => clearInterval(timer);
  }, [isAnalyzing, onAnalysisComplete]);

  if (!isAnalyzing) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4">
          <div className="animate-spin">
            <Icon name="Loader2" size={32} className="text-accent" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Analyzing Your Skin
        </h3>
        <p className="text-sm text-muted-foreground">
          Our AI is processing your image to determine your skin type and concerns
        </p>
      </div>
      <div className="space-y-4">
        {analysisSteps?.map((step, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              index < currentStep 
                ? 'bg-success text-success-foreground' 
                : index === currentStep 
                  ? 'bg-accent text-accent-foreground' 
                  : 'bg-muted text-muted-foreground'
            }`}>
              {index < currentStep ? (
                <Icon name="Check" size={16} />
              ) : (
                <Icon name={step?.icon} size={16} />
              )}
            </div>
            
            <div className="flex-1">
              <h4 className={`text-sm font-medium transition-colors duration-300 ${
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step?.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {step?.description}
              </p>
            </div>
            
            {index === currentStep && (
              <div className="text-right">
                <div className="text-sm font-medium text-accent">
                  {Math.round(progress)}%
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${((currentStep * 100) + progress) / analysisSteps?.length}%` 
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Processing...</span>
          <span>
            {Math.round(((currentStep * 100) + progress) / analysisSteps?.length)}% Complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;