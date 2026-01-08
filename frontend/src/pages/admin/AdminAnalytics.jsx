import React, { useEffect, useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

function getAuthHeaders() {
  const raw = localStorage.getItem('gm_auth');
  if (raw) {
    try {
      const p = JSON.parse(raw);
      if (p && p.token) return { Authorization: `Bearer ${p.token}` };
    } catch (e) { /* ignore */ }
  }
  const alt = localStorage.getItem('admin_dashboard_token');
  if (alt) return { Authorization: `Bearer ${alt}` };
  return {};
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--admin-bg-card)',
        border: '1px solid var(--admin-border)',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
      }}>
        <p style={{ color: 'var(--admin-text-primary)', fontWeight: '600', marginBottom: '8px' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontSize: '13px', margin: '4px 0' }}>
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminAnalytics() {
  const [range, setRange] = useState(7);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({});
  const [growth, setGrowth] = useState({});
  const [liveUsers, setLiveUsers] = useState(0);
  const [debugSessions, setDebugSessions] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [seriesVisible, setSeriesVisible] = useState({ active: true, attempts: true, conv: true });

  async function load(rangeDays) {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/analytics?range=${rangeDays}`, { headers });
      if (res.status === 401 || res.status === 403) {
        setError('Unauthorized — paste an admin JWT in localStorage under `admin_dashboard_token` or login as admin');
        setData([]);
        return;
      }
      if (!res.ok) {
        setError(`Server responded ${res.status}`);
        setData([]);
        return;
      }
      const j = await res.json();
      const payload = j.data || {};
      const labels = payload.labels || [];
      const active = payload.activeSeries || [];
      const conv = payload.convSeries || [];
      const newUsers = payload.newUsersSeries || [];
      const attempts = payload.attemptsSeries || [];
      const durations = payload.sessionDurationSeries || [];
      const combined = labels.map((lbl, i) => ({
        label: lbl,
        active: active[i] || 0,
        conv: conv[i] || 0,
        newUsers: newUsers[i] || 0,
        attempts: attempts[i] || 0,
        sessionDuration: durations[i] || 0,
      }));
      setData(combined);
      const totalsPayload = payload.totals || {};
      totalsPayload.visitCounts = payload.visitCounts || {};
      setTotals(totalsPayload);
      setLiveUsers(payload.liveUsers || 0);
      setGrowth(payload.growth || {});
    } catch (e) {
      console.error('admin analytics load failed', e);
      setError('Failed to fetch analytics — see console');
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(range); }, [range]);

  const summary = useMemo(() => ({
    active: totals.totalActive || 0,
    attempts: totals.totalAttempts || 0,
    conv: totals.totalConv || 0,
    newUsers: totals.totalNewUsers || 0,
  }), [totals]);

  const fmtChange = (val) => {
    const n = Number(val) || 0;
    const arrow = n > 0 ? '▲' : (n < 0 ? '▼' : '');
    const isUp = n > 0;
    const isDown = n < 0;
    return (
      <span className={`admin-stat-card-change ${isUp ? 'up' : isDown ? 'down' : ''}`}>
        {arrow} {Math.abs(n).toFixed(1)}%
      </span>
    );
  };

  function StatCard({ title, value, change, highlight, icon }) {
    return (
      <div className={`admin-stat-card ${highlight ? 'cyan' : ''}`} style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>{title}</div>
            <div className="admin-stat-card-value" style={{ fontSize: '24px', marginTop: '4px' }}>{value}</div>
            <div style={{ marginTop: '6px' }}>{fmtChange(change)}</div>
          </div>
          {icon && (
            <div className="admin-stat-card-icon" style={{ width: '36px', height: '36px' }}>
              <Icon name={icon} size={18} />
            </div>
          )}
        </div>
      </div>
    );
  }

  const toggleSeries = (key) => {
    setSeriesVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--admin-text-primary)', margin: 0 }}>Platform Analytics</h3>
          <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>Overview of active users, conversions and site engagement.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Live Users */}
          <div className="admin-live-indicator">
            <div className="admin-live-dot"></div>
            <span className="admin-live-text">Live Now</span>
            <span className="admin-live-count">{loading ? '...' : liveUsers}</span>
          </div>

          {/* Range Selector */}
          <div className="admin-range-selector">
            {[7, 15, 30, 90].map(d => (
              <button
                key={d}
                className={`admin-range-btn ${range === d ? 'active' : ''}`}
                onClick={() => setRange(d)}
              >
                {d}d
              </button>
            ))}
          </div>

          {/* Debug Button */}
          <button
            onClick={async () => {
              setShowDebug(s => !s);
              if (!debugSessions) {
                try {
                  const headers = getAuthHeaders();
                  const res = await fetch(`${API_BASE}/admin/debug/sessions`, { headers });
                  const j = await res.json();
                  setDebugSessions(j.data || null);
                } catch (e) {
                  console.error('failed fetching debug sessions', e);
                  setDebugSessions({ error: 'Failed to fetch' });
                }
              }
            }}
            className="admin-quick-btn"
            style={{ padding: '8px 14px' }}
          >
            <Icon name="Terminal" size={16} />
            Inspect Sessions
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="admin-error" style={{ marginBottom: '24px' }}>
          <div className="admin-error-content">
            <Icon name="AlertTriangle" size={18} style={{ color: 'var(--admin-danger)' }} />
            <span className="admin-error-text">{error}</span>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      {showDebug && debugSessions && (
        <div className="admin-debug-panel">
          <h4 className="admin-debug-title">
            <Icon name="Database" size={18} style={{ marginRight: '8px' }} />
            Recent Sessions (Debug)
          </h4>
          {debugSessions.error && <div style={{ color: 'var(--admin-danger)' }}>{debugSessions.error}</div>}
          {debugSessions.sessions && debugSessions.sessions.length === 0 && (
            <div style={{ color: 'var(--admin-text-muted)' }}>No sessions recorded yet.</div>
          )}
          {debugSessions.sessions && debugSessions.sessions.length > 0 && (
            <div style={{ overflowX: 'auto', maxHeight: '240px' }}>
              <table className="admin-debug-table">
                <thead>
                  <tr>
                    <th>Session ID</th>
                    <th>User ID</th>
                    <th>Path</th>
                    <th>Last Ping</th>
                    <th>Started</th>
                    <th>Duration (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {debugSessions.sessions.map(s => (
                    <tr key={s.session_id}>
                      <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.session_id}</td>
                      <td>{s.user_id || '—'}</td>
                      <td>{s.path || '—'}</td>
                      <td>{s.last_ping_at || '—'}</td>
                      <td>{s.started_at || '—'}</td>
                      <td>{s.duration_seconds ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {debugSessions.views && debugSessions.views.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--admin-text-primary)' }}>Recent Page Views</div>
              <div style={{ overflowX: 'auto', maxHeight: '160px' }}>
                <table className="admin-debug-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Session ID</th>
                      <th>Path</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debugSessions.views.map(v => (
                      <tr key={v.id}>
                        <td style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.id}</td>
                        <td style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.session_id || '—'}</td>
                        <td>{v.path || '—'}</td>
                        <td>{v.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="admin-analytics-summary">
        <StatCard title="Live Now" value={loading ? '...' : liveUsers} change={0} highlight icon="Activity" />
        <StatCard title="Active Users" value={loading ? '...' : summary.active} change={growth.activePct ?? 0} icon="UserCheck" />
        <StatCard title="Attempts" value={loading ? '...' : summary.attempts} change={growth.attemptsPct ?? 0} icon="MousePointer" />
        <StatCard title="Conversions" value={loading ? '...' : summary.conv} change={growth.convPct ?? 0} icon="Target" />
        <StatCard title="New Users" value={loading ? '...' : summary.newUsers} change={growth.newUsersPct ?? 0} icon="UserPlus" />
      </div>

      {/* Charts Grid */}
      <div className="admin-charts-grid">
        {/* Main Chart */}
        <div className="admin-chart-container">
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>Traffic Overview</h4>
            <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>User activity trends over time</p>
          </div>

          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <defs>
                  <linearGradient id="gradActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradAttempts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'var(--admin-text-muted)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--admin-border)' }}
                  tickLine={{ stroke: 'var(--admin-border)' }}
                  interval={Math.max(0, Math.floor(data.length / 8))}
                />
                <YAxis
                  tick={{ fill: 'var(--admin-text-muted)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--admin-border)' }}
                  tickLine={{ stroke: 'var(--admin-border)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => <span style={{ color: 'var(--admin-text-secondary)' }}>{value}</span>}
                />
                {seriesVisible.active && (
                  <Area type="monotone" dataKey="active" name="Active Users" stroke="#06b6d4" strokeWidth={2} fill="url(#gradActive)" />
                )}
                {seriesVisible.attempts && (
                  <Area type="monotone" dataKey="attempts" name="Attempts" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradAttempts)" />
                )}
                {seriesVisible.conv && (
                  <Area type="monotone" dataKey="conv" name="Conversions" stroke="#22c55e" strokeWidth={2} fill="url(#gradConv)" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Series Toggles */}
          <div className="admin-series-toggles">
            <button
              onClick={() => toggleSeries('active')}
              className={`admin-series-btn ${seriesVisible.active ? 'active cyan' : 'inactive'}`}
            >
              Active
            </button>
            <button
              onClick={() => toggleSeries('attempts')}
              className={`admin-series-btn ${seriesVisible.attempts ? 'active purple' : 'inactive'}`}
            >
              Attempts
            </button>
            <button
              onClick={() => toggleSeries('conv')}
              className={`admin-series-btn ${seriesVisible.conv ? 'active green' : 'inactive'}`}
            >
              Conversions
            </button>
          </div>
        </div>

        {/* Session Duration + Visit Stats */}
        <div className="admin-chart-container">
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>Session Duration</h4>
            <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>Average session duration in seconds</p>
          </div>

          <div style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
                <XAxis dataKey="label" hide />
                <YAxis
                  tick={{ fill: 'var(--admin-text-muted)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--admin-border)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sessionDuration"
                  name="Avg Duration"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Visit Stats */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text-primary)', marginBottom: '12px' }}>
              Page Visits
            </div>
            <div className="admin-visit-stats">
              <div className="admin-visit-stat">
                <div className="admin-visit-stat-label">Last 24h</div>
                <div className="admin-visit-stat-value">
                  {loading ? '...' : (totals?.visitCounts?.[1] ?? 0)}
                </div>
              </div>
              <div className="admin-visit-stat">
                <div className="admin-visit-stat-label">Last 7 days</div>
                <div className="admin-visit-stat-value">
                  {loading ? '...' : (totals?.visitCounts?.[7] ?? 0)}
                </div>
              </div>
              <div className="admin-visit-stat">
                <div className="admin-visit-stat-label">Last 15 days</div>
                <div className="admin-visit-stat-value">
                  {loading ? '...' : (totals?.visitCounts?.[15] ?? 0)}
                </div>
              </div>
              <div className="admin-visit-stat">
                <div className="admin-visit-stat-label">Last 30 days</div>
                <div className="admin-visit-stat-value">
                  {loading ? '...' : (totals?.visitCounts?.[30] ?? 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
