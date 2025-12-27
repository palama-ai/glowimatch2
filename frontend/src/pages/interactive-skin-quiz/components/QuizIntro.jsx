import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

import { useI18n } from '../../../contexts/I18nContext';

const QuizIntro = ({ onStart }) => {
  const { t } = useI18n();
  const features = [
    {
      icon: "Brain",
      title: t('quiz_feature_smart_title'),
      description: t('quiz_feature_smart_desc')
    },
    {
      icon: "Clock",
      title: t('quiz_feature_quick_title'),
      description: t('quiz_feature_quick_desc')
    },
    {
      icon: "Shield",
      title: t('quiz_feature_personalized_title'),
      description: t('quiz_feature_personalized_desc')
    }
  ];

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-up">
      <div className="bg-card rounded-xl border border-border p-8 md:p-12">
        <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Sparkles" size={32} color="white" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-4">
          {t('quiz_intro_title')}
        </h1>

        <p className="text-muted-foreground text-lg mb-8">
          {t('quiz_intro_desc')}
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
            {t('quiz_start_button')}
          </Button>

          <p className="text-xs text-muted-foreground">
            {t('quiz_privacy_note')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizIntro;