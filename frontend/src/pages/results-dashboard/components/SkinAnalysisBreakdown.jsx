import React from 'react';
import Icon from '../../../components/AppIcon';

const SkinAnalysisBreakdown = ({ analysisData }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const metrics = analysisData?.metrics || [];

  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="BarChart3" size={24} className="text-accent" />
        <h3 className="text-xl font-semibold text-foreground">Detailed Skin Analysis</h3>
      </div>
      <div className="space-y-6">
        {metrics.length === 0 ? (
          <div className="text-sm text-muted-foreground">No detailed metric breakdown available. View recommendations or run image analysis for a deeper report.</div>
        ) : (
          metrics
            .slice()
            .sort((a,b) => (b?.score || 0) - (a?.score || 0))
            .map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name={metric?.icon} size={18} className="text-accent" />
                    <span className="font-medium text-foreground">{metric?.name}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(metric?.score)} ${getScoreColor(metric?.score)}`}>
                    {metric?.score}/100
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(metric?.score)}`}
                    style={{ width: `${metric?.score}%` }}
                  />
                </div>

                <p className="text-sm text-muted-foreground">{metric?.description}</p>
              </div>
            ))
        )}
      </div>
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-semibold text-foreground mb-3 flex items-center">
          <Icon name="Lightbulb" size={18} className="text-accent mr-2" />
          Personalized Skincare Tips
        </h4>
        {analysisData?.tips?.length > 0 ? (
          <ul className="space-y-2">
            {analysisData?.tips?.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-foreground">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-muted-foreground">No tips available. Try retaking the quiz or uploading a clearer image for better recommendations.</div>
        )}
      </div>
      {analysisData?.raw?.explanation && (
        <div className="mt-6 p-4 border border-accent/20 bg-accent/5 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-medium text-foreground mb-1">Analysis Explanation</h5>
              <p className="text-sm text-muted-foreground">{analysisData?.raw?.explanation}</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 p-4 border border-accent/20 bg-accent/5 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-foreground mb-1">Analysis Method</h5>
            <p className="text-sm text-muted-foreground">
              Results are based on your quiz responses{analysisData?.raw ? ' and the uploaded image analysis' : ''}. Confidence indicates the model&apos;s estimated accuracy for the detected skin traits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinAnalysisBreakdown;