import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import { useI18n } from '../../contexts/I18nContext';
import { quizService } from '../../lib/supabase';
import SkinTypeSummary from './components/SkinTypeSummary';
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';
import SkinAnalysisBreakdown from './components/SkinAnalysisBreakdown';
import SkincareRoutine from './components/SkincareRoutine';
import ProductModal from './components/ProductModal';
import Icon from '../../components/AppIcon';

// Generate a fallback routine based on skin type when AI fails
const generateFallbackRoutine = (skinType) => {
  const baseRoutine = {
    morning: [
      {
        type: 'cleanser',
        name: 'Gentle Cleanser',
        description: 'Start your day with a gentle cleanser to remove overnight oil and impurities.',
        timing: '1-2 minutes',
        tips: 'Use lukewarm water and massage in circular motions.'
      },
      {
        type: 'toner',
        name: 'Hydrating Toner',
        description: 'Balance your skin\'s pH and prepare it for the next steps.',
        timing: '30 seconds',
        tips: 'Pat gently into skin rather than rubbing.'
      },
      {
        type: 'serum',
        name: 'Vitamin C Serum',
        description: 'Antioxidant protection and brightening for the day ahead.',
        timing: '1 minute',
        tips: 'Apply to slightly damp skin for better absorption.'
      },
      {
        type: 'moisturizer',
        name: 'Lightweight Moisturizer',
        description: 'Lock in hydration without feeling heavy.',
        timing: '1 minute',
        tips: 'Let it absorb before applying sunscreen.'
      },
      {
        type: 'sunscreen',
        name: 'SPF 30+ Sunscreen',
        description: 'Protect your skin from UV damage - the most important step!',
        timing: '1-2 minutes',
        tips: 'Apply generously and reapply every 2 hours when outdoors.'
      }
    ],
    evening: [
      {
        type: 'cleanser',
        name: 'Double Cleanse - Oil Cleanser',
        description: 'Remove makeup and sunscreen with an oil-based cleanser.',
        timing: '1-2 minutes',
        tips: 'Massage thoroughly to break down all impurities.'
      },
      {
        type: 'cleanser',
        name: 'Double Cleanse - Water Cleanser',
        description: 'Follow up with a water-based cleanser for a deep clean.',
        timing: '1-2 minutes',
        tips: 'This ensures all residue is removed.'
      },
      {
        type: 'toner',
        name: 'Hydrating Toner',
        description: 'Rebalance and hydrate your skin after cleansing.',
        timing: '30 seconds',
        tips: 'Use the same toner as your morning routine.'
      },
      {
        type: 'serum',
        name: 'Treatment Serum',
        description: 'Target your specific skin concerns with an active serum.',
        timing: '1 minute',
        tips: 'Night is the best time for active ingredients like retinol.'
      },
      {
        type: 'moisturizer',
        name: 'Night Cream',
        description: 'Rich moisturizer to nourish and repair while you sleep.',
        timing: '1-2 minutes',
        tips: 'Use a slightly heavier formula than your day cream.'
      }
    ]
  };

  // Customize based on skin type
  const skinTypeCustomizations = {
    oily: {
      morning: { moisturizer: 'Oil-Free Gel Moisturizer', serum: 'Niacinamide Serum' },
      evening: { moisturizer: 'Lightweight Gel Cream', serum: 'Salicylic Acid Serum' }
    },
    dry: {
      morning: { moisturizer: 'Rich Hydrating Cream', serum: 'Hyaluronic Acid Serum' },
      evening: { moisturizer: 'Intensive Night Balm', serum: 'Ceramide Serum' }
    },
    sensitive: {
      morning: { moisturizer: 'Calming Moisturizer', serum: 'Centella Asiatica Serum' },
      evening: { moisturizer: 'Soothing Night Cream', serum: 'Aloe Vera Serum' }
    },
    combination: {
      morning: { moisturizer: 'Balancing Lotion', serum: 'Niacinamide Serum' },
      evening: { moisturizer: 'Light Night Cream', serum: 'AHA/BHA Serum' }
    }
  };

  const customization = skinTypeCustomizations[skinType?.toLowerCase()] || skinTypeCustomizations.combination;

  // Apply customizations
  if (customization.morning) {
    const morningMoisturizer = baseRoutine.morning.find(s => s.type === 'moisturizer');
    const morningSerum = baseRoutine.morning.find(s => s.type === 'serum');
    if (morningMoisturizer) morningMoisturizer.name = customization.morning.moisturizer;
    if (morningSerum) morningSerum.name = customization.morning.serum;
  }
  if (customization.evening) {
    const eveningMoisturizer = baseRoutine.evening.find(s => s.type === 'moisturizer');
    const eveningSerum = baseRoutine.evening.find(s => s.type === 'serum');
    if (eveningMoisturizer) eveningMoisturizer.name = customization.evening.moisturizer;
    if (eveningSerum) eveningSerum.name = customization.evening.serum;
  }

  return baseRoutine;
};

