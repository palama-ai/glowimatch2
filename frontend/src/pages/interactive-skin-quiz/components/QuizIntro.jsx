import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuizIntro = ({ onStart }) => {
  const features = [
    {
      icon: "Brain",
      title: "Smart Analysis",
      description: "AI-powered questions adapt to your responses"
    },
    {
      icon: "Clock",
      title: "Quick & Easy",
      description: "Takes only 3-5 minutes to complete"
    },
    {
      icon: "Shield",
      title: "Personalized Results",
      description: "Get recommendations tailored to your skin type"
    }
  ];

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-up">
      <div className="bg-card rounded-xl border border-border p-8 md:p-12">
        <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Sparkles" size={32} color="white" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-4">
          Discover Your Perfect Skin Match
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Answer a few quick questions about your skin to get personalized product recommendations that work for you.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {features?.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon name={feature?.icon} size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">{feature?.title}</h3>
              <p className="text-sm text-muted-foreground">{feature?.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Button
            variant="default"
            size="lg"
            onClick={onStart}
            iconName="ArrowRight"
            iconPosition="right"
            className="w-full md:w-auto animate-scale-hover"
          >
            Start Skin Quiz
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Your responses are private and used only for personalized recommendations
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizIntro;