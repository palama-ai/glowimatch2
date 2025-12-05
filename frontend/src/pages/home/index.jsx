import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import SplashLoader from '../../components/SplashLoader';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { IMAGES } from '../../utils/imageConstants';
import Icon from '../../components/AppIcon';

// Product Card Component
const ProductCard = ({ image, label, price }) => (
  <div className="relative group">
    <div className="bg-gradient-to-br from-pink-200 to-rose-300 rounded-3xl p-6 h-96 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <img src={image} alt={label} className="w-3/4 h-3/4 object-cover rounded-2xl" />
    </div>
    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-full px-4 py-2 text-center">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-xs text-pink-600 font-bold">{price}</p>
    </div>
  </div>
);

// Feature Chip Component
const FeatureChip = ({ icon, label }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm hover:shadow-md transition-all">
    <div className="text-2xl">{icon}</div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </div>
);

const Home = () => {
  const { t } = useI18n();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <SplashLoader isVisible={showSplash} onComplete={handleSplashComplete} />
      
      {!showSplash && (
        <>
          <Header />
          
          {/* Hero Section - Matching Design */}
          <main className="animate-fadeIn">
          <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-transparent rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-rose-200 to-transparent rounded-full blur-3xl opacity-30"></div>

            {/* Content Container */}
            <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 w-full">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Section - Text Content */}
                <div className="space-y-8">
                  {/* Tagline */}
                  <div className="space-y-4">
                    <div className="inline-block px-4 py-2 bg-pink-100 rounded-full">
                      <span className="text-pink-700 text-sm font-semibold">✨ Natural Skincare</span>
                    </div>
                    
                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">
                      Get Your
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600">
                        Natural Skin
                      </span>
                    </h1>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-gray-700 leading-relaxed max-w-md">
                    The natural color of the skin is your identity and uniquality, don't change it. we offer best care to protect it.
                  </p>

                  {/* Feature Chips */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <FeatureChip icon="🌿" label="Herbal" />
                    <FeatureChip icon="✨" label="Premium" />
                    <FeatureChip icon="🌍" label="Natural" />
                    <FeatureChip icon="⚗️" label="Science-Based" />
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Link 
                      to="/interactive-skin-quiz"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-pink-500/40 transition-all duration-300 transform hover:scale-105"
                    >
                      <Icon name="Sparkles" size={20} />
                      Start Your Journey
                    </Link>
                  </div>
                </div>

                {/* Right Section - Products Display */}
                <div className="hidden lg:grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <ProductCard 
                      image={IMAGES.hero_skincare || "🧴"}
                      label="Foundation Pro"
                      price="$45"
                    />
                  </div>
                  <div className="space-y-6 mt-12">
                    <ProductCard 
                      image={IMAGES.skincare_routine || "💄"}
                      label="Luxe Serum"
                      price="$38"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* Why Us Section */}
        <section className="py-20 px-4 lg:px-8 bg-gradient-to-b from-white to-pink-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">Why GlowMatch?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Trusted skincare analysis powered by AI and dermatological expertise</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '🧠', title: 'AI-Powered', desc: 'Advanced machine learning analyzes your skin with precision' },
                { icon: '❤️', title: 'Personalized', desc: 'Tailored routines for your unique skin type and goals' },
                { icon: '📊', title: 'Data-Driven', desc: 'Results-backed recommendations from real user data' }
              ].map((item, idx) => (
                <div key={idx} className="group bg-white border border-pink-100 rounded-2xl p-8 hover:shadow-xl hover:border-pink-300 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-2 text-xl">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with Pink Gradient */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/50 to-transparent opacity-60"></div>

          <div className="relative max-w-4xl mx-auto px-4 lg:px-8 text-center text-white py-12">
            <h3 className="text-5xl font-bold mb-4 leading-tight">Discover Your Best Skin</h3>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">Join thousands of people who've already found their perfect skincare routine</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/interactive-skin-quiz"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-pink-600 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <span>Start Quiz Now</span>
                <Icon name="ArrowRight" size={20} />
              </Link>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur border border-white/40 text-white rounded-2xl font-bold hover:bg-white/30 transition-all duration-300"
              >
                <Icon name="Mail" size={20} />
                <span>Get in Touch</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog/Tips Section */}
        <section className="py-20 px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">Skincare Tips & Insights</h2>
              <p className="text-xl text-gray-600">Expert advice for radiant, healthy skin</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: 'Build a Simple Routine', desc: 'A practical guide to skincare essentials and building consistency' },
                { title: 'Understanding Skin Types', desc: 'Learn the differences between oily, dry, combination and sensitive skin' }
              ].map((item, idx) => (
                <Link 
                  key={idx}
                  to="/blog"
                  className="group block overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 hover:border-pink-400 transition-all hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-pink-200 to-rose-200">
                    <div className="w-full h-full flex items-center justify-center text-6xl">💆</div>
                  </div>
                  <div className="p-8">
                    <h4 className="font-bold text-gray-900 mb-2 text-xl group-hover:text-pink-600 transition-colors">{item.title}</h4>
                    <p className="text-gray-600 mb-4">{item.desc}</p>
                    <span className="inline-flex items-center text-pink-600 font-bold group-hover:translate-x-2 transition-transform">
                      Read More <Icon name="ArrowRight" size={16} className="ml-2" />
                    </span>
                  </div>
                </Link>
              ))}
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
