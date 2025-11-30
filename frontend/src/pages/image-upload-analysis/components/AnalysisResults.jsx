import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AnalysisResults = ({ results, uploadedImage }) => {
  const navigate = useNavigate();

  if (!results) return null;

  const getSkinTypeColor = (skinType) => {
    const colors = {
      oily: 'text-blue-600',
      dry: 'text-orange-600',
      sensitive: 'text-red-600',
      combination: 'text-purple-600',
      normal: 'text-green-600'
    };
    return colors?.[skinType] || 'text-foreground';
  };

  const getSkinTypeDescription = (skinType) => {
    const descriptions = {
      oily: "Your skin produces excess sebum, particularly in the T-zone area. Focus on oil control and gentle cleansing.",
      dry: "Your skin lacks moisture and may feel tight or flaky. Prioritize hydration and barrier repair.",
      sensitive: "Your skin reacts easily to products and environmental factors. Choose gentle, fragrance-free formulations.",
      combination: "You have both oily and dry areas on your face. Use targeted treatments for different zones.",
      normal: "Your skin is well-balanced with minimal concerns. Maintain with gentle, consistent care."
    };
    return descriptions?.[skinType] || "Analysis complete. Personalized recommendations available.";
  };

  const getConcernDetails = (concern) => {
    const concernMap = {
      mild_dryness: { label: "Mild Dryness", severity: "Low", color: "text-yellow-600" },
      t_zone_oiliness: { label: "T-Zone Oiliness", severity: "Moderate", color: "text-blue-600" },
      acne_prone: { label: "Acne Prone", severity: "Moderate", color: "text-red-600" },
      fine_lines: { label: "Fine Lines", severity: "Low", color: "text-orange-600" },
      uneven_tone: { label: "Uneven Skin Tone", severity: "Low", color: "text-purple-600" }
    };
    return concernMap?.[concern] || { label: concern, severity: "Unknown", color: "text-muted-foreground" };
  };

  const handleViewFullResults = () => {
    // Store analysis results in localStorage for the results dashboard
    const analysisData = {
      timestamp: new Date()?.toISOString(),
      skinType: results?.skinType,
      confidence: results?.confidence,
      concerns: results?.concerns,
      imageAnalysis: true,
      quizCompleted: true
    };
    localStorage.setItem('glowmatch-analysis', JSON.stringify(analysisData));
    navigate('/results-dashboard');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Analysis Complete Header */}
      <div className="bg-success/10 border border-success/20 rounded-xl p-6 text-center">
        <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center mb-4">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Analysis Complete!
        </h2>
        <p className="text-sm text-muted-foreground">
          Your skin has been successfully analyzed using AI technology
        </p>
      </div>
      {/* Main Results Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image with Overlay */}
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden">
              <Image
                src={uploadedImage?.preview}
                alt="Analyzed skin photo with AI-detected skin type and concern areas highlighted"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Confidence Score</span>
                  <span className="text-lg font-bold">{results?.confidence}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Your Skin Type
              </h3>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`text-2xl font-bold capitalize ${getSkinTypeColor(results?.skinType)}`}>
                  {results?.skinType}
                </div>
                <div className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                  {results?.confidence}% Match
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getSkinTypeDescription(results?.skinType)}
              </p>
            </div>

            {/* Detected Concerns */}
            {results?.concerns && results?.concerns?.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-foreground mb-3">
                  Detected Concerns
                </h4>
                <div className="space-y-2">
                  {results?.concerns?.map((concern, index) => {
                    const concernDetails = getConcernDetails(concern);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                          <span className="text-sm font-medium text-foreground">
                            {concernDetails?.label}
                          </span>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${concernDetails?.color} bg-current/10`}>
                          {concernDetails?.severity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Analysis Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">4.2/5</div>
                <div className="text-xs text-muted-foreground">Skin Health Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">12</div>
                <div className="text-xs text-muted-foreground">Product Matches</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          fullWidth
          onClick={handleViewFullResults}
          iconName="ArrowRight"
          iconPosition="right"
          className="animate-scale-hover"
        >
          View Full Results & Recommendations
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.location?.reload()}
          iconName="RotateCcw"
          iconPosition="left"
          className="animate-scale-hover sm:w-auto"
        >
          Analyze Another Photo
        </Button>
      </div>
      {/* Additional Info */}
      <div className="bg-muted/50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Analysis Based On
            </p>
            <p className="text-xs text-muted-foreground">
              AI-powered image analysis combined with your quiz responses for personalized skincare recommendations tailored to your unique skin profile.
            </p>
          </div>
        </div>
      </div>
      {/* Debug Info (visible in dev/testing) */}
      {results?.debug && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-semibold text-sm mb-2">Server debug info</h4>
          <pre className="text-xs text-yellow-800 font-mono whitespace-pre-wrap">{JSON.stringify(results.debug, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;