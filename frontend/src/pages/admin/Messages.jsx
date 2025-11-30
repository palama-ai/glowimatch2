import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchMessages = async () => {
    const raw = localStorage.getItem('gm_auth');
    const headers = raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {};
    const r = await fetch(`${API_BASE}/admin/messages`, { headers });
    const j = await r.json();
    setMessages(j.data || []);
  };

  useEffect(() => { fetchMessages(); }, []);

  const openMessage = async (id) => {
    const raw = localStorage.getItem('gm_auth');
    const headers = raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {};
    const r = await fetch(`${API_BASE}/admin/messages/${id}`, { headers });
    const j = await r.json();
    setSelected(j.data || null);
    fetchMessages();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="space-y-2">
              {messages.map(m => (
                <div key={m.id} onClick={() => openMessage(m.id)} className={`p-3 rounded-lg border ${m.read ? 'bg-muted/20' : 'bg-card'} cursor-pointer`}> 
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                  <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            {selected ? (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">{selected.name} &lt;{selected.email}&gt;</h3>
                <div className="text-xs text-muted-foreground mb-4">{new Date(selected.created_at).toLocaleString()}</div>
                <div className="whitespace-pre-wrap text-sm text-foreground">{selected.message}</div>
              </div>
            ) : (
              <div className="text-muted-foreground">Select a message to read</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
