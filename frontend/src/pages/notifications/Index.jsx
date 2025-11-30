import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const getAuthHeaders = () => {
        const raw = localStorage.getItem('gm_auth');
        if (raw) {
          try { const p = JSON.parse(raw); if (p && p.token) return { Authorization: `Bearer ${p.token}` }; } catch (e) {}
        }
        const alt = localStorage.getItem('admin_dashboard_token');
        if (alt) return { Authorization: `Bearer ${alt}` };
        return {};
      };

      const headers = getAuthHeaders();
      console.log('[NotificationsPage] Fetching from:', `${API_BASE}/notifications/me`, 'with auth:', !!headers.Authorization);
      
      const res = await fetch(`${API_BASE}/notifications/me`, { headers });
      console.log('[NotificationsPage] Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('[NotificationsPage] Error response:', errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      const data = await res.json();
      console.log('[NotificationsPage] Fetched data:', data);
      
      // API returns { data: rows } or an array
      const list = Array.isArray(data) ? data : (data.data || data.notifications || []);
      console.log('[NotificationsPage] Parsed list:', list);
      
      setNotifications(list);
    } catch (e) {
      console.error('[NotificationsPage] Load notifications error', e);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (linkId) => {
    try {
      const getAuthHeaders = () => {
        const raw = localStorage.getItem('gm_auth');
        if (raw) {
          try { const p = JSON.parse(raw); if (p && p.token) return { Authorization: `Bearer ${p.token}` }; } catch (e) {}
        }
        const alt = localStorage.getItem('admin_dashboard_token');
        if (alt) return { Authorization: `Bearer ${alt}` };
        return {};
      };
      const headers = getAuthHeaders();
      const res = await fetch(`${API_BASE}/notifications/me/${linkId}/read`, {
        method: 'POST',
        headers
      });
      if (res.ok) {
        await load();
      }
    } catch (e) {
      console.error('[NotificationsPage] Mark read failed', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Icon name="Bell" size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">All your recent notifications</p>
        </div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-4">
          {notifications.length === 0 && (
            <div className="text-muted-foreground">No notifications found.</div>
          )}

          {notifications.map((n) => {
            const unread = n.read === 0 || n.read === false || n.read === null;
            return (
              <div key={n.link_id || n.notification_id || Math.random()} className={`p-4 border rounded-lg ${unread ? 'bg-accent/5' : 'bg-background'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{n.title || 'Notice'}</div>
                    <div className="text-sm text-muted-foreground mt-1">{n.body}</div>
                    {n.link && (
                      <div className="mt-2">
                        <button onClick={() => navigate(n.link)} className="text-sm text-accent underline">Open link</button>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
                    {unread && (
                      <button onClick={() => markRead(n.link_id)} className="mt-2 inline-flex items-center px-2 py-1 text-xs bg-accent text-white rounded">Mark read</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
