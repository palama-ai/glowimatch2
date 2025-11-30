import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

function getAuthHeaders() {
  const raw = localStorage.getItem('gm_auth');
  if (raw) {
    try { const p = JSON.parse(raw); if (p && p.token) return { Authorization: `Bearer ${p.token}` }; } catch (e) {}
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
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_dashboard_token') || '');
  const [tokenSavedMsg, setTokenSavedMsg] = useState('');
  const [filter, setFilter] = useState('');
  const [liveOnly, setLiveOnly] = useState(false);

  const fetchDebug = async () => {
    setLoading(true); setError(null);
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/debug/sessions`, { headers });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Unauthorized (401/403). Paste an admin JWT below and click "Set token".');
          setSessions([]); setViews([]);
          setLoading(false);
          return;
        }
        throw new Error('Failed');
      }
      const j = await res.json();
      setSessions(j.data?.sessions || []);
      setViews(j.data?.views || []);
    } catch (e) {
      console.error('fetch debug sessions failed', e);
      setError('Failed to fetch sessions; ensure admin JWT is set in localStorage');
      setSessions([]); setViews([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDebug(); }, []);

  const applyAdminToken = () => {
    try {
      if (!adminToken) {
        setTokenSavedMsg('Please paste a token first');
        return;
      }
      localStorage.setItem('admin_dashboard_token', adminToken);
      setTokenSavedMsg('Token saved. Refreshing...');
      setError(null);
      // small delay so UI shows message then fetch
      setTimeout(() => { fetchDebug(); setTokenSavedMsg(''); }, 300);
    } catch (e) {
      console.error('save token failed', e);
      setTokenSavedMsg('Failed to save token');
    }
  };

  const now = Date.now();
  const filtered = sessions.filter(s => {
    if (!s) return false;
    if (liveOnly) {
      if (!s.last_ping_at) return false;
      const ping = new Date(s.last_ping_at).getTime();
      if (isNaN(ping)) return false;
      if ((now - ping) > 60_000) return false; // live within 60s
    }
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (s.session_id || '').toLowerCase().includes(q) || (s.path || '').toLowerCase().includes(q) || (s.user_id || '').toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon name="Activity" size={20} className="text-accent" />
          <div>
            <h2 className="text-xl font-semibold">Active Sessions</h2>
            <div className="text-sm text-muted-foreground">Live sessions and recent page views</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search session / path / user" className="px-3 py-2 border border-border rounded" />
          <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={liveOnly} onChange={e=>setLiveOnly(e.target.checked)} /> Live only</label>
          <button onClick={fetchDebug} className="px-3 py-2 bg-accent text-white rounded">Refresh</button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input value={adminToken} onChange={e=>setAdminToken(e.target.value)} placeholder="Paste admin JWT here" className="px-3 py-2 border border-border rounded w-80" />
          <button onClick={applyAdminToken} className="px-3 py-2 bg-primary text-white rounded">Set token</button>
          {tokenSavedMsg && <div className="text-sm text-muted-foreground">{tokenSavedMsg}</div>}
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded border border-border">
          <h3 className="font-semibold mb-2">Sessions ({filtered.length})</h3>
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm table-auto">
              <thead>
                <tr>
                  <th className="text-left px-2">session</th>
                  <th className="px-2">user</th>
                  <th className="px-2">path</th>
                  <th className="px-2">last ping</th>
                  <th className="px-2">duration</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.session_id} className="border-t">
                    <td className="px-2 truncate max-w-xs">{s.session_id}</td>
                    <td className="px-2">{s.user_id || '—'}</td>
                    <td className="px-2 truncate max-w-xs">{s.path || '—'}</td>
                    <td className="px-2">{s.last_ping_at ? new Date(s.last_ping_at).toLocaleString() : '—'}</td>
                    <td className="px-2">{s.duration_seconds ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card p-4 rounded border border-border">
          <h3 className="font-semibold mb-2">Recent Page Views ({views.length})</h3>
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm table-auto">
              <thead>
                <tr>
                  <th className="text-left px-2">id</th>
                  <th className="px-2">session</th>
                  <th className="px-2">path</th>
                  <th className="px-2">time</th>
                </tr>
              </thead>
              <tbody>
                {views.filter(v => {
                  if (!filter) return true;
                  const q = filter.toLowerCase();
                  return (v.id||'').toLowerCase().includes(q) || (v.path||'').toLowerCase().includes(q) || (v.session_id||'').toLowerCase().includes(q);
                }).map(v => (
                  <tr key={v.id} className="border-t">
                    <td className="px-2 truncate max-w-xs">{v.id}</td>
                    <td className="px-2 truncate max-w-xs">{v.session_id || '—'}</td>
                    <td className="px-2">{v.path || '—'}</td>
                    <td className="px-2">{v.created_at ? new Date(v.created_at).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
