import React from 'react';
import Icon from '../../../components/AppIcon';

const PhotoGuidelines = () => {
  const guidelines = [
    {
      icon: "Sun",
      title: "Good Lighting",
      description: "Use natural daylight or bright indoor lighting for best results"
    },
    {
      icon: "Camera",
      title: "Clear Focus",
      description: "Ensure your photo is sharp and in focus, avoid blurry images"
    },
    {
      icon: "User",
      title: "Face Forward",
      description: "Look directly at the camera with your face clearly visible"
    },
    {
      icon: "Palette",
      title: "No Makeup",
      description: "Remove makeup for accurate skin analysis and type detection"
    },
    {
      icon: "Smartphone",
      title: "Close Distance",
      description: "Take the photo from arm\'s length for optimal detail capture"
    },
    {
      icon: "Eye",
      title: "Show Skin Areas",
      description: "Include face, hands, or legs based on your analysis preference"
    }
  ];

  return (
    <div className="bg-muted/50 rounded-xl p-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Info" size={20} className="text-accent" />
        <h3 className="text-lg font-semibold text-foreground">
          Photo Guidelines
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guidelines?.map((guideline, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name={guideline?.icon} size={16} className="text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">
                {guideline?.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {guideline?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="AlertCircle" size={16} className="text-accent mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Privacy & Security
            </p>
            <p className="text-xs text-muted-foreground">
              Your images are processed securely and automatically deleted after analysis. We never store or share your photos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoGuidelines;