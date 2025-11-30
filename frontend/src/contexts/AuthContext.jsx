import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, quizService, subscriptionService, profileService } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const profileOperations = {
    async load(userId) {
      if (!userId) return;
      setProfileLoading(true);
      try {
        // Load profile
        const { data: profile, error: profileError } = await profileService.getProfile(userId);
        if (!profileError) {
          setUserProfile(profile);
        }

        // Load subscription
        const { data: subscriptionData, error: subError } = await subscriptionService.getCurrentSubscription(userId);
        if (!subError) {
          setSubscription(subscriptionData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setProfileLoading(false);
      }
    },

    clear() {
      setUserProfile(null);
      setSubscription(null);
      setProfileLoading(false);
    }
  };

  const authStateHandlers = {
    onChange: (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        profileOperations?.load(session?.user?.id);
      } else {
        profileOperations?.clear();
      }
    }
  };

  useEffect(() => {
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      authStateHandlers?.onChange(null, session);
    });

    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      authStateHandlers?.onChange
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName) => {
    // include referral code from localStorage if present
    const referralCode = localStorage.getItem('admin_dashboard_token') ? null : (localStorage.getItem('referral_code') || null);
    const { data, error } = await supabase?.auth?.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'user',
          referral_code: referralCode
        }
      }
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });
      // If backend returned session data, update local user and load profile
      if (data && data.user) {
        setUser(data.user);
        try {
          await profileOperations?.load(data.user.id);
        } catch (e) {
          console.error('Failed to load profile after sign in:', e);
        }
        return { data, error: null };
      }

      // Normalize failure: if no error returned, provide a friendly message
      if (!error) {
        return { data: null, error: { message: 'Sign in failed - invalid credentials or server error' } };
      }

      return { data, error };
    } catch (e) {
      console.error('Auth.signIn unexpected error:', e);
      return { data: null, error: { message: e?.message || 'Unexpected error during sign in' } };
    }
  };

  const signOut = async () => {
    const { error } = await supabase?.auth?.signOut();
    if (!error) {
      setUser(null);
      profileOperations?.clear();
    }
    return { error };
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('No user logged in') };
    
    const { data, error } = await profileService.updateProfile(user.id, updates);
    if (!error) {
      setUserProfile(data);
    }
    return { data, error };
  };

  const canTakeQuiz = () => {
    // Only allow quiz when user logged in and subscription has remaining attempts or admin
    if (!user && userProfile?.role !== 'admin') return false;
    if (userProfile?.role === 'admin') return true;
    if (!subscription) return false;
    const used = subscription.quiz_attempts_used || 0;
    const limit = subscription.quiz_attempts_limit || 0;
    return used < limit;
  };

  const getRemainingAttempts = () => {
    if (!subscription) return 0;
    const used = subscription.quiz_attempts_used || 0;
    const limit = subscription.quiz_attempts_limit || 0;
    const remaining = limit - used;
    return remaining >= 0 ? remaining : 0;
  };

  const getNextResetDate = () => {
    if (!subscription?.last_attempt_date) return null;
    const lastAttempt = new Date(subscription.last_attempt_date);
    lastAttempt.setMonth(lastAttempt.getMonth() + 1);
    return lastAttempt;
  };

  const purchaseQuizAttempts = async (quantity) => {
    if (!user) return { error: new Error('No user logged in') };
    
    try {
      // إضافة محاولتين مجانيتين عند شراء 5 محاولات
      const totalAttempts = quantity >= 5 ? quantity + 2 : quantity;

      const { data, error } = await subscriptionService.purchaseQuizAttempts(user.id, totalAttempts);
      if (error) throw error;

      // تحديث البيانات المحلية
      await profileOperations?.load(user?.id);
      return { data, error: null };
    } catch (error) {
      console.error('Error purchasing attempts:', error);
      return { data: null, error };
    }
  };

  const recordQuizAttempt = async (quizData, results) => {
    if (!user) {
      return { error: { code: 'AUTH_ERROR', message: 'No user logged in' } };
    }
    
    if (!isAdmin() && !canTakeQuiz()) {
      return { error: { code: 'SUBSCRIPTION_ERROR', message: 'Active subscription required' } };
    }

    try {
      // Save quiz data with image analysis flag
      const { data, error } = await quizService.saveQuizAttempt(
        user.id,
        quizData,
        results
      );
      
      if (error) {
        throw {
          code: error.code || 'SAVE_ERROR',
          message: error.message || 'Failed to save quiz attempt',
          details: error.details || error
        };
      }
      
      // Reload profile data for regular users to update attempt counts
      if (!isAdmin()) {
        await profileOperations?.load(user?.id);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error recording quiz attempt:', error);
      return { 
        data: null, 
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message || 'An unexpected error occurred while saving your quiz attempt',
          details: error.details || error
        }
      };
    }
  };

  const isAdmin = () => {
    try {
      // Check multiple sources for admin role to ensure we catch it regardless of how it's stored
      const profileRole = userProfile?.role;
      if (profileRole === 'admin') return true;

      // Check JWT token payload (stored in gm_auth)
      const raw = localStorage.getItem('gm_auth');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const token = parsed.token;
          if (token) {
            // Decode JWT manually (take the payload part)
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              if (payload.role === 'admin') return true;
            }
          }
        } catch (e) {
          console.warn('Failed to decode JWT for admin check:', e);
        }
      }

      // Check auth user metadata
      const authRole = user?.user_metadata?.role;
      if (authRole === 'admin') return true;

      // Fallback: known admin email (for dev/testing)
      if (user?.email === 'admin@glowmatch.com') return true;

      return false;
    } catch (e) {
      console.error('Error checking admin role:', e);
      return false;
    }
  };

  // Keep backward compatibility with isAdminRobust
  const isAdminRobust = isAdmin;

  const value = {
    user,
    userProfile,
    subscription,
    loading,
    profileLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    canTakeQuiz,
    getRemainingAttempts,
    recordQuizAttempt,
    getNextResetDate,
    purchaseQuizAttempts,
    isAdmin,
    isAdminRobust, // Keep for backward compatibility
    // allow consumers to refresh profile/subscription data after changes
    refreshProfile: async () => { if (user?.id) await profileOperations.load(user.id); }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};