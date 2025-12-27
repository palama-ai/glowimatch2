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
                <span className="text-accent text-sm font-semibold">{t('about_hero_badge')}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">{t('about_hero_title')}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('about_hero_desc')}
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
                    <p className="text-muted-foreground">{t('about_value_1')}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Icon name="Check" size={20} className="text-accent" />
                    </div>
                    <p className="text-muted-foreground">{t('about_value_2')}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Icon name="Check" size={20} className="text-accent" />
                    </div>
                    <p className="text-muted-foreground">{t('about_value_3')}</p>
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
                    <p className="font-semibold text-foreground">{t('secure_private')}</p>
                    <p className="text-sm text-muted-foreground mt-2">{t('e2e_encryption')}</p>
                  </div>
                  <div className="p-6 bg-accent/5 rounded-xl border border-accent/20">
                    <Icon name="Shield" size={32} className="text-accent mb-3" />
                    <p className="font-semibold text-foreground">{t('gdpr_compliant')}</p>
                    <p className="text-sm text-muted-foreground mt-2">{t('full_data_protection')}</p>
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
              <p className="text-lg text-muted-foreground">{t('how_it_works_sub')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-transparent rounded-xl"></div>
                <div className="relative bg-background border border-border rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="Lightbulb" size={32} className="text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-3">1</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{t('step_1')}</h3>
                  <p className="text-muted-foreground">{t('step_1_desc')}</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-transparent rounded-xl"></div>
                <div className="relative bg-background border border-border rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="Camera" size={32} className="text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-3">2</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{t('step_2')}</h3>
                  <p className="text-muted-foreground">{t('step_2_desc')}</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-transparent rounded-xl"></div>
                <div className="relative bg-background border border-border rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="Sparkles" size={32} className="text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-3">3</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{t('step_3')}</h3>
                  <p className="text-muted-foreground">{t('step_3_desc')}</p>
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
              <p className="text-lg text-muted-foreground">{t('team_sub')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Aicha Alaoui - Founder */}
              <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent hover:shadow-lg transition-all">
                <div className="h-56 bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">AA</span>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <div className="text-xl font-semibold text-foreground">Aicha Alaoui</div>
                  <div className="text-sm text-accent font-medium mt-1">Founder</div>
                  <p className="text-sm text-muted-foreground mt-3">{t('team_aicha_desc')}</p>
                  <a
                    href="https://www.linkedin.com/in/aicha-alaoui-65478439b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] rounded-full text-sm font-medium transition-colors"
                  >
                    <Icon name="Linkedin" size={16} />
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Ayoub Alioui - Co-Founder & CEO */}
              <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent hover:shadow-lg transition-all">
                <div className="h-56 bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                    <img
                      src="/images/team/ayoub-alioui.jpg"
                      alt="Ayoub Alioui"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <div className="text-xl font-semibold text-foreground">Ayoub Alioui</div>
                  <div className="text-sm text-accent font-medium mt-1">Co-Founder & CEO</div>
                  <p className="text-sm text-muted-foreground mt-3">Leading the vision, strategy, and technical innovation behind Glowimatch.</p>
                  <a
                    href="https://www.linkedin.com/in/ayoub--alioui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] rounded-full text-sm font-medium transition-colors"
                  >
                    <Icon name="Linkedin" size={16} />
                    LinkedIn
                  </a>
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
