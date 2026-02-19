import { test, expect } from 'playwright-test-coverage';

test('updateUser', async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;

  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza diner');
  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('textbox').first().fill('pizza dinerx');
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText('pizza dinerx');

  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza dinerx');
});

test('admin can list users and delete a user', async ({ page }) => {
  const victimId = Math.floor(Math.random() * 100000);
  const victimName = `victim user ${victimId}`;
  const victimEmail = `victim${victimId}@jwt.com`;

  // Create victim user
  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill(victimName);
  await page.getByRole('textbox', { name: 'Email address' }).fill(victimEmail);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();

  // Login as admin
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  // Confirm admin is logged in
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible({ timeout: 15000 });

  // Go to admin dashboard using UI link
  await page.getByRole('link', { name: /admin/i }).click();

  // Ensure no error page is shown
  await expect(page.getByRole('heading', { name: 'Oops' })).toHaveCount(0);

  // Check Users heading
  const usersHeading = page.getByRole('heading', { name: 'Users' });
  await expect(usersHeading).toBeVisible({ timeout: 15000 });

  // Anchor Users section based on heading
  // Move up the DOM to get the full Users block
  const usersSection = usersHeading.locator('..').locator('..');

  // Locate Users table using role
  const usersTable = usersSection.getByRole('table');

  // Refresh user list
  await usersSection.getByRole('button', { name: /refresh/i }).click();

  // Search by name
  await usersSection.getByRole('textbox', { name: 'Name' }).fill(victimName);
  await usersSection.getByRole('button', { name: 'Search' }).click();

  // Use row role instead of tbody selector
  const victimRow = usersTable.getByRole('row', { name: new RegExp(victimEmail) });
  await expect(victimRow).toBeVisible({ timeout: 15000 });

  // Delete user
  page.once('dialog', (dialog) => dialog.accept());
  await victimRow.getByRole('button', { name: /delete/i }).click();

  // Confirm user is removed
  await expect(usersTable.getByText(victimEmail)).toHaveCount(0, { timeout: 15000 });
});