const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

/**
 * Helper to build auth header from localStorage (used by the frontend wrapper)
 */
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

/**
 * Service class for handling quiz-related operations
 */
class QuizService {
  /**
   * Save quiz attempt progress (autosave)
   * @param {string} userId - User ID
   * @param {Object} quizData - Current quiz state
   * @returns {Promise} Result of the autosave operation
   */
  static async autosaveQuiz(userId, quizData) {
    try {
      const r = await fetch(`${API_BASE}/quiz/autosave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ userId, quiz_data: quizData })
      });
      if (!r.ok) {
        const err = await r.json().catch(() => null);
        throw err || new Error('Autosave failed');
      }
      const json = await r.json().catch(() => null);
      return { success: true, data: json };
    } catch (error) {
      console.error('Error autosaving quiz:', error);
      return { success: false, error };
    }
  }

  /**
   * Get latest autosaved quiz state
   * @param {string} userId - User ID
   * @returns {Promise} Latest autosaved quiz data
   */
  static async getAutosavedQuiz(userId) {
    try {
      const r = await fetch(`${API_BASE}/quiz/autosave/${encodeURIComponent(userId)}`);
      if (!r.ok) {
        const err = await r.json().catch(() => null);
        throw err || new Error('Failed to load autosave');
      }
      const json = await r.json();
      return { success: true, data: json.data };
    } catch (error) {
      console.error('Error getting autosaved quiz:', error);
      return { success: false, error };
    }
  }

  /**
   * Save completed quiz attempt
   * @param {string} userId - User ID
   * @param {Object} quizData - Complete quiz data
   * @param {Object} results - Quiz results
   * @param {boolean} hasImageAnalysis - Whether this attempt includes image analysis
   * @returns {Promise} Result of saving the quiz attempt
   */
  static async saveQuizAttempt(userId, quizData, results = {}, hasImageAnalysis = false) {
    try {
      if (!userId) throw new Error('User ID is required');
      if (!quizData) throw new Error('Quiz data is required');
      
      // Ensure proper JSON structure
      const formattedQuizData = {
        ...quizData,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      const formattedResults = {
        ...results,
        timestamp: new Date().toISOString()
      };

      const r = await fetch(`${API_BASE}/quiz/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ userId, quiz_data: formattedQuizData, results: formattedResults, has_image_analysis: hasImageAnalysis })
      });

      const json = await r.json().catch(() => null);
      if (!r.ok) {
        throw json?.error || new Error('Failed to save quiz attempt');
      }

      // Clean up autosave on successful completion
      try {
        await fetch(`${API_BASE}/quiz/autosave/${encodeURIComponent(userId)}`, { method: 'DELETE' });
      } catch (e) {
        // non-fatal
        console.warn('Failed to clear autosave after save:', e);
      }

      return { success: true, data: json.data };
    } catch (error) {
      console.error('Error saving quiz attempt:', {
        message: error.message,
        code: error?.code,
        details: error?.details
      });
      return { 
        success: false, 
        error: {
          message: error.message,
          code: error?.code
        }
      };
    }
  }

  /**
   * Clear autosaved quiz data
   * @param {string} userId - User ID
   * @returns {Promise} Result of clearing autosave
   */
  static async clearAutosave(userId) {
    try {
      const r = await fetch(`${API_BASE}/quiz/autosave/${encodeURIComponent(userId)}`, { method: 'DELETE' });
      if (!r.ok) {
        const err = await r.json().catch(() => null);
        throw err || new Error('Failed to clear autosave');
      }
      return { success: true };
    } catch (error) {
      console.error('Error clearing autosave:', error);
      return { success: false, error };
    }
  }

  /**
   * Get quiz attempt history
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @param {number} options.limit - Max number of records to return
   * @param {number} options.offset - Number of records to skip
   * @param {boolean} options.imageAnalysisOnly - Only return attempts with image analysis
   * @returns {Promise} Quiz attempt history
   */
  static async getQuizHistory(userId, { limit = 10, offset = 0, imageAnalysisOnly = false } = {}) {
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset), imageAnalysisOnly: imageAnalysisOnly ? '1' : '0' });
      const r = await fetch(`${API_BASE}/quiz/history/${encodeURIComponent(userId)}?${params.toString()}`);
      if (!r.ok) {
        const err = await r.json().catch(() => null);
        throw err || new Error('Failed to load history');
      }
      const json = await r.json();
      return { success: true, data: json.data, pagination: { total: json.data?.length || 0, offset, limit, hasMore: (json.data?.length || 0) > limit } };
    } catch (error) {
      console.error('Error getting quiz history:', error);
      return { success: false, error };
    }
  }

  /**
   * Get a specific quiz attempt
   * @param {string} userId - User ID
   * @param {string} attemptId - Attempt ID
   * @returns {Promise} Quiz attempt details
   */
  static async getQuizAttempt(userId, attemptId) {
    try {
      const r = await fetch(`${API_BASE}/quiz/attempts/${encodeURIComponent(attemptId)}`);
      if (!r.ok) {
        const err = await r.json().catch(() => null);
        throw err || new Error('Failed to load attempt');
      }
      const json = await r.json();
      return { success: true, data: json.data };
    } catch (error) {
      console.error('Error getting quiz attempt:', error);
      return { success: false, error };
    }
  }
}

export default QuizService;