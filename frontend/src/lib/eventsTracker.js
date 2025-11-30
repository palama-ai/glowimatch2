/* Lightweight event tracker
   - Starts/maintains a session id in localStorage
   - Sends /api/events start/ping/view/end calls
   - Intended to be imported once at app root (e.g. in App.jsx)
*/
import { useEffect, useRef } from 'react';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

function genId() {
  // small RFC4122-lite random id
  return 'xxxxxxxx'.replace(/[x]/g, () => (Math.floor(Math.random() * 16)).toString(16));
}

export default function useEventsTracker() {
  const sidRef = useRef(null);
  const startedAtRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const stored = localStorage.getItem('gm_session_id');
    const sessionId = stored || genId();
    sidRef.current = sessionId;
    localStorage.setItem('gm_session_id', sessionId);
    startedAtRef.current = Date.now();

    // helper to post JSON
    const post = async (path, body) => {
      try {
        await fetch(`${API_BASE}/events${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } catch (e) {
        // ignore network errors silently
      }
    };

    // start session
    post('/start', { sessionId, path: window.location.pathname });

    // record initial view
    post('/view', { sessionId, path: window.location.pathname });

    // ping every 30s
    const pingInterval = setInterval(() => {
      post('/ping', { sessionId, path: window.location.pathname });
    }, 30000);

    // listen to SPA navigation (history.pushState)
    const origPush = history.pushState;
    history.pushState = function (...args) {
      origPush.apply(this, args);
      try { post('/view', { sessionId, path: window.location.pathname }); } catch (e) {}
    };

    // also catch popstate
    const onPop = () => { post('/view', { sessionId, path: window.location.pathname }); };
    window.addEventListener('popstate', onPop);

    // before unload, send end with duration (seconds)
    const onBefore = () => {
      try {
        const duration = Math.round((Date.now() - startedAtRef.current) / 1000);
        // send synchronously if possible
        navigator.sendBeacon && navigator.sendBeacon(`${API_BASE}/events/end`, JSON.stringify({ sessionId, duration }));
        // also send async fallback
        fetch(`${API_BASE}/events/end`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, duration }) }).catch(()=>{});
      } catch (e) {}
    };
    window.addEventListener('beforeunload', onBefore);

    return () => {
      mounted = false;
      clearInterval(pingInterval);
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('beforeunload', onBefore);
      history.pushState = origPush;
      // attempt final end
      try {
        const duration = Math.round((Date.now() - startedAtRef.current) / 1000);
        fetch(`${API_BASE}/events/end`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, duration }) }).catch(()=>{});
      } catch (e) {}
    };
  }, []);
}
