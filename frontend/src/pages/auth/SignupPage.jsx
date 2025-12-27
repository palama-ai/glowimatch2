import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import GoogleSignInButton from '../../components/GoogleSignInButton';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'user' // 'user' or 'seller'
  });
  const [referralCode, setReferralCode] = useState(() => localStorage.getItem('referral_code') || '');
  const location = useLocation();

  // Signup block status
  const [signupBlock, setSignupBlock] = useState({ blockUserSignup: false, blockSellerSignup: false });

  // Fetch signup block status on mount
  useEffect(() => {
    const fetchSignupStatus = async () => {
      try {
        const r = await fetch(`${API_BASE}/admin/signup-status`);
        if (r.ok) {
          const j = await r.json();
          setSignupBlock(j.data || { blockUserSignup: false, blockSellerSignup: false });
        }
      } catch (e) {
        console.warn('[signup] Could not fetch signup status:', e);
      }
    };
    fetchSignupStatus();
  }, []);

  // read ?ref=... from URL and prefill referral code
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const r = params.get('ref');
      if (r) {
        setReferralCode(r);
        localStorage.setItem('referral_code', r);
      }
    } catch (e) { /* ignore */ }
  }, [location.search]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Password validation requirements
  const passwordRequirements = [
    { label: 'Uppercase letter (A-Z)', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'Lowercase letter (a-z)', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'Number (0-9)', test: (pwd) => /[0-9]/.test(pwd) },
    { label: 'Symbol (!@#$%...)', test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) },
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  ];

  const allPasswordRequirementsMet = passwordRequirements.every((req) => req.test(formData.password || ''));

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData?.password !== formData?.confirmPassword) {
      setError(t('passwords_not_match'));
      setLoading(false);
      return;
    }

    if (!allPasswordRequirementsMet) {
      setError('Password must contain an uppercase letter, lowercase letter, number, symbol, and be at least 8 characters');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('You must accept the Terms of Service to create an account');
      setLoading(false);
      return;
    }

    // store referral code locally (if present in the form)
    if (referralCode) localStorage.setItem('referral_code', referralCode);
    const { error, data } = await signUp(formData?.email, formData?.password, formData?.fullName, formData?.accountType);

    if (error) {
      setError(error?.message || error);
    } else {
      // Check if verification is required
      if (data?.requiresVerification) {
        setSuccess('Account created! Please check your email for the verification code.');
        setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(formData?.email)}`), 1500);
      } else {
        setSuccess(t('account_created'));
        // Redirect sellers to seller dashboard, users to home
        if (formData?.accountType === 'seller') {
          setTimeout(() => navigate('/seller'), 2000);
        } else {
          setTimeout(() => navigate('/'), 2000);
        }
      }
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-accent/20 to-pink-500/20 rounded-full mb-4">
            <Icon name="Sparkles" size={40} className="text-accent" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">
            Glowimatch
          </h1>
          <p className="text-muted-foreground text-sm">Discover Your Perfect Skincare</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-lg overflow-hidden">
          {/* Header gradient */}
          <div className="h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600" />

          <div className="p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {t('join_glowmatch')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('skincare_journey')}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Account Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">{t('account_type')}</label>
                <div className="flex p-1 bg-muted/50 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: 'user' })}
                    disabled={signupBlock.blockUserSignup}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${formData?.accountType === 'user'
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                      } ${signupBlock.blockUserSignup ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon name={signupBlock.blockUserSignup ? "UserX" : "User"} size={16} />
                    {t('user')}
                    {signupBlock.blockUserSignup && <Icon name="Lock" size={12} className="ml-1 text-red-500" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: 'seller' })}
                    disabled={signupBlock.blockSellerSignup}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${formData?.accountType === 'seller'
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                      } ${signupBlock.blockSellerSignup ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon name={signupBlock.blockSellerSignup ? "StoreOff" : "Store"} size={16} />
                    {t('seller')}
                    {signupBlock.blockSellerSignup && <Icon name="Lock" size={12} className="ml-1 text-red-500" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formData?.accountType === 'seller'
                    ? t('sell_products')
                    : t('find_routine')
                  }
                </p>

                {/* Blocked Signup Warning */}
                {((formData?.accountType === 'user' && signupBlock.blockUserSignup) ||
                  (formData?.accountType === 'seller' && signupBlock.blockSellerSignup)) && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg flex items-start gap-2">
                      <Icon name="AlertTriangle" size={18} className="flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <strong className="block">{t('reg_disabled_title')}</strong>
                        {formData?.accountType === 'seller'
                          ? t('reg_disabled_seller')
                          : t('reg_disabled_user')
                        }

                      </div>
                    </div>
                  )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('full_name')}</label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="John Doe"
                    value={formData?.fullName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('email_address')}</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={formData?.email}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('referral_code')}</label>
                  <Input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    placeholder={t('optional')}
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('password')}</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={formData?.password}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  {/* Password Requirements Indicator */}
                  {formData?.password && (
                    <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-2">{t('password_req_title')}</p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {passwordRequirements.map((req, index) => {
                          const isMet = req.test(formData.password || '');
                          let label = req.label;
                          if (index === 0) label = t('req_uppercase');
                          if (index === 1) label = t('req_lowercase');
                          if (index === 2) label = t('req_number');
                          if (index === 3) label = t('req_symbol');
                          if (index === 4) label = t('req_length');
                          return (
                            <div key={index} className="flex items-center gap-2">
                              <Icon
                                name={isMet ? "CheckCircle2" : "XCircle"}
                                size={14}
                                className={isMet ? "text-green-500" : "text-red-400"}
                              />
                              <span className={`text-xs ${isMet ? "text-green-600" : "text-muted-foreground"}`}>
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('confirm_password')}</label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={formData?.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
                  <Icon name="AlertTriangle" size={18} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
                  <Icon name="CheckCircle2" size={18} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Terms of Service Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
                />
                <label htmlFor="acceptTerms" className="text-sm text-muted-foreground cursor-pointer">
                  {t('agree_terms')}{' '}
                  <Link to="/terms" className="text-accent hover:underline font-medium" target="_blank">
                    {t('terms_of_service')}
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg hover:shadow-pink-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !allPasswordRequirementsMet || (formData?.password !== formData?.confirmPassword) || !acceptTerms || (formData?.accountType === 'user' && signupBlock.blockUserSignup) || (formData?.accountType === 'seller' && signupBlock.blockSellerSignup)}
                iconName={loading ? "Loader2" : "UserPlus"}
                iconClassName={loading ? "animate-spin" : ""}
              >
                {loading ? t('creating_account') : t('sign_up')}
              </Button>

              {/* Password warning if requirements not met */}
              {formData?.password && !allPasswordRequirementsMet && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                  <Icon name="AlertCircle" size={16} className="flex-shrink-0" />
                  <span>{t('password_req_not_met')}</span>
                </div>
              )}

              {/* Password mismatch warning */}
              {formData?.confirmPassword && formData?.password !== formData?.confirmPassword && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                  <Icon name="XCircle" size={16} className="flex-shrink-0" />
                  <span>{t('passwords_not_match')}</span>
                </div>
              )}
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <GoogleSignInButton
              accountType={formData?.accountType || 'user'}
              onSuccess={(data) => {
                // Redirect based on role
                if (data?.user?.role === 'seller') {
                  navigate('/seller');
                } else if (data?.user?.role === 'admin') {
                  navigate('/admin');
                } else {
                  navigate('/');
                }
              }}
              onError={(err) => {
                setError(err?.message || 'Google sign-up failed');
              }}
            />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t('already_have_account')}{' '}
                <Link to="/login" className="text-accent font-semibold hover:underline transition-colors">
                  {t('sign_in')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
