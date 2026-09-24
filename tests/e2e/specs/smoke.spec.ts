import { expect, test } from '@playwright/test';

test('foundation homepage is usable and exposes a local health route', async ({ page, request }) => {
  const health = await request.get('/api/health');
  expect(health.ok()).toBe(true);
  expect((await health.json()).status).toBe('ok');

  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Build a career you can navigate with confidence/i })).toBeVisible();
  await expect(page.getByText('India + global ready')).toBeVisible();

  await page.getByRole('link', { name: 'View the build roadmap' }).click();
  await expect(page.locator('#roadmap')).toBeInViewport();
  await expect(page.getByText('Secure accounts')).toBeVisible();
});
