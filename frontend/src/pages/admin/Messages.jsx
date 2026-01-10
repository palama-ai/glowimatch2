import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const raw = localStorage.getItem('gm_auth');
      const headers = raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {};
      const r = await fetch(`${API_BASE}/admin/messages`, { headers });
      const j = await r.json();
      setMessages(j.data || []);
    } catch (e) {
      console.error('Failed to fetch messages', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name?.toLowerCase().includes(q);
        const matchEmail = m.email?.toLowerCase().includes(q);
        const matchMessage = m.message?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchMessage) return false;
      }
      // Status filter
      if (filterStatus === 'unread' && m.read) return false;
      if (filterStatus === 'read' && !m.read) return false;
      return true;
    });
  }, [messages, searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: messages.length,
    unread: messages.filter(m => !m.read).length,
    read: messages.filter(m => m.read).length,
  }), [messages]);

  const openMessage = async (id) => {
    const raw = localStorage.getItem('gm_auth');
    const headers = raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {};
    const r = await fetch(`${API_BASE}/admin/messages/${id}`, { headers });
    const j = await r.json();
    setSelected(j.data || null);
    fetchMessages();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--admin-text-primary)', margin: 0 }}>
          Contact Messages
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
          View and manage messages from your contact form
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div className="admin-stat-card blue" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Total Messages</div>
              <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.total}</div>
            </div>
            <div className="admin-stat-card-icon">
              <Icon name="Mail" size={24} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card orange" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Unread</div>
              <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.unread}</div>
            </div>
            <div className="admin-stat-card-icon">
              <Icon name="MailWarning" size={24} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card green" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Read</div>
              <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.read}</div>
            </div>
            <div className="admin-stat-card-icon">
              <Icon name="MailCheck" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div className="admin-search" style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}>
          <Icon name="Search" size={18} style={{ color: 'var(--admin-text-muted)' }} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="admin-range-selector">
          {['all', 'unread', 'read'].map(status => (
            <button
              key={status}
              className={`admin-range-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchMessages}
          className="admin-quick-btn"
          style={{ padding: '10px 16px' }}
        >
          <Icon name="RefreshCw" size={16} />
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <span className="admin-loading-text">Loading messages...</span>
        </div>
      ) : (
        /* Messages Layout */
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
          {/* Messages List */}
          <div className="admin-content-card" style={{ padding: '0', maxHeight: '600px', overflowY: 'auto' }}>
            {filteredMessages.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                <Icon name="Inbox" size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '14px' }}>No messages found</p>
              </div>
            ) : (
              filteredMessages.map(m => (
                <div
                  key={m.id}
                  onClick={() => openMessage(m.id)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--admin-border)',
                    cursor: 'pointer',
                    background: selected?.id === m.id ? 'var(--admin-bg-card-hover)' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (selected?.id !== m.id) e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (selected?.id !== m.id) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: m.read
                        ? 'linear-gradient(135deg, var(--admin-text-muted) 0%, #475569 100%)'
                        : 'linear-gradient(135deg, var(--admin-accent) 0%, var(--admin-purple) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      flexShrink: 0,
                    }}>
                      {(m.name || m.email || '?').charAt(0).toUpperCase()}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: m.read ? '400' : '600',
                          color: 'var(--admin-text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {m.name}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: 'var(--admin-text-muted)',
                          flexShrink: 0,
                          marginLeft: '8px',
                        }}>
                          {formatDate(m.created_at)}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--admin-text-muted)',
                        marginBottom: '4px',
                      }}>
                        {m.email}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: m.read ? 'var(--admin-text-muted)' : 'var(--admin-text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {m.message?.slice(0, 60)}...
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {!m.read && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--admin-accent)',
                        flexShrink: 0,
                        marginTop: '4px',
                      }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="admin-content-card" style={{ padding: '0' }}>
            {selected ? (
              <div>
                {/* Message Header */}
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid var(--admin-border)',
                  background: 'var(--admin-bg-primary)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--admin-accent) 0%, var(--admin-purple) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '20px',
                    }}>
                      {(selected.name || selected.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>
                        {selected.name}
                      </h3>
                      <a
                        href={`mailto:${selected.email}`}
                        style={{ fontSize: '14px', color: 'var(--admin-accent)', textDecoration: 'none' }}
                      >
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="Calendar" size={14} />
                      {new Date(selected.created_at).toLocaleDateString()}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="Clock" size={14} />
                      {new Date(selected.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div style={{ padding: '24px' }}>
                  <div style={{
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: 'var(--admin-text-primary)',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {selected.message}
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--admin-border)',
                  display: 'flex',
                  gap: '12px',
                }}>
                  <a
                    href={`mailto:${selected.email}`}
                    className="admin-quick-btn"
                    style={{
                      padding: '10px 20px',
                      textDecoration: 'none',
                      background: 'var(--admin-accent)',
                      color: 'white',
                      borderColor: 'var(--admin-accent)',
                    }}
                  >
                    <Icon name="Reply" size={16} />
                    Reply
                  </a>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '400px',
                color: 'var(--admin-text-muted)',
              }}>
                <Icon name="MousePointer" size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>Select a message to read</p>
                <p style={{ margin: '8px 0 0', fontSize: '13px' }}>Click on any message from the list</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Messages;
