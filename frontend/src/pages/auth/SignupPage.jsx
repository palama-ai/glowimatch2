import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

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

    if (formData?.password?.length < 6) {
      setError(t('password_min_length'));
      setLoading(false);
      return;
    }

    // store referral code locally (if present in the form)
    if (referralCode) localStorage.setItem('referral_code', referralCode);
    const { error } = await signUp(formData?.email, formData?.password, formData?.fullName, formData?.accountType);

    if (error) {
      setError(error?.message);
    } else {
      setSuccess(t('account_created'));
      // Redirect sellers to seller dashboard, users to login
      if (formData?.accountType === 'seller') {
        setTimeout(() => navigate('/seller'), 2000);
      } else {
        setTimeout(() => navigate('/login'), 3000);
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
                <label className="block text-sm font-medium text-foreground mb-3">Account Type</label>
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
                    User
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
                    Seller
                    {signupBlock.blockSellerSignup && <Icon name="Lock" size={12} className="ml-1 text-red-500" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formData?.accountType === 'seller'
                    ? 'Sell your skincare products on Glowimatch'
                    : 'Find the perfect skincare routine for you'
                  }
                </p>

                {/* Blocked Signup Warning */}
                {((formData?.accountType === 'user' && signupBlock.blockUserSignup) ||
                  (formData?.accountType === 'seller' && signupBlock.blockSellerSignup)) && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg flex items-start gap-2">
                      <Icon name="AlertTriangle" size={18} className="flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <strong className="block">التسجيل معطل مؤقتاً</strong>
                        {formData?.accountType === 'seller'
                          ? 'تسجيل حسابات البائعين معطل حالياً. يرجى المحاولة لاحقاً.'
                          : 'تسجيل حسابات المستخدمين معطل حالياً. يرجى المحاولة لاحقاً.'
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
                  <label className="block text-sm font-medium text-foreground mb-2">Referral Code</label>
                  <Input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    placeholder="Optional"
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg hover:shadow-pink-500/40 transition-all"
                disabled={loading || (formData?.accountType === 'user' && signupBlock.blockUserSignup) || (formData?.accountType === 'seller' && signupBlock.blockSellerSignup)}
                iconName={loading ? "Loader2" : "UserPlus"}
                iconClassName={loading ? "animate-spin" : ""}
              >
                {loading ? t('creating_account') : t('sign_up')}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>

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
