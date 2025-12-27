import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import GoogleSignInButton from '../../components/GoogleSignInButton';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleError, setGoogleError] = useState('');

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: code + new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [displayedCode, setDisplayedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await signIn(formData?.email, formData?.password);

    if (error) {
      // Check if email verification is required
      if (error?.requiresVerification || error?.type === 'requires_verification') {
        const emailToVerify = error?.email || formData?.email;
        navigate(`/verify-email?email=${encodeURIComponent(emailToVerify)}`);
        setLoading(false);
        return;
      }
      setError(error?.message);
    } else {
      try {
        const authData = JSON.parse(localStorage.getItem('gm_auth') || '{}');
        const token = authData?.token;
        if (token) {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.role === 'seller') {
              navigate('/seller');
              setLoading(false);
              return;
            } else if (payload.role === 'admin') {
              navigate('/admin');
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        console.warn('Error parsing token for role:', e);
      }
      navigate('/');
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    });
  };

  // Forgot password handlers
  const handleForgotPasswordRequest = async () => {
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setDisplayedCode(data.code || '');
        setForgotStep(2);
        setForgotSuccess('Reset code generated! Enter it below with your new password.');
      } else {
        setForgotError(data.error || 'Failed to request reset');
      }
    } catch (err) {
      setForgotError('Network error. Please try again.');
    }

    setForgotLoading(false);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, code: resetCode, newPassword })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setForgotSuccess('Password reset successfully! You can now login.');
        setTimeout(() => {
          closeForgotPassword();
        }, 2000);
      } else {
        setForgotError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setForgotError('Network error. Please try again.');
    }

    setForgotLoading(false);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotStep(1);
    setForgotEmail('');
    setResetCode('');
    setDisplayedCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotError('');
    setForgotSuccess('');
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
                {t('sign_in_to_glowmatch')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('welcome_back')}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                  <label className="block text-sm font-medium text-foreground mb-2">{t('password')}</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={formData?.password}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  {/* Forgot Password Link */}
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="mt-2 text-sm text-accent hover:underline"
                  >
                    {t('forgot_password')}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
                  <Icon name="AlertTriangle" size={18} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg hover:shadow-pink-500/40 transition-all"
                disabled={loading}
                iconName={loading ? "Loader2" : "LogIn"}
                iconClassName={loading ? "animate-spin" : ""}
              >
                {loading ? t('signing_in') : t('sign_in')}
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

            {/* Google Sign-In Button */}
            <GoogleSignInButton
              accountType="user"
              onSuccess={(data) => {
                if (data?.user?.role === 'seller') {
                  navigate('/seller');
                } else if (data?.user?.role === 'admin') {
                  navigate('/admin');
                } else {
                  navigate('/');
                }
              }}
              onError={(err) => {
                setGoogleError(err?.message || 'Google sign-in failed');
              }}
            />

            {googleError && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2 rounded-lg text-sm text-center">
                {googleError}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t('no_account')}{' '}
                <Link to="/signup" className="text-accent font-semibold hover:underline transition-colors">
                  {t('sign_up')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600" />

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">{t('forgot_password_title')}</h3>
                <button onClick={closeForgotPassword} className="p-2 hover:bg-muted rounded-lg">
                  <Icon name="X" size={20} className="text-muted-foreground" />
                </button>
              </div>

              {forgotStep === 1 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t('forgot_password_desc')}
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('email_address')}</label>
                    <Input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full"
                    />
                  </div>

                  {forgotError && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2 rounded-lg text-sm">
                      {forgotError}
                    </div>
                  )}

                  <Button
                    onClick={handleForgotPasswordRequest}
                    disabled={forgotLoading || !forgotEmail}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
                    iconName={forgotLoading ? "Loader2" : "Send"}
                    iconClassName={forgotLoading ? "animate-spin" : ""}
                  >
                    {forgotLoading ? 'Sending...' : 'Get Reset Code'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="Mail" size={18} />
                      <p className="text-sm font-medium">{t('check_email')}</p>
                    </div>
                    <p className="text-xs">{t('code_sent_to')} <strong>{forgotEmail}</strong></p>
                    <p className="text-xs text-green-600 mt-1">{t('code_expires')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('reset_code')}</label>
                    <Input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder={t('reset_code_placeholder')}
                      maxLength={6}
                      className="w-full text-center text-lg tracking-widest"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('new_password')}</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('confirm_new_password')}</label>
                    <Input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full"
                    />
                  </div>

                  {forgotError && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2 rounded-lg text-sm">
                      {forgotError}
                    </div>
                  )}

                  {forgotSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                      {forgotSuccess}
                    </div>
                  )}

                  <Button
                    onClick={handleResetPassword}
                    disabled={forgotLoading || !resetCode || !newPassword || !confirmNewPassword}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
                    iconName={forgotLoading ? "Loader2" : "Check"}
                    iconClassName={forgotLoading ? "animate-spin" : ""}
                  >
                    {forgotLoading ? t('loading') : t('reset_password')}
                  </Button>

                  <button
                    onClick={() => setForgotStep(1)}
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← {t('back_to_email')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
