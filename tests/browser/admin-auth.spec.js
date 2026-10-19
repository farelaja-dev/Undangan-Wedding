import { test, expect } from '@playwright/test';

test('server rejects anonymous admin requests but guests can open the invitation', async ({ baseURL }) => {
  // Native fetch cannot inherit the authenticated Playwright fixture credentials.
  for (const path of ['/admin', '/admin/', '/api/admin-session', '/src/Admin.jsx']) {
    const response = await fetch(`${baseURL}${path}`);
    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toContain('Basic');
    expect(response.headers.get('cache-control')).toContain('no-store');
  }
  expect((await fetch(`${baseURL}/pak-halim`)).status).toBe(200);
  const wrong = await fetch(`${baseURL}/admin`, { headers: { Authorization: `Basic ${Buffer.from('admin:wrong').toString('base64')}` } });
  expect(wrong.status).toBe(401);
});

test('authorized admin passes server verification and can manage guests', async ({ page }) => {
  await page.goto('/admin');
  await expect(page.getByRole('button', { name: 'Tambah tamu', exact: true })).toBeVisible();
  const session = await page.evaluate(async () => (await fetch('/api/admin-session')).json());
  expect(session).toEqual({ authenticated: true });
});
