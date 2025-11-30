import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuestionCard = ({ question, onAnswer, selectedAnswer, onNext, onPrevious, isFirstQuestion, isLastQuestion }) => {
  // استخدام useCallback لمنع إعادة إنشاء الدالة
  const handleAnswerSelect = React.useCallback((answer) => {
    console.debug('QuestionCard: handleAnswerSelect called with', answer);
    onAnswer(answer);
  }, [onAnswer]);

  const renderAnswerOptions = () => {
    switch (question?.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question?.options?.map((option) => (
              <button
                key={option?.id}
                type="button"
                onClick={() => { console.debug('QuestionCard: option clicked', option?.id); handleAnswerSelect(option); }}
                aria-pressed={selectedAnswer?.id === option?.id}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 animate-scale-hover ${
                  (selectedAnswer && selectedAnswer.id === option.id)
                    ? 'border-accent bg-accent/10 text-accent' :'border-border bg-card hover:border-accent/50 hover:bg-accent/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-card-foreground">{option?.label}</h4>
                    {option?.description && (
                      <p className="text-sm text-muted-foreground mt-1">{option?.description}</p>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer?.id === option?.id
                      ? 'border-accent bg-accent' :'border-muted-foreground'
                  }`}>
                    {selectedAnswer?.id === option?.id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-6">
            <div className="px-4">
              <input
                type="range"
                min={question?.min}
                max={question?.max}
                step={question?.step || 1}
                value={selectedAnswer?.value || question?.min}
                onChange={(e) => handleAnswerSelect({ value: parseInt(e?.target?.value), label: question?.labels?.[parseInt(e?.target?.value)] })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{question?.labels?.[question?.min]}</span>
                <span>{question?.labels?.[question?.max]}</span>
              </div>
              {selectedAnswer && (
                <div className="text-center mt-4">
                  <span className="text-lg font-medium text-accent">{selectedAnswer?.label}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'image-selection':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {question?.options?.map((option) => (
              <button
                key={option?.id}
                type="button"
                onClick={() => { console.debug('QuestionCard: image option clicked', option?.id); handleAnswerSelect(option); }}
                aria-pressed={selectedAnswer?.id === option?.id}
                className={`relative p-3 rounded-lg border-2 transition-all duration-300 animate-scale-hover ${
                  (selectedAnswer && selectedAnswer.id === option.id)
                    ? 'border-accent bg-accent/10' :'border-border hover:border-accent/50'
                }`}
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-3">
                  <img
                    src={option?.image}
                    alt={option?.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-card-foreground">{option?.label}</p>
                {selectedAnswer?.id === option?.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Icon name="Check" size={14} color="white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 md:p-8 animate-fade-up">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-card-foreground mb-3">
          {question?.title}
        </h2>
        {question?.subtitle && (
          <p className="text-muted-foreground">{question?.subtitle}</p>
        )}
      </div>
      <div className="mb-8">
        {renderAnswerOptions()}
      </div>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          iconName="ChevronLeft"
          iconPosition="left"
          className="animate-scale-hover"
        >
          Previous
        </Button>

        <Button
          variant="default"
          onClick={onNext}
          disabled={!selectedAnswer}
          iconName={isLastQuestion ? "Upload" : "ChevronRight"}
          iconPosition="right"
          className="animate-scale-hover"
        >
          {isLastQuestion ? "Continue to Analysis" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default QuestionCard;