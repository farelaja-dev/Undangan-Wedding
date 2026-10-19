import { test, expect } from '@playwright/test';

test('CSV generates query links that work in a fresh guest browser', async ({ page, browser, baseURL }) => {
  await page.goto('/admin');
  await page.locator('input[type=file]').setInputFiles({
    name: 'tamu.csv', mimeType: 'text/csv',
    buffer: Buffer.from('nama,telepon,grup\nPak Halim,085700000000,Keluarga\nIbu Sari,,Sahabat'),
  });
  await page.getByRole('button', { name: 'Impor 2 tamu' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(2);
  const link = await page.getByRole('link', { name: 'Pratinjau undangan Pak Halim' }).getAttribute('href');
  expect(link).toBe(`${baseURL}/?to=Pak+Halim`);
  const context = await browser.newContext();
  const guest = await context.newPage();
  await guest.route('**/rest/v1/wedding_wishes*', route => route.fulfill({ json: [] }));
  await guest.emulateMedia({ reducedMotion: 'reduce' });
  await guest.goto(link);
  await expect(guest.locator('.cover-recipient strong')).toHaveText('Pak Halim');
  await expect(guest.locator('.cover-recipient strong')).toHaveCSS('font-weight', '700');
  await guest.reload();
  await expect(guest.locator('.cover-recipient strong')).toHaveText('Pak Halim');
  await guest.getByRole('button', { name: 'Buka Undangan', exact: true }).click();
  await expect(guest.getByLabel('Nama lengkap', { exact: true })).toHaveValue('Pak Halim');
  await expect(guest.getByLabel('Nama untuk ucapan')).toHaveValue('Pak Halim');
  await context.close();
});
