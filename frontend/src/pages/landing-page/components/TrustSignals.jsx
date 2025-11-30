import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      id: 1,
      icon: "Shield",
      title: "SSL Secured",
      description: "256-bit encryption"
    },
    {
      id: 2,
      icon: "Lock",
      title: "Privacy Protected",
      description: "GDPR compliant"
    },
    {
      id: 3,
      icon: "Award",
      title: "Certified Safe",
      description: "Security verified"
    },
    {
      id: 4,
      icon: "CheckCircle",
      title: "Trusted Platform",
      description: "Verified by experts"
    }
  ];

  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {trustBadges?.map((badge) => (
            <div key={badge?.id} className="flex flex-col items-center text-center animate-fade-in">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                <Icon name={badge?.icon} size={20} color="var(--color-accent)" />
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">{badge?.title}</h4>
              <p className="text-xs text-muted-foreground">{badge?.description}</p>
            </div>
          ))}
        </div>

        {/* Footer Content */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Sparkles" size={16} color="white" />
              </div>
              <span className="text-lg font-semibold text-foreground">GlowMatch</span>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} GlowMatch. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                AI-powered beauty recommendations for everyone
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} color="var(--color-accent)" className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground font-medium mb-1">Your Privacy Matters</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use advanced encryption to protect your data. Your photos and personal information are processed securely and never shared with third parties. All analysis happens in real-time and data is not stored permanently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TrustSignals;