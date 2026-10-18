import { test, expect } from '@playwright/test';

test('cover fits and floral chapters reveal during scrolling', async ({ page }, testInfo) => {
  await page.goto('/?to=Bapak%20Budi%20dan%20Ibu%20Sari');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.cover-content')).toHaveCSS('filter', 'blur(0px)');
  await page.screenshot({ path: testInfo.outputPath('cover-final.png') });
  const button = page.getByRole('button', { name: 'Buka Undangan', exact: true });
  const box = await button.boundingBox();
  expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize().height);
  await button.click();
  await expect(page.locator('.invitation-cover')).toHaveCount(0);
  await expect(page.locator('.lux-hero-copy')).toHaveCSS('filter', 'blur(0px)');
  await page.screenshot({ path: testInfo.outputPath('opened-final.png') });
  await page.getByRole('button', { name: 'Jeda efek animasi' }).click();
  // Traverse chapters just as a guest scrolls, including the previously unvisited portraits.
  const revealElements = page.locator('.reveal');
  for (let i = 0; i < await revealElements.count(); i++) {
    const element = revealElements.nth(i);
    await element.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expect(element).toHaveClass(/is-visible/);
  }
  await page.locator('.lux-person').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('couple-final.png') });
  await page.locator('.lux-rsvp-form').scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('rsvp-final.png') });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: testInfo.outputPath('full-final.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width);
});
