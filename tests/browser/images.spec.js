import { test, expect } from '@playwright/test';

test('responsive photos load WebP and zoom pauses when the hero leaves the screen', async ({ page }, testInfo) => {
  const rawPhotos = [];
  page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/photos/')) rawPhotos.push(request.url()); });
  await page.route('**/rest/v1/wedding_wishes*', route => route.fulfill({ json: [] }));
  await page.goto('/');
  const hero = page.locator('.lux-hero .cinematic-slider');
  await expect(hero.locator('img')).toHaveCount(1);
  if (testInfo.project.name === 'mobile') await expect(page.locator('.wedding-backdrop .cinematic-images img')).toHaveCount(0);
  await page.getByRole('button', { name: 'Buka Undangan', exact: true }).click();
  await expect(page.locator('.invitation-cover')).toHaveCount(0);
  const heroPhoto = hero.locator('.cinematic-slide.active img');
  await expect.poll(() => heroPhoto.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  expect(await heroPhoto.evaluate(el => el.currentSrc)).toMatch(/\/optimized\/.*\.webp$/);
  await expect(heroPhoto).toHaveCSS('animation-play-state', 'running');
  await page.screenshot({ path: testInfo.outputPath('optimized-hero.png') });
  await page.locator('#galeri').scrollIntoViewIfNeeded();
  await expect(heroPhoto).toHaveCSS('animation-play-state', 'paused');
  const thumbnail = page.locator('.gallery-thumbnails img').first();
  await expect.poll(() => thumbnail.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  expect(await thumbnail.evaluate(el => el.currentSrc)).toMatch(/-160\.webp$/);
  await page.getByRole('button', { name: 'Perbesar foto 1', exact: true }).click();
  const fullPhoto = page.locator('.lightbox .photo img');
  await expect.poll(() => fullPhoto.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  expect(await fullPhoto.evaluate(el => el.currentSrc)).toMatch(/\/optimized\/.*\.webp$/);
  expect(rawPhotos).toEqual([]);
});
