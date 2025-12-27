import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

export default function AdminLayout({ children }) {
  const loc = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { to: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/admin/users', label: 'Users', icon: 'Users' },
    { to: '/admin/products', label: 'Products', icon: 'Package' },
    { to: '/admin/blogs', label: 'Blogs', icon: 'BookOpen' },
    { to: '/admin/messages', label: 'Messages', icon: 'Mail' },
    { to: '/admin/notifications', label: 'Notifications', icon: 'Bell' },
    { to: '/admin/sessions', label: 'Sessions', icon: 'Activity' },
    { to: '/admin/safety', label: 'Safety', icon: 'Shield' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 hidden md:block border-r border-border bg-card px-4 py-6 min-h-screen sticky top-0">
          <div className="mb-6">
            <div className="text-lg font-bold">Admin</div>
            <div className="text-sm text-muted-foreground">Control panel</div>
          </div>
          <nav className="space-y-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${loc.pathname === l.to ? 'bg-accent/10 text-accent font-semibold' : 'hover:bg-muted/50 text-foreground'}`}
              >
                <Icon name={l.icon} size={18} />
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          {/* Header */}
          <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-border bg-background sticky top-0 z-40">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
                </button>
                <div className="text-lg sm:text-xl font-semibold">GlowMatch Admin</div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Admin</div>
                <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Icon name="Home" size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-b border-border bg-card animate-fade-in">
              <nav className="p-3 space-y-1">
                {links.map(l => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${loc.pathname === l.to ? 'bg-accent/10 text-accent font-semibold' : 'hover:bg-muted/50 text-foreground'}`}
                  >
                    <Icon name={l.icon} size={20} />
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
