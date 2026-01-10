import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = u.full_name?.toLowerCase().includes(q);
        const matchEmail = u.email?.toLowerCase().includes(q);
        if (!matchName && !matchEmail) return false;
      }
      // Role filter
      if (filterRole !== 'all' && u.role !== filterRole) return false;
      // Status filter
      if (filterStatus === 'active' && u.disabled) return false;
      if (filterStatus === 'disabled' && !u.disabled) return false;
      if (filterStatus === 'deleted' && !u.deleted) return false;
      return true;
    });
  }, [users, searchQuery, filterRole, filterStatus]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => !u.disabled && !u.deleted).length,
    disabled: users.filter(u => u.disabled).length,
    admins: users.filter(u => u.role === 'admin').length,
    sellers: users.filter(u => u.role === 'seller').length,
  }), [users]);

  const toggleDisabled = async (id, disabled) => {
    const raw = localStorage.getItem('gm_auth');
    const headers = { 'Content-Type': 'application/json', ...(raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {}) };
    await fetch(`${API_BASE}/admin/users/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ disabled }) });
    fetchUsers();
  };

  const setStatusMessage = async (id) => {
    const msg = prompt('Enter deactivation message to show to the user (leave empty to clear)');
    if (msg === null) return;
    const raw = localStorage.getItem('gm_auth');
    const headers = { 'Content-Type': 'application/json', ...(raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {}) };
    await fetch(`${API_BASE}/admin/users/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ status_message: msg }) });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    const ok = confirm('Are you sure you want to delete this user?');
    if (!ok) return;
    const raw = localStorage.getItem('gm_auth');
    const headers = { 'Content-Type': 'application/json', ...(raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {}) };
    try {
      const r = await fetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE', headers });
      if (!r.ok) {
        const text = await r.text();
        alert('Failed to delete user: ' + text);
      }
    } catch (e) {
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

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'var(--admin-danger)';
      case 'seller': return 'var(--admin-purple)';
      default: return 'var(--admin-accent)';
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--admin-text-primary)', margin: 0 }}>
          Users Management
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
          Manage all registered users, their roles, and subscriptions
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div className="admin-stat-card blue" style={{ padding: '16px' }}>
          <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Total Users</div>
          <div className="admin-stat-card-value" style={{ fontSize: '24px' }}>{stats.total}</div>
        </div>
        <div className="admin-stat-card green" style={{ padding: '16px' }}>
          <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Active</div>
          <div className="admin-stat-card-value" style={{ fontSize: '24px' }}>{stats.active}</div>
        </div>
        <div className="admin-stat-card red" style={{ padding: '16px' }}>
          <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Disabled</div>
          <div className="admin-stat-card-value" style={{ fontSize: '24px' }}>{stats.disabled}</div>
        </div>
        <div className="admin-stat-card orange" style={{ padding: '16px' }}>
          <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Admins</div>
          <div className="admin-stat-card-value" style={{ fontSize: '24px' }}>{stats.admins}</div>
        </div>
        <div className="admin-stat-card purple" style={{ padding: '16px' }}>
          <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Sellers</div>
          <div className="admin-stat-card-value" style={{ fontSize: '24px' }}>{stats.sellers}</div>
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
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <div className="admin-range-selector">
          {['all', 'user', 'seller', 'admin'].map(role => (
            <button
              key={role}
              className={`admin-range-btn ${filterRole === role ? 'active' : ''}`}
              onClick={() => setFilterRole(role)}
            >
              {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="admin-range-selector">
          {['all', 'active', 'disabled'].map(status => (
            <button
              key={status}
              className={`admin-range-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchUsers}
          className="admin-quick-btn"
          style={{ padding: '10px 16px' }}
        >
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
          <span className="admin-loading-text">Loading users...</span>
        </div>
      ) : (
        /* Users Table */
        <div className="admin-content-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--admin-bg-primary)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>User</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Role</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Subscription</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    <Icon name="Users" size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '14px' }}>No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr
                    key={u.id}
                    style={{ borderTop: '1px solid var(--admin-border)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--admin-bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, var(--admin-accent) 0%, var(--admin-purple) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}>
                          {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)' }}>
                            {u.full_name || 'No Name'}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: `${getRoleBadgeColor(u.role)}20`,
                        color: getRoleBadgeColor(u.role),
                        textTransform: 'capitalize'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        fontSize: '13px',
                        color: u.subscription?.plan_id ? 'var(--admin-success)' : 'var(--admin-text-muted)'
                      }}>
                        {u.subscription?.plan_id || 'No Plan'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {u.deleted ? (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: 'rgba(100, 116, 139, 0.15)',
                          color: 'var(--admin-text-muted)'
                        }}>
                          Deleted
                        </span>
                      ) : u.disabled ? (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: 'var(--admin-danger)'
                        }}>
                          Disabled
                        </span>
                      ) : (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: 'rgba(34, 197, 94, 0.15)',
                          color: 'var(--admin-success)'
                        }}>
                          Active
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {!u.deleted && (
                          <>
                            <button
                              onClick={() => toggleDisabled(u.id, !u.disabled)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                border: 'none',
                                cursor: 'pointer',
                                background: u.disabled ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: u.disabled ? 'var(--admin-success)' : 'var(--admin-danger)',
                              }}
                            >
                              {u.disabled ? 'Enable' : 'Disable'}
                            </button>
                            <button
                              onClick={() => setStatusMessage(u.id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                border: 'none',
                                cursor: 'pointer',
                                background: 'rgba(245, 158, 11, 0.15)',
                                color: 'var(--admin-warning)',
                              }}
                            >
                              <Icon name="MessageSquare" size={14} />
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                border: 'none',
                                cursor: 'pointer',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: 'var(--admin-danger)',
                              }}
                            >
                              <Icon name="Trash2" size={14} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setPlan(u.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer',
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: 'var(--admin-accent)',
                          }}
                        >
                          <Icon name="CreditCard" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Users;
