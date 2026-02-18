import { test, expect } from 'playwright-test-coverage';

test('updateUser', async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;

  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();

  // CI fix: "pd" may load slower or behave differently in CI.
  const pd = page.locator('a:has-text("pd"), button:has-text("pd"), [role="link"]:has-text("pd"), [role="button"]:has-text("pd")').first();
  await expect(pd).toBeVisible({ timeout: 15000 });
  await pd.click();

  await expect(page.getByRole('main')).toContainText('pizza diner', { timeout: 15000 });
  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');

  await page.getByRole('textbox').first().fill('pizza dinerx');
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached', timeout: 15000 });
  await expect(page.getByRole('main')).toContainText('pizza dinerx', { timeout: 15000 });

  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Login' }).click();

  // Go back to pd to verify the updated name is saved.
  await expect(pd).toBeVisible({ timeout: 15000 });
  await pd.click();

  await expect(page.getByRole('main')).toContainText('pizza dinerx', { timeout: 15000 });
});