const ResultsDashboard = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
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
  const analysisAlreadySaved = useRef(false); // Track if we've already saved for this session

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
    console.log('🚀 [fetchRecommendedProducts] STARTING - skinType:', analysis?.skinType);
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

      // DEBUG: Log full product data to check AI fields
      console.log('[AI-Recommend] Full response:', json);
      console.log('[AI-Recommend] First product aiScore:', products[0]?.aiScore, 'aiReasons:', products[0]?.aiReasons);

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
            // Use fallback routine when API fails
            console.log('[Expand] Using fallback routine for skin type:', parsed?.skinType);
            const fallbackRoutine = generateFallbackRoutine(parsed?.skinType);
            setDetailedState(prev => ({
              ...(prev || {}),
              routine: fallbackRoutine,
              metrics: [],
              tips: [],
              rationale: 'Personalized routine based on your skin type',
              generatedAt: new Date().toISOString(),
              isFallback: true
            }));
            setExpandLoading(false);
            return;
          }

          const j = await resp.json();
          console.log('[Expand] Response:', j);
          setExpandProviderUsed(j?.data?.provider || null);
          const gen = j?.data?.generated || null;

          // Check if we have a valid routine with morning/evening arrays
          const hasValidRoutine = gen?.routine &&
            (Array.isArray(gen.routine.morning) && gen.routine.morning.length > 0) ||
            (Array.isArray(gen.routine.evening) && gen.routine.evening.length > 0);

          if (gen && (gen.metrics?.length > 0 || gen.tips?.length > 0 || hasValidRoutine)) {
            // Update with AI generated data, but ensure routine exists
            const routineToUse = hasValidRoutine ? gen.routine : generateFallbackRoutine(parsed?.skinType);
            const newDetailedState = {
              metrics: gen.metrics?.length > 0 ? gen.metrics : [],
              tips: gen.tips?.length > 0 ? gen.tips : [],
              routine: routineToUse,
              rationale: gen.rationale || null,
              generatedAt: new Date().toISOString(),
              isFallback: !hasValidRoutine
            };
            setDetailedState(prev => ({
              ...(prev || {}),
              ...newDetailedState
            }));
          } else {
            console.warn('[Expand] No meaningful data in response, using fallback:', gen);
            // Use fallback routine when AI returns incomplete data
            const fallbackRoutine = generateFallbackRoutine(parsed?.skinType);
            setDetailedState(prev => ({
              ...(prev || {}),
              routine: fallbackRoutine,
              metrics: gen?.metrics || [],
              tips: gen?.tips || [],
              rationale: 'Personalized routine based on your skin type',
              generatedAt: new Date().toISOString(),
              isFallback: true
            }));
          }
        } catch (e) {
          console.warn('Expand fetch failed:', e);
          // Use fallback routine on any error
          const analysisData = localStorage.getItem('glowmatch-analysis');
          let skinType = 'combination';
          try {
            const parsed = JSON.parse(analysisData);
            skinType = parsed?.skinType || 'combination';
          } catch { }
          console.log('[Expand] Using fallback routine after error for skin type:', skinType);
          const fallbackRoutine = generateFallbackRoutine(skinType);
          setDetailedState(prev => ({
            ...(prev || {}),
            routine: fallbackRoutine,
            metrics: [],
            tips: [],
            rationale: 'Personalized routine based on your skin type',
            generatedAt: new Date().toISOString(),
            isFallback: true
          }));
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

  // Combined save: Save both analysis AND products together when both are ready
  useEffect(() => {
    // Wait until we have: attemptId, products loaded, and not already saved
    const hasProducts = allProducts.length > 0 && !productsLoading;
    const hasAnalysis = detailedState && (detailedState.metrics?.length > 0 || detailedState.routine);

    if (attemptId && hasProducts && !analysisAlreadySaved.current) {
      analysisAlreadySaved.current = true;

      const completeAnalysis = {
        ...(detailedState || {}),
        products: allProducts,
        savedAt: new Date().toISOString()
      };

      console.log('[Results] Saving complete analysis + products to database for attempt:', attemptId);
      quizService.saveQuizAnalysis(attemptId, completeAnalysis)
        .then(result => {
          if (result.success) {
            console.log('[Results] Complete analysis saved successfully');
          } else {
            console.warn('[Results] Failed to save:', result.error);
          }
        })
        .catch(err => console.warn('[Results] Error saving:', err));
    }
  }, [allProducts, attemptId, productsLoading, detailedState]); // Trigger when any of these change

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
    { id: 'analysis', label: t('tab_analysis'), icon: 'BarChart3' },
    { id: 'routine', label: t('tab_routine'), icon: 'Clock' },
    { id: 'products', label: t('tab_products'), icon: 'ShoppingBag' }
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
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 rounded-full text-xs sm:text-sm text-accent font-medium mb-3 sm:mb-4">
              <Icon name="Sparkles" size={14} className="sm:hidden" />
              <Icon name="Sparkles" size={16} className="hidden sm:block" />
              {t('analysis_complete_badge')}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
              {t('results_profile_title')}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
              {t('results_profile_desc')}
            </p>
          </div>

          {/* Skin Type Summary */}
          <SkinTypeSummary
            skinType={currentAnalysis?.skinType}
            confidence={currentAnalysis?.confidence}
            characteristics={currentAnalysis?.characteristics || currentAnalysis?.concerns || []}
          />

          {/* Tab Navigation */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex p-1 sm:p-1.5 bg-muted/50 rounded-xl sm:rounded-2xl overflow-x-auto max-w-full">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab?.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Icon name={tab?.icon} size={14} className="sm:hidden" />
                  <Icon name={tab?.icon} size={16} className="hidden sm:block" />
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
                  {t('generating_analysis')}
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
                  {t('recommended_for_you')}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {productsLoading ? t('loading') : `${filteredProducts?.length} ${t('tab_products')}`}
                </span>
              </div>

              {productsLoading && (
                <div className="flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground py-12">
                  <Icon name="Loader2" size={24} className="animate-spin text-accent" />
                  <div className="text-center">
                    <p className="font-medium text-foreground">{t('products_analyzing')}</p>
                    <p className="text-xs mt-1">{t('products_analyzing_sub')}</p>
                  </div>
                </div>
              )}

              {productsError && !productsLoading && (
                <div className="text-center py-8 px-4 bg-yellow-50 border border-yellow-200 rounded-2xl mb-4">
                  <Icon name="AlertCircle" size={24} className="text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-yellow-700">{productsError || t('products_error')}</p>
                  <p className="text-xs text-yellow-600 mt-1">{t('products_fallback')}</p>
                </div>
              )}

              {!productsLoading && filteredProducts?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredProducts?.map((product, index) => (
                    <div key={product?.id} onClick={() => setSelectedProduct({ product, index })} className="cursor-pointer">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : !productsLoading && allProducts?.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-2xl">
                  <Icon name="Package" size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-2">{t('no_products_title')}</p>
                  <p className="text-sm text-muted-foreground">{t('no_products_desc')}</p>
                </div>
              ) : !productsLoading ? (
                <div className="text-center py-12 bg-muted/30 rounded-2xl">
                  <Icon name="Search" size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">{t('no_match_title')}</p>
                  <button
                    onClick={() => setActiveFilters({ type: [], priceRange: [], concerns: [] })}
                    className="text-sm text-accent hover:underline"
                  >
                    {t('clear_filters')}
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Retake Quiz CTA */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-flex flex-col items-center p-4 sm:p-6 glass-accent rounded-2xl">
              <Icon name="RefreshCw" size={20} className="text-accent mb-2 sm:mb-3 sm:hidden" />
              <Icon name="RefreshCw" size={24} className="text-accent mb-2 sm:mb-3 hidden sm:block" />
              <p className="text-xs sm:text-sm text-foreground mb-2 sm:mb-3">
                {t('retake_quiz_desc')}
              </p>
              <button
                onClick={handleRetakeQuiz}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-accent text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-accent/90 transition-colors"
              >
                {t('take_another_quiz')}
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
