import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const raw = localStorage.getItem('gm_auth');
    const headers = raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {};
    try {
      const r = await fetch(`${API_BASE}/admin/users`, { headers });
      const text = await r.text();
      let j = null;
      try { j = JSON.parse(text); } catch (e) { /* not json */ }
      if (!r.ok) {
        console.error('Failed to fetch admin users', r.status, text);
        // try debug endpoint (no auth) as fallback
        try {
          const dbg = await fetch(`${API_BASE}/admin/debug/users`);
          if (dbg.ok) {
            const dj = await dbg.json();
            setUsers(dj.data || []);
            setError('Using debug endpoint (no auth)');
            return;
          }
        } catch (de) { /* ignore */ }
        setError(j?.error || `Request failed: ${r.status}`);
        setUsers([]);
      } else {
        setUsers(j?.data || []);
        if (!j || !j.data) setError('No users returned from server');
      }
    } catch (e) {
      console.error('fetchUsers error', e);
      setError(e.message || 'Network error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleDisabled = async (id, disabled) => {
    const raw = localStorage.getItem('gm_auth');
    const headers = { 'Content-Type': 'application/json', ...(raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {}) };
    await fetch(`${API_BASE}/admin/users/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ disabled }) });
    fetchUsers();
  };

  const setStatusMessage = async (id) => {
    const msg = prompt('Enter deactivation message to show to the user (leave empty to clear)');
    if (msg === null) return; // cancelled
    const raw = localStorage.getItem('gm_auth');
    const headers = { 'Content-Type': 'application/json', ...(raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {}) };
    await fetch(`${API_BASE}/admin/users/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ status_message: msg }) });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    const ok = confirm('Are you sure you want to delete this user? This is a soft-delete and can be reversed by an admin.');
    if (!ok) return;
    const raw = localStorage.getItem('gm_auth');
    const headers = { 'Content-Type': 'application/json', ...(raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {}) };
    try {
      const r = await fetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE', headers });
      const text = await r.text().catch(() => null);
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch (e) { /* ignore */ }
      if (!r.ok) {
        console.error('Failed to delete user', r.status, text, json);
        const msg = json?.error || json?.details || text || `Request failed: ${r.status}`;
        alert('Failed to delete user: ' + msg);
      } else {
        // success - show a quick confirmation
        alert('User deleted');
      }
    } catch (e) {
      console.error('deleteUser error', e);
      alert('Failed to delete user');
    }
    fetchUsers();
  };

  const setPlan = async (id) => {
    const planId = prompt('Enter plan id (e.g. basic, pro)');
    if (!planId) return;
    const raw = localStorage.getItem('gm_auth');
    const headers = { 'Content-Type': 'application/json', ...(raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {}) };
    await fetch(`${API_BASE}/admin/users/${id}/subscription`, { method: 'POST', headers, body: JSON.stringify({ planId, status: 'active' }) });
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
        {loading ? <div>Loading...</div> : (
          <div className="space-y-4">
            {error && <div className="text-sm text-red-600">Error: {error}</div>}
            {users.length === 0 && !error && <div className="text-sm text-muted-foreground">No users found.</div>}
            {users.map(u => (
              <div key={u.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{u.full_name || u.email}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                  <div className="text-xs text-muted-foreground">Role: {u.role} | Subscription: {u.subscription?.plan_id || 'none'}</div>
                </div>
                <div className="space-x-2">
                  {u.deleted ? (
                    <span className="px-3 py-1 rounded bg-gray-100 text-sm text-muted-foreground">Deleted</span>
                  ) : (
                    <>
                      <button onClick={() => toggleDisabled(u.id, !u.disabled)} className={`px-3 py-1 rounded ${u.disabled ? 'bg-green-100' : 'bg-red-100'}`}>
                        {u.disabled ? 'Enable' : 'Disable'}
                      </button>
                      <button onClick={() => setStatusMessage(u.id)} className="px-3 py-1 rounded bg-yellow-100">Set Message</button>
                      <button onClick={() => deleteUser(u.id)} className="px-3 py-1 rounded bg-red-100">Delete</button>
                    </>
                  )}
                  <button onClick={() => setPlan(u.id)} className="px-3 py-1 rounded bg-accent/10">Set Plan</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;
