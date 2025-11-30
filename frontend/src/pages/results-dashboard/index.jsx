import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import ResultsActionBar from '../../components/ui/ResultsActionBar';
import SkinTypeSummary from './components/SkinTypeSummary';
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';
import SkinAnalysisBreakdown from './components/SkinAnalysisBreakdown';
import SkincareRoutine from './components/SkincareRoutine';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ResultsDashboard = () => {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState({
    type: [],
    priceRange: [],
    concerns: []
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
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
    "Good overall skin texture",
    "Mild sensitivity to fragrances",
    "Normal elasticity and firmness"]

  };

  // Mock detailed analysis data
  const detailedAnalysis = {
    metrics: [
    {
      name: "Moisture Level",
      score: 65,
      icon: "Droplets",
      description: "Your skin shows moderate hydration levels. Focus on maintaining moisture balance."
    },
    {
      name: "Oil Production",
      score: 78,
      icon: "Zap",
      description: "Higher sebum production in T-zone area. Use oil-control products strategically."
    },
    {
      name: "Pore Visibility",
      score: 45,
      icon: "Circle",
      description: "Enlarged pores detected, particularly around nose area. Consider pore-minimizing treatments."
    },
    {
      name: "Skin Texture",
      score: 82,
      icon: "Layers",
      description: "Good overall texture with minor rough patches. Regular exfoliation recommended."
    },
    {
      name: "Sensitivity Level",
      score: 70,
      icon: "Shield",
      description: "Mild sensitivity detected. Choose gentle, fragrance-free formulations."
    }],

    tips: [
    "Use a gentle cleanser twice daily to maintain balance without over-drying",
    "Apply different moisturizers to T-zone and cheek areas based on their needs",
    "Incorporate a BHA exfoliant 2-3 times per week to address pores",
    "Always use SPF 30+ sunscreen during the day to prevent further damage",
    "Introduce new products gradually to avoid irritation"]

  };

  // Mock skincare routine data
  const skincareRoutine = {
    morning: [
    {
      type: "cleanser",
      name: "Gentle Foaming Cleanser",
      description: "Start with a mild, pH-balanced cleanser to remove overnight buildup without stripping natural oils.",
      timing: "2 minutes",
      tips: "Use lukewarm water and gentle circular motions. Avoid over-cleansing the dry areas of your face."
    },
    {
      type: "toner",
      name: "Balancing Toner",
      description: "Apply a hydrating toner to restore pH balance and prep skin for subsequent products.",
      timing: "30 seconds",
      tips: "Use a cotton pad or pat gently with hands. Focus on T-zone for oil control."
    },
    {
      type: "serum",
      name: "Niacinamide Serum",
      description: "Target enlarged pores and oil production with a niacinamide-based serum.",
      timing: "1 minute",
      tips: "Apply to T-zone primarily, then blend outward. Wait for absorption before next step."
    },
    {
      type: "moisturizer",
      name: "Lightweight Moisturizer",
      description: "Use a gel-based moisturizer for T-zone and cream-based for cheeks.",
      timing: "1 minute",
      tips: "Customize application - lighter on oily areas, more generous on dry zones."
    },
    {
      type: "sunscreen",
      name: "Broad Spectrum SPF 30+",
      description: "Finish with a non-comedogenic sunscreen to protect from UV damage.",
      timing: "1 minute",
      tips: "Reapply every 2 hours if outdoors. Choose mineral sunscreen if you have sensitivity."
    }],

    evening: [
    {
      type: "cleanser",
      name: "Double Cleanse",
      description: "Remove makeup and sunscreen with an oil cleanser, followed by your gentle foaming cleanser.",
      timing: "3 minutes",
      tips: "Massage oil cleanser for 1 minute, then follow with water-based cleanser."
    },
    {
      type: "treatment",
      name: "BHA Exfoliant (2-3x/week)",
      description: "Use salicylic acid to unclog pores and improve skin texture.",
      timing: "Leave on",
      tips: "Start with 2x per week. Apply to T-zone and areas with enlarged pores."
    },
    {
      type: "serum",
      name: "Hydrating Serum",
      description: "Apply a hyaluronic acid serum to boost moisture levels.",
      timing: "1 minute",
      tips: "Apply to damp skin for better absorption. Focus on dry cheek areas."
    },
    {
      type: "moisturizer",
      name: "Night Moisturizer",
      description: "Use a richer moisturizer to repair and hydrate overnight.",
      timing: "2 minutes",
      tips: "Be generous on dry areas, lighter on T-zone. Allow full absorption before bed."
    }]

  };

  // Mock product recommendations
  const mockProducts = [
  {
    id: 1,
    name: "Gentle Foaming Cleanser",
    brand: "CeraVe",
    price: 12.99,
    originalPrice: 15.99,
    rating: 4.5,
    reviewCount: 2847,
    image: "https://images.unsplash.com/photo-1735286770188-de4c5131589a",
    imageAlt: "White bottle of CeraVe foaming cleanser with pump dispenser on clean white background",
    description: "A gentle, non-comedogenic cleanser that removes dirt and makeup without disrupting the skin barrier.",
    badge: "Best Seller",
    purchaseUrl: "https://example.com/buy/cerave-cleanser",
    detailsUrl: "https://example.com/product/cerave-cleanser",
    type: "cleanser",
    priceRange: "0-25",
    concerns: ["sensitivity", "dryness"]
  },
  {
    id: 2,
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    price: 7.20,
    rating: 4.3,
    reviewCount: 5632,
    image: "https://images.unsplash.com/photo-1615354650192-e5a5bd9aa169",
    imageAlt: "Small glass dropper bottle of The Ordinary niacinamide serum with white label on marble surface",
    description: "High-strength niacinamide serum to reduce the appearance of pores and regulate sebum production.",
    purchaseUrl: "https://example.com/buy/ordinary-niacinamide",
    detailsUrl: "https://example.com/product/ordinary-niacinamide",
    type: "serum",
    priceRange: "0-25",
    concerns: ["pores", "acne"]
  },
  {
    id: 3,
    name: "Hydrating Hyaluronic Acid Serum",
    brand: "Neutrogena",
    price: 18.99,
    originalPrice: 22.99,
    rating: 4.4,
    reviewCount: 1923,
    image: "https://images.unsplash.com/photo-1715750972096-a4820ab5f7f5",
    imageAlt: "Blue and white Neutrogena serum bottle with dropper cap on light blue background",
    description: "Lightweight serum with hyaluronic acid to boost skin hydration for up to 24 hours.",
    badge: "Dermatologist Recommended",
    purchaseUrl: "https://example.com/buy/neutrogena-serum",
    detailsUrl: "https://example.com/product/neutrogena-serum",
    type: "serum",
    priceRange: "0-25",
    concerns: ["dryness"]
  },
  {
    id: 4,
    name: "Daily Facial Moisturizer SPF 30",
    brand: "Olay",
    price: 24.99,
    rating: 4.2,
    reviewCount: 3456,
    image: "https://images.unsplash.com/photo-1630398776959-6ff31b49df55",
    imageAlt: "White jar of Olay daily moisturizer with SPF on clean white surface with soft lighting",
    description: "Lightweight moisturizer with broad-spectrum SPF 30 protection for daily use.",
    purchaseUrl: "https://example.com/buy/olay-moisturizer",
    detailsUrl: "https://example.com/product/olay-moisturizer",
    type: "moisturizer",
    priceRange: "0-25",
    concerns: ["dryness"]
  },
  {
    id: 5,
    name: "BHA Liquid Exfoliant",
    brand: "Paula\'s Choice",
    price: 32.00,
    rating: 4.6,
    reviewCount: 8934,
    image: "https://images.unsplash.com/photo-1697023546958-14293c7409aa",
    imageAlt: "Dark blue bottle of Paula\'s Choice BHA exfoliant with pump dispenser on wooden surface",
    description: "2% salicylic acid treatment to unclog pores and smooth skin texture.",
    badge: "Editor\'s Choice",
    purchaseUrl: "https://example.com/buy/paulas-choice-bha",
    detailsUrl: "https://example.com/product/paulas-choice-bha",
    type: "serum",
    priceRange: "25-50",
    concerns: ["acne", "pores"]
  },
  {
    id: 6,
    name: "Mineral Sunscreen SPF 50",
    brand: "EltaMD",
    price: 37.00,
    rating: 4.7,
    reviewCount: 2156,
    image: "https://images.unsplash.com/photo-1586260297517-8ff8529b997f",
    imageAlt: "White tube of EltaMD mineral sunscreen with blue accents on beach sand background",
    description: "Zinc oxide sunscreen that provides broad-spectrum protection without white cast.",
    purchaseUrl: "https://example.com/buy/eltamd-sunscreen",
    detailsUrl: "https://example.com/product/eltamd-sunscreen",
    type: "sunscreen",
    priceRange: "25-50",
    concerns: ["sensitivity"]
  }];


  useEffect(() => {
    // التحقق من وجود تحليل للمستخدم
    const analysisData = localStorage.getItem('glowmatch-analysis');
    const quizData = localStorage.getItem('glowmatch-quiz-data');
    if (!analysisData || !quizData) {
      navigate('/interactive-skin-quiz');
      return;
    }

    // تحميل نتائج التحليل
    try {
      const parsed = JSON.parse(analysisData);

      // prefer structured detailed data if provided by analysis service
      const detailed = parsed?.detailed || parsed?.raw?.detailed || null;

      setAnalysisState(parsed);
      if (detailed) setDetailedState(detailed);

      // Request server-side generation of routine/expanded metrics when possible
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
            const txt = await resp.text().catch(()=>null);
            setExpandError(`Generation failed: ${resp.status} ${txt || ''}`);
            setExpandLoading(false);
            return;
          }
          const j = await resp.json();
          setExpandProviderUsed(j?.data?.provider || null);
          const gen = j?.data?.generated || null;
          if (gen) {
            // gen may include routine, metrics, tips
            setDetailedState(prev => ({ ...(prev || {}), metrics: gen.metrics || prev?.metrics || [], tips: gen.tips || prev?.tips || [], routine: gen.routine || prev?.routine || null, rationale: gen.rationale || prev?.rationale }));
            if (gen.routine) setFilteredProducts(mockProducts?.filter(product => product?.concerns?.some(c => (parsed?.concerns || []).includes(c))));
            } else {
              setExpandError('Generation returned no content');
          }
        } catch (e) {
          console.debug('expand fetch failed', e);
          setExpandError(String(e?.message || e));
        } finally { setExpandLoading(false); }
      })();

      // update products based on detected concerns (fallback if missing)
      const concerns = parsed?.concerns || [];
      setFilteredProducts(mockProducts?.filter(product => 
        product?.concerns?.some(concern => concerns?.includes(concern))
      ));
    } catch (error) {
      console.error('Error loading analysis data:', error);
      navigate('/interactive-skin-quiz');
    }

    // Filter products based on active filters
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
  }, [activeFilters, navigate]);

  const handleFilterChange = (category, values) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: values
    }));
  };

  const handleRetakeQuiz = () => {
    // مسح كل البيانات المحفوظة
    localStorage.removeItem('glowmatch-analysis');
    localStorage.removeItem('glowmatch-quiz-data');
    localStorage.removeItem('glowmatch-quiz-progress');
    navigate('/interactive-skin-quiz');
  };

  const tabs = [
  { id: 'products', label: 'Recommended Products', icon: 'ShoppingBag' },
  { id: 'routine', label: 'Skincare Routine', icon: 'Clock' },
  { id: 'analysis', label: 'Detailed Analysis', icon: 'BarChart3' }];


  const currentAnalysis = analysisState || analysisResults;
  const currentDetailed = detailedState || detailedAnalysis;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProgressIndicator />
      <main className="max-w-6xl mx-auto px-5 lg:px-8 py-8 pb-24">
        <Breadcrumbs />
        
        {/* Page Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Icon name="Sparkles" size={48} className="mx-auto mb-4 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Personalized Results
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentAnalysis?.raw ? 'Based on your quiz responses and AI image analysis, we\'ve created a personalized skincare plan for you.' : 'Based on your quiz responses, we\'ve created a personalized skincare plan. Upload a photo for more detailed analysis.'}
          </p>
        </div>

        {/* Skin Type Summary */}
        <SkinTypeSummary
          skinType={currentAnalysis?.skinType}
          confidence={currentAnalysis?.confidence}
          characteristics={currentAnalysis?.characteristics || currentAnalysis?.concerns || []} />


        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
          {tabs?.map((tab) =>
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab?.id)}
            iconName={tab?.icon}
            iconPosition="left"
            className="flex-1 md:flex-none">

              {tab?.label}
            </Button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'products' &&
        <div className="animate-fade-in">
            {/* Product Filters */}
            <ProductFilters
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters} />


            {/* Products Grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Recommended Products ({filteredProducts?.length})
                </h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Sparkles" size={16} className="text-accent" />
                  <span>Personalized for {currentAnalysis?.skinType || 'your'} skin</span>
                </div>
              </div>

              {filteredProducts?.length > 0 ?
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts?.map((product) =>
              <ProductCard key={product?.id} product={product} />
              )}
                </div> :

            <div className="text-center py-12 bg-muted/30 rounded-xl">
                  <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to see more recommendations.
                  </p>
                  <Button
                variant="outline"
                onClick={() => setActiveFilters({ type: [], priceRange: [], concerns: [] })}>

                    Clear All Filters
                  </Button>
                </div>
            }
            </div>
          </div>
        }

        {activeTab === 'routine' &&
        <div className="animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{expandLoading ? 'Generating routine…' : (expandError ? `Generation error: ${expandError}` : (currentDetailed?.routine ? `AI-generated routine shown (${expandProviderUsed || expandProvider})` : 'Showing default routine'))}</div>
              <div className="flex items-center gap-2">
                <select value={expandProvider} onChange={e=>setExpandProvider(e.target.value)} className="px-2 py-1 border rounded">
                  <option value="gemini">Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="cloud">Anthropic</option>
                </select>
                <Button onClick={async ()=>{
                  try {
                    const analysisData = localStorage.getItem('glowmatch-analysis');
                    if (!analysisData) return alert('No analysis found in localStorage');
                    const parsed = JSON.parse(analysisData);
                    setExpandLoading(true); setExpandError(null);
                    const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';
                    const resp = await fetch(`${API_BASE}/analysis/expand`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ analysis: parsed, provider: expandProvider }) });
                    if (!resp.ok) { const t = await resp.text().catch(()=>null); setExpandError(`Regenerate failed: ${resp.status} ${t||''}`); return; }
                    const j = await resp.json(); const gen = j?.data?.generated || null;
                    if (gen) setDetailedState(prev => ({ ...(prev||{}), metrics: gen.metrics || prev?.metrics || [], tips: gen.tips || prev?.tips || [], routine: gen.routine || prev?.routine || null, rationale: gen.rationale || prev?.rationale }));
                  } catch (e) { setExpandError(String(e?.message||e)); }
                  finally { setExpandLoading(false); }
                }} className="px-3 py-1">Regenerate</Button>
              </div>
            </div>
            <SkincareRoutine
              skinType={currentAnalysis?.skinType}
              routineSteps={(currentDetailed && currentDetailed.routine) ? currentDetailed.routine : skincareRoutine} />

          </div>
        }

        {activeTab === 'analysis' &&
        <div className="animate-fade-in">
            <div className="mb-3 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{expandLoading ? 'Generating detailed analysis…' : (expandError ? `Generation error: ${expandError}` : (currentDetailed?.metrics ? `AI-generated metrics displayed (${expandProviderUsed || expandProvider})` : 'Showing default analysis'))}</div>
              <div className="flex items-center gap-2">
                <select value={expandProvider} onChange={e=>setExpandProvider(e.target.value)} className="px-2 py-1 border rounded hidden md:inline">
                  <option value="gemini">Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="cloud">Anthropic</option>
                </select>
                <Button size="sm" onClick={async ()=>{
                  try {
                    const analysisData = localStorage.getItem('glowmatch-analysis');
                    if (!analysisData) return alert('No analysis found in localStorage');
                    const parsed = JSON.parse(analysisData);
                    setExpandLoading(true); setExpandError(null);
                    const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';
                    const resp = await fetch(`${API_BASE}/analysis/expand`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ analysis: parsed, provider: expandProvider }) });
                    if (!resp.ok) { const t = await resp.text().catch(()=>null); setExpandError(`Regenerate failed: ${resp.status} ${t||''}`); return; }
                    const j = await resp.json(); const gen = j?.data?.generated || null;
                    if (gen) setDetailedState(prev => ({ ...(prev||{}), metrics: gen.metrics || prev?.metrics || [], tips: gen.tips || prev?.tips || [], routine: gen.routine || prev?.routine || null, rationale: gen.rationale || prev?.rationale }));
                  } catch (e) { setExpandError(String(e?.message||e)); }
                  finally { setExpandLoading(false); }
                }}>Regenerate</Button>
              </div>
            </div>
            <SkinAnalysisBreakdown analysisData={currentDetailed} />
          </div>
        }

        {/* Quick Actions */}
        <div className="mt-12 text-center animate-fade-in">
          <div className="bg-gradient-to-r from-accent/5 to-secondary/5 rounded-xl p-6 border border-accent/10">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Want to update your results?
            </h3>
            <p className="text-muted-foreground mb-4">
              Retake the skin quiz anytime to get updated recommendations as your skin changes.
            </p>
            <Button
              variant="outline"
              onClick={handleRetakeQuiz}
              iconName="RotateCcw"
              iconPosition="left"
              className="animate-scale-hover">

              Retake Skin Quiz
            </Button>
          </div>
        </div>
      </main>
      <ResultsActionBar />
    </div>);

};

export default ResultsDashboard;