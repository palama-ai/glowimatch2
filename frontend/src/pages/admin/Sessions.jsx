import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

function getAuthHeaders() {
  const raw = localStorage.getItem('gm_auth');
  if (raw) {
    try { const p = JSON.parse(raw); if (p && p.token) return { Authorization: `Bearer ${p.token}` }; } catch (e) { }
  }
  const alt = localStorage.getItem('admin_dashboard_token');
  if (alt) return { Authorization: `Bearer ${alt}` };
  return {};
}

export default function AdminSessions() {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [views, setViews] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [liveOnly, setLiveOnly] = useState(false);

  const fetchDebug = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/debug/sessions`, { headers });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Unauthorized. Please ensure you are logged in as admin.');
          setSessions([]);
          setViews([]);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch sessions');
      }
      const j = await res.json();
      setSessions(j.data?.sessions || []);
      setViews(j.data?.views || []);
    } catch (e) {
      console.error('fetch debug sessions failed', e);
      setError('Failed to fetch sessions');
      setSessions([]);
      setViews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDebug(); }, []);

  const now = Date.now();

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      if (!s) return false;
      if (liveOnly) {
        if (!s.last_ping_at) return false;
        const ping = new Date(s.last_ping_at).getTime();
        if (isNaN(ping)) return false;
        if ((now - ping) > 60000) return false;
      }
      if (!filter) return true;
      const q = filter.toLowerCase();
      return (s.session_id || '').toLowerCase().includes(q) ||
        (s.path || '').toLowerCase().includes(q) ||
        (s.user_id || '').toLowerCase().includes(q);
    });
  }, [sessions, filter, liveOnly, now]);

  const filteredViews = useMemo(() => {
    if (!filter) return views;
    const q = filter.toLowerCase();
    return views.filter(v =>
      (v.id || '').toLowerCase().includes(q) ||
      (v.path || '').toLowerCase().includes(q) ||
      (v.session_id || '').toLowerCase().includes(q)
    );
  }, [views, filter]);

  const stats = useMemo(() => ({
    totalSessions: sessions.length,
    liveSessions: sessions.filter(s => {
      if (!s.last_ping_at) return false;
      const ping = new Date(s.last_ping_at).getTime();
      return !isNaN(ping) && (now - ping) <= 60000;
    }).length,
    totalViews: views.length,
  }), [sessions, views, now]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--admin-text-primary)', margin: 0 }}>
          Active Sessions
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
          Monitor live sessions and recent page views
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div className="admin-stat-card blue" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Total Sessions</div>
              <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.totalSessions}</div>
            </div>
            <div className="admin-stat-card-icon"><Icon name="Users" size={24} /></div>
          </div>
        </div>
        <div className="admin-stat-card green" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Live Now</div>
              <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.liveSessions}</div>
            </div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--admin-success)', animation: 'pulse 2s infinite' }}></div>
          </div>
        </div>
        <div className="admin-stat-card purple" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Page Views</div>
              <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.totalViews}</div>
            </div>
            <div className="admin-stat-card-icon"><Icon name="Eye" size={24} /></div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="admin-search" style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}>
          <Icon name="Search" size={18} style={{ color: 'var(--admin-text-muted)' }} />
          <input
            type="text"
            placeholder="Search session, path, or user..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-secondary)', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={liveOnly}
            onChange={(e) => setLiveOnly(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          Live only (last 60s)
        </label>

        <button onClick={fetchDebug} className="admin-quick-btn" style={{ padding: '10px 16px' }}>
          <Icon name="RefreshCw" size={16} />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="admin-error" style={{ marginBottom: '24px' }}>
          <div className="admin-error-content">
            <Icon name="AlertTriangle" size={18} style={{ color: 'var(--admin-danger)' }} />
            <span className="admin-error-text">{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <span className="admin-loading-text">Loading sessions...</span>
        </div>
      ) : (
        /* Two Column Layout */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Sessions Table */}
          <div className="admin-content-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-bg-primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>
                Sessions ({filteredSessions.length})
              </h3>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--admin-bg-primary)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Session</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>User</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Path</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Last Ping</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                        <Icon name="Users" size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                        <p style={{ margin: 0, fontSize: '13px' }}>No sessions found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map(s => (
                      <tr key={s.session_id} style={{ borderTop: '1px solid var(--admin-border)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontSize: '12px', color: 'var(--admin-text-primary)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {s.session_id?.slice(0, 12)}...
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                          {s.user_id || '-'}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                          {s.path || '-'}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                          {formatDate(s.last_ping_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Page Views Table */}
          <div className="admin-content-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-bg-primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>
                Recent Page Views ({filteredViews.length})
              </h3>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--admin-bg-primary)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>ID</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Session</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Path</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredViews.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                        <Icon name="Eye" size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                        <p style={{ margin: 0, fontSize: '13px' }}>No views found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredViews.map(v => (
                      <tr key={v.id} style={{ borderTop: '1px solid var(--admin-border)' }}>
                        <td style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                          {v.id?.slice(0, 8)}...
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                          {v.session_id?.slice(0, 8)}...
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                          {v.path || '-'}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                          {formatDate(v.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
