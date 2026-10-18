import { test, expect } from '@playwright/test';

test('opening text fades in once without flashing or restarting after the gates open', async ({ page }) => {
  await page.route('**/rest/v1/wedding_wishes*', route => route.fulfill({ json: [] }));
  await page.goto('/');
  await expect(page.locator('.lux-hero-copy')).toHaveCSS('opacity', '0');
  await expect(page.locator('.backdrop-copy')).toHaveCSS('opacity', '0');
  await page.evaluate(() => {
    window.openingSamples = [];
    window.openingStarts = [];
    document.addEventListener('animationstart', event => {
      if (event.animationName === 'opening-copy-in') window.openingStarts.push(event.target.className);
    });
    const started = performance.now();
    const sample = () => {
      window.openingSamples.push({
        state: document.querySelector('.luxury').dataset.coverState,
        opacity: Number(getComputedStyle(document.querySelector('.lux-hero-copy')).opacity),
      });
      if (performance.now() - started < 2600) requestAnimationFrame(sample);
      else window.openingSampleDone = true;
    };
    document.querySelector('.open-invitation').click();
    requestAnimationFrame(sample);
  });
  await expect.poll(() => page.evaluate(() => window.openingSampleDone)).toBe(true);
  const { samples, starts } = await page.evaluate(() => ({ samples: window.openingSamples, starts: window.openingStarts }));
  expect(samples.some(sample => sample.state === 'opening' && sample.opacity > 0 && sample.opacity < 1)).toBe(true);
  for (let i = 1; i < samples.length; i++) expect(samples[i].opacity).toBeGreaterThanOrEqual(samples[i - 1].opacity - 0.01);
  expect(starts.filter(name => name === 'lux-hero-copy')).toHaveLength(1);
  await expect(page.locator('.lux-hero-copy')).toHaveCSS('opacity', '1');
  await expect(page.locator('.lux-hero-copy')).toHaveCSS('filter', 'blur(0px)');
  await expect(page.locator('.invitation-cover')).toHaveCount(0);
});

test('reduced motion opening keeps the text visible', async ({ page }) => {
  await page.route('**/rest/v1/wedding_wishes*', route => route.fulfill({ json: [] }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Buka Undangan', exact: true }).click();
  await expect(page.locator('.invitation-cover')).toHaveCount(0);
  await expect(page.locator('.lux-hero-copy')).toHaveCSS('opacity', '1');
  await expect(page.locator('.backdrop-copy')).toHaveCSS('opacity', '1');
});
