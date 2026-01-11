import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, quizService } from '../../lib/supabase';
import { useI18n } from '../../contexts/I18nContext';
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
import SEO from '../../components/SEO';

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
  const { t } = useI18n();
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
      title: t('q1_title'),
      subtitle: t('q1_subtitle'),
      type: "multiple-choice",
      options: [
        {
          id: "oily",
          label: t('q1_opt_oily_label'),
          description: t('q1_opt_oily_desc')
        },
        {
          id: "dry",
          label: t('q1_opt_dry_label'),
          description: t('q1_opt_dry_desc')
        },
        {
          id: "combination",
          label: t('q1_opt_comb_label'),
          description: t('q1_opt_comb_desc')
        },
        {
          id: "sensitive",
          label: t('q1_opt_sens_label'),
          description: t('q1_opt_sens_desc')
        },
        {
          id: "normal",
          label: t('q1_opt_norm_label'),
          description: t('q1_opt_norm_desc')
        }]
    },
    {
      id: 2,
      title: t('q2_title'),
      subtitle: t('q2_subtitle'),
      type: "multiple-choice",
      options: [
        {
          id: "never",
          label: t('q2_opt_never_label'),
          description: t('q2_opt_never_desc')
        },
        {
          id: "rarely",
          label: t('q2_opt_rarely_label'),
          description: t('q2_opt_rarely_desc')
        },
        {
          id: "sometimes",
          label: t('q2_opt_sometimes_label'),
          description: t('q2_opt_sometimes_desc')
        },
        {
          id: "often",
          label: t('q2_opt_often_label'),
          description: t('q2_opt_often_desc')
        },
        {
          id: "constantly",
          label: t('q2_opt_constantly_label'),
          description: t('q2_opt_constantly_desc')
        }]
    },
    {
      id: 3,
      title: t('q3_title'),
      subtitle: t('q3_subtitle'),
      type: "multiple-choice",
      options: [
        {
          id: "tight-dry",
          label: t('q3_opt_tight_label'),
          description: t('q3_opt_tight_desc')
        },
        {
          id: "comfortable",
          label: t('q3_opt_comfortable_label'),
          description: t('q3_opt_comfortable_desc')
        },
        {
          id: "slightly-oily",
          label: t('q3_opt_slightly_label'),
          description: t('q3_opt_slightly_desc')
        },
        {
          id: "very-oily",
          label: t('q3_opt_very_label'),
          description: t('q3_opt_very_desc')
        },
        {
          id: "irritated",
          label: t('q3_opt_irritated_label'),
          description: t('q3_opt_irritated_desc')
        }]
    },
    {
      id: 4,
      title: t('q4_title'),
      subtitle: t('q4_subtitle'),
      type: "image-selection",
      options: [
        {
          id: "acne",
          label: t('q4_opt_acne_label'),
          image: "https://images.unsplash.com/photo-1452223355713-db7fc5eed0b9",
          imageAlt: t('q4_opt_acne_label')
        },
        {
          id: "aging",
          label: t('q4_opt_aging_label'),
          image: "https://images.unsplash.com/photo-1531067332586-ffe9e4d49477",
          imageAlt: t('q4_opt_aging_label')
        },
        {
          id: "dryness",
          label: t('q4_opt_dryness_label'),
          image: "https://images.unsplash.com/photo-1729617086451-70a40832030b",
          imageAlt: t('q4_opt_dryness_label')
        },
        {
          id: "pigmentation",
          label: t('q4_opt_pigmentation_label'),
          image: "https://images.unsplash.com/photo-1702354408183-1d7a58afaf5f",
          imageAlt: t('q4_opt_pigmentation_label')
        },
        {
          id: "sensitivity",
          label: t('q4_opt_sensitivity_label'),
          image: "https://images.unsplash.com/photo-1694226016585-d4a261afee7c",
          imageAlt: t('q4_opt_sensitivity_label')
        },
        {
          id: "pores",
          label: t('q4_opt_pores_label'),
          image: "https://images.unsplash.com/photo-1567854143419-b38292f838c5",
          imageAlt: t('q4_opt_pores_label')
        }]
    },
    {
      id: 5,
      title: t('q5_title'),
      subtitle: t('q5_subtitle'),
      type: "slider",
      min: 1,
      max: 5,
      step: 1,
      labels: {
        1: t('q5_label_1'),
        2: t('q5_label_2'),
        3: t('q5_label_3'),
        4: t('q5_label_4'),
        5: t('q5_label_5')
      }
    },
    {
      id: 6,
      title: t('q6_title'),
      subtitle: t('q6_subtitle'),
      type: "multiple-choice",
      options: [
        {
          id: "minimal",
          label: t('q6_opt_minimal_label'),
          description: t('q6_opt_minimal_desc')
        },
        {
          id: "basic",
          label: t('q6_opt_basic_label'),
          description: t('q6_opt_basic_desc')
        },
        {
          id: "comprehensive",
          label: t('q6_opt_comprehensive_label'),
          description: t('q6_opt_comprehensive_desc')
        },
        {
          id: "extensive",
          label: t('q6_opt_extensive_label'),
          description: t('q6_opt_extensive_desc')
        }]
    },
    {
      id: 7,
      title: t('q7_title'),
      subtitle: t('q7_subtitle'),
      type: "multiple-choice",
      options: [
        {
          id: "under-5",
          label: t('q7_opt_under5_label'),
          description: t('q7_opt_under5_desc')
        },
        {
          id: "5-10",
          label: t('q7_opt_5to10_label'),
          description: t('q7_opt_5to10_desc')
        },
        {
          id: "10-20",
          label: t('q7_opt_10to20_label'),
          description: t('q7_opt_10to20_desc')
        },
        {
          id: "over-20",
          label: t('q7_opt_over20_label'),
          description: t('q7_opt_over20_desc')
        }]
    },
    {
      id: 8,
      title: t('q8_title'),
      subtitle: t('q8_subtitle'),
      type: "multiple-choice",
      options: [
        {
          id: "budget",
          label: t('q8_opt_budget_label'),
          description: t('q8_opt_budget_desc')
        },
        {
          id: "moderate",
          label: t('q8_opt_moderate_label'),
          description: t('q8_opt_moderate_desc')
        },
        {
          id: "premium",
          label: t('q8_opt_premium_label'),
          description: t('q8_opt_premium_desc')
        },
        {
          id: "luxury",
          label: t('q8_opt_luxury_label'),
          description: t('q8_opt_luxury_desc')
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
        // Fetch referral link in background, show message immediately
        fetchReferralLink().catch(e => console.debug('fetchReferralLink failed', e));
        alert(t('quiz_no_attempts_alert'));
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
          const details = error?.raw || error?.details || null;
          setLastSaveError({ code: 'START_ATTEMPT_ERROR', message: error?.message || 'Unable to start quiz', details });
          return;
        }

        // Start quiz IMMEDIATELY - refresh profile in background
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setResponses([]);
        setCurrentAnswer(null);

        // Refresh profile in background (non-blocking)
        refreshProfile().catch(e => console.debug('profile reload failed', e));

      } catch (e) {
        console.error('startQuiz request failed', e);
        setLastSaveError({ code: e?.status || 'NETWORK_ERROR', message: e?.message || 'Unable to start quiz at this time', details: e?.raw || null });
        return;
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert(t('quiz_start_error_alert'));
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
      const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';
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

      // Save quiz attempt (this is required, must wait)
      let attemptData = null;
      try {
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

      // Navigate IMMEDIATELY - don't wait for analysis or report
      console.log('Navigating to image analysis...');
      navigate('/image-upload-analysis', {
        replace: true,
        state: { quizAttemptId: attemptData.id, model }
      });

      // Run AI analysis + report generation in BACKGROUND (non-blocking)
      const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';
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

      // Background: AI analysis (non-blocking)
      fetch(`${API_BASE}/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ quizData, images: [], model })
      }).then(resp => resp.json()).then(json => {
        if (json?.data) {
          console.log('Background AI analysis completed');
          const existing = JSON.parse(localStorage.getItem('glowmatch-quiz-data') || '{}');
          localStorage.setItem('glowmatch-quiz-data', JSON.stringify({
            ...existing,
            analysis: json.data.analysis || json.data.result || json.data
          }));
        }
      }).catch(e => console.warn('Background analysis failed:', e));

      // Background: Generate PDF report (non-blocking)
      generateAndUploadReportAndAttach(attemptData).then(reportResult => {
        if (reportResult?.success) {
          console.log('Background report generation completed');
          const existing = JSON.parse(localStorage.getItem('glowmatch-quiz-data') || '{}');
          localStorage.setItem('glowmatch-quiz-data', JSON.stringify({ ...existing, reportUrl: reportResult.publicUrl }));
        }
      }).catch(e => console.warn('Background report failed:', e));

    } catch (error) {
      console.error('Error in handleContinueToAnalysis:', error);
      debugLogger.error('handleContinueToAnalysis', error);

      const code = error?.code || error?.status || error?.name || 'unknown';
      const message = error?.message || JSON.stringify(error);
      const details = error?.details || error?.fallback || null;
      const errorPayload = { code, message, details };
      setLastSaveError(errorPayload);

      alert(`Failed to save quiz attempt (code: ${code}). Please try again.`);
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
            t('quiz_restore_confirm')
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
            t('quiz_restore_local_confirm')
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
              {t('auth_required_title')}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t('auth_required_desc')}
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/login')}
                iconName="LogIn"
                className="w-full max-w-xs"
              >
                {t('sign_in')}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/signup')}
                iconName="UserPlus"
                className="w-full max-w-xs"
              >
                {t('sign_up')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowAuthPrompt(false)}
                className="w-full max-w-xs"
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Skin Type Quiz - Discover Your Skin Profile"
        description="Take our free AI-powered skin type quiz to discover your unique skin profile. Get personalized skincare recommendations and find the perfect products for your skin concerns."
        keywords="skin type quiz, skin analysis test, find my skin type, personalized skincare quiz, اختبار نوع البشرة, تحليل البشرة, quiz type de peau"
        url="/interactive-skin-quiz"
      />
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
