import { lazy, Suspense, useEffect, useState } from 'react';
import Invitation from './Invitation';
const Admin = lazy(() => import('./Admin'));
function ProtectedAdmin() {
  const [status, setStatus] = useState('checking');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin-session', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal })
      .then(async response => {
        const data = response.ok ? await response.json() : null;
        setStatus(data?.authenticated === true ? 'authorized' : 'denied');
      }).catch(error => { if (error.name !== 'AbortError') setStatus('denied'); });
    return () => controller.abort();
  }, []);
  if (status === 'checking') return <div className="loading">Memeriksa akses admin...</div>;
  if (status !== 'authorized') return <div className="loading">Admin terkunci. <a href="/admin">Masuk kembali</a></div>;
  return <Suspense fallback={<div className="loading">Menyiapkan pengelola tamu...</div>}><Admin /></Suspense>;
}
export default function App() {
  return window.location.pathname.replace(/\/$/, '') === '/admin'
    ? <ProtectedAdmin />
    : <Invitation />;
}
