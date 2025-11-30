import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50/40 via-background to-purple-50/40 dark:from-pink-950/20 dark:via-background dark:to-purple-950/20 py-20 md:py-40">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-full blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center">
          {/* Icon Badge */}
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary rounded-full blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/30 rounded-full p-4 backdrop-blur-sm">
                <Icon name="Sparkles" size={48} className="text-accent animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground mb-6 animate-fade-up leading-tight">
            Discover Your
            <span className="block bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent animate-gradient-shift">
              Perfect Skin
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-up animate-delay-200 leading-relaxed">
            Take our AI-powered skin analysis quiz to get personalized skincare recommendations tailored to your unique skin type and concerns.
          </p>
          
          {/* Subscription Plans Preview */}
          <div className="mb-14 animate-fade-up animate-delay-300">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
              {/* Free Plan */}
              <div className="group relative bg-gradient-to-br from-green-50/50 to-green-50/20 dark:from-green-950/20 dark:to-green-950/10 backdrop-blur-sm border border-green-200/50 dark:border-green-900/50 rounded-xl p-5 text-center hover:border-green-400/80 dark:hover:border-green-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10">
                <div className="text-green-600 dark:text-green-400 font-bold text-lg mb-2">Free</div>
                <div className="text-sm text-muted-foreground mb-2">5 attempts</div>
                <div className="text-2xl font-bold text-foreground">$0<span className="text-xs text-muted-foreground font-normal">/mo</span></div>
              </div>
              {/* Standard Plan */}
              <div className="group relative bg-gradient-to-br from-blue-50/50 to-blue-50/20 dark:from-blue-950/20 dark:to-blue-950/10 backdrop-blur-sm border border-blue-200/50 dark:border-blue-900/50 rounded-xl p-5 text-center hover:border-blue-400/80 dark:hover:border-blue-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-2">Standard</div>
                <div className="text-sm text-muted-foreground mb-2">25 attempts</div>
                <div className="text-2xl font-bold text-foreground">$10<span className="text-xs text-muted-foreground font-normal">/mo</span></div>
              </div>
              {/* Pro Plan */}
              <div className="group relative bg-gradient-to-br from-purple-50/50 to-purple-50/20 dark:from-purple-950/20 dark:to-purple-950/10 backdrop-blur-sm border border-purple-200/50 dark:border-purple-900/50 rounded-xl p-5 text-center hover:border-purple-400/80 dark:hover:border-purple-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="inline-flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-white bg-gradient-to-r from-accent to-secondary px-2 py-1 rounded-full">POPULAR</span>
                </div>
                <div className="text-purple-600 dark:text-purple-400 font-bold text-lg mb-1">Pro</div>
                <div className="text-sm text-muted-foreground mb-2">50 attempts</div>
                <div className="text-2xl font-bold text-foreground">$17<span className="text-xs text-muted-foreground font-normal">/mo</span></div>
              </div>
              {/* Plus Plan */}
              <div className="group relative bg-gradient-to-br from-orange-50/50 to-orange-50/20 dark:from-orange-950/20 dark:to-orange-950/10 backdrop-blur-sm border border-orange-200/50 dark:border-orange-900/50 rounded-xl p-5 text-center hover:border-orange-400/80 dark:hover:border-orange-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="text-orange-600 dark:text-orange-400 font-bold text-lg mb-2">Plus</div>
                <div className="text-sm text-muted-foreground mb-2">80 attempts</div>
                <div className="text-2xl font-bold text-foreground">$25<span className="text-xs text-muted-foreground font-normal">/mo</span></div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animate-delay-400">
            <Button
              size="lg"
              onClick={() => navigate('/interactive-skin-quiz')}
              iconName="Play"
              className="animate-scale-hover shadow-lg shadow-accent/30 hover:shadow-accent/50"
            >
              Start Free Quiz
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/subscription')}
              iconName="Crown"
              className="animate-scale-hover"
            >
              View Plans
            </Button>
            {!user && (
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate('/login')}
                iconName="LogIn"
                className="animate-scale-hover"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-up animate-delay-500">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-green-500/5 px-4 py-2 rounded-full border border-green-500/20 backdrop-blur-sm">
              <Icon name="Shield" size={18} className="text-green-600 dark:text-green-400" />
              <span className="font-medium text-foreground">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-accent/10 to-accent/5 px-4 py-2 rounded-full border border-accent/20 backdrop-blur-sm">
              <Icon name="Zap" size={18} className="text-accent" />
              <span className="font-medium text-foreground">AI-Powered Analysis</span>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 px-4 py-2 rounded-full border border-blue-500/20 backdrop-blur-sm">
              <Icon name="Users" size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-foreground">Trusted by 10,000+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;