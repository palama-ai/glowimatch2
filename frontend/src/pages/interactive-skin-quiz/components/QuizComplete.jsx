import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuizComplete = ({ responses, onContinue }) => {
  const [model, setModel] = React.useState('fallback');
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
          Quiz Complete!
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Great job! We've gathered all the information we need to analyze your skin and provide personalized recommendations.
        </p>

        <div className="bg-muted rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-card-foreground mb-4">Quick Summary</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Responses Collected:</span>
              <span className="font-medium text-card-foreground">{summary?.totalResponses}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Primary Skin Type:</span>
              <span className="font-medium text-accent">{summary?.skinType}</span>
            </div>
            {summary?.concerns?.length > 0 && (
              <div className="flex items-start justify-between">
                <span className="text-muted-foreground">Key Concerns:</span>
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
          <div className="text-left">
            <label className="text-sm text-muted-foreground block mb-2">Select analysis model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full md:w-72 p-2 bg-background border border-border rounded"
            >
              <option value="fallback">Rule-based (local fallback)</option>
              <option value="openai">OpenAI (GPT)</option>
              <option value="gemini">Gemini</option>
              <option value="cloud">Anthropic / Cloud</option>
            </select>
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={() => onContinue(model)}
            iconName="Camera"
            iconPosition="right"
            className="w-full md:w-auto animate-scale-hover"
          >
            Continue to Image Analysis
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Next: Upload a photo for AI-powered skin analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizComplete;