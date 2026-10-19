import { test } from 'node:test';
import assert from 'node:assert/strict';
import { protectAdmin, isAdminPath } from '../server/admin-auth.js';

const env = { ADMIN_USERNAME: 'admin', ADMIN_PASSWORD: 'A-test-password-long-enough-123' };
const request = (path, credentials) => new Request(`https://example.com${path}`, {
  headers: credentials ? { Authorization: `Basic ${Buffer.from(credentials).toString('base64')}` } : {},
});

test('protected routes fail closed and public guest routes remain accessible', () => {
  for (const path of ['/admin', '/admin/', '/admin/nested', '/%61dmin', '/assets/Admin-test.js', '/src/Admin.jsx', '/api/admin-session']) {
    assert.equal(isAdminPath(new URL(request(path).url).pathname), true);
    assert.equal(protectAdmin(request(path), env).status, 401);
    assert.equal(protectAdmin(request(path, 'admin:wrong-password'), env).status, 401);
    assert.equal(protectAdmin(request(path), {}).status, 503);
  }
  for (const path of ['/', '/pak-halim', '/photos/slider1.jpg', '/assets/index-test.js']) assert.equal(protectAdmin(request(path), {}), null);
});

test('valid credentials grant access, confirmation has no secrets and all responses are private', async () => {
  const credentials = `${env.ADMIN_USERNAME}:${env.ADMIN_PASSWORD}`;
  assert.equal(protectAdmin(request('/admin', credentials), env), null);
  const response = protectAdmin(request('/api/admin-session', credentials), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { authenticated: true });
  assert.match(response.headers.get('cache-control'), /no-store/);
  const denied = protectAdmin(request('/admin'), env);
  assert.match(denied.headers.get('www-authenticate'), /^Basic/);
  assert.match(denied.headers.get('cache-control'), /no-store/);
  assert.equal((await denied.text()).includes(env.ADMIN_PASSWORD), false);
  assert.equal(protectAdmin(request('/admin', credentials), { ...env, ADMIN_PASSWORD: 'short' }).status, 503);
});
