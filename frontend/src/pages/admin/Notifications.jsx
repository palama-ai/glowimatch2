import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

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
      try { const p = JSON.parse(raw); if (p && p.token) return { Authorization: `Bearer ${p.token}` }; } catch (e) {}
    }
    const alt = localStorage.getItem('admin_dashboard_token');
    if (alt) return { Authorization: `Bearer ${alt}` };
    return {};
  }

  const fetchList = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      console.log('[Notifications] Fetching notifications with headers:', !!headers.Authorization);
      const r = await fetch(`${API_BASE}/notifications/admin`, { headers });
      console.log('[Notifications] Response status:', r.status);
      
      if (!r.ok) {
        const errorText = await r.text();
        console.error('[Notifications] Error response:', errorText);
        throw new Error(`HTTP ${r.status}: ${errorText}`);
      }
      
      const j = await r.json();
      console.log('[Notifications] Fetched data:', j);
      setList(j.data || []);
    } catch (e) {
      console.error('[Notifications] Failed to load notifications', e);
      setError('Failed to load notifications');
      setList([]);
    } finally { setLoading(false); }
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
      console.log('[Notifications] Sending notification:', { title, body });
      
      const r = await fetch(`${API_BASE}/notifications/admin`, { 
        method: 'POST', 
        headers, 
        body: JSON.stringify({ title, body, target: 'all' }) 
      });

      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        console.error('[Notifications] Send error:', txt);
        throw new Error(txt || 'Failed to send notification');
      }

      const response = await r.json();
      console.log('[Notifications] Send response:', response);

      setTitle('');
      setBody('');
      setSuccess('✓ Notification sent to all users successfully!');
      
      // Refresh list
      await fetchList();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      console.error('[Notifications] sendAll error', e);
      setError(`Failed to send notification: ${e.message}`);
    } finally { setSending(false); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Send Notifications</h1>
          <p className="text-muted-foreground">Broadcast announcements and updates to all users</p>
        </div>

        {/* Compose Section */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-lg p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name="Mail" size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Compose Message</h2>
              <p className="text-sm text-muted-foreground">Send to all users</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notification Title *
              </label>
              <Input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., New Feature Available"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will appear as the headline of the notification
              </p>
            </div>

            {/* Body Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message Body *
              </label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your message here. Be clear and concise."
                rows={6}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {body.length} characters
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
                <Icon name="AlertTriangle" size={18} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <Icon name="CheckCircle2" size={18} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Send Button */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={sendAll}
                disabled={sending || !title.trim() || !body.trim()}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg hover:shadow-pink-500/40 transition-all"
              >
                <Icon name={sending ? "Loader2" : "Send"} size={18} className={`mr-2 ${sending ? 'animate-spin' : ''}`} />
                {sending ? 'Sending...' : 'Send to All Users'}
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-lg p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name="History" size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Recent Notifications</h2>
              <p className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `${list.length} notification${list.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Icon name="Loader2" size={32} className="animate-spin text-accent" />
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">No notifications sent yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {list.map(n => (
                <div key={n.id} className="p-4 border border-border/50 rounded-lg bg-background hover:border-accent/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{n.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{n.body}</p>
                    </div>
                    {n.target_all === 1 && (
                      <span className="ml-2 px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full flex-shrink-0">
                        All Users
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
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
