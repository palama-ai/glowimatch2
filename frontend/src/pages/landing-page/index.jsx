import React from 'react';
import HeroSection from './components/HeroSection';
import FeatureHighlights from './components/FeatureHighlights';
import TrustSignals from './components/TrustSignals';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeatureHighlights />
      <TrustSignals />
    </div>
  );
};

export default LandingPage;