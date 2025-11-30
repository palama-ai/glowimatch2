import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, quizService } from '../../lib/supabase';
import { debugLogger } from '../../lib/debugLogger';
import { generateAndUploadReportAndAttach } from '../../lib/reportService';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Button from '../../components/ui/Button';
import QuizIntro from './components/QuizIntro';
import QuestionCard from './components/QuestionCard';
import QuizProgress from './components/QuizProgress';
import QuizComplete from './components/QuizComplete';
import Icon from '../../components/AppIcon';

const InteractiveSkinQuiz = () => {
  const navigate = useNavigate();
  const { 
    user, 
    canTakeQuiz, 
    getRemainingAttempts, 
    recordQuizAttempt,
    refreshProfile,
    getNextResetDate,
    purchaseQuizAttempts 
  } = useAuth();
  const [referralLink, setReferralLink] = useState(null);
  const [fetchingReferral, setFetchingReferral] = useState(false);
  const remainingAttempts = getRemainingAttempts?.();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [lastSaveError, setLastSaveError] = useState(null);

  const questions = [
  {
    id: 1,
    title: "What\'s your primary skin type?",
    subtitle: "Choose the option that best describes your skin most of the time",
    type: "multiple-choice",
    options: [
    {
      id: "oily",
      label: "Oily",
      description: "Shiny, greasy appearance with enlarged pores"
    },
    {
      id: "dry",
      label: "Dry",
      description: "Tight, flaky, or rough texture with fine lines"
    },
    {
      id: "combination",
      label: "Combination",
      description: "Oily T-zone with dry or normal cheeks"
    },
    {
      id: "sensitive",
      label: "Sensitive",
      description: "Easily irritated, red, or reactive to products"
    },
    {
      id: "normal",
      label: "Normal",
      description: "Balanced, neither too oily nor too dry"
    }]

  },
  {
    id: 2,
    title: "How often do you experience breakouts?",
    subtitle: "Think about your skin over the past 3 months",
    type: "multiple-choice",
    options: [
    {
      id: "never",
      label: "Never",
      description: "I rarely get pimples or blemishes"
    },
    {
      id: "rarely",
      label: "Rarely",
      description: "Occasional breakout, maybe once a month"
    },
    {
      id: "sometimes",
      label: "Sometimes",
      description: "A few breakouts per month"
    },
    {
      id: "often",
      label: "Often",
      description: "Weekly breakouts or persistent acne"
    },
    {
      id: "constantly",
      label: "Constantly",
      description: "Daily breakouts or severe acne"
    }]

  },
  {
    id: 3,
    title: "How does your skin feel by midday?",
    subtitle: "After your morning skincare routine",
    type: "multiple-choice",
    options: [
    {
      id: "tight-dry",
      label: "Tight & Dry",
      description: "Feels stretched and needs moisturizer"
    },
    {
      id: "comfortable",
      label: "Comfortable",
      description: "Feels balanced and normal"
    },
    {
      id: "slightly-oily",
      label: "Slightly Oily",
      description: "Some shine in T-zone area"
    },
    {
      id: "very-oily",
      label: "Very Oily",
      description: "Noticeable shine and greasiness"
    },
    {
      id: "irritated",
      label: "Irritated",
      description: "Red, itchy, or uncomfortable"
    }]

  },
  {
    id: 4,
    title: "What\'s your biggest skin concern?",
    subtitle: "Select your primary concern",
    type: "image-selection",
    options: [
    {
      id: "acne",
      label: "Acne & Breakouts",
      image: "https://images.unsplash.com/photo-1452223355713-db7fc5eed0b9",
      imageAlt: "Close-up of skin with acne breakouts and blemishes"
    },
    {
      id: "aging",
      label: "Fine Lines & Aging",
      image: "https://images.unsplash.com/photo-1531067332586-ffe9e4d49477",
      imageAlt: "Mature skin showing fine lines and wrinkles around eyes"
    },
    {
      id: "dryness",
      label: "Dryness & Flaking",
      image: "https://images.unsplash.com/photo-1729617086451-70a40832030b",
      imageAlt: "Dry flaky skin texture with visible peeling"
    },
    {
      id: "pigmentation",
      label: "Dark Spots & Pigmentation",
      image: "https://images.unsplash.com/photo-1702354408183-1d7a58afaf5f",
      imageAlt: "Skin with dark spots and uneven pigmentation"
    },
    {
      id: "sensitivity",
      label: "Redness & Sensitivity",
      image: "https://images.unsplash.com/photo-1694226016585-d4a261afee7c",
      imageAlt: "Sensitive red irritated skin with inflammation"
    },
    {
      id: "pores",
      label: "Large Pores",
      image: "https://images.unsplash.com/photo-1567854143419-b38292f838c5",
      imageAlt: "Close-up of skin showing enlarged visible pores"
    }]

  },
  {
    id: 5,
    title: "How sensitive is your skin to new products?",
    subtitle: "Rate your skin\'s reaction to new skincare products",
    type: "slider",
    min: 1,
    max: 5,
    step: 1,
    labels: {
      1: "Not Sensitive",
      2: "Slightly Sensitive",
      3: "Moderately Sensitive",
      4: "Very Sensitive",
      5: "Extremely Sensitive"
    }
  },
  {
    id: 6,
    title: "What\'s your current skincare routine?",
    subtitle: "How many steps do you typically follow?",
    type: "multiple-choice",
    options: [
    {
      id: "minimal",
      label: "Minimal (1-3 steps)",
      description: "Cleanser and moisturizer, maybe sunscreen"
    },
    {
      id: "basic",
      label: "Basic (4-6 steps)",
      description: "Cleanser, toner, moisturizer, sunscreen, occasional mask"
    },
    {
      id: "comprehensive",
      label: "Comprehensive (7-10 steps)",
      description: "Full routine with serums, treatments, and targeted products"
    },
    {
      id: "extensive",
      label: "Extensive (10+ steps)",
      description: "Multi-step routine with multiple serums and treatments"
    }]

  },
  {
    id: 7,
    title: "How much time do you spend on skincare daily?",
    subtitle: "Include both morning and evening routines",
    type: "multiple-choice",
    options: [
    {
      id: "under-5",
      label: "Under 5 minutes",
      description: "Quick and simple routine"
    },
    {
      id: "5-10",
      label: "5-10 minutes",
      description: "Basic but thorough routine"
    },
    {
      id: "10-20",
      label: "10-20 minutes",
      description: "Detailed routine with multiple products"
    },
    {
      id: "over-20",
      label: "Over 20 minutes",
      description: "Extensive routine with treatments and massage"
    }]

  },
  {
    id: 8,
    title: "What\'s your budget for skincare products?",
    subtitle: "Monthly spending on skincare products",
    type: "multiple-choice",
    options: [
    {
      id: "budget",
      label: "Budget-Friendly ($0-$50)",
      description: "Drugstore and affordable options"
    },
    {
      id: "moderate",
      label: "Moderate ($50-$150)",
      description: "Mix of drugstore and mid-range products"
    },
    {
      id: "premium",
      label: "Premium ($150-$300)",
      description: "High-end and professional products"
    },
    {
      id: "luxury",
      label: "Luxury ($300+)",
      description: "Top-tier and luxury skincare brands"
    }]

  }];

  // compute values inline to avoid initialization order issues

  useEffect(() => {
    // Load saved quiz progress if available and user is logged in
    if (user) {
      const savedProgress = localStorage.getItem('glowmatch-quiz-progress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setQuizStarted(progress?.quizStarted || false);
        setCurrentQuestionIndex(progress?.currentQuestionIndex || 0);
        setResponses(progress?.responses || []);
      }
    }
  }, [user]);

  useEffect(() => {
    // Save quiz progress only if quiz is started and we have actual changes
    if (quizStarted) {
      const progress = {
        quizStarted,
        currentQuestionIndex,
        responses,
        currentAnswer,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('glowmatch-quiz-progress', JSON.stringify(progress));
      
      // تأكد من أن الإجابة الحالية محفوظة
      const question = questions?.[currentQuestionIndex];
      if (question && currentAnswer) {
        const existingResponse = responses.find(r => r.questionId === question.id);
        if (!existingResponse) {
          const newResponse = {
            questionId: question.id,
            question: question.title,
            answer: currentAnswer,
            timestamp: new Date().toISOString()
          };
          setResponses(prev => [...prev, newResponse]);
        }
      }
    }
  }, [quizStarted, currentQuestionIndex, responses, currentAnswer, questions]);

  const handleStartQuiz = async () => {
    try {
      // إذا لم يكن المستخدم مسجل دخوله
      if (!user) {
        setShowAuthPrompt(true);
        return;
      }
      // If user has zero remaining attempts, prompt sharing referral
      const remaining = getRemainingAttempts?.();
      if (typeof remaining === 'number' && remaining <= 0) {
        // Ensure referral link is available for sharing
        try {
          await fetchReferralLink();
        } catch (e) {
          console.debug('fetchReferralLink failed', e);
        }
        alert('You have no quiz attempts left. Share your referral link to get more attempts.');
        return;
      }

      // Consume one attempt via backend
      if (!canTakeQuiz()) {
        navigate('/subscription');
        return;
      }

      try {
        const { data, error } = await quizService.startQuiz();
        if (error || !data) {
          console.error('startQuiz failed', error);
          // Surface server raw body if available so the developer can inspect HTML/error pages
          const details = error?.raw || error?.details || null;
          setLastSaveError({ code: 'START_ATTEMPT_ERROR', message: error?.message || 'Unable to start quiz', details });
          return;
        }
        // refresh profile/subscription in context
        try { await refreshProfile(); } catch(e) { console.debug('profile reload failed', e); }
      } catch (e) {
        console.error('startQuiz request failed', e);
        setLastSaveError({ code: e?.status || 'NETWORK_ERROR', message: e?.message || 'Unable to start quiz at this time', details: e?.raw || null });
        return;
      }

      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setResponses([]);
      setCurrentAnswer(null);
    } catch (error) {
      console.error('Error starting quiz:', error);
      // عرض رسالة خطأ أكثر وضوحاً للمستخدم
      alert('Unable to start the quiz at this moment. Please try again in a few moments.');
    }
  };

  const getAuthHeader = () => {
    try {
      const raw = localStorage.getItem('gm_auth');
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return { Authorization: `Bearer ${parsed.token}` };
    } catch {
      return {};
    }
  };

  const fetchReferralLink = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return null;
    }

    setFetchingReferral(true);
    try {
      const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';
      const resp = await fetch(`${API_BASE}/referrals/me`, {
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
      });
      const json = await resp.json();
      if (resp.ok) {
        // API returns { data: { referral_code, link } }
        const data = json?.data || json;
        let link = data?.link || data?.referral_link || data?.url || (data?.referral_code ? `${window.location.origin}/?ref=${data.referral_code}` : null);

        // If server returned no code (null), attempt to create one
        if (!link || link.includes('ref=null')) {
          // call create endpoint to generate a code
          try {
            const cResp = await fetch(`${API_BASE}/referrals/create`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
            const cJson = await cResp.json().catch(() => null) || {};
            if (cResp.ok && (cJson.data || cJson)) {
              const created = cJson.data || cJson;
              link = created.referral_link || created.link || (created.referral_code ? `${window.location.origin}/?ref=${created.referral_code}` : link);
              setReferralLink(link);
              return link;
            } else {
              console.warn('Failed to create referral code', cJson);
            }
          } catch (e) {
            console.debug('create referral request failed', e);
          }
        }

        setReferralLink(link);
        return link;
      } else {
        console.warn('Failed to fetch referral link', json);
        throw new Error(json?.error || 'Failed to fetch referral link');
      }
    } finally {
      setFetchingReferral(false);
    }
  };

  const handleAnswer = (answer) => {
    console.debug('InteractiveSkinQuiz: handleAnswer called with', answer);
    setCurrentAnswer(answer);
    // حفظ الإجابة مباشرة في الردود أيضاً
    const newResponse = {
      questionId: questions[currentQuestionIndex].id,
      question: questions[currentQuestionIndex].title,
      answer: answer,
      timestamp: new Date().toISOString()
    };

    const updatedResponses = [...responses];
    const existingIndex = updatedResponses.findIndex(r => r.questionId === newResponse.questionId);
    
    if (existingIndex >= 0) {
      updatedResponses[existingIndex] = newResponse;
    } else {
      updatedResponses.push(newResponse);
    }
    
    setResponses(updatedResponses);
  };

  const handleNext = async () => {
    if (currentAnswer) {
      const newResponse = {
        questionId: questions?.[currentQuestionIndex]?.id,
        question: questions?.[currentQuestionIndex]?.title,
        answer: currentAnswer,
        timestamp: new Date().toISOString(),
      };

      const updatedResponses = [...responses];
      const existingIndex = updatedResponses?.findIndex((r) => r?.questionId === newResponse?.questionId);

      if (existingIndex >= 0) {
        updatedResponses[existingIndex] = newResponse;
      } else {
        updatedResponses?.push(newResponse);
      }

      setResponses(updatedResponses);

      if (currentQuestionIndex < questions?.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentAnswer(null);
      } else {
        try {
      // Quiz completed - prepare results
      const quizData = {
        responses: updatedResponses.map(r => ({
          questionId: r.questionId,
          question: r.question,
          answer: {
            id: r.answer?.id,
            label: r.answer?.label,
            value: r.answer?.value || r.answer?.id || r.answer?.label
          }
        })),
        metadata: {
          completedAt: new Date().toISOString(),
          totalQuestions: questions?.length,
          version: '1.0'
        }
      };

      const results = {
        skin_type: updatedResponses.find(r => r.questionId === 1)?.answer?.label || 'unknown',
        concerns: updatedResponses
          .filter(r => r.questionId === 4)
          .map(r => r.answer?.label)
          .filter(Boolean),
        sensitivity_level: updatedResponses.find(r => r.questionId === 5)?.answer?.value || 3,
        routine_complexity: updatedResponses.find(r => r.questionId === 6)?.answer?.id || 'basic',
        completed_at: new Date().toISOString()
      };          // Save directly using the quiz service
          const { data: attemptData, error: saveError } = await quizService.saveQuizAttempt(
            user.id,
            quizData,
            results,
            false
          );

          if (saveError || !attemptData) {
            console.error('Failed to save quiz attempt:', saveError || attemptData);
            throw {
              code: 'SAVE_ERROR',
              message: 'Unable to save your quiz results',
              details: saveError || null
            };
          }

          // Save backup to localStorage with the attempt ID
          localStorage.setItem('glowmatch-quiz-data', JSON.stringify({
            ...quizData,
            attemptId: attemptData.id
          }));
          
          setQuizComplete(true);
          
        } catch (error) {
          console.error('Error completing quiz:', error);
          const errorMessage = error?.message || 'Failed to save quiz data';
          setLastSaveError({
            code: error?.code || 'SAVE_ERROR',
            message: errorMessage,
            details: error?.details || null
          });
          return;
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousResponse = responses?.find((r) => r?.questionId === questions?.[currentQuestionIndex - 1]?.id);
      setCurrentAnswer(previousResponse ? previousResponse?.answer : null);
    }
  };

  const handleContinueToAnalysis = async (model = 'fallback') => {
    console.log('Starting analysis transition...');
    
    try {
      // Check user authentication
      if (!user?.id) {
        console.error('No user ID found');
        throw new Error('User not authenticated');
      }

      // Format quiz data with proper structure
      const quizData = {
        responses: responses.map(r => ({
          questionId: r.questionId,
          question: r.question,
          answer: {
            id: r.answer?.id,
            label: r.answer?.label,
            value: r.answer?.value || r.answer?.id || r.answer?.label || r.answer
          },
          timestamp: r.timestamp
        })),
        metadata: {
          completedAt: new Date().toISOString(),
          totalQuestions: questions?.length,
          version: '1.0'
        }
      };

      // Prepare results summary
      const results = {
        skin_type: responses.find(r => r.questionId === 1)?.answer?.label || 'unknown',
        concerns: responses
          .filter(r => r.questionId === 4)
          .map(r => r.answer?.label)
          .filter(Boolean),
        sensitivity_level: responses.find(r => r.questionId === 5)?.answer?.value || 3,
        routine_complexity: responses.find(r => r.questionId === 6)?.answer?.id || 'basic',
        completed_at: new Date().toISOString()
      };

      console.log('Saving quiz attempt...', { quizData, results });

      // Try RPC save first (preferred). If it fails (permissions / RPC error), fall back to direct insert.
      let attemptData = null;
      try {
        // Try saving using quizService (centralized backend call)
        const { data: serviceData, error: serviceError } = await quizService.saveQuizAttempt(
          user.id,
          quizData,
          results,
          false
        );

        if (serviceError || !serviceData) {
          throw serviceError || new Error('Save failed');
        }

        attemptData = serviceData;
        console.log('Quiz saved via service:', serviceData);
      } catch (err) {
        console.error('Failed to save quiz attempt:', err);
        throw err;
      }

      if (!attemptData) {
        throw new Error('No attempt data returned after save');
      }

      // Try to run AI analysis (best-effort). This analyzes quiz answers (images will be uploaded on next page).
      const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';
      const getAuthHeader = () => {
        try {
          const raw = localStorage.getItem('gm_auth');
          if (!raw) return {};
          const parsed = JSON.parse(raw);
          return { Authorization: `Bearer ${parsed.token}` };
        } catch {
          return {};
        }
      };

      let analysisText = null;
      try {
        const resp = await fetch(`${API_BASE}/analysis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify({ quizData, images: [], model })
        });
        const json = await resp.json();
        if (resp.ok && json?.data) {
          analysisText = json.data.analysis || json.data.result || json.data;
        } else {
          console.warn('Analysis failed or returned no data', json);
        }
      } catch (e) {
        console.warn('Analysis request failed (non-blocking):', e);
      }

      // Attach analysis to attempt data so report generation can include it
      if (analysisText) attemptData.analysis = analysisText;

      // Save backup to localStorage (include attempt id)
      localStorage.setItem('glowmatch-quiz-data', JSON.stringify({
        ...quizData,
        attemptId: attemptData.id
      }));

      // Clean up temporary data
      localStorage.removeItem('glowmatch-quiz-progress');
      localStorage.removeItem('glowmatch-quiz-autosave');
      
      // Reset component state
      setQuizStarted(false);
      setCurrentQuestionIndex(0);
      setResponses([]);
      setCurrentAnswer(null);
      setQuizComplete(false);

      console.log('Navigating to image analysis...');
      
      // Generate PDF report and attach (best-effort). If report generation/upload fails, we still navigate.
      try {
        const reportResult = await generateAndUploadReportAndAttach(attemptData);
        if (reportResult?.success) {
          // update local backup with report url
          const existing = JSON.parse(localStorage.getItem('glowmatch-quiz-data') || '{}');
          localStorage.setItem('glowmatch-quiz-data', JSON.stringify({ ...existing, reportUrl: reportResult.publicUrl }));
        } else {
          console.warn('Report generation/upload returned failure', reportResult.error);
        }
      } catch (reportError) {
        console.error('Report generation/upload failed:', reportError);
        // show non-blocking banner
        setLastSaveError({ code: reportError?.code || 'report_error', message: reportError?.message || String(reportError), details: reportError?.details || null });
      }

      // Navigate to image analysis and pass chosen model so the next page can run image+quiz analysis
      navigate('/image-upload-analysis', { 
        replace: true,
        state: { quizAttemptId: attemptData.id, model }
      });

    } catch (error) {
      // More detailed logging for the user and developer
      console.error('Error in handleContinueToAnalysis:', error);
      debugLogger.error('handleContinueToAnalysis', error);

      // Prepare user-friendly error details and persist them to state so user can copy
      const code = error?.code || error?.status || error?.name || 'unknown';
      const message = error?.message || JSON.stringify(error);
      const details = error?.details || error?.fallback || null;
      const errorPayload = { code, message, details };
      setLastSaveError(errorPayload);

      // Show a helpful alert and keep banner visible
      alert(`Failed to save quiz attempt (code: ${code}). Please try again. More details are shown on the page. If this continues, open the browser console and share the error details.`);
      return;
    }
  };

  

  // الحفظ التلقائي كل 30 ثانية
  useEffect(() => {
    if (!quizStarted || !user) return;

    const autoSaveInterval = setInterval(async () => {
      try {
        const currentProgress = {
          user_id: user.id,
          quiz_data: {
            responses,
            currentQuestionIndex,
            timestamp: new Date().toISOString()
          },
          is_completed: false
        };

        const { data, error } = await quizService.saveQuizAutosave(user.id, currentProgress.quiz_data);
        if (error) throw error;

        // حفظ نسخة محلية أيضاً
        localStorage.setItem('glowmatch-quiz-autosave', JSON.stringify(currentProgress));
      } catch (error) {
        console.error('Auto-save error:', error);
      }
    }, 30000); // كل 30 ثانية

    return () => clearInterval(autoSaveInterval);
  }, [quizStarted, user, responses, currentQuestionIndex]);

  // استعادة التقدم المحفوظ عند تحميل الصفحة
  useEffect(() => {
    const loadSavedProgress = async () => {
      if (!user) return;

      try {
        // محاولة تحميل البيانات من قاعدة البيانات أولاً
        const { data: savedProgress, error } = await quizService.getQuizAutosave(user.id);
        if (error) throw error;

        if (savedProgress?.quiz_data) {
          const confirmation = window.confirm(
            'We found a saved quiz in progress. Would you like to continue where you left off?'
          );

          if (confirmation) {
            setQuizStarted(true);
            setCurrentQuestionIndex(savedProgress.quiz_data.currentQuestionIndex);
            setResponses(savedProgress.quiz_data.responses);
            return;
          }
        }

        // إذا لم يتم العثور على بيانات في قاعدة البيانات، جرب localStorage
        const localProgress = localStorage.getItem('glowmatch-quiz-autosave');
        if (localProgress) {
          const parsedProgress = JSON.parse(localProgress);
          const confirmation = window.confirm(
            'We found a locally saved quiz. Would you like to continue where you left off?'
          );

          if (confirmation) {
            setQuizStarted(true);
            setCurrentQuestionIndex(parsedProgress.quiz_data.currentQuestionIndex);
            setResponses(parsedProgress.quiz_data.responses);
          }
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    };

    loadSavedProgress();
  }, [user]);

  // Set current answer from existing response when navigating back
  useEffect(() => {
    if (quizStarted && questions?.[currentQuestionIndex]) {
      const existingResponse = responses?.find((r) => r?.questionId === questions[currentQuestionIndex]?.id);
      setCurrentAnswer(existingResponse ? existingResponse?.answer : null);
    }
  }, [currentQuestionIndex, quizStarted, questions, responses]);

  // Auth prompt modal
  if (showAuthPrompt) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-5 lg:px-8 py-16 text-center">
            <Icon name="Lock" size={64} className="mx-auto text-accent mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Sign In Required
            </h2>
            <p className="text-muted-foreground mb-8">
              Please sign in to your account to take the skin quiz and track your results.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/login')}
                iconName="LogIn"
                className="w-full max-w-xs"
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/signup')}
                iconName="UserPlus"
                className="w-full max-w-xs"
              >
                Create Account
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowAuthPrompt(false)}
                className="w-full max-w-xs"
              >
                Back to Quiz
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProgressIndicator />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 py-8">
          <Breadcrumbs />
          {lastSaveError && (
            <div className="mb-4 p-4 border-l-4 border-red-500 bg-red-50 rounded-r text-sm">
              <div className="flex items-start">
                <Icon name="AlertTriangle" className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-medium mb-1">Error Saving Quiz</h3>
                  <p className="text-red-700 mb-2">{lastSaveError.message}</p>
                  <div className="flex items-center space-x-2 text-xs text-red-600">
                    <span className="font-mono bg-red-100 px-2 py-0.5 rounded">
                      Error code: {lastSaveError.code}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="xs"
                      onClick={() => setLastSaveError(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Dismiss
                    </Button>
                  </div>
                  {lastSaveError.details && (
                    <pre className="mt-2 p-2 bg-red-100 rounded text-xs text-red-600 font-mono whitespace-pre-wrap">
                      {JSON.stringify(lastSaveError.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Attempts / Referral Card */}
          {!quizStarted && (
            <div className="mb-6 bg-gradient-to-br from-accent/5 to-secondary/5 border border-accent/20 rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 p-3 bg-accent/20 rounded-lg">
                    <Icon name="Zap" className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Remaining Attempts</p>
                    <p className="text-2xl font-bold text-foreground">{remainingAttempts === Infinity ? '∞' : remainingAttempts}</p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {typeof remainingAttempts === 'number' && remainingAttempts <= 0 ? (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Icon name="AlertTriangle" className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-destructive">No attempts remaining</p>
                          <p className="text-sm text-muted-foreground mt-1">Share your referral link with friends to earn free quiz attempts!</p>
                          <Button onClick={fetchReferralLink} size="sm" className="mt-2" disabled={fetchingReferral} iconName={fetchingReferral ? "Loader2" : "Share2"}>
                            {fetchingReferral ? 'Loading...' : 'Get Referral Link'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Icon name="CheckCircle2" className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Ready to take the quiz</p>
                        <p className="text-sm text-muted-foreground">One attempt will be consumed when you start</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {referralLink && (
                <div className="mt-4 pt-4 border-t border-accent/10">
                  <p className="text-sm font-medium text-foreground mb-3">Share this link to earn bonus attempts:</p>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input 
                      readOnly 
                      value={referralLink} 
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm font-mono text-center sm:text-left" 
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigator.clipboard?.writeText(referralLink)}
                      iconName="Copy"
                      className="w-full sm:w-auto"
                    >
                      Copy Link
                    </Button>
                    {navigator.share && (
                      <Button 
                        size="sm"
                        onClick={() => navigator.share({ title: 'Free Quiz Attempts', text: 'Get free skin quiz attempts using my referral link!', url: referralLink })}
                        iconName="Share2"
                        className="w-full sm:w-auto"
                      >
                        Share
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subscription Status */}
          {user && !canTakeQuiz() && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="AlertCircle" className="text-accent" />
                  <span className="text-sm font-medium text-accent">
                    Active subscription required to take the quiz
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/subscription')}
                  iconName="CreditCard"
                >
                  View Plans
                </Button>
              </div>
            </div>
          )}
          
          {!quizStarted ?
          <QuizIntro onStart={handleStartQuiz} /> :
          quizComplete ?
          <QuizComplete
            responses={responses}
            onContinue={handleContinueToAnalysis} /> :

          <div className="space-y-6">
              <QuizProgress
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={questions?.length}
              completedQuestions={responses?.length} />

              <QuestionCard
              question={questions?.[currentQuestionIndex]}
              onAnswer={handleAnswer}
              selectedAnswer={currentAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirstQuestion={currentQuestionIndex === 0}
              isLastQuestion={currentQuestionIndex === questions?.length - 1} />

            </div>
          }
        </div>
      </main>
    </div>);

};

export default InteractiveSkinQuiz;