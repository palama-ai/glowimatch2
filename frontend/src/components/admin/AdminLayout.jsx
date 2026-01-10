import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import '../../styles/admin-dashboard.css';

export default function AdminLayout({ children }) {
  const loc = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainLinks = [
    { to: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/admin/users', label: 'Users', icon: 'Users' },
    { to: '/admin/products', label: 'Products', icon: 'Package' },
    { to: '/admin/blogs', label: 'Blogs', icon: 'BookOpen' },
  ];

  const settingsLinks = [
    { to: '/admin/messages', label: 'Messages', icon: 'Mail', badge: null },
    { to: '/admin/notifications', label: 'Notifications', icon: 'Bell' },
    { to: '/admin/sessions', label: 'Sessions', icon: 'Activity' },
    { to: '/admin/safety', label: 'Safety', icon: 'Shield' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return loc.pathname === '/admin';
    }
    return loc.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      <div
        className={`admin-mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <button
          className="admin-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
        </button>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>GlowMatch Admin</div>
        <Link to="/" className="admin-mobile-menu-btn">
          <Icon name="Home" size={20} />
        </Link>
      </div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Logo Section */}
        <div className="admin-sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="admin-sidebar-logo-icon">
              <Icon name="Sparkles" size={22} />
            </div>
            <div>
              <div className="admin-sidebar-logo-text">GlowMatch</div>
              <div className="admin-sidebar-logo-subtitle">Admin Panel</div>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            className="admin-sidebar-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          {/* Main Section */}
          <div className="admin-nav-section">
            <div className="admin-nav-section-title">Main Menu</div>
            {mainLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`admin-nav-link ${isActive(link.to) ? 'active' : ''}`}
              >
                <span className="admin-nav-link-icon">
                  <Icon name={link.icon} size={20} />
                </span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Settings Section */}
          <div className="admin-nav-section">
            <div className="admin-nav-section-title">Settings & Tools</div>
            {settingsLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`admin-nav-link ${isActive(link.to) ? 'active' : ''}`}
              >
                <span className="admin-nav-link-icon">
                  <Icon name={link.icon} size={20} />
                </span>
                {link.label}
                {link.badge && (
                  <span className="admin-nav-link-badge">{link.badge}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="admin-sidebar-profile">
          <div className="admin-sidebar-avatar">
            <Icon name="User" size={20} />
          </div>
          <div className="admin-sidebar-user-info">
            <div className="admin-sidebar-user-name">Administrator</div>
            <div className="admin-sidebar-user-role">Super Admin</div>
          </div>
          <Link to="/" style={{ color: 'var(--admin-text-muted)' }}>
            <Icon name="LogOut" size={18} />
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
