import React from 'react';
import Header from '../../components/ui/Header';
import { useI18n } from '../../contexts/I18nContext';
import { IMAGES, GRADIENTS } from '../../utils/imageConstants';
import Icon from '../../components/AppIcon';

const About = () => {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[400px] flex items-center overflow-hidden pt-20 pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-purple-500/10"></div>
          <div className="relative max-w-6xl mx-auto px-5 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div className="inline-block px-4 py-2 bg-accent/20 border border-accent/40 rounded-full mb-4">
                <span className="text-accent text-sm font-semibold">About GlowMatch</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Skincare, Personalized</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                GlowMatch combines a quick, friendly skin quiz with optional AI-powered image analysis to give clear, actionable skincare advice tailored to you.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 px-5 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="relative">
                <div className={`absolute -inset-4 bg-gradient-to-r ${GRADIENTS.warm_gradient} rounded-2xl blur-xl opacity-30`}></div>
                <img 
                  src={IMAGES.about_mission}
                  alt="mission"
                  className="relative w-full rounded-2xl shadow-2xl"
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">{t('about_mission')}</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{t('about_mission_text')}</p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Icon name="Check" size={20} className="text-accent" />
                    </div>
                    <p className="text-muted-foreground">Combine quiz answers with AI-powered image analysis</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Icon name="Check" size={20} className="text-accent" />
                    </div>
                    <p className="text-muted-foreground">Provide personalized recommendations</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Icon name="Check" size={20} className="text-accent" />
                    </div>
                    <p className="text-muted-foreground">Make skincare accessible to everyone</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">{t('about_privacy')}</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{t('about_privacy_text')}</p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-accent/5 rounded-xl border border-accent/20">
                    <Icon name="Lock" size={32} className="text-accent mb-3" />
                    <p className="font-semibold text-foreground">Secure & Private</p>
                    <p className="text-sm text-muted-foreground mt-2">End-to-end encryption</p>
                  </div>
                  <div className="p-6 bg-accent/5 rounded-xl border border-accent/20">
                    <Icon name="Shield" size={32} className="text-accent mb-3" />
                    <p className="font-semibold text-foreground">GDPR Compliant</p>
                    <p className="text-sm text-muted-foreground mt-2">Full data protection</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className={`absolute -inset-4 bg-gradient-to-r ${GRADIENTS.cool_gradient} rounded-2xl blur-xl opacity-30`}></div>
                <img 
                  src={IMAGES.feature_analysis}
                  alt="analysis"
                  className="relative w-full rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-5 lg:px-8 bg-accent/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">{t('how_it_works')}</h2>
              <p className="text-lg text-muted-foreground">A simple 3-step process to better skin</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-transparent rounded-xl"></div>
                <div className="relative bg-background border border-border rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="Lightbulb" size={32} className="text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-3">1</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Complete Quiz</h3>
                  <p className="text-muted-foreground">Answer a quick survey about your skin type, concerns, and goals.</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-transparent rounded-xl"></div>
                <div className="relative bg-background border border-border rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="Camera" size={32} className="text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-3">2</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Upload Photo (Optional)</h3>
                  <p className="text-muted-foreground">Get advanced AI analysis with a clear photo of your skin.</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-transparent rounded-xl"></div>
                <div className="relative bg-background border border-border rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="Sparkles" size={32} className="text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-3">3</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Get Results</h3>
                  <p className="text-muted-foreground">Receive personalized routine and product recommendations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-5 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">{t('team')}</h2>
              <p className="text-lg text-muted-foreground">Meet the team behind GlowMatch</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent hover:shadow-lg transition-all">
                <div className="h-56 bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon name="User" size={64} className="text-accent/40" />
                </div>
                <div className="p-6 text-center">
                  <div className="text-lg font-semibold text-foreground">Aicha</div>
                  <div className="text-sm text-accent font-medium">Founder & Product Lead</div>
                  <p className="text-sm text-muted-foreground mt-3">Passionate about making skincare accessible and personalized for everyone.</p>
                </div>
              </div>
              <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent hover:shadow-lg transition-all">
                <div className="h-56 bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon name="Code" size={64} className="text-accent/40" />
                </div>
                <div className="p-6 text-center">
                  <div className="text-lg font-semibold text-foreground">Dev Team</div>
                  <div className="text-sm text-accent font-medium">Engineering & AI</div>
                  <p className="text-sm text-muted-foreground mt-3">Building cutting-edge AI models and scalable infrastructure.</p>
                </div>
              </div>
              <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent hover:shadow-lg transition-all">
                <div className="h-56 bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon name="Headphones" size={64} className="text-accent/40" />
                </div>
                <div className="p-6 text-center">
                  <div className="text-lg font-semibold text-foreground">Support Team</div>
                  <div className="text-sm text-accent font-medium">Customer Success</div>
                  <p className="text-sm text-muted-foreground mt-3">Dedicated to helping you achieve your best skin ever.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
