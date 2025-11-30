import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { useModal } from '../contexts/ModalContext';
import Button from './ui/Button';
import Icon from './AppIcon';

const AnalysisModal = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { showAnalysisPrompt, closeAnalysisPrompt } = useModal();

  if (!showAnalysisPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-background to-background/95 border border-border/50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
        {/* Header gradient */}
        <div className="h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600" />
        
        <div className="p-8 space-y-6">
          {/* Icon with glow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/30 rounded-full blur-lg" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-accent/20 to-pink-500/20 rounded-full flex items-center justify-center border border-accent/30">
                <Icon name="ClipboardCheck" size={40} className="text-accent" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              {t('complete_quiz')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('quiz_desc')}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={() => {
                closeAnalysisPrompt();
                navigate('/interactive-skin-quiz');
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg hover:shadow-pink-500/40 transition-all"
            >
              <Icon name="Sparkles" size={18} className="mr-2" />
              {t('take_quiz')}
            </Button>
            <Button
              variant="outline"
              onClick={closeAnalysisPrompt}
              className="w-full"
            >
              {t('close')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
