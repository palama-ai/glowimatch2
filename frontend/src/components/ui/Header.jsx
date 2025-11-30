import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useModal } from '../../contexts/ModalContext';
import Button from './Button';
import Icon from '../AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

const Header = () => {
  const navigate = useNavigate();
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showCount, setShowCount] = useState(true);
  const { lang, setLang, t } = useI18n();
  const { theme, toggle } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { openAnalysisPrompt } = useModal();

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  // Fetch unread messages/notifications
  useEffect(() => {
    let countTimer;
    
    const fetchUnread = async () => {
      try {
        let headers = {};
        const raw = localStorage.getItem('gm_auth');
        if (raw) {
          try { 
            const p = JSON.parse(raw); 
            if (p && p.token) {
              headers.Authorization = `Bearer ${p.token}`;
            }
          } catch (e) {}
        }
        if (!headers.Authorization) {
          const alt = localStorage.getItem('admin_dashboard_token');
          if (alt) {
            headers.Authorization = `Bearer ${alt}`;
          }
        }

        if (!headers.Authorization) {
          setUnreadCount(0);
          return;
        }

        // Admin: Fetch unread contact messages
        if (isAdmin && isAdmin()) {
          const res = await fetch(`${API_BASE}/contact`, { headers });
          if (res.ok) {
            const data = await res.json();
            const messages = data.data || [];
            const unread = messages.filter(m => !m.read).length;
            
            // عندما تصل رسالة جديدة، اعرض العدد لمدة 5 ثواني ثم أخفيه
            if (unread > 0) {
              setUnreadCount(unread);
              setShowCount(true);
              
              // إخفاء العدد بعد 5 ثواني والاحتفاظ بالنقطة الحمراء
              if (countTimer) clearTimeout(countTimer);
              countTimer = setTimeout(() => {
                setShowCount(false);
              }, 5000);
            } else {
              setUnreadCount(0);
              setShowCount(false);
            }
          }
        } else {
          // Regular users: Fetch notifications
          const res = await fetch(`${API_BASE}/notifications/me`, { headers });
          if (res.ok) {
            const parsed = await res.json();
            const rows = Array.isArray(parsed) ? parsed : (parsed.data || parsed.notifications || []);
            const unread = rows.filter(n => n.read === 0 || n.read === false || n.read === null).length;
            setUnreadCount(unread);
          }
        }
      } catch (e) {
        console.error('[Header] Failed to fetch unread', e);
        setUnreadCount(0);
      }
    };

    if (user) {
      fetchUnread();
      // Refresh every 10 seconds for faster detection of new messages
      const interval = setInterval(fetchUnread, 10000);
      return () => {
        clearInterval(interval);
        if (countTimer) clearTimeout(countTimer);
      };
    } else {
      setUnreadCount(0);
      setShowCount(false);
    }
  }, [user, isAdmin]);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-md border-b border-gradient-to-r border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-accent/20 to-pink-500/20 rounded-lg group-hover:from-accent/30 group-hover:to-pink-500/30 transition-colors">
              <Icon name="Sparkles" size={20} className="text-accent" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">GlowMatch</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Public Navigation (Always visible) */}
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('home')}
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('about')}
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('contact')}
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('blog')}
            </Link>

            {/* Authenticated User Navigation */}
            {user && (
              <>
                <Link
                  to="/interactive-skin-quiz"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('skin_quiz')}
                </Link>
                <button
                  onClick={openAnalysisPrompt}
                  className="text-muted-foreground hover:text-foreground transition-colors border-none bg-transparent px-0"
                >
                  {t('analysis')}
                </button>
              </>
            )}

            {isAdmin && isAdmin() && (
              <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('admin')}
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative flex items-center">
                {/* Notifications/Messages Icon */}
                <Link 
                  to={isAdmin && isAdmin() ? "/admin/messages" : "/notifications"} 
                  className="inline-flex items-center mr-3 relative"
                >
                  <div className="p-1 rounded-md hover:bg-muted/50 inline-flex items-center justify-center transition-all">
                    <Icon 
                      name={isAdmin && isAdmin() ? "Mail" : "Bell"} 
                      size={18}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    />
                    {unreadCount > 0 && (
                      <>
                        {showCount ? (
                          // Show number badge for 5 seconds
                          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full animate-pulse">
                            {unreadCount}
                          </span>
                        ) : (
                          // Show red dot after 5 seconds
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
                        )}
                      </>
                    )}
                  </div>
                </Link>

                <div className="flex items-center space-x-2 mr-3">
                  {/* Language Selector - Icon Only */}
                  <div className="relative inline-block">
                    <button
                      onClick={() => setShowLangMenu(!showLangMenu)}
                      className="p-2 rounded-lg hover:bg-accent/10 transition-all duration-200 group relative"
                      title="Change language"
                    >
                      <Icon
                        name="Globe"
                        size={18}
                        className="text-accent group-hover:text-accent group-hover:scale-110 transition-transform"
                      />
                    </button>

                    {/* Language Dropdown */}
                    {showLangMenu && (
                      <div className="absolute right-0 top-full mt-2 w-32 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                        <button
                          onClick={() => {
                            setLang('en');
                            setShowLangMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            lang === 'en'
                              ? 'bg-accent/10 text-accent font-semibold'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        >
                          🇺🇸 English
                        </button>
                        <button
                          onClick={() => {
                            setLang('fr');
                            setShowLangMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            lang === 'fr'
                              ? 'bg-accent/10 text-accent font-semibold'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        >
                          🇫🇷 Français
                        </button>
                        <button
                          onClick={() => {
                            setLang('ar');
                            setShowLangMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            lang === 'ar'
                              ? 'bg-accent/10 text-accent font-semibold'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        >
                          🇸🇦 العربية
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Theme Toggle */}
                  <button
                    onClick={toggle}
                    title="Toggle theme"
                    className="p-2 rounded-lg hover:bg-accent/10 transition-all duration-200 group"
                  >
                    <Icon
                      name={theme === 'dark' ? 'Sun' : 'Moon'}
                      size={18}
                      className="text-accent group-hover:text-accent group-hover:scale-110 transition-transform"
                    />
                  </button>
                </div>

                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name="User" size={20} />
                  <span className="hidden sm:inline">
                    {userProfile?.full_name?.split(' ')?.[0] || 'User'}
                  </span>
                  <Icon name="ChevronDown" size={16} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-gradient-to-br from-card to-card/95 border border-border/50 rounded-xl shadow-xl overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-accent/10 to-pink-500/10 border-b border-border/50">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Account</p>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        {userProfile?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{userProfile?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {/* Profile */}
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors group"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Icon name="User" size={16} className="text-accent group-hover:scale-110 transition-transform" />
                        <span>{t('profile')}</span>
                        <Icon name="ArrowRight" size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      {/* Plans */}
                      <Link
                        to="/subscription"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors group"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Icon name="Zap" size={16} className="text-accent group-hover:scale-110 transition-transform" />
                        <span>{t('plans')}</span>
                        <Icon name="ArrowRight" size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      {/* History */}
                      <Link
                        to="/quiz-history"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors group"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Icon name="History" size={16} className="text-accent group-hover:scale-110 transition-transform" />
                        <span>{t('quiz_history')}</span>
                        <Icon name="ArrowRight" size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      {/* Admin Link */}
                      {isAdmin && isAdmin() && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors group"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Icon name="ShieldCheck" size={16} className="text-accent group-hover:scale-110 transition-transform" />
                          <span>{t('admin')}</span>
                          <Icon name="ArrowRight" size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border/50" />

                    {/* Logout Button */}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors group"
                    >
                      <Icon name="LogOut" size={16} className="group-hover:scale-110 transition-transform" />
                      <span>{t('logout')}</span>
                      <Icon name="ArrowRight" size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  {t('sign_in')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  {t('sign_up')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;