import { next } from '@vercel/functions';
import { isAdminPath, privateHeaders, protectAdmin } from './server/admin-auth.js';

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!photos/|optimized/|audio/|decor/|favicon.svg|contoh-tamu.csv).*)'],
};

export default function middleware(request) {
  const denied = protectAdmin(request);
  if (denied) return denied;
  const response = next();
  if (isAdminPath(new URL(request.url).pathname)) {
    for (const [key, value] of Object.entries(privateHeaders)) response.headers.set(key, value);
  }
  return response;
}
