import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useI18n } from '../../../contexts/I18nContext';

const QuizComplete = ({ responses, onContinue }) => {
  const { t } = useI18n();
  const getResponseSummary = () => {
    const skinConcerns = responses?.filter(r => r?.question?.includes('concern'))?.map(r => r?.answer?.label);
    const skinType = responses?.find(r => r?.question?.includes('skin type'))?.answer?.label || 'Mixed';

    return {
      skinType,
      concerns: skinConcerns?.slice(0, 3),
      totalResponses: responses?.length
    };
  };

  const summary = getResponseSummary();

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-up">
      <div className="bg-card rounded-xl border border-border p-8 md:p-12">
        <div className="w-16 h-16 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircle" size={32} color="white" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-4">
          {t('quiz_complete_title')}
        </h1>

        <p className="text-muted-foreground text-lg mb-8">
          {t('quiz_complete_desc')}
        </p>

        <div className="bg-muted rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-card-foreground mb-4">{t('quiz_summary_title')}</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('quiz_summary_responses')}:</span>
              <span className="font-medium text-card-foreground">{summary?.totalResponses}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('quiz_summary_skin_type')}:</span>
              <span className="font-medium text-accent">{summary?.skinType}</span>
            </div>
            {summary?.concerns?.length > 0 && (
              <div className="flex items-start justify-between">
                <span className="text-muted-foreground">{t('quiz_summary_concerns')}:</span>
                <div className="text-right">
                  {summary?.concerns?.map((concern, index) => (
                    <div key={index} className="text-sm text-card-foreground">{concern}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Button
            variant="default"
            size="lg"
            onClick={() => onContinue('fallback')}
            iconName="Camera"
            iconPosition="right"
            className="w-full md:w-auto animate-scale-hover"
          >
            {t('quiz_continue_image')}
          </Button>

          <p className="text-xs text-muted-foreground">
            {t('quiz_next_step')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizComplete;
