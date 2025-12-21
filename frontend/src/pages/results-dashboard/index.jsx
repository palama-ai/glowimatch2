import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import { quizService } from '../../lib/supabase';
import SkinTypeSummary from './components/SkinTypeSummary';
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';
import SkinAnalysisBreakdown from './components/SkinAnalysisBreakdown';
import SkincareRoutine from './components/SkincareRoutine';
import ProductModal from './components/ProductModal';
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
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [allProducts, setAllProducts] = useState([]); // Store all fetched products for filtering
  const [selectedProduct, setSelectedProduct] = useState(null); // { product, index }
  const [attemptId, setAttemptId] = useState(null); // Track current quiz attempt ID
  const analysisAlreadySaved = useRef(false); // Track if we've already saved analysis for this session
  const productsSaved = useRef(false); // Track if we've already saved products for this session

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

  // No fallback mock products - show empty state when no products available

  // Fetch AI-recommended products using voting system
  const fetchRecommendedProducts = async (analysis) => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

      // Get auth header for authenticated requests
      const getAuthHeader = () => {
        try {
          const raw = localStorage.getItem('gm_auth');
          if (!raw) return {};
          const p = JSON.parse(raw);
          return { Authorization: `Bearer ${p.token}` };
        } catch { return {}; }
      };

      const resp = await fetch(`${API_BASE}/products/ai-recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ analysis })
      });

      if (!resp.ok) {
        throw new Error('Failed to fetch AI recommendations');
      }

      const json = await resp.json();
      const products = json?.data || [];

      // Store voting info for display
      if (json?.votingInfo) {
        console.log('[AI Voting]', json.votingInfo);
      }

      // Set products from API (may be empty if no seller products exist)
      setAllProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      setProductsError('Unable to load AI product recommendations');
      // Keep empty state on error
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Initial data loading - runs once on mount
  useEffect(() => {
    const analysisData = localStorage.getItem('glowmatch-analysis');
    const quizDataRaw = localStorage.getItem('glowmatch-quiz-data');
    if (!analysisData || !quizDataRaw) {
      navigate('/interactive-skin-quiz');
      return;
    }

    try {
      const parsed = JSON.parse(analysisData);
      const quizParsed = JSON.parse(quizDataRaw);
      const currentAttemptId = quizParsed?.attemptId || null;
      setAttemptId(currentAttemptId);
      setAnalysisState(parsed);

      // Check if we have pre-saved analysis data (from quiz history)
      const savedAnalysis = parsed?.savedAnalysis || null;
      if (savedAnalysis && savedAnalysis.metrics) {
        console.log('[Results] Using saved analysis data');
        setDetailedState(savedAnalysis);
        if (savedAnalysis.products?.length > 0) {
          setAllProducts(savedAnalysis.products);
          setFilteredProducts(savedAnalysis.products);
        } else {
          fetchRecommendedProducts(parsed);
        }
        return; // Don't re-fetch AI data
      }

      // Set initial detailed state from local data
      const detailed = parsed?.detailed || parsed?.raw?.detailed || null;
      if (detailed) {
        setDetailedState(detailed);
      }

      // Fetch AI-recommended products using voting system
      fetchRecommendedProducts(parsed);

      // Request server-side generation (best-effort, don't overwrite existing data on failure)
      (async (provider = expandProvider) => {
        try {
          setExpandLoading(true); setExpandError(null);
          const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

          // Get auth header for authenticated requests
          const getAuthHeader = () => {
            try {
              const raw = localStorage.getItem('gm_auth');
              if (!raw) return {};
              const p = JSON.parse(raw);
              return { Authorization: `Bearer ${p.token}` };
            } catch { return {}; }
          };

          const resp = await fetch(`${API_BASE}/analysis/expand`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify({ analysis: parsed, provider })
          });

          if (!resp.ok) {
            const errText = await resp.text().catch(() => 'Unknown error');
            console.warn('Expand API failed:', resp.status, errText);
            setExpandError('Unable to generate detailed analysis');
            setExpandLoading(false);
            return;
          }

          const j = await resp.json();
          console.log('[Expand] Response:', j);
          setExpandProviderUsed(j?.data?.provider || null);
          const gen = j?.data?.generated || null;

          if (gen && (gen.metrics?.length > 0 || gen.tips?.length > 0 || gen.routine)) {
            // Update with AI generated data
            const newDetailedState = {
              metrics: gen.metrics?.length > 0 ? gen.metrics : [],
              tips: gen.tips?.length > 0 ? gen.tips : [],
              routine: gen.routine || null,
              rationale: gen.rationale || null,
              generatedAt: new Date().toISOString()
            };
            setDetailedState(prev => ({
              ...(prev || {}),
              ...newDetailedState
            }));

            // Save to database if we have an attemptId and haven't already saved
            if (currentAttemptId && !analysisAlreadySaved.current) {
              analysisAlreadySaved.current = true;
              console.log('[Results] Saving AI analysis to database for attempt:', currentAttemptId);
              quizService.saveQuizAnalysis(currentAttemptId, newDetailedState)
                .then(result => {
                  if (result.success) {
                    console.log('[Results] Analysis saved successfully');
                  } else {
                    console.warn('[Results] Failed to save analysis:', result.error);
                  }
                })
                .catch(err => console.warn('[Results] Error saving analysis:', err));
            }
          } else {
            console.warn('[Expand] No meaningful data in response:', gen);
            setExpandError('AI could not generate detailed analysis');
          }
        } catch (e) {
          console.warn('Expand fetch failed:', e);
          setExpandError('Failed to generate analysis');
        } finally {
          setExpandLoading(false);
        }
      })();
    } catch (error) {
      console.error('Error parsing analysis data:', error);
      navigate('/interactive-skin-quiz');
    }
  }, [navigate]); // Only run on mount

  // Product filtering - runs when filters change
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];
    Object.entries(activeFilters)?.forEach(([category, values]) => {
      if (values?.length > 0) {
        filtered = filtered?.filter((product) => {
          if (category === 'type') return values?.includes(product?.type) || values?.includes(product?.category);
          if (category === 'priceRange') return values?.includes(product?.priceRange);
          if (category === 'concerns') {
            const productConcerns = Array.isArray(product?.concerns) ? product.concerns : [];
            return values?.some((concern) => productConcerns?.includes(concern));
          }
          return true;
        });
      }
    });
    setFilteredProducts(filtered);
  }, [activeFilters, allProducts]);

  // Save products to database when they're loaded
  useEffect(() => {
    if (allProducts.length > 0 && attemptId && !productsLoading && !productsSaved.current) {
      productsSaved.current = true; // Prevent duplicate saves
      // Update the saved analysis to include products
      console.log('[Results] Saving products to database for attempt:', attemptId);
      quizService.saveQuizAnalysis(attemptId, {
        ...(detailedState || {}),
        products: allProducts,
        productsUpdatedAt: new Date().toISOString()
      })
        .then(result => {
          if (result.success) {
            console.log('[Results] Products saved successfully');
          } else {
            console.warn('[Results] Failed to save products:', result.error);
          }
        })
        .catch(err => console.warn('[Results] Error saving products:', err));
    }
  }, [allProducts, attemptId, productsLoading]); // Only run when products change

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
  const currentDetailed = detailedState || null;

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
                routineSteps={currentDetailed?.routine || null}
                isLoading={expandLoading}
                error={expandError}
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
                  {productsLoading ? 'Loading...' : `${filteredProducts?.length} products`}
                </span>
              </div>

              {productsLoading && (
                <div className="flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground py-12">
                  <Icon name="Loader2" size={24} className="animate-spin text-accent" />
                  <div className="text-center">
                    <p className="font-medium text-foreground">AI is analyzing products for you...</p>
                    <p className="text-xs mt-1">Multiple AI models are voting on the best matches</p>
                  </div>
                </div>
              )}

              {productsError && !productsLoading && (
                <div className="text-center py-8 px-4 bg-yellow-50 border border-yellow-200 rounded-2xl mb-4">
                  <Icon name="AlertCircle" size={24} className="text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-yellow-700">{productsError}</p>
                  <p className="text-xs text-yellow-600 mt-1">Showing fallback recommendations</p>
                </div>
              )}

              {!productsLoading && filteredProducts?.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts?.map((product, index) => (
                    <div key={product?.id} onClick={() => setSelectedProduct({ product, index })} className="cursor-pointer">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : !productsLoading && allProducts?.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-2xl">
                  <Icon name="Package" size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-2">No products available yet</p>
                  <p className="text-sm text-muted-foreground">Products will appear here once they are added by sellers</p>
                </div>
              ) : !productsLoading ? (
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
              ) : null}
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

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct.product}
          products={filteredProducts}
          currentIndex={selectedProduct.index}
          onClose={() => setSelectedProduct(null)}
          onNavigate={(newIndex) => setSelectedProduct({
            product: filteredProducts[newIndex],
            index: newIndex
          })}
        />
      )}
    </div>
  );
};

export default ResultsDashboard;
