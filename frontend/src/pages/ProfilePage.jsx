import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';

const ProfilePage = () => {
  const { user, userProfile, subscription, signOut, updateProfile, loading } = useAuth();
  const { refreshProfile } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [generating, setGenerating] = useState(false);
  const [referralLink, setReferralLink] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile?.full_name || '',
        email: userProfile?.email || ''
      });
      console.log('[Profile] User profile loaded:', { 
        hasReferralCode: !!userProfile?.referral_code, 
        code: userProfile?.referral_code,
        stats: userProfile?.referralStats,
        allData: userProfile 
      });
    }
  }, [userProfile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setUpdateLoading(true);
    setMessage('');

        const { error } = await updateProfile(formData);
    
    if (error) {
      setMessage(error?.message);
    } else {
      setMessage(t('profile_updated'));
      setEditing(false);
    }    setUpdateLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Icon name="Loader2" size={48} className="animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div></div>
      <Header />
      <main className="max-w-4xl mx-auto px-5 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-card-foreground">{t('profile_settings')}</h1>
              <Button
                variant="outline"
                onClick={handleSignOut}
                iconName="LogOut"
              >
                {t('sign_out')}
              </Button>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  label={t('full_name_label')}
                  value={formData?.full_name}
                  onChange={handleInputChange}
                  disabled={!editing}
                  required
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label={t('email_address_label')}
                  value={formData?.email}
                  onChange={handleInputChange}
                  disabled={!editing}
                  required
                />
              </div>

              {message && (
                <div className={`px-4 py-3 rounded-lg ${
                  message?.includes('successfully') 
                    ? 'bg-green-50 border border-green-200 text-green-700' :'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex items-center space-x-4">
                {!editing ? (
                  <Button
                    type="button"
                    onClick={() => setEditing(true)}
                    iconName="Edit"
                  >
                    {t('edit_profile')}
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={updateLoading}
                      iconName={updateLoading ? "Loader2" : "Save"}
                      iconClassName={updateLoading ? "animate-spin" : ""}
                    >
                      {updateLoading ? t('saving') : t('save_changes')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          full_name: userProfile?.full_name || '',
                          email: userProfile?.email || ''
                        });
                      }}
                    >
                      {t('cancel')}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Referral Info (replaces subscription UI) */}
          <div className="bg-gradient-to-br from-accent/5 to-secondary/5 border border-accent/20 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="Share2" size={24} className="text-accent" />
              <h2 className="text-xl font-semibold text-foreground">{t('referral_program')}</h2>
            </div>

            {/* Referral Code Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Code Section */}
              <div className="bg-background/60 border border-accent/20 p-5 rounded-lg">
                <p className="text-sm text-muted-foreground font-medium mb-2">{t('your_referral_code')}</p>
                <div className="bg-card border border-border rounded-lg p-4 mb-3">
                  <code className="text-lg font-mono font-bold text-accent">
                    {userProfile?.referral_code || '—'}
                  </code>
                </div>
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (!userProfile?.referral_code) {
                        alert('Referral code not available. Please generate one.');
                        return;
                      }
                      const link = `${window.location.origin}/?ref=${userProfile?.referral_code}`;
                      navigator.clipboard?.writeText(link);
                      setMessage(t('referral_copied'));
                      setTimeout(() => setMessage(''), 3000);
                    }}
                    iconName="Copy"
                  >
                    {t('copy_referral_link')}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={generating}
                    onClick={async () => {
                      if (!user) return;
                      setGenerating(true);
                      setReferralLink(null);
                      try {
                        const raw = localStorage.getItem('gm_auth');
                        const token = raw ? JSON.parse(raw).token : null;
                        const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';
                        const resp = await fetch(`${API_BASE}/referrals/create`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {})
                          }
                        });
                        const json = await resp.json().catch(() => null) || {};
                        if (resp.ok && (json.data || json)) {
                          const d = json.data || json;
                          const link = d.referral_link || d.link || (d.referral_code ? `${window.location.origin}/?ref=${d.referral_code}` : null);
                          setReferralLink(link);
                          try { await refreshProfile(); } catch(e) { console.debug('refreshProfile failed', e); }
                          if (link) {
                            navigator.clipboard?.writeText(link);
                            setMessage(t('referral_generated'));
                            setTimeout(() => setMessage(''), 3000);
                          }
                        } else {
                          setMessage(t('referral_failed'));
                          console.warn('create referral failed', json);
                        }
                      } catch (e) {
                        console.error('Error creating referral code', e);
                        setMessage(t('referral_failed'));
                      } finally {
                        setGenerating(false);
                      }
                    }}
                    iconName={generating ? "Loader2" : "RefreshCw"}
                    iconClassName={generating ? "animate-spin" : ""}
                  >
                    {generating ? t('generating') : t('generate_code')}
                  </Button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="bg-background/60 border border-accent/20 p-5 rounded-lg">
                <p className="text-sm text-muted-foreground font-medium mb-3">{t('referral_stats')}</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('referral_total')}:</span>
                    <span className="text-2xl font-bold text-accent">{userProfile?.referralStats?.totalReferrals ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('referral_recent')}:</span>
                    <span className="text-lg font-semibold text-foreground">{userProfile?.referralStats?.recentCount ?? 0} / 10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('referral_slots')}:</span>
                    <span className="text-lg font-semibold text-green-600">{userProfile?.referralStats?.remainingSlots ?? 10}</span>
                  </div>
                  <div className="mt-4 p-3 bg-accent/5 border border-accent/10 rounded-lg">
                    <p className="text-xs text-muted-foreground">{t('referral_description')}</p>
                  </div>
                </div>
              </div>
            </div>

            {referralLink && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-mono break-all">{referralLink}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;