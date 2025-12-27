import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useModal } from '../../contexts/ModalContext';
import Button from './Button';
import Icon from '../AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

// Navigation Link Component with Animation
const NavLink = ({ to, label }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className={`relative px-3 py-1 font-medium transition-all duration-300 rounded-lg ${isActive
        ? 'text-pink-600 bg-white/60'
        : 'text-gray-700 hover:text-pink-600'
        }`}
    >
      <span className="relative z-10">{label}</span>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg -z-0 animate-pulse" />
      )}
    </Link>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const { user, userProfile, signOut, isAdmin, isSeller } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showCount, setShowCount] = useState(true);
  const { lang, setLang, t } = useI18n();
  const { theme, toggle } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          } catch (e) { }
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

            if (unread > 0) {
              setUnreadCount(unread);
              setShowCount(true);

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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-pink-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} className="text-gray-700" />
          </button>

          {/* Logo - Left */}
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Glowimatch</span>
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden lg:flex items-center flex-1 justify-center">
            <div className="flex items-center space-x-1 px-4 py-1.5 bg-gradient-to-r from-pink-50/80 to-rose-50/80 rounded-full border border-pink-200/50 backdrop-blur-sm">
              <NavLink to="/" label={t('home')} />
              <NavLink to="/about" label={t('about')} />
              <NavLink to="/contact" label={t('contact')} />
              <NavLink to="/blog" label={t('blog')} />
              {user && isSeller && isSeller() && <NavLink to="/seller" label={t('dashboard') || 'Dashboard'} />}
              {user && (!isSeller || !isSeller()) && <NavLink to="/interactive-skin-quiz" label={t('skin_quiz')} />}
              {user && isAdmin && isAdmin() && <NavLink to="/admin" label={t('admin')} />}
            </div>
          </nav>

          {/* Right Section - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {user ? (
              <>
                {/* Notifications - Circular */}
                <Link
                  to={isAdmin && isAdmin() ? "/admin/messages" : "/notifications"}
                  className="inline-flex items-center relative"
                >
                  <button className="p-2.5 rounded-full hover:bg-pink-100 inline-flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Icon
                      name={isAdmin && isAdmin() ? "Mail" : "Bell"}
                      size={20}
                      className="text-gray-700"
                    />
                    {unreadCount > 0 && (
                      <>
                        {showCount ? (
                          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full animate-pulse">
                            {unreadCount}
                          </span>
                        ) : (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
                        )}
                      </>
                    )}
                  </button>
                </Link>

                {/* Settings Menu - Circular */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    className="p-2.5 rounded-full hover:bg-pink-100 inline-flex items-center justify-center transition-all duration-300 hover:scale-110"
                    title="Settings"
                  >
                    <Icon name="Settings" size={20} className="text-gray-700" />
                  </button>

                  {showSettingsMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-pink-200 rounded-xl shadow-xl overflow-hidden z-50">
                      {/* Settings Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-pink-100 to-rose-100 border-b border-pink-200">
                        <p className="text-sm font-bold text-gray-900">{t('settings') || 'Settings'}</p>
                      </div>

                      {/* Settings Items */}
                      <div className="py-2">
                        {/* Theme Toggle */}
                        <button
                          onClick={() => {
                            toggle();
                            setShowSettingsMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        >
                          <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={16} className="text-pink-500" />
                          <span>{theme === 'dark' ? ` ${t('light_mode') || 'Light Mode'}` : ` ${t('dark_mode') || 'Dark Mode'}`}</span>
                        </button>

                        <div className="border-t border-pink-200 my-1" />

                        {/* Language Options */}
                        <button
                          onClick={() => setLang('en')}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${lang === 'en' ? 'bg-pink-100 text-pink-600 font-semibold' : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                            }`}
                        >
                          <span>🇺🇸</span>
                          <span>English</span>
                        </button>
                        <button
                          onClick={() => setLang('fr')}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${lang === 'fr' ? 'bg-pink-100 text-pink-600 font-semibold' : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                            }`}
                        >
                          <span>🇫🇷</span>
                          <span>Français</span>
                        </button>
                        <button
                          onClick={() => setLang('ar')}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${lang === 'ar' ? 'bg-pink-100 text-pink-600 font-semibold' : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                            }`}
                        >
                          <span>🇸🇦</span>
                          <span>العربية</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile - Circular */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2.5 rounded-full hover:bg-pink-100 inline-flex items-center justify-center transition-all duration-300 hover:scale-110"
                    title={userProfile?.full_name || 'User'}
                  >
                    <Icon name="User" size={20} className="text-gray-700" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-pink-200 rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 bg-gradient-to-r from-pink-100 to-rose-100 border-b border-pink-200">
                        <p className="text-sm font-bold text-gray-900">{userProfile?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{userProfile?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link to="/profile" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                          <Icon name="User" size={16} className="text-pink-500" />
                          <span>{t('profile')}</span>
                        </Link>
                        <Link to="/subscription" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                          <Icon name="Zap" size={16} className="text-pink-500" />
                          <span>{t('plans')}</span>
                        </Link>
                        {(!isSeller || !isSeller()) && (
                          <Link to="/quiz-history" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <Icon name="History" size={16} className="text-pink-500" />
                            <span>{t('quiz_history')}</span>
                          </Link>
                        )}
                        {isSeller && isSeller() && (
                          <Link to="/seller" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <Icon name="LayoutDashboard" size={16} className="text-pink-500" />
                            <span>{t('dashboard') || 'Dashboard'}</span>
                          </Link>
                        )}
                        {isAdmin && isAdmin() && (
                          <Link to="/admin" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <Icon name="ShieldCheck" size={16} className="text-pink-500" />
                            <span>{t('admin')}</span>
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-pink-200" />
                      <button onClick={() => { handleSignOut(); setShowUserMenu(false); }} className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
                        <Icon name="LogOut" size={16} />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 text-gray-700 font-semibold hover:text-pink-600 transition-all duration-300 hover:bg-pink-50 rounded-full border border-pink-200 hover:border-pink-400 text-sm sm:text-base"
                >
                  {t('sign_in')}
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 text-white font-semibold bg-gradient-to-r from-pink-500 to-rose-500 rounded-full hover:shadow-lg hover:shadow-pink-400/50 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  {t('sign_up')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-pink-100 bg-white/95 backdrop-blur-md animate-fade-in">
            <nav className="py-4 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <Icon name="Home" size={18} />
                {t('home')}
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <Icon name="Info" size={18} />
                {t('about')}
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <Icon name="Mail" size={18} />
                {t('contact')}
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <Icon name="BookOpen" size={18} />
                {t('blog')}
              </Link>
              {user && isSeller && isSeller() && (
                <Link
                  to="/seller"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  <Icon name="LayoutDashboard" size={18} />
                  {t('dashboard') || 'Dashboard'}
                </Link>
              )}
              {user && (!isSeller || !isSeller()) && (
                <Link
                  to="/interactive-skin-quiz"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  <Icon name="Sparkles" size={18} />
                  {t('skin_quiz')}
                </Link>
              )}
              {user && isAdmin && isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  <Icon name="ShieldCheck" size={18} />
                  {t('admin')}
                </Link>
              )}
              {user && (
                <>
                  <div className="border-t border-pink-100 mt-2 pt-2">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      <Icon name="User" size={18} />
                      {t('profile')}
                    </Link>
                    <Link
                      to="/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      <Icon name="Bell" size={18} />
                      {t('notifications')}
                      {unreadCount > 0 && (
                        <span className="ml-auto bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>
                      )}
                    </Link>
                    {(!isSeller || !isSeller()) && (
                      <Link
                        to="/quiz-history"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      >
                        <Icon name="History" size={18} />
                        {t('quiz_history')}
                      </Link>
                    )}
                  </div>
                </>
              )}

              {/* Settings Section */}
              <div className="border-t border-pink-100 mt-2 pt-2">
                <div className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase">{t('settings') || 'Settings'}</div>

                {/* Language Toggle */}
                <div className="flex items-center gap-3 px-5 py-3">
                  <Icon name="Globe" size={18} className="text-gray-500" />
                  <span className="text-gray-700 flex-1">{t('language') || 'Language'}</span>
                  <div className="flex gap-1">
                    {['en', 'fr', 'ar'].map(l => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`px-2 py-1 text-xs rounded ${lang === l ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-pink-100'}`}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={toggle}
                  className="flex items-center gap-3 px-5 py-3 w-full text-gray-700 hover:bg-pink-50 transition-colors"
                >
                  <Icon name={theme === 'dark' ? 'Moon' : 'Sun'} size={18} className="text-gray-500" />
                  <span className="flex-1 text-left">{theme === 'dark' ? (t('light_mode') || 'Light Mode') : (t('dark_mode') || 'Dark Mode')}</span>
                </button>
              </div>

              {user && (
                <div className="border-t border-pink-100 mt-2 pt-2">
                  <button
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-5 py-3 w-full text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Icon name="LogOut" size={18} />
                    {t('logout')}
                  </button>
                </div>
              )}

              {!user && (
                <div className="border-t border-pink-100 mt-2 pt-3 px-5">
                  <button
                    onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                    className="w-full mb-2 px-4 py-2.5 text-gray-700 font-semibold hover:text-pink-600 transition-all rounded-full border border-pink-200 hover:border-pink-400"
                  >
                    {t('sign_in')}
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
