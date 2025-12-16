import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SplashLoader from '../../components/SplashLoader';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { IMAGES, GRADIENTS } from '../../utils/imageConstants';
import Icon from '../../components/AppIcon';

const Feature = ({ icon, title, desc }) => (
  <div className="group bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-accent transition-all duration-300 hover:scale-105">
    <div className="mb-4 text-accent group-hover:scale-110 transition-transform">
      <Icon name={icon} size={40} />
    </div>
    <h4 className="font-semibold text-foreground mb-2 text-lg">{title}</h4>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
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
      <SplashLoader isVisible={showSplash} onComplete={handleSplashComplete} />
      
      {!showSplash && (
        <>
          <Header />
          
          {/* Hero Section */}
          <main className="animate-fadeIn">
        <section className="relative min-h-[-10px] flex items-center overflow-hidden">
          {/* Home Image */}
          <div className="w-full h-full relative">
            <img 
              src="/assets/images/home.png"
              alt="home"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-5 lg:px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose GlowMatch?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Powered by AI and dermatological expertise to deliver your best skin</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Feature 
                icon="Brain" 
                title="AI-Driven Analysis" 
                desc="We combine quiz answers with image-derived features to improve recommendations with advanced machine learning." 
              />
              <Feature 
                icon="Heart" 
                title="Personalized Routines" 
                desc="Get a routine tailored to your skin type, sensitivity and goals for maximum effectiveness." 
              />
              <Feature 
                icon="Download" 
                title="Easy Reports" 
                desc="Download PDF reports of your results and recommended products in a beautiful, shareable format." 
              />
            </div>
          </div>
        </section>

        {/* Trust Section with Image */}
        <section className="py-20 bg-accent/5">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">Trusted by thousands</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Our AI-powered skincare analysis has helped thousands of people achieve their skin goals. Get personalized recommendations based on your unique skin characteristics.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-3xl font-bold text-accent">50K+</p>
                    <p className="text-muted-foreground">Active Users</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-accent">4.8★</p>
                    <p className="text-muted-foreground">Average Rating</p>
                  </div>
                </div>
                <Link to="/contact" className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Learn More
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
        <section className="py-20 px-5 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">Skincare Tips & Insights</h2>
              <p className="text-lg text-muted-foreground">Expert advice to help you care for your skin</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Link to="/blog/simple-skincare-routine" className="group block overflow-hidden bg-card rounded-xl border border-border hover:border-accent transition-all hover:shadow-xl">
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img 
                    src={IMAGES.blog_routine}
                    alt="skincare routine"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-foreground mb-2 text-lg group-hover:text-accent transition-colors">How to build a simple skincare routine</h4>
                  <p className="text-sm text-muted-foreground mb-4">A practical guide to choosing the essentials and building consistency.</p>
                  <span className="inline-flex items-center text-accent font-semibold">
                    Read More <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </Link>
              <Link to="/blog/understanding-skin-types" className="group block overflow-hidden bg-card rounded-xl border border-border hover:border-accent transition-all hover:shadow-xl">
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img 
                    src={IMAGES.blog_skincare_tips}
                    alt="skin types"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-foreground mb-2 text-lg group-hover:text-accent transition-colors">Understanding skin types</h4>
                  <p className="text-sm text-muted-foreground mb-4">Learn the differences between oily, dry, combination and sensitive skin.</p>
                  <span className="inline-flex items-center text-accent font-semibold">
                    Read More <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className={`w-full h-full bg-gradient-to-r ${GRADIENTS.accent_gradient}`}></div>
            <div className={`absolute inset-0 bg-gradient-to-r ${GRADIENTS.overlay_dark}`}></div>
          </div>
          <div className="relative max-w-4xl mx-auto px-5 lg:px-8 text-center text-white py-16">
            <h3 className="text-4xl font-bold mb-4">Ready to find your perfect skincare routine?</h3>
            <p className="text-xl text-gray-200 mb-8">Join thousands of people discovering their best skin</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/interactive-skin-quiz" className="px-8 py-4 bg-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105">
                Start Quiz Now
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-white/10 backdrop-blur border border-white/30 text-white rounded-lg font-semibold hover:bg-white/20 transition-all">
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
        </>
      )}
    </div>
  );
};

export default Home;
