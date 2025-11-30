import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

import Image from '../../../components/AppImage';

const ImagePreviewTools = ({ image, onImageUpdate, onStartAnalysis }) => {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showCropGuide, setShowCropGuide] = useState(false);

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    onImageUpdate({
      ...image,
      rotation: newRotation
    });
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 2);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.5);
    setZoom(newZoom);
  };

  const handleReset = () => {
    setRotation(0);
    setZoom(1);
    onImageUpdate({
      ...image,
      rotation: 0,
      zoom: 1
    });
  };

  if (!image) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Preview & Adjust
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCropGuide(!showCropGuide)}
          iconName={showCropGuide ? "EyeOff" : "Eye"}
          iconPosition="left"
        >
          {showCropGuide ? "Hide" : "Show"} Guide
        </Button>
      </div>
      <div className="relative bg-muted rounded-lg overflow-hidden mb-6" style={{ aspectRatio: '1' }}>
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            transition: 'transform 0.3s ease'
          }}
        >
          <Image
            src={image?.preview}
            alt="Preview of uploaded skin analysis photo with adjustment tools for optimal AI processing"
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {showCropGuide && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-2 border-accent/50 border-dashed rounded-lg">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-accent rounded-full opacity-60" />
            </div>
            <div className="absolute top-2 left-2 bg-accent/90 text-accent-foreground px-2 py-1 rounded text-xs">
              Face Detection Area
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRotate}
          iconName="RotateCw"
          iconPosition="left"
          className="animate-scale-hover"
        >
          Rotate
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          iconName="ZoomIn"
          iconPosition="left"
          disabled={zoom >= 2}
          className="animate-scale-hover"
        >
          Zoom In
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          iconName="ZoomOut"
          iconPosition="left"
          disabled={zoom <= 0.5}
          className="animate-scale-hover"
        >
          Zoom Out
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          iconName="RotateCcw"
          iconPosition="left"
          className="animate-scale-hover"
        >
          Reset
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Image Quality:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-success font-medium">Excellent</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Lighting:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-success font-medium">Good</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Face Detection:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-success font-medium">Ready</span>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="default"
          fullWidth
          onClick={onStartAnalysis}
          iconName="Zap"
          iconPosition="left"
          className="animate-scale-hover"
        >
          Start AI Analysis
        </Button>
      </div>
    </div>
  );
};

export default ImagePreviewTools;