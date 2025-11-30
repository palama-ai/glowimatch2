// This file replaces the Supabase client wrapper with calls to the local backend
// so the frontend can continue importing the same symbols: `supabase`, `quizService`,
// `subscriptionService`, and `profileService` but the implementation uses fetch.

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

function makeResp(ok, data, error) {
  return { ok, data, error };
}

const authStorageKey = 'gm_auth';

const supabase = {
  auth: {
    async signUp({ email, password, options }) {
      const body = { email, password, fullName: options?.data?.full_name, referralCode: options?.data?.referral_code };
      const r = await fetch(`${API_BASE}/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json = await r.json();
      if (json?.data?.token) {
        localStorage.setItem(authStorageKey, JSON.stringify({ token: json.data.token, user: json.data.user }));
      }
      return makeResp(r.ok, json.data ?? null, json.error ?? null);
    },

    async signInWithPassword({ email, password }) {
      try {
        const r = await fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const json = await r.json().catch(() => null);
        if (json?.data?.token) {
          localStorage.setItem(authStorageKey, JSON.stringify({ token: json.data.token, user: json.data.user }));
        }
        let err = null;
        if (!r.ok) {
          const msg = (json && (json.message || json.error)) || 'Login failed';
          err = { message: msg, raw: json };
        }
        return makeResp(r.ok, json?.data ?? null, err);
      } catch (err) {
        console.error('signInWithPassword error:', err);
        return makeResp(false, null, { message: err?.message || 'Network error' });
      }
    },

    async signOut() {
      localStorage.removeItem(authStorageKey);
      return makeResp(true, null, null);
    },

    async getSession() {
      const raw = localStorage.getItem(authStorageKey);
      if (!raw) return { data: { session: null } };
      const parsed = JSON.parse(raw);
      // Optionally verify with backend
      const r = await fetch(`${API_BASE}/auth/session`, { headers: { Authorization: `Bearer ${parsed.token}` } });
      const json = await r.json();
      if (json?.data?.session) return { data: { session: json.data.session } };
      return { data: { session: null } };
    },

    onAuthStateChange(cb) {
      // Lightweight implementation: listen to storage events and call callback
      function handler(e) {
        if (e.key === authStorageKey) {
          const parsed = e.newValue ? JSON.parse(e.newValue) : null;
          cb(null, { user: parsed?.user ?? null });
        }
      }
      window.addEventListener('storage', handler);
      // Return an object similar to supabase subscription
      return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', handler) } } };
    }
  }
};

const getAuthHeader = () => {
  const raw = localStorage.getItem(authStorageKey);
  if (!raw) return {};
  try { const parsed = JSON.parse(raw); return { Authorization: `Bearer ${parsed.token}` }; } catch { return {}; }
};

export const quizService = {
  async saveQuizAttempt(userId, quizData, results = {}, hasImageAnalysis = false) {
    try {
      const r = await fetch(`${API_BASE}/quiz/attempts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ userId, quiz_data: quizData, results, has_image_analysis: hasImageAnalysis })
      });
      const json = await r.json();
      if (!r.ok) throw json.error || new Error('Failed to save');
      return { data: json.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getQuizHistory(userId) {
    try {
      const r = await fetch(`${API_BASE}/quiz/history/${encodeURIComponent(userId)}`);
      const json = await r.json();
      if (!r.ok) throw json.error || new Error('Failed to load');
      return { data: json.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async saveQuizAutosave(userId, quizData) {
    try {
      const r = await fetch(`${API_BASE}/quiz/autosave`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ userId, quiz_data: quizData }) });
      const json = await r.json();
      if (!r.ok) throw json.error || new Error('Failed to autosave');
      return { data: json, error: null, success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  async getQuizAutosave(userId) {
    try {
      const r = await fetch(`${API_BASE}/quiz/autosave/${encodeURIComponent(userId)}`);
      const json = await r.json();
      if (!r.ok) throw json.error || new Error('Failed to fetch autosave');
      return { data: json.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
  ,
  async startQuiz() {
    try {
      const r = await fetch(`${API_BASE}/quiz/start`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });

      // Try to parse JSON safely; if server returns HTML or plain text, capture it as raw
      const text = await r.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        // Not JSON (likely HTML error page). Surface the raw text for debugging.
        const err = new Error('Non-JSON response from server');
        err.raw = text;
        err.status = r.status;
        throw err;
      }

      if (!r.ok) throw json?.error || new Error('Failed to start quiz');
      return { data: json.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

export const subscriptionService = {
  async getCurrentSubscription(userId) {
    try {
      const r = await fetch(`${API_BASE}/subscription/${encodeURIComponent(userId)}`);
      const json = await r.json();
      if (!r.ok) throw json.error || new Error('Failed to load subscription');
      return { data: json.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async purchaseQuizAttempts(userId, quantity) {
    try {
      const r = await fetch(`${API_BASE}/subscription/purchase-attempts`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ userId, quantity }) });
      const json = await r.json();
      if (!r.ok) throw json.error || new Error('Failed to purchase');
      return { data: json.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async subscribeToPlan(userId, plan) {
    try {
      const r = await fetch(`${API_BASE}/subscription/subscribe`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ userId, plan }) });
      const json = await r.json();
      if (!r.ok) throw json.error || new Error('Failed to subscribe');
      return { data: json.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

export const profileService = {
  async getProfile(userId) {
    try {
      const r = await fetch(`${API_BASE}/profile/${encodeURIComponent(userId)}`);
      const json = await r.json();
      if (!r.ok) throw json.error || new Error('Failed to load profile');
      return { data: json.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateProfile(userId, updates) {
    try {
      const r = await fetch(`${API_BASE}/profile/${encodeURIComponent(userId)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(updates) });
      const json = await r.json();
      if (!r.ok) throw json.error || new Error('Failed to update profile');
      return { data: json.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

export { supabase };
