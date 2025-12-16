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
      className={`relative px-3 py-1 font-medium transition-all duration-300 rounded-lg ${
        isActive 
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
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showCount, setShowCount] = useState(true);
  const { lang, setLang, t } = useI18n();
  const { theme, toggle } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
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
          {/* Logo - Left */}
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent hidden sm:inline">GlowMatch</span>
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden lg:flex items-center flex-1 justify-center">
            <div className="flex items-center space-x-1 px-4 py-1.5 bg-gradient-to-r from-pink-50/80 to-rose-50/80 rounded-full border border-pink-200/50 backdrop-blur-sm">
              <NavLink to="/" label={t('home')} />
              <NavLink to="/about" label={t('about')} />
              <NavLink to="/contact" label={t('contact')} />
              <NavLink to="/blog" label={t('blog')} />
              {user && <NavLink to="/interactive-skin-quiz" label={t('skin_quiz')} />}
              {user && isAdmin && isAdmin() && <NavLink to="/admin" label={t('admin')} />}
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 flex-shrink-0">
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
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${
                            lang === 'en' ? 'bg-pink-100 text-pink-600 font-semibold' : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                          }`}
                        >
                          <span>🇺🇸</span>
                          <span>English</span>
                        </button>
                        <button
                          onClick={() => setLang('fr')}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${
                            lang === 'fr' ? 'bg-pink-100 text-pink-600 font-semibold' : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                          }`}
                        >
                          <span>🇫🇷</span>
                          <span>Français</span>
                        </button>
                        <button
                          onClick={() => setLang('ar')}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${
                            lang === 'ar' ? 'bg-pink-100 text-pink-600 font-semibold' : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
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
                        <Link to="/quiz-history" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                          <Icon name="History" size={16} className="text-pink-500" />
                          <span>{t('quiz_history')}</span>
                        </Link>
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
                  className="px-6 py-2.5 text-gray-700 font-semibold hover:text-pink-600 transition-all duration-300 hover:bg-pink-50 rounded-full border border-pink-200 hover:border-pink-400"
                >
                  {t('sign_in')}
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-6 py-2.5 text-white font-semibold bg-gradient-to-r from-pink-500 to-rose-500 rounded-full hover:shadow-lg hover:shadow-pink-400/50 transition-all duration-300 transform hover:scale-105"
                >
                  {t('sign_up')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
