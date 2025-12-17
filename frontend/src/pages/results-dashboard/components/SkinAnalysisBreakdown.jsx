import React from 'react';
import Icon from '../../../components/AppIcon';

// Circular Progress Component for metrics
const CircularMetric = ({ score, icon, name, size = 100 }) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score) => {
    if (score >= 80) return '#10B981'; // success green
    if (score >= 60) return '#F59E0B'; // warning amber
    return '#EF4444'; // error red
  };

  const getBgColor = (score) => {
    if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-950/30';
    if (score >= 60) return 'bg-amber-50 dark:bg-amber-950/30';
    return 'bg-red-50 dark:bg-red-950/30';
  };

  return (
    <div className={`flex flex-col items-center p-4 rounded-2xl ${getBgColor(score)} card-hover`}>
      <div className="circular-progress relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            className="circular-progress-track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            style={{ stroke: 'rgba(0,0,0,0.1)' }}
          />
          <circle
            className="circular-progress-fill"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={getColor(score)}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon name={icon || 'Circle'} size={20} className="text-muted-foreground mb-1" />
          <span className="text-lg font-bold text-foreground">{score}</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-medium text-foreground text-center">{name}</span>
    </div>
  );
};

// Tip Card Component
const TipCard = ({ tip, index }) => (
  <div className="flex items-start gap-3 p-4 bg-background/60 rounded-xl border border-border/50">
    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-bold text-accent">{index + 1}</span>
    </div>
    <p className="text-sm text-foreground leading-relaxed">{tip}</p>
  </div>
);

const SkinAnalysisBreakdown = ({ analysisData }) => {
  const metrics = analysisData?.metrics || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics Section */}
      <div className="glass-accent rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Icon name="BarChart3" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Skin Metrics</h3>
            <p className="text-xs text-muted-foreground">Detailed breakdown of your skin analysis</p>
          </div>
        </div>

        {metrics.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="PieChart" size={40} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              No detailed metrics available. Complete an image analysis for deeper insights.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 stagger-children">
            {metrics
              .slice()
              .sort((a, b) => (b?.score || 0) - (a?.score || 0))
              .map((metric, index) => (
                <CircularMetric
                  key={index}
                  score={metric?.score || 0}
                  icon={metric?.icon}
                  name={metric?.name}
                  size={90}
                />
              ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      {analysisData?.tips?.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Icon name="Lightbulb" size={20} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Personalized Tips</h3>
              <p className="text-xs text-muted-foreground">Recommendations based on your skin profile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-children">
            {analysisData.tips.slice(0, 4).map((tip, index) => (
              <TipCard key={index} tip={tip} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Analysis Explanation */}
      {analysisData?.raw?.explanation && (
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={18} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-foreground mb-1 text-sm">AI Analysis Summary</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysisData.raw.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Method Note */}
      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl text-sm">
        <Icon name="Shield" size={16} className="text-muted-foreground" />
        <span className="text-muted-foreground">
          Analysis based on your quiz responses{analysisData?.raw ? ' and uploaded image' : ''}.
        </span>
      </div>
    </div>
  );
};

export default SkinAnalysisBreakdown;