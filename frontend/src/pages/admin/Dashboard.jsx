import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminAnalytics from './AdminAnalytics';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

const StatCard = ({ title, value, note, icon, color = 'accent' }) => (
  <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="text-4xl font-bold text-foreground mt-3">{value}</div>
        {note && <div className="text-xs text-muted-foreground mt-2">{note}</div>}
      </div>
      {icon && (
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon name={icon} size={24} className={`text-${color}`} />
        </div>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDebugStats = async () => {
    try {
      const r = await fetch(`${API_BASE}/admin/debug/stats`);
      if (!r.ok) return null;
      const j = await r.json();
      return j.data || null;
    } catch (e) { return null; }
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

  useEffect(() => { fetchStats(); }, []);

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your platform overview.</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link to="/admin/users">
            <Button variant="outline" iconName="Users" iconPosition="left">
              Users
            </Button>
          </Link>
          <Link to="/admin/blogs">
            <Button variant="outline" iconName="BookOpen" iconPosition="left">
              Blogs
            </Button>
          </Link>
          <Link to="/admin/messages">
            <Button variant="outline" iconName="Mail" iconPosition="left">
              Messages
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg flex items-center space-x-3">
          <Icon name="Loader2" className="animate-spin text-accent" />
          <span className="text-accent font-medium">Loading statistics…</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="AlertTriangle" className="text-destructive" />
            <span className="text-destructive font-medium">{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchStats}>
            Retry
          </Button>
        </div>
      )}

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          />
        </div>
      )}

      {/* Plans Breakdown */}
      {stats && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Subscription Plans</h3>
              <p className="text-sm text-muted-foreground mt-1">Active subscriptions by plan</p>
            </div>
            <Icon name="PieChart" className="text-accent" size={24} />
          </div>

          {Object.keys(stats.planBreakdown || {}).length === 0 ? (
            <div className="text-center py-8">
              <Icon name="TrendingUp" className="mx-auto text-muted-foreground mb-3" size={32} />
              <p className="text-sm text-muted-foreground">No active subscriptions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats.planBreakdown).map(([plan, count]) => {
                const maxCount = Math.max(...Object.values(stats.planBreakdown));
                const percentage = (count / maxCount) * 100;
                return (
                  <div key={plan} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {plan === 'none' ? 'No Plan' : plan.charAt(0).toUpperCase() + plan.slice(1)}
                      </span>
                      <span className="text-lg font-bold text-accent">{count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 bg-gradient-to-r from-accent to-secondary rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Analytics Section */}
      {!loading && stats && <AdminAnalytics />}
    </AdminLayout>
  );
};

export default Dashboard;
