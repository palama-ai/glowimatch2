import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SkinTypeSummary from './components/SkinTypeSummary';
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';
import SkinAnalysisBreakdown from './components/SkinAnalysisBreakdown';
import SkincareRoutine from './components/SkincareRoutine';
import Icon from '../../components/AppIcon';

const ResultsDashboard = () => {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState({
    type: [],
    priceRange: [],
    concerns: []
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('analysis');
  const [analysisState, setAnalysisState] = useState(null);
  const [detailedState, setDetailedState] = useState(null);
  const [expandLoading, setExpandLoading] = useState(false);
  const [expandError, setExpandError] = useState(null);
  const [expandProvider, setExpandProvider] = useState('gemini');
  const [expandProviderUsed, setExpandProviderUsed] = useState(null);

  // Mock analysis results data
  const analysisResults = {
    skinType: "combination",
    confidence: 87,
    characteristics: [
      "Oily T-zone with enlarged pores",
      "Dry cheek areas requiring hydration",
      "Occasional breakouts around nose",
      "Good overall skin texture"
    ]
  };

  // Mock detailed analysis data
  const detailedAnalysis = {
    metrics: [
      { name: "Moisture", score: 65, icon: "Droplets" },
      { name: "Oil Level", score: 78, icon: "Zap" },
      { name: "Pore Size", score: 45, icon: "Circle" },
      { name: "Texture", score: 82, icon: "Layers" },
      { name: "Sensitivity", score: 70, icon: "Shield" }
    ],
    tips: [
      "Use a gentle cleanser twice daily to maintain balance",
      "Apply different moisturizers to T-zone and cheeks",
      "Incorporate a BHA exfoliant 2-3 times per week",
      "Always use SPF 30+ sunscreen during the day"
    ]
  };

  // Mock skincare routine data
  const skincareRoutine = {
    morning: [
      { type: "cleanser", name: "Gentle Foaming Cleanser", description: "Start with a mild, pH-balanced cleanser.", timing: "2 min", tips: "Use lukewarm water and gentle motions." },
      { type: "toner", name: "Balancing Toner", description: "Restore pH balance and prep skin.", timing: "30 sec", tips: "Focus on T-zone for oil control." },
      { type: "serum", name: "Niacinamide Serum", description: "Target pores and oil production.", timing: "1 min", tips: "Apply to T-zone primarily." },
      { type: "moisturizer", name: "Lightweight Moisturizer", description: "Gel-based for T-zone, cream for cheeks.", timing: "1 min" },
      { type: "sunscreen", name: "SPF 30+ Sunscreen", description: "Broad-spectrum protection.", timing: "1 min", tips: "Reapply every 2 hours outdoors." }
    ],
    evening: [
      { type: "cleanser", name: "Double Cleanse", description: "Oil cleanser then foaming cleanser.", timing: "3 min" },
      { type: "treatment", name: "BHA Exfoliant", description: "Salicylic acid 2-3x per week.", timing: "Leave on", tips: "Apply to problem areas." },
      { type: "serum", name: "Hydrating Serum", description: "Hyaluronic acid for moisture.", timing: "1 min", tips: "Apply to damp skin." },
      { type: "moisturizer", name: "Night Moisturizer", description: "Richer formula for overnight repair.", timing: "2 min" }
    ]
  };

  // Mock products
  const mockProducts = [
    { id: 1, name: "Gentle Foaming Cleanser", brand: "CeraVe", price: 12.99, originalPrice: 15.99, rating: 4.5, reviewCount: 2847, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03", badge: "Best Seller", purchaseUrl: "#", type: "cleanser", concerns: ["sensitivity"] },
    { id: 2, name: "Niacinamide 10% + Zinc", brand: "The Ordinary", price: 7.20, rating: 4.3, reviewCount: 5632, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be", purchaseUrl: "#", type: "serum", concerns: ["pores", "acne"] },
    { id: 3, name: "Hyaluronic Acid Serum", brand: "Neutrogena", price: 18.99, originalPrice: 22.99, rating: 4.4, reviewCount: 1923, image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15", badge: "Editor Pick", purchaseUrl: "#", type: "serum", concerns: ["dryness"] },
    { id: 4, name: "Daily Moisturizer SPF 30", brand: "Olay", price: 24.99, rating: 4.2, reviewCount: 3456, image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd", purchaseUrl: "#", type: "moisturizer", concerns: ["dryness"] },
    { id: 5, name: "BHA Liquid Exfoliant", brand: "Paula's Choice", price: 32.00, rating: 4.6, reviewCount: 8934, image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc", badge: "Top Rated", purchaseUrl: "#", type: "serum", concerns: ["acne", "pores"] },
    { id: 6, name: "Mineral Sunscreen SPF 50", brand: "EltaMD", price: 37.00, rating: 4.7, reviewCount: 2156, image: "https://images.unsplash.com/photo-1556227834-09f1de7a7d14", purchaseUrl: "#", type: "sunscreen", concerns: ["sensitivity"] }
  ];

  // Initial data loading - runs once on mount
  useEffect(() => {
    const analysisData = localStorage.getItem('glowmatch-analysis');
    const quizData = localStorage.getItem('glowmatch-quiz-data');
    if (!analysisData || !quizData) {
      navigate('/interactive-skin-quiz');
      return;
    }

    try {
      const parsed = JSON.parse(analysisData);
      const detailed = parsed?.detailed || parsed?.raw?.detailed || null;
      setAnalysisState(parsed);

      // Set initial detailed state from local data
      if (detailed) {
        setDetailedState(detailed);
      }

      // Set initial products based on concerns
      const concerns = parsed?.concerns || [];
      if (concerns.length > 0) {
        setFilteredProducts(mockProducts?.filter(product => product?.concerns?.some(concern => concerns?.includes(concern))));
      } else {
        setFilteredProducts(mockProducts);
      }

      // Request server-side generation (best-effort, don't overwrite existing data on failure)
      (async (provider = expandProvider) => {
        try {
          setExpandLoading(true); setExpandError(null);
          const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';
          const resp = await fetch(`${API_BASE}/analysis/expand`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ analysis: parsed, provider })
          });
          if (!resp.ok) {
            console.warn('Expand API failed, keeping existing data');
            return;
          }
          const j = await resp.json();
          setExpandProviderUsed(j?.data?.provider || null);
          const gen = j?.data?.generated || null;
          if (gen && (gen.metrics?.length > 0 || gen.tips?.length > 0 || gen.routine)) {
            // Only update if we got meaningful data back
            setDetailedState(prev => ({
              ...(prev || {}),
              metrics: gen.metrics?.length > 0 ? gen.metrics : (prev?.metrics || []),
              tips: gen.tips?.length > 0 ? gen.tips : (prev?.tips || []),
              routine: gen.routine || prev?.routine || null
            }));
          }
        } catch (e) {
          console.warn('Expand fetch failed, keeping existing data:', e);
        } finally { setExpandLoading(false); }
      })();
    } catch (error) {
      console.error('Error parsing analysis data:', error);
      navigate('/interactive-skin-quiz');
    }
  }, [navigate]); // Only run on mount

  // Product filtering - runs when filters change
  useEffect(() => {
    let filtered = mockProducts;
    Object.entries(activeFilters)?.forEach(([category, values]) => {
      if (values?.length > 0) {
        filtered = filtered?.filter((product) => {
          if (category === 'type') return values?.includes(product?.type);
          if (category === 'priceRange') return values?.includes(product?.priceRange);
          if (category === 'concerns') return values?.some((concern) => product?.concerns?.includes(concern));
          return true;
        });
      }
    });
    setFilteredProducts(filtered);
  }, [activeFilters]);

  const handleFilterChange = (category, values) => {
    setActiveFilters((prev) => ({ ...prev, [category]: values }));
  };

  const handleRetakeQuiz = () => {
    localStorage.removeItem('glowmatch-analysis');
    localStorage.removeItem('glowmatch-quiz-data');
    localStorage.removeItem('glowmatch-quiz-progress');
    navigate('/interactive-skin-quiz');
  };

  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: 'BarChart3' },
    { id: 'routine', label: 'Routine', icon: 'Clock' },
    { id: 'products', label: 'Products', icon: 'ShoppingBag' }
  ];

  const currentAnalysis = analysisState || analysisResults;
  const currentDetailed = detailedState || detailedAnalysis;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Gradient */}
      <div className="gradient-hero">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Page Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-sm text-accent font-medium mb-4">
              <Icon name="Sparkles" size={16} />
              Analysis Complete
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Your Skin Profile
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Personalized insights and recommendations based on your unique skin analysis.
            </p>
          </div>

          {/* Skin Type Summary */}
          <SkinTypeSummary
            skinType={currentAnalysis?.skinType}
            confidence={currentAnalysis?.confidence}
            characteristics={currentAnalysis?.characteristics || currentAnalysis?.concerns || []}
          />

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 bg-muted/50 rounded-2xl">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab?.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'analysis' && (
            <div className="animate-fade-in">
              {expandLoading && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Generating detailed analysis...
                </div>
              )}
              <SkinAnalysisBreakdown analysisData={currentDetailed} />
            </div>
          )}

          {activeTab === 'routine' && (
            <div className="animate-fade-in">
              <SkincareRoutine
                skinType={currentAnalysis?.skinType}
                routineSteps={(currentDetailed?.routine) || skincareRoutine}
              />
            </div>
          )}

          {activeTab === 'products' && (
            <div className="animate-fade-in">
              <ProductFilters onFilterChange={handleFilterChange} activeFilters={activeFilters} />

              <div className="flex items-center justify-between mb-4 mt-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Recommended for You
                </h2>
                <span className="text-sm text-muted-foreground">
                  {filteredProducts?.length} products
                </span>
              </div>

              {filteredProducts?.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts?.map((product) => (
                    <ProductCard key={product?.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-2xl">
                  <Icon name="Search" size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No products match your filters</p>
                  <button
                    onClick={() => setActiveFilters({ type: [], priceRange: [], concerns: [] })}
                    className="text-sm text-accent hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Retake Quiz CTA */}
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col items-center p-6 glass-accent rounded-2xl">
              <Icon name="RefreshCw" size={24} className="text-accent mb-3" />
              <p className="text-sm text-foreground mb-3">
                Skin changes over time. Retake the quiz for updated recommendations.
              </p>
              <button
                onClick={handleRetakeQuiz}
                className="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent/90 transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResultsDashboard;