import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import QuizService from '../lib/quizService';

// Autosave debounce interval in milliseconds
const AUTOSAVE_DELAY = 3000;

const useQuizStore = create(
  devtools(
    (set, get) => ({
      // Quiz state
      currentStep: 0,
      answers: {},
      results: null,
      isComplete: false,
      autosaveStatus: 'idle', // 'idle' | 'saving' | 'error'
      lastSaved: null,
      error: null,

      // Quiz progress
      setCurrentStep: (step) => {
        set({ currentStep: step });
        get().autosaveQuiz();
      },

      // Answer management
      setAnswer: (questionId, answer) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: answer
          }
        }));
        get().autosaveQuiz();
      },

      // Bulk update answers (e.g., when restoring from autosave)
      setAnswers: (answers) => {
        set({ answers });
      },

      // Quiz completion
      setComplete: (results) => {
        set({ 
          isComplete: true, 
          results,
          autosaveStatus: 'idle' 
        });
      },

      // Error handling
      setError: (error) => {
        set({ error });
      },

      // Autosave functionality
      autosaveQuiz: async () => {
        const state = get();
        
        // Don't autosave if quiz is complete
        if (state.isComplete) return;

        // Debounce autosave
        if (state.autosaveTimeout) {
          clearTimeout(state.autosaveTimeout);
        }

        const timeout = setTimeout(async () => {
          const quizData = {
            currentStep: state.currentStep,
            answers: state.answers
          };

          set({ autosaveStatus: 'saving' });

          const { success, error } = await QuizService.autosaveQuiz(
            state.userId,
            quizData
          );

          if (success) {
            set({ 
              autosaveStatus: 'idle',
              lastSaved: new Date().toISOString(),
              error: null
            });
          } else {
            set({ 
              autosaveStatus: 'error',
              error: error.message
            });
          }
        }, AUTOSAVE_DELAY);

        set({ autosaveTimeout: timeout });
      },

      // Load autosaved quiz state
      loadAutosavedQuiz: async (userId) => {
        const { success, data, error } = await QuizService.getAutosavedQuiz(userId);

        if (success && data) {
          set({
            userId,
            currentStep: data.quiz_data.currentStep,
            answers: data.quiz_data.answers,
            lastSaved: data.updated_at,
            error: null
          });
          return true;
        } else {
          set({ 
            error: error?.message || 'Failed to load autosaved quiz',
            userId
          });
          return false;
        }
      },

      // Save completed quiz
      saveQuizAttempt: async (userId, hasImageAnalysis = false) => {
        const state = get();
        const { success, error } = await QuizService.saveQuizAttempt(
          userId,
          {
            currentStep: state.currentStep,
            answers: state.answers
          },
          state.results,
          hasImageAnalysis
        );

        if (!success) {
          set({ error: error.message });
          return false;
        }

        return true;
      },

      // Reset quiz state
      resetQuiz: () => {
        set({
          currentStep: 0,
          answers: {},
          results: null,
          isComplete: false,
          autosaveStatus: 'idle',
          lastSaved: null,
          error: null
        });
      }
    }),
    {
      name: 'quiz-store'
    }
  )
);

export default useQuizStore;