import { test, expect } from '@playwright/test';

test('music starts after opening and the record pauses and resumes with playback', async ({ page }) => {
  await page.goto('/');
  const audio = page.locator('audio');
  await expect.poll(() => audio.evaluate(el => el.paused)).toBe(true);
  expect(await audio.evaluate(el => el.currentTime)).toBe(0);
  await expect(page.locator('.music-toggle')).toHaveCount(0);
  await page.getByRole('button', { name: 'Buka Undangan', exact: true }).click();
  const control = page.locator('.music-toggle');
  await expect(control).toHaveAccessibleName('Jeda musik');
  await expect.poll(() => audio.evaluate(el => el.currentTime)).toBeGreaterThan(0.15);
  expect(await audio.evaluate(el => el.volume)).toBeCloseTo(0.35);
  await expect(audio).toHaveAttribute('src', '/audio/lagu.mp3');
  expect(await audio.evaluate(el => el.duration)).toBeGreaterThan(0);
  await expect(page.locator('.record-disc')).toHaveCSS('animation-play-state', 'running');
  await control.click();
  await expect(control).toHaveAccessibleName('Putar musik');
  await expect.poll(() => audio.evaluate(el => el.paused)).toBe(true);
  await expect(page.locator('.record-disc')).toHaveCSS('animation-play-state', 'paused');
  const pausedAt = await audio.evaluate(el => el.currentTime);
  await control.click();
  await expect(control).toHaveAccessibleName('Jeda musik');
  await expect.poll(() => audio.evaluate(el => el.currentTime)).toBeGreaterThan(pausedAt + 0.1);
});
