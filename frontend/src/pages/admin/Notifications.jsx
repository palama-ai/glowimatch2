import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const Notifications = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  function getAuthHeaders() {
    const raw = localStorage.getItem('gm_auth');
    if (raw) {
      try { const p = JSON.parse(raw); if (p && p.token) return { Authorization: `Bearer ${p.token}` }; } catch (e) { }
    }
    const alt = localStorage.getItem('admin_dashboard_token');
    if (alt) return { Authorization: `Bearer ${alt}` };
    return {};
  }

  const fetchList = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const r = await fetch(`${API_BASE}/notifications/admin`, { headers });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setList(j.data || []);
    } catch (e) {
      console.error('[Notifications] Failed to load notifications', e);
      setError('Failed to load notifications');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const sendAll = async () => {
    setError('');
    setSuccess('');

    if (!title.trim() || !body.trim()) {
      setError('Title and message are required');
      return;
    }

    setSending(true);
    try {
      const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() };
      const r = await fetch(`${API_BASE}/notifications/admin`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title, body, target: 'all' })
      });

      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        throw new Error(txt || 'Failed to send notification');
      }

      setTitle('');
      setBody('');
      setSuccess('Notification sent to all users successfully!');
      await fetchList();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      console.error('[Notifications] sendAll error', e);
      setError(`Failed to send notification: ${e.message}`);
    } finally {
      setSending(false);
    }
  };

  const stats = useMemo(() => ({
    total: list.length,
    allUsers: list.filter(n => n.target_all === 1).length,
  }), [list]);

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--admin-text-primary)', margin: 0 }}>
          Notifications
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
          Broadcast announcements and updates to all users
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div className="admin-stat-card blue" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Total Sent</div>
              <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.total}</div>
            </div>
            <div className="admin-stat-card-icon"><Icon name="Bell" size={24} /></div>
          </div>
        </div>
        <div className="admin-stat-card purple" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>To All Users</div>
              <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.allUsers}</div>
            </div>
            <div className="admin-stat-card-icon"><Icon name="Users" size={24} /></div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Compose Section */}
        <div className="admin-content-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--admin-border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Send" size={20} style={{ color: 'var(--admin-accent)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>Compose Message</h2>
              <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0 }}>Send to all users</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Title Input */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--admin-text-primary)', marginBottom: '8px' }}>
                Notification Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., New Feature Available"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--admin-border)',
                  background: 'var(--admin-bg-primary)',
                  color: 'var(--admin-text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Body Input */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--admin-text-primary)', marginBottom: '8px' }}>
                Message Body *
              </label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your message here. Be clear and concise."
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--admin-border)',
                  background: 'var(--admin-bg-primary)',
                  color: 'var(--admin-text-primary)',
                  fontSize: '14px',
                  resize: 'none',
                  outline: 'none',
                }}
              />
              <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '6px' }}>
                {body.length} characters
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="admin-error">
                <div className="admin-error-content">
                  <Icon name="AlertTriangle" size={16} />
                  <span className="admin-error-text">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="admin-success-alert">
                <Icon name="CheckCircle2" size={16} />
                {success}
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={sendAll}
              disabled={sending || !title.trim() || !body.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '10px',
                border: 'none',
                background: (!title.trim() || !body.trim())
                  ? 'var(--admin-bg-primary)'
                  : 'linear-gradient(135deg, var(--admin-accent) 0%, var(--admin-purple) 100%)',
                color: (!title.trim() || !body.trim()) ? 'var(--admin-text-muted)' : 'white',
                fontWeight: '600',
                fontSize: '14px',
                cursor: (!title.trim() || !body.trim()) ? 'not-allowed' : 'pointer',
                boxShadow: (!title.trim() || !body.trim()) ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.3)',
              }}
            >
              <Icon name={sending ? "Loader2" : "Send"} size={18} className={sending ? 'animate-spin' : ''} />
              {sending ? 'Sending...' : 'Send to All Users'}
            </button>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="admin-content-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-bg-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="History" size={20} style={{ color: 'var(--admin-purple)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>Recent Notifications</h2>
              <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0 }}>
                {loading ? 'Loading...' : `${list.length} notification${list.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading" style={{ padding: '40px' }}>
              <div className="admin-loading-spinner"></div>
            </div>
          ) : list.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <Icon name="Inbox" size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: '14px' }}>No notifications sent yet</p>
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {list.map(n => (
                <div key={n.id} style={{ padding: '16px 24px', borderBottom: '1px solid var(--admin-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>
                      {n.title}
                    </h4>
                    {n.target_all === 1 && (
                      <span className="admin-badge info">All Users</span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', margin: '0 0 8px', lineHeight: '1.5' }}>
                    {n.body}
                  </p>
                  <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                    {new Date(n.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
