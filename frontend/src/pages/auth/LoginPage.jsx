import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

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

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await signIn(formData?.email, formData?.password);

    if (error) {
      setError(error?.message);
    } else {
      // Check user role from gm_auth token and redirect accordingly
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
      // Default: redirect to home
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
    </div>
  );
};

export default LoginPage;