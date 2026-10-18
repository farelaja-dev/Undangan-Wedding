import { lazy, Suspense } from 'react';
import Invitation from './Invitation';
const Admin = lazy(() => import('./Admin'));
export default function App() {
  return window.location.pathname.replace(/\/$/, '') === '/admin'
    ? <Suspense fallback={<div className="loading">Menyiapkan pengelola tamu…</div>}><Admin /></Suspense>
    : <Invitation />;
}
