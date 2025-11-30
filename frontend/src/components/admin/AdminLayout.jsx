import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const loc = useLocation();
  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/blogs', label: 'Blogs' },
    { to: '/admin/messages', label: 'Messages' },
    { to: '/admin/notifications', label: 'Notifications' },
    { to: '/admin/sessions', label: 'Sessions' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 hidden md:block border-r border-border bg-card px-4 py-6">
          <div className="mb-6">
            <div className="text-lg font-bold">Admin</div>
            <div className="text-sm text-muted-foreground">Control panel</div>
          </div>
          <nav className="space-y-1">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`block px-3 py-2 rounded ${loc.pathname === l.to ? 'bg-accent/10 font-semibold' : 'hover:bg-muted/10'}`}>
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <div className="px-4 py-4 border-b border-border bg-background">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="text-xl font-semibold">GlowMatch Admin</div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground hidden sm:block">Signed in as admin</div>
              </div>
            </div>
          </div>

          <main className="max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
