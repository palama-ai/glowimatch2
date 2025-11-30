import React from 'react';
import { useLocation } from 'react-router-dom';

const ProgressIndicator = () => {
  const location = useLocation();

  const steps = [
    { path: '/landing-page', label: 'Welcome', step: 1 },
    { path: '/interactive-skin-quiz', label: 'Skin Quiz', step: 2 },
    { path: '/image-upload-analysis', label: 'Analysis', step: 3 },
    { path: '/results-dashboard', label: 'Results', step: 4 }
  ];

  const getCurrentStep = () => {
    const currentPath = location?.pathname;
    const step = steps?.find(s => s?.path === currentPath);
    return step ? step?.step : 1;
  };

  const currentStep = getCurrentStep();
  const progressPercentage = (currentStep / steps?.length) * 100;

  // Don't show progress indicator on landing page
  if (location?.pathname === '/landing-page' || location?.pathname === '/') {
    return null;
  }

  return (
    <div className="w-full bg-muted border-b border-border">
      <div className="max-w-4xl mx-auto px-5 lg:px-8 py-4">
        {/* Desktop Progress Bar */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-2">
            {steps?.map((step, index) => (
              <div key={step?.path} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                  step?.step <= currentStep
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted-foreground/20 text-muted-foreground'
                }`}>
                  {step?.step}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step?.step <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.label}
                </span>
                {index < steps?.length - 1 && (
                  <div className="flex-1 mx-4 h-0.5 bg-muted-foreground/20">
                    <div 
                      className="h-full bg-accent transition-all duration-500"
                      style={{ width: step?.step < currentStep ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Progress Indicator */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {steps?.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {steps?.find(s => s?.step === currentStep)?.label}
            </span>
          </div>
          <div className="w-full bg-muted-foreground/20 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;