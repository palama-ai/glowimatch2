import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminAnalytics from './AdminAnalytics';
import { Link } from 'react-router-dom';
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

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Signup block settings state
  const [signupBlock, setSignupBlock] = useState({ blockUserSignup: false, blockSellerSignup: false });
  const [signupBlockLoading, setSignupBlockLoading] = useState(false);
  const [signupBlockSuccess, setSignupBlockSuccess] = useState(null);

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
          <div className="admin-search">
            <Icon name="Search" size={18} style={{ color: 'var(--admin-text-muted)' }} />
            <input type="text" placeholder="Search..." />
          </div>
          <button className="admin-notification-btn">
            <Icon name="Bell" size={20} />
            <span className="admin-notification-badge">3</span>
          </button>
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
