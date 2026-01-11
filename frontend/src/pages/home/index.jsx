import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/Footer';
import SplashLoader from '../../components/SplashLoader';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { IMAGES, GRADIENTS } from '../../utils/imageConstants';
import Icon from '../../components/AppIcon';
import SEO from '../../components/SEO';

const Feature = ({ icon, title, desc }) => (
  <div className="group bg-card border border-border rounded-xl p-5 sm:p-8 hover:shadow-lg hover:border-accent transition-all duration-300 hover:scale-105">
    <div className="mb-3 sm:mb-4 text-accent group-hover:scale-110 transition-transform">
      <Icon name={icon} size={32} className="sm:hidden" />
      <Icon name={icon} size={40} className="hidden sm:block" />
    </div>
    <h4 className="font-semibold text-foreground mb-1.5 sm:mb-2 text-base sm:text-lg">{title}</h4>
    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const Home = () => {
  const { t } = useI18n();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AI Skincare Analysis & Beauty Products"
        description="Discover your perfect skincare routine with AI-powered skin analysis. Take our skin type quiz and get personalized beauty product recommendations tailored to your unique skin needs."
        keywords="skincare, AI skin analysis, beauty products, skin type quiz, personalized skincare routine, cosmetics store, beauty shop, العناية بالبشرة, منتجات التجميل, soins de la peau"
        url="/"
      />
      <SplashLoader isVisible={showSplash} onComplete={handleSplashComplete} />

      {!showSplash && (
        <>
          <Header />

          {/* Hero Section */}
          <main className="animate-fadeIn">
            <section className="relative flex flex-col items-center overflow-hidden">
              {/* Home Image */}
              <div className="w-full relative">
                <img
                  src="/assets/images/home.png"
                  alt="AI-powered skincare analysis showing personalized beauty product recommendations for all skin types"
                  width="1920"
                  height="1080"
                  className="w-full h-auto object-cover"
                />
              </div>
            </section>

            {/* How It Works - Visual Cards Section */}
            <section className="py-12 sm:py-16 px-4 sm:px-5 lg:px-8 bg-gradient-to-b from-background to-accent/5">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
                  How AI Skin Analysis Works
                </h2>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {/* Step 1 */}
                  <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-accent transition-colors">
                    <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="ClipboardList" size={28} className="text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Take the Quiz</h3>
                    <p className="text-sm text-muted-foreground">Answer questions about your skin in under 3 minutes</p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-accent transition-colors">
                    <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Brain" size={28} className="text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">AI Analysis</h3>
                    <p className="text-sm text-muted-foreground">Our AI matches you with 500+ dermatologist-approved products</p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-accent transition-colors">
                    <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Sparkles" size={28} className="text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Get Your Routine</h3>
                    <p className="text-sm text-muted-foreground">Receive personalized morning & evening skincare routine</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <Link
                    to="/interactive-skin-quiz"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <Icon name="Sparkles" size={20} />
                    Start Your Free Skin Analysis
                  </Link>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-12 sm:py-20 px-4 sm:px-5 lg:px-8 bg-background">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                  <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">{t('why_choose')}</h2>
                  <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">{t('why_choose_sub')}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                  <Feature
                    icon="Brain"
                    title={t('ai_driven')}
                    desc={t('ai_driven_desc')}
                  />
                  <Feature
                    icon="Heart"
                    title={t('personalized_routines')}
                    desc={t('routines_desc')}
                  />
                  <Feature
                    icon="Download"
                    title={t('easy_reports')}
                    desc={t('reports_desc')}
                  />
                </div>
              </div>
            </section>

            {/* Trust Section with Image */}
            <section className="py-12 sm:py-20 bg-accent/5">
              <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">{t('trusted_by')}</h2>
                    <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                      {t('trusted_by_sub')}
                    </p>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold text-accent">50K+</p>
                        <p className="text-muted-foreground text-sm">{t('active_users')}</p>
                      </div>
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold text-accent">4.8★</p>
                        <p className="text-muted-foreground text-sm">{t('avg_rating')}</p>
                      </div>
                    </div>
                    <Link
                      to="/contact"
                      className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
                      aria-label="Contact Glowimatch skincare experts for personalized advice"
                    >
                      Contact Our Skincare Experts
                    </Link>
                  </div>
                  <div className="relative">
                    <div className={`absolute -inset-4 bg-gradient-to-r ${GRADIENTS.warm_gradient} rounded-2xl blur-xl opacity-30`}></div>
                    <img
                      src={IMAGES.skincare_routine}
                      alt="skincare routine"
                      className="relative w-full rounded-2xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Blog Preview Section */}
            <section className="py-12 sm:py-20 px-4 sm:px-5 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                  <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">{t('skincare_tips')}</h2>
                  <p className="text-sm sm:text-lg text-muted-foreground">{t('skincare_tips_sub')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  <Link to="/blog" className="group block overflow-hidden bg-card rounded-xl border border-border hover:border-accent transition-all hover:shadow-xl">
                    <div className="relative h-64 overflow-hidden bg-muted">
                      <img
                        src={IMAGES.blog_routine}
                        alt="skincare routine"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="font-semibold text-foreground mb-2 text-lg group-hover:text-accent transition-colors">{t('blog_simple_routine')}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{t('blog_simple_routine_desc')}</p>
                      <span className="inline-flex items-center text-accent font-semibold">
                        {t('read_more')} <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </div>
                  </Link>
                  <Link to="/blog" className="group block overflow-hidden bg-card rounded-xl border border-border hover:border-accent transition-all hover:shadow-xl">
                    <div className="relative h-64 overflow-hidden bg-muted">
                      <img
                        src={IMAGES.blog_skincare_tips}
                        alt="skin types"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="font-semibold text-foreground mb-2 text-lg group-hover:text-accent transition-colors">{t('blog_skin_types')}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{t('blog_skin_types_desc')}</p>
                      <span className="inline-flex items-center text-accent font-semibold">
                        {t('read_more')} <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-12 sm:py-20 overflow-hidden">
              <div className="absolute inset-0">
                <div className={`w-full h-full bg-gradient-to-r ${GRADIENTS.accent_gradient}`}></div>
                <div className={`absolute inset-0 bg-gradient-to-r ${GRADIENTS.overlay_dark}`}></div>
              </div>
              <div className="relative max-w-4xl mx-auto px-4 sm:px-5 lg:px-8 text-center text-white py-8 sm:py-16">
                <h3 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">{t('ready_to_find')}</h3>
                <p className="text-base sm:text-xl text-gray-200 mb-6 sm:mb-8">{t('join_thousands')}</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link to="/interactive-skin-quiz" className="px-6 sm:px-8 py-3 sm:py-4 bg-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base">
                    {t('start_quiz_now')}
                  </Link>
                  <Link to="/contact" className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur border border-white/30 text-white rounded-lg font-semibold hover:bg-white/20 transition-all text-sm sm:text-base">
                    {t('get_in_touch')}
                  </Link>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </>
      )}
    </div>
  );
};

export default Home;
