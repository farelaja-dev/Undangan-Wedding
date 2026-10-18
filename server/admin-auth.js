import { createHash, timingSafeEqual } from 'node:crypto';

export function isAdminPath(pathname) {
  let path;
  try { path = decodeURIComponent(pathname).replace(/\/+/g, '/'); }
  catch { return true; }
  return /^\/admin(?:\/|$)/i.test(path)
    || path === '/api/admin-session'
    || /^\/assets\/Admin-[^/]+\.js(?:\.map)?$/i.test(path)
    || /\/src\/Admin\.jsx$/i.test(path);
}

export const privateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  Vary: 'Authorization',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
};

// Called only on the server. Never import this file into src/.
export function protectAdmin(request, env = process.env) {
  const path = new URL(request.url).pathname;
  if (!isAdminPath(path)) return null;
  const username = env.ADMIN_USERNAME;
  const password = env.ADMIN_PASSWORD;
  if (!username || username.includes(':') || !password || password.length < 20) {
    return new Response('Admin belum dikonfigurasi. Atur ADMIN_USERNAME dan ADMIN_PASSWORD di server.', {
      status: 503, headers: { ...privateHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  const header = request.headers.get('authorization') || '';
  const match = header.length <= 4096 && /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(header);
  const supplied = match ? Buffer.from(match[1], 'base64').toString('utf8') : '';
  const hash = value => createHash('sha256').update(value).digest();
  if (!timingSafeEqual(hash(supplied), hash(`${username}:${password}`))) {
    return new Response('Login diperlukan untuk membuka admin.', {
      status: 401,
      headers: {
        ...privateHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'WWW-Authenticate': 'Basic realm="Wedding Admin", charset="UTF-8"',
      },
    });
  }
  if (path === '/api/admin-session') {
    return Response.json({ authenticated: true }, { headers: privateHeaders });
  }
  return null;
}

export function attachAdminAuth(server, env) {
  server.middlewares.use((req, res, next) => {
    const request = new Request(new URL(req.url, 'http://localhost'), {
      headers: { authorization: req.headers.authorization || '' },
    });
    const response = protectAdmin(request, env);
    if (isAdminPath(new URL(request.url).pathname)) {
      for (const [key, value] of Object.entries(privateHeaders)) res.setHeader(key, value);
    }
    if (!response) return next();
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    response.text().then(body => res.end(body));
  });
}
