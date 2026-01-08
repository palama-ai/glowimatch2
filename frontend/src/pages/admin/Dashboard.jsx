import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminAnalytics from './AdminAnalytics';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

// Modern Stat Card Component
const StatCard = ({ title, value, note, icon, color = 'blue', percentage }) => {
  const circumference = 2 * Math.PI * 24;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`admin-stat-card ${color}`}>
      <div className="admin-stat-card-header">
        <div>
          <div className="admin-stat-card-title">{title}</div>
          <div className="admin-stat-card-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
          {note && <div className="admin-stat-card-note">{note}</div>}
        </div>
        {percentage !== undefined ? (
          <div className="admin-circular-progress">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle
                className="admin-circular-progress-bg"
                cx="30"
                cy="30"
                r="24"
              />
              <circle
                className="admin-circular-progress-bar"
                cx="30"
                cy="30"
                r="24"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ stroke: `var(--admin-${color === 'blue' ? 'accent' : color})` }}
              />
            </svg>
            <span className="admin-circular-progress-text">{percentage}%</span>
          </div>
        ) : (
          <div className="admin-stat-card-icon">
            <Icon name={icon} size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

// Search Result Item Component
const SearchResultItem = ({ item, onClick }) => (
  <div
    className="admin-search-result-item"
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'background 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--admin-bg-card-hover)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      background: `rgba(${item.type === 'user' ? '59, 130, 246' : item.type === 'product' ? '139, 92, 246' : '34, 197, 94'}, 0.15)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Icon
        name={item.type === 'user' ? 'User' : item.type === 'product' ? 'Package' : 'FileText'}
        size={16}
        style={{ color: item.type === 'user' ? 'var(--admin-accent)' : item.type === 'product' ? 'var(--admin-purple)' : 'var(--admin-success)' }}
      />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)' }}>{item.name}</div>
      <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{item.subtitle}</div>
    </div>
    <div style={{
      padding: '3px 8px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '500',
      background: 'var(--admin-bg-primary)',
      color: 'var(--admin-text-muted)',
      textTransform: 'capitalize',
    }}>
      {item.type}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Signup block settings state
  const [signupBlock, setSignupBlock] = useState({ blockUserSignup: false, blockSellerSignup: false });
  const [signupBlockLoading, setSignupBlockLoading] = useState(false);
  const [signupBlockSuccess, setSignupBlockSuccess] = useState(null);

  // Admin pages for search
  const adminPages = useMemo(() => [
    { name: 'Dashboard', subtitle: 'Main admin overview', type: 'page', path: '/admin' },
    { name: 'Users Management', subtitle: 'Manage all users', type: 'page', path: '/admin/users' },
    { name: 'Products', subtitle: 'Manage products', type: 'page', path: '/admin/products' },
    { name: 'Blogs', subtitle: 'Manage blog posts', type: 'page', path: '/admin/blogs' },
    { name: 'Messages', subtitle: 'View contact messages', type: 'page', path: '/admin/messages' },
    { name: 'Notifications', subtitle: 'Send notifications', type: 'page', path: '/admin/notifications' },
    { name: 'Sessions', subtitle: 'View active sessions', type: 'page', path: '/admin/sessions' },
    { name: 'Safety', subtitle: 'Safety & security settings', type: 'page', path: '/admin/safety' },
  ], []);

  // Search function
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setShowSearchResults(true);
    setSearchLoading(true);

    try {
      const raw = localStorage.getItem('gm_auth');
      const headers = raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {};
      const queryLower = query.toLowerCase();

      // Search pages locally
      const matchedPages = adminPages.filter(page =>
        page.name.toLowerCase().includes(queryLower) ||
        page.subtitle.toLowerCase().includes(queryLower)
      );

      // Search users - fetch all and filter locally
      let userResults = [];
      try {
        const usersRes = await fetch(`${API_BASE}/admin/users`, { headers });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          const allUsers = usersData.data || usersData || [];
          // Filter users by name or email
          userResults = allUsers
            .filter(user =>
              (user.full_name && user.full_name.toLowerCase().includes(queryLower)) ||
              (user.email && user.email.toLowerCase().includes(queryLower))
            )
            .slice(0, 5)
            .map(user => ({
              name: user.full_name || user.email,
              subtitle: user.email,
              type: 'user',
              path: '/admin/users',
              id: user.id,
            }));
        }
      } catch (e) {
        console.warn('User search failed:', e);
      }

      // Search products - fetch all and filter locally
      let productResults = [];
      try {
        const productsRes = await fetch(`${API_BASE}/admin/products`, { headers });
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const allProducts = productsData.data || productsData || [];
          // Filter products by name or brand
          productResults = allProducts
            .filter(product =>
              (product.name && product.name.toLowerCase().includes(queryLower)) ||
              (product.brand && product.brand.toLowerCase().includes(queryLower)) ||
              (product.category && product.category.toLowerCase().includes(queryLower))
            )
            .slice(0, 5)
            .map(product => ({
              name: product.name,
              subtitle: product.brand || product.category || 'Product',
              type: 'product',
              path: '/admin/products',
              id: product.id,
            }));
        }
      } catch (e) {
        console.warn('Product search failed:', e);
      }

      // Combine results - pages first, then users, then products
      setSearchResults([...matchedPages, ...userResults, ...productResults]);
    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchResultClick = (item) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(item.path);
  };

  const fetchDebugStats = async () => {
    try {
      const r = await fetch(`${API_BASE}/admin/debug/stats`);
      if (!r.ok) return null;
      const j = await r.json();
      return j.data || null;
    } catch (e) { return null; }
  };

  const fetchSignupBlockSettings = async () => {
    try {
      const raw = localStorage.getItem('gm_auth');
      const headers = raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {};
      const r = await fetch(`${API_BASE}/admin/settings/signup-block`, { headers });
      if (r.ok) {
        const j = await r.json();
        setSignupBlock(j.data || { blockUserSignup: false, blockSellerSignup: false });
      }
    } catch (e) {
      console.warn('[admin] Could not fetch signup block settings:', e);
    }
  };

  const updateSignupBlock = async (key, value) => {
    setSignupBlockLoading(true);
    setSignupBlockSuccess(null);
    try {
      const raw = localStorage.getItem('gm_auth');
      const headers = raw ? {
        Authorization: `Bearer ${JSON.parse(raw).token}`,
        'Content-Type': 'application/json'
      } : { 'Content-Type': 'application/json' };

      const body = key === 'user'
        ? { blockUserSignup: value }
        : { blockSellerSignup: value };

      const r = await fetch(`${API_BASE}/admin/settings/signup-block`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (r.ok) {
        const j = await r.json();
        setSignupBlock(j.data || signupBlock);
        setSignupBlockSuccess(key === 'user'
          ? (value ? 'User signup blocked' : 'User signup enabled')
          : (value ? 'Seller signup blocked' : 'Seller signup enabled'));
        setTimeout(() => setSignupBlockSuccess(null), 3000);
      }
    } catch (e) {
      console.error('[admin] Failed to update signup block:', e);
    } finally {
      setSignupBlockLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = localStorage.getItem('gm_auth');
      const headers = raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {};
      const r = await fetch(`${API_BASE}/admin/stats`, { headers });
      if (r.ok) {
        const j = await r.json();
        setStats(j.data || {});
      } else {
        console.warn('[admin] stats fetch failed', r.status);
        const dbg = await fetchDebugStats();
        if (dbg) {
          console.warn('[admin] using debug stats fallback');
          setStats(dbg);
        } else {
          setError('Unable to load admin statistics');
          setStats(null);
        }
      }
    } catch (e) {
      console.error('Failed to load admin stats', e);
      setError(e?.message || 'Failed to load statistics');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSignupBlockSettings();
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.admin-search-container')) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getActivePercentage = () => {
    if (!stats) return 0;
    return stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;
  };

  const getSubscriptionPercentage = () => {
    if (!stats) return 0;
    return stats.total > 0 ? Math.round((stats.subscribed / stats.total) * 100) : 0;
  };

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="admin-header">
        <div>
          <h1 className="admin-header-welcome">
            Welcome back, Admin! <span className="admin-header-welcome-emoji">👋</span>
          </h1>
          <p className="admin-header-subtitle">Here's what's happening with your platform today.</p>
        </div>
        <div className="admin-header-actions">
          {/* Search with Dropdown */}
          <div className="admin-search-container" style={{ position: 'relative' }}>
            <div className="admin-search">
              <Icon name="Search" size={18} style={{ color: 'var(--admin-text-muted)' }} />
              <input
                type="text"
                placeholder="Search users, products, pages..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
              />
              {searchLoading && (
                <Icon name="Loader2" size={16} style={{ color: 'var(--admin-text-muted)', animation: 'spin 1s linear infinite' }} />
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '8px',
                background: 'var(--admin-bg-card)',
                border: '1px solid var(--admin-border)',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                zIndex: 100,
                maxHeight: '400px',
                overflowY: 'auto',
              }}>
                {searchResults.length === 0 && !searchLoading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    <Icon name="Search" size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '14px' }}>No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div style={{ padding: '8px' }}>
                    {searchResults.map((item, index) => (
                      <SearchResultItem
                        key={`${item.type}-${item.name}-${index}`}
                        item={item}
                        onClick={() => handleSearchResultClick(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="admin-quick-access">
        <Link to="/admin/users" className="admin-quick-btn">
          <Icon name="Users" size={18} />
          Users
        </Link>
        <Link to="/admin/blogs" className="admin-quick-btn">
          <Icon name="BookOpen" size={18} />
          Blogs
        </Link>
        <Link to="/admin/messages" className="admin-quick-btn">
          <Icon name="Mail" size={18} />
          Messages
        </Link>
        <Link to="/admin/products" className="admin-quick-btn">
          <Icon name="Package" size={18} />
          Products
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <span className="admin-loading-text">Loading statistics…</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="admin-error">
          <div className="admin-error-content">
            <Icon name="AlertTriangle" size={20} style={{ color: 'var(--admin-danger)' }} />
            <span className="admin-error-text">{error}</span>
          </div>
          <button className="admin-quick-btn" onClick={fetchStats}>
            <Icon name="RefreshCw" size={16} />
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards Grid */}
      {stats && (
        <div className="admin-stats-grid">
          <StatCard
            title="Total Users"
            value={stats.total ?? 0}
            icon="Users"
            color="blue"
          />
          <StatCard
            title="Active Users"
            value={stats.active ?? 0}
            note={`${getActivePercentage()}% of total`}
            icon="UserCheck"
            color="green"
            percentage={getActivePercentage()}
          />
          <StatCard
            title="Disabled Users"
            value={stats.disabled ?? 0}
            icon="UserX"
            color="red"
          />
          <StatCard
            title="Subscribed"
            value={stats.subscribed ?? 0}
            note={`${getSubscriptionPercentage()}% of total`}
            icon="CreditCard"
            color="purple"
            percentage={getSubscriptionPercentage()}
          />
        </div>
      )}

      {/* Two Column Layout: Signup Control & Plans */}
      <div className="admin-two-col">
        {/* Signup Control Panel */}
        <div className="admin-signup-control">
          <div className="admin-signup-control-header">
            <div className="admin-signup-control-title">
              <Icon name="ShieldAlert" size={22} style={{ color: 'var(--admin-warning)' }} />
              Signup Control
            </div>
            {signupBlockSuccess && (
              <div className="admin-success-alert">
                <Icon name="CheckCircle2" size={16} />
                {signupBlockSuccess}
              </div>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginBottom: '20px' }}>
            Block new account registrations for users or sellers
          </p>

          <div className="admin-signup-control-buttons">
            <button
              onClick={() => updateSignupBlock('user', !signupBlock.blockUserSignup)}
              disabled={signupBlockLoading}
              className={`admin-signup-btn ${signupBlock.blockUserSignup ? 'blocked' : 'enabled'}`}
            >
              <Icon
                name={signupBlock.blockUserSignup ? "UserX" : "UserCheck"}
                size={24}
              />
              <div style={{ textAlign: 'left' }}>
                <div className="admin-signup-btn-label">User Signup</div>
                <div className="admin-signup-btn-status">
                  {signupBlock.blockUserSignup ? 'Blocked' : 'Enabled'}
                </div>
              </div>
              {signupBlockLoading && <Icon name="Loader2" size={18} className="animate-spin" />}
            </button>

            <button
              onClick={() => updateSignupBlock('seller', !signupBlock.blockSellerSignup)}
              disabled={signupBlockLoading}
              className={`admin-signup-btn ${signupBlock.blockSellerSignup ? 'blocked' : 'enabled'}`}
            >
              <Icon
                name={signupBlock.blockSellerSignup ? "StoreOff" : "Store"}
                size={24}
              />
              <div style={{ textAlign: 'left' }}>
                <div className="admin-signup-btn-label">Seller Signup</div>
                <div className="admin-signup-btn-status">
                  {signupBlock.blockSellerSignup ? 'Blocked' : 'Enabled'}
                </div>
              </div>
              {signupBlockLoading && <Icon name="Loader2" size={18} className="animate-spin" />}
            </button>
          </div>
        </div>

        {/* Subscription Plans */}
        {stats && (
          <div className="admin-plans-section">
            <div className="admin-content-card-header">
              <div>
                <h3 className="admin-content-card-title">Subscription Plans</h3>
                <p className="admin-content-card-subtitle">Active subscriptions by plan</p>
              </div>
              <Icon name="PieChart" size={22} style={{ color: 'var(--admin-accent)' }} />
            </div>

            {Object.keys(stats.planBreakdown || {}).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--admin-text-muted)' }}>
                <Icon name="TrendingUp" size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ fontSize: '14px' }}>No active subscriptions yet</p>
              </div>
            ) : (
              <div style={{ marginTop: '16px' }}>
                {Object.entries(stats.planBreakdown).map(([plan, count]) => {
                  const maxCount = Math.max(...Object.values(stats.planBreakdown));
                  const percentage = (count / maxCount) * 100;
                  return (
                    <div key={plan} className="admin-plan-item">
                      <span className="admin-plan-name">
                        {plan === 'none' ? 'No Plan' : plan.charAt(0).toUpperCase() + plan.slice(1)}
                      </span>
                      <div className="admin-plan-bar">
                        <div
                          className="admin-plan-bar-fill"
                          style={{ width: `${Math.max(5, percentage)}%` }}
                        />
                      </div>
                      <span className="admin-plan-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Analytics Section */}
      {!loading && stats && <AdminAnalytics />}
    </AdminLayout>
  );
};

export default Dashboard;
