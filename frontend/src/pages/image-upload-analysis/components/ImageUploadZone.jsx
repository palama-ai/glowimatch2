import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ImageUploadZone = ({ onImageUpload, uploadedImage, isAnalyzing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileSelection(files?.[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload({
          file: file,
          preview: e?.target?.result,
          name: file?.name,
          size: file?.size
        });
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  const handleCameraCapture = () => {
    // For mobile devices, this would trigger camera
    if (navigator.mediaDevices && navigator.mediaDevices?.getUserMedia) {
      fileInputRef?.current?.click();
    }
  };

  if (uploadedImage) {
    return (
      <div className="relative bg-card border-2 border-border rounded-xl p-6 animate-fade-in">
        <div className="aspect-square max-w-md mx-auto relative overflow-hidden rounded-lg">
          <Image
            src={uploadedImage?.preview}
            alt="Uploaded skin analysis photo showing face for AI-powered skin type detection"
            className="w-full h-full object-cover"
          />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin mb-3">
                  <Icon name="Loader2" size={32} />
                </div>
                <p className="text-sm font-medium">Analyzing your skin...</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {uploadedImage?.name} ({(uploadedImage?.size / 1024 / 1024)?.toFixed(2)} MB)
          </p>
          {!isAnalyzing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onImageUpload(null)}
              iconName="X"
              iconPosition="left"
            >
              Remove Image
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-card border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer animate-fade-in ${
        isDragOver 
          ? 'border-accent bg-accent/5 scale-[1.02]' 
          : 'border-border hover:border-accent/50 hover:bg-accent/5'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
          <Icon name="Upload" size={32} className="text-accent" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Upload Your Photo
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your image here, or click to browse
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="default"
            iconName="Upload"
            iconPosition="left"
            className="animate-scale-hover"
          >
            Browse Files
          </Button>
          
          <Button
            variant="outline"
            iconName="Camera"
            iconPosition="left"
            onClick={(e) => {
              e?.stopPropagation();
              handleCameraCapture();
            }}
            className="animate-scale-hover"
          >
            Take Photo
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Supported formats: JPG, PNG, WEBP</p>
          <p>Maximum size: 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadZone;