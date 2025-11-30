import React, { useEffect, useState, useMemo } from 'react';
// Replace Ant Design usage with lightweight HTML/Tailwind to avoid requiring `antd` dependency
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

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
      // attach session duration series if provided
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
      // attach visitCounts into totals for UI convenience
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
    const cls = n > 0 ? 'text-green-600' : (n < 0 ? 'text-red-600' : 'text-muted-foreground');
    return (
      <span className={`ml-2 ${cls}`}>{arrow} {Math.abs(n).toFixed(1)}%</span>
    );
  };

  function StatCard({ title, value, change, highlight }) {
    return (
      <div className={`p-4 rounded border ${highlight ? 'border-accent/20 bg-accent/5' : 'bg-card'} `}>
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{title}</div>
          {/* placeholder for icon space */}
        </div>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs">{fmtChange(change)}</div>
        </div>
      </div>
    );
  }

  const toggleSeries = (key) => {
    setSeriesVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-semibold">Platform Analytics</h3>
          <p className="text-sm text-muted-foreground mt-1">Overview of active users, conversions and site engagement.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Icon name="UserCheck" size={16} className="text-green-400" />
                <div className="text-sm">Live</div>
              </div>
              <div className="ml-2 px-3 py-1 bg-accent text-white rounded font-semibold flex items-center gap-2">
                <Icon name="Activity" size={14} className="opacity-90" />
                <span>{loading ? '...' : liveUsers}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button className={`px-3 py-1 rounded text-sm ${range===7 ? 'bg-accent text-white' : 'bg-muted/10'}`} onClick={() => setRange(7)}>7d</button>
              <button className={`px-3 py-1 rounded text-sm ${range===15 ? 'bg-accent text-white' : 'bg-muted/10'}`} onClick={() => setRange(15)}>15d</button>
              <button className={`px-3 py-1 rounded text-sm ${range===30 ? 'bg-accent text-white' : 'bg-muted/10'}`} onClick={() => setRange(30)}>30d</button>
              <button className={`px-3 py-1 rounded text-sm ${range===90 ? 'bg-accent text-white' : 'bg-muted/10'}`} onClick={() => setRange(90)}>90d</button>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              className="px-3 py-1 rounded bg-muted/10 text-sm"
            >
              Inspect sessions
            </button>
          </div>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

        {showDebug && debugSessions && (
          <div className="mb-4 p-3 rounded bg-card border border-border">
            <h4 className="font-semibold mb-2">Recent Sessions (debug)</h4>
            {debugSessions.error && <div className="text-sm text-red-600">{debugSessions.error}</div>}
            {debugSessions.sessions && debugSessions.sessions.length === 0 && <div className="text-sm text-muted-foreground">No sessions recorded yet.</div>}
            {debugSessions.sessions && debugSessions.sessions.length > 0 && (
              <div className="overflow-auto max-h-60">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr>
                      <th className="text-left px-2">session_id</th>
                      <th className="px-2">user_id</th>
                      <th className="px-2">path</th>
                      <th className="px-2">last_ping_at</th>
                      <th className="px-2">started_at</th>
                      <th className="px-2">duration_s</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debugSessions.sessions.map(s => (
                      <tr key={s.session_id} className="border-t">
                        <td className="px-2 truncate max-w-xs">{s.session_id}</td>
                        <td className="px-2">{s.user_id || '—'}</td>
                        <td className="px-2">{s.path || '—'}</td>
                        <td className="px-2">{s.last_ping_at || '—'}</td>
                        <td className="px-2">{s.started_at || '—'}</td>
                        <td className="px-2">{s.duration_seconds ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {debugSessions.views && debugSessions.views.length > 0 && (
              <div className="mt-3">
                <div className="text-sm font-medium mb-1">Recent Page Views</div>
                <div className="overflow-auto max-h-40">
                  <table className="w-full text-sm table-auto">
                    <thead>
                      <tr>
                        <th className="text-left px-2">id</th>
                        <th className="px-2">session_id</th>
                        <th className="px-2">path</th>
                        <th className="px-2">created_at</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debugSessions.views.map(v => (
                        <tr key={v.id} className="border-t">
                          <td className="px-2 truncate max-w-xs">{v.id}</td>
                          <td className="px-2 truncate max-w-xs">{v.session_id || '—'}</td>
                          <td className="px-2">{v.path || '—'}</td>
                          <td className="px-2">{v.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      {/* Top summary cards */}
      <div className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Live Now" value={loading ? '...' : liveUsers} change={0} highlight />
          <StatCard title="Active Users" value={loading ? '...' : summary.active} change={growth.activePct ?? 0} />
          <StatCard title="Attempts" value={loading ? '...' : summary.attempts} change={growth.attemptsPct ?? 0} />
          <StatCard title="Conversions" value={loading ? '...' : summary.conv} change={growth.convPct ?? 0} />
          <StatCard title="New Users" value={loading ? '...' : summary.newUsers} change={growth.newUsersPct ?? 0} />
        </div>
      </div>

      <div className="bg-card rounded p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2" style={{ width: '100%', height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="gradAttempts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" angle={-45} textAnchor="end" interval={Math.max(0, Math.floor(data.length / 10))} height={60} />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, name]} />
              <Legend verticalAlign="top" />
              {/* interactive series toggles */}
              {seriesVisible.active && <Line type="monotone" dataKey="active" name="Active Users" stroke="#06b6d4" strokeWidth={2} dot={false} />}
              {seriesVisible.attempts && <Line type="monotone" dataKey="attempts" name="Attempts" stroke="#7c3aed" strokeWidth={2} dot={false} fillOpacity={1} />}
              {seriesVisible.conv && <Line type="monotone" dataKey="conv" name="Conversions" stroke="#10b981" strokeWidth={2} dot={false} />}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button onClick={() => toggleSeries('active')} className={`px-2 py-1 rounded text-sm ${seriesVisible.active ? 'bg-accent text-white' : 'bg-muted/10'}`}>Active</button>
            <button onClick={() => toggleSeries('attempts')} className={`px-2 py-1 rounded text-sm ${seriesVisible.attempts ? 'bg-purple-600 text-white' : 'bg-muted/10'}`}>Attempts</button>
            <button onClick={() => toggleSeries('conv')} className={`px-2 py-1 rounded text-sm ${seriesVisible.conv ? 'bg-green-600 text-white' : 'bg-muted/10'}`}>Conversions</button>
          </div>

          <div className="bg-white/0 rounded" style={{ width: '100%', height: 380 }}>
            <div className="text-sm font-medium mb-2">Average Session Duration (seconds)</div>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" hide />
                  <YAxis />
                  <Tooltip formatter={(v) => [v, 'Avg sec']} />
                  <Line type="monotone" dataKey="sessionDuration" name="Avg Duration" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted/5 rounded">
                <div className="text-xs text-muted-foreground">Visits (1d)</div>
                <div className="text-lg font-semibold">{loading ? '...' : (totals && totals.visitCounts ? totals.visitCounts[1] ?? 0 : (typeof (totals) === 'object' && totals.visitCounts ? totals.visitCounts[1] : 0))}</div>
              </div>
              <div className="p-2 bg-muted/5 rounded">
                <div className="text-xs text-muted-foreground">Visits (7d)</div>
                <div className="text-lg font-semibold">{loading ? '...' : (totals && totals.visitCounts ? totals.visitCounts[7] ?? 0 : 0)}</div>
              </div>
              <div className="p-2 bg-muted/5 rounded">
                <div className="text-xs text-muted-foreground">Visits (15d)</div>
                <div className="text-lg font-semibold">{loading ? '...' : (totals && totals.visitCounts ? totals.visitCounts[15] ?? 0 : 0)}</div>
              </div>
              <div className="p-2 bg-muted/5 rounded">
                <div className="text-xs text-muted-foreground">Visits (30d)</div>
                <div className="text-lg font-semibold">{loading ? '...' : (totals && totals.visitCounts ? totals.visitCounts[30] ?? 0 : 0)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
