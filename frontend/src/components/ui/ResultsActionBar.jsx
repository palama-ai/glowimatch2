import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const ResultsActionBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  // Only show on results dashboard
  if (location?.pathname !== '/results-dashboard') {
    return null;
  }

  const handleRetakeQuiz = () => {
    navigate('/interactive-skin-quiz');
  };

  const handleSaveResults = () => {
    // Save the latest analysis object (if present) for easy retrieval
    const analysis = localStorage.getItem('glowmatch-analysis');
    if (analysis) {
      try {
        const parsed = JSON.parse(analysis);
        const results = {
          savedAt: new Date().toISOString(),
          skinType: parsed.skinType || parsed.skin_type || null,
          confidence: parsed.confidence || null,
          concerns: parsed.concerns || parsed.characteristics || [],
          recommendations: parsed.recommendations || parsed.tips || [],
          raw: parsed.raw || parsed
        };
        localStorage.setItem('glowmatch-results', JSON.stringify(results));
        alert('Results saved successfully!');
        return;
      } catch (e) {
        console.error('save results parse failed', e);
      }
    }

    // fallback
    const fallback = { savedAt: new Date().toISOString(), note: 'No analysis found' };
    localStorage.setItem('glowmatch-results', JSON.stringify(fallback));
    alert('Saved summary (no detailed analysis present)');
  };

  const handleShare = (platform) => {
    const shareText = "Check out my personalized skin analysis results from GlowMatch!";
    const shareUrl = window.location?.href;
    
    switch (platform) {
      case 'copy':
        navigator.clipboard?.writeText(shareUrl);
        alert('Link copied to clipboard!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
    }
    setIsShareMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Action Bar */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-40">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleRetakeQuiz}
                iconName="RotateCcw"
                iconPosition="left"
                className="animate-scale-hover"
              >
                Retake Quiz
              </Button>
              <Button
                variant="secondary"
                onClick={handleSaveResults}
                iconName="Save"
                iconPosition="left"
                className="animate-scale-hover"
              >
                Save Results
              </Button>
            </div>
            
            <div className="relative">
              <Button
                variant="default"
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                iconName="Share2"
                iconPosition="left"
                className="animate-scale-hover"
              >
                Share Results
              </Button>
              
              {isShareMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 bg-popover border border-border rounded-lg shadow-soft-lg p-2 min-w-48 animate-fade-up">
                  <div className="space-y-1">
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon name="Copy" size={16} />
                      <span>Copy Link</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon name="Twitter" size={16} />
                      <span>Share on Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon name="Facebook" size={16} />
                      <span>Share on Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon name="MessageCircle" size={16} />
                      <span>Share on WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-40">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetakeQuiz}
              iconName="RotateCcw"
              className="text-xs"
            >
              Retake
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveResults}
              iconName="Save"
              className="text-xs"
            >
              Save
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
              iconName="Share2"
              className="text-xs"
            >
              Share
            </Button>
          </div>
          
          {isShareMenuOpen && (
            <div className="mt-3 bg-muted rounded-lg p-3 animate-fade-up">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-foreground bg-background hover:bg-background/80 rounded-md transition-colors"
                >
                  <Icon name="Copy" size={14} />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-foreground bg-background hover:bg-background/80 rounded-md transition-colors"
                >
                  <Icon name="Twitter" size={14} />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-foreground bg-background hover:bg-background/80 rounded-md transition-colors"
                >
                  <Icon name="Facebook" size={14} />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-foreground bg-background hover:bg-background/80 rounded-md transition-colors"
                >
                  <Icon name="MessageCircle" size={14} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile share menu */}
      {isShareMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsShareMenuOpen(false)}
        />
      )}
    </>
  );
};

export default ResultsActionBar;