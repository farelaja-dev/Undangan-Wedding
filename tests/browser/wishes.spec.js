import { test, expect } from '@playwright/test';

test('wishes replace pages, collapse long messages and return to page one after posting', async ({ page }) => {
  test.skip(!process.env.VITE_SUPABASE_URL, 'Use test environment variables; requests are mocked.');
  const rows = Array.from({ length: 10 }, (_, i) => ({
    id: `row-${i}`, name: `Tamu ${i + 1}`, message: i === 0 ? 'Semoga selalu berbahagia. '.repeat(25) : `Doa nomor ${i + 1}`,
    created_at: '2026-10-18T13:00:00Z',
  }));
  let failNext = false;
  await page.route('**/rest/v1/wedding_wishes*', route => {
    if (route.request().method() === 'POST') {
      const row = { ...route.request().postDataJSON(), id: 'new', created_at: '2026-10-18T14:00:00Z' };
      rows.unshift(row);
      return route.fulfill({ status: 201, json: [row] });
    }
    if (failNext) { failNext = false; return route.fulfill({ status: 503, json: {} }); }
    const query = new URL(route.request().url()).searchParams;
    const start = Number(query.get('offset'));
    const limit = Number(query.get('limit'));
    return route.fulfill({ json: rows.slice(start, start + limit) });
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?to=Budi');
  await page.getByRole('button', { name: 'Buka Undangan', exact: true }).click();
  const section = page.locator('.guest-wishes');
  const cards = section.locator('.wishes-list li');
  const next = section.getByRole('button', { name: 'Berikutnya', exact: true });
  const previous = section.getByRole('button', { name: 'Sebelumnya', exact: true });
  await expect(cards).toHaveCount(5);
  await expect(previous).toBeDisabled();
  await section.getByRole('button', { name: 'Baca selengkapnya' }).click();
  await expect(section.getByRole('button', { name: 'Ringkas ucapan' })).toHaveAttribute('aria-expanded', 'true');
  await section.getByRole('button', { name: 'Ringkas ucapan' }).click();
  failNext = true;
  await next.click();
  await expect(section.getByRole('alert')).toBeVisible();
  await expect(cards.first()).toContainText('Tamu 1');
  await next.click();
  await expect(section.getByText('Halaman 2', { exact: true })).toBeVisible();
  await expect(cards).toHaveCount(5);
  await expect(cards.first()).toContainText('Tamu 6');
  await expect(next).toBeDisabled();
  await previous.click();
  await expect(cards.first()).toContainText('Tamu 1');
  await next.click();
  await section.getByLabel('Tulis ucapan').fill('Ucapan terbaru dari Budi');
  await section.getByRole('button', { name: 'Kirim ucapan', exact: true }).click();
  await expect(cards).toHaveCount(5);
  await expect(cards.first()).toContainText('Ucapan terbaru dari Budi');
  await expect(section.getByText('Halaman 1', { exact: true })).toBeVisible();
  await expect(previous).toBeDisabled();
});

test('public wishes survive reload and preserve text after a failed submission', async ({ page }) => {
  test.skip(!process.env.VITE_SUPABASE_URL, 'Run with test Supabase environment variables; requests are mocked.');
  const rows = [{ id: 'first', name: 'Sari', message: 'Selamat menempuh hidup baru!', created_at: '2026-10-18T13:00:00Z' }];
  let failNext = false;
  await page.route('**/rest/v1/wedding_wishes*', async route => {
    if (route.request().method() === 'POST') {
      if (failNext) {
        failNext = false;
        return route.fulfill({ status: 503, json: { message: 'Unavailable' } });
      }
      const body = route.request().postDataJSON();
      expect(Object.keys(body).sort()).toEqual(['message', 'name']);
      const row = { ...body, id: `wish-${rows.length}`, created_at: '2026-10-18T14:00:00Z' };
      rows.unshift(row);
      return route.fulfill({ status: 201, json: [row] });
    }
    return route.fulfill({ json: rows });
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?to=Budi');
  await page.getByRole('button', { name: 'Buka Undangan', exact: true }).click();
  const section = page.locator('.guest-wishes');
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByText('Selamat menempuh hidup baru!', { exact: true })).toBeVisible();
  await expect(section.getByLabel('Nama untuk ucapan')).toHaveValue('Budi');
  const text = '<img src=x onerror=alert(1)> Semoga bahagia!';
  await section.getByLabel('Tulis ucapan').fill(text);
  failNext = true;
  await section.getByRole('button', { name: 'Kirim ucapan', exact: true }).click();
  await expect(section.getByRole('alert')).toBeVisible();
  await expect(section.getByLabel('Tulis ucapan')).toHaveValue(text);
  await section.getByRole('button', { name: 'Kirim ucapan', exact: true }).click();
  await expect(section.locator('.wishes-list li')).toHaveCount(2);
  await expect(section.locator('.wishes-list img')).toHaveCount(0);
  await expect(section.getByLabel('Tulis ucapan')).toHaveValue('');
  await page.reload();
  await page.getByRole('button', { name: 'Buka Undangan', exact: true }).click();
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator('.wishes-list li')).toHaveCount(2);
  await expect(section.locator('.wishes-list')).toContainText(text);
  expect(rows).toHaveLength(2);
});

test('RSVP uses the configured WhatsApp number and story has chapter titles', async ({ page }) => {
  await page.route('**/rest/v1/wedding_wishes*', route => route.fulfill({ json: [] }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?to=Budi');
  await page.getByRole('button', { name: 'Buka Undangan', exact: true }).click();
  await expect(page.locator('.story-moment h3')).toHaveText(['Awal Cerita', 'Lamaran', 'Pernikahan']);
  await expect(page.locator('.story-year')).toHaveCount(0);
  await page.evaluate(() => { window.open = url => { window.__whatsappUrl = url; return null; }; });
  await page.getByRole('button', { name: 'Kirim konfirmasi', exact: true }).click();
  const url = new URL(await page.evaluate(() => window.__whatsappUrl));
  expect(url.hostname).toBe('wa.me');
  expect(url.pathname).toBe('/6285706314694');
  expect(url.searchParams.get('text')).toContain('Nama: Budi');
});
