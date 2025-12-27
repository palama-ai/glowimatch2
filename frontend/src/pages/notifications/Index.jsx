import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useI18n } from '../../contexts/I18nContext';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const NotificationsPage = () => {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const getAuthHeaders = () => {
        const raw = localStorage.getItem('gm_auth');
        if (raw) {
          try { const p = JSON.parse(raw); if (p && p.token) return { Authorization: `Bearer ${p.token}` }; } catch (e) { }
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
          try { const p = JSON.parse(raw); if (p && p.token) return { Authorization: `Bearer ${p.token}` }; } catch (e) { }
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
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-3 sm:px-4">
      <div className="flex items-center space-x-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Icon name="Bell" size={18} className="text-accent sm:hidden" />
          <Icon name="Bell" size={20} className="text-accent hidden sm:block" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">{t('notifications_title')}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{t('notifications_sub')}</p>
        </div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-4">
          {notifications.length === 0 && (
            <div className="text-muted-foreground">{t('no_notifications')}</div>
          )}

          {notifications.map((n) => {
            const unread = n.read === 0 || n.read === false || n.read === null;
            return (
              <div key={n.link_id || n.notification_id || Math.random()} className={`p-3 sm:p-4 border rounded-lg ${unread ? 'bg-accent/5' : 'bg-background'}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                  <div className="flex-1">
                    <div className="font-semibold text-sm sm:text-base">{n.title || t('notification_default_title')}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">{n.body}</div>
                    {n.link && (
                      <div className="mt-2">
                        <button onClick={() => navigate(n.link)} className="text-xs sm:text-sm text-accent underline">{t('open_link')}</button>
                      </div>
                    )}
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                    <div className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
                    {unread && (
                      <button onClick={() => markRead(n.link_id)} className="sm:mt-2 inline-flex items-center px-2 py-1 text-xs bg-accent text-white rounded">{t('mark_read')}</button>
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
