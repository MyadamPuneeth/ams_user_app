import { expect, test } from '@playwright/test';

const academyId = '11111111-1111-4111-8111-111111111111';
const branchId = '22222222-2222-4222-8222-222222222222';
const athleteId = '33333333-3333-4333-8333-333333333333';
const batchId = '44444444-4444-4444-8444-444444444444';
const athlete = { id: athleteId, name: 'An unusually long athlete name for a compact card', active: true, homeBranchId: branchId, monthlyFee: '12345678.00', membershipId: null };
const branch = { id: branchId, name: 'PunsAcademy_Gachibowli_A_Very_Long_Branch_Name', city: 'Hyderabad', address: 'Long address for a narrow display', tables: [{ id: 'table-1', name: 'Table 1' }] };
const batch = { id: batchId, academyId, name: 'Morning group', branchId, tableId: 'table-1', recurrence: 'WEEKLY', oneOffDate: null, weekdays: [0, 1, 2, 3, 4, 5, 6], startsOn: '2020-01-01', endsOn: null, startTime: '05:00:00', endTime: '06:00:00', coachIds: [], athleteIds: [], active: true };

async function mockApp(page, roles = ['ADMIN'], onRequest = () => {}) {
  await page.route('**/api/**', async route => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    onRequest(request);
    let result;
    if (path === '/api/auth/config') result = { demo: false };
    else if (path === '/api/me') result = { id: 'user-1', email: 'test@example.test', name: 'Test User', platformOwner: false, passwordChangeRequired: false, workspaces: [{ academy: { id: academyId, name: 'Puns academy', timezone: 'Asia/Kolkata' }, membership: { id: 'member-1', roles, active: true, allBranches: true, branchIds: [] } }] };
    else if (path.endsWith('/dashboard')) result = { branches: 1, tables: 1, members: 1, invitations: 0, currentMonthRevenue: '12345678.00' };
    else if (path.endsWith('/branches')) result = [branch];
    else if (path.endsWith('/athletes')) result = [athlete];
    else if (path.endsWith('/coaches')) result = [];
    else if (path.endsWith('/batches')) result = [batch];
    else if (path.endsWith('/finance-summary')) result = { collections: '12345678.00', refunds: '0', expenses: '0', outstanding: '0', net: '12345678.00', monthlyTrend: [{ month: '2026-09-01', revenue: '100', expenses: '20' }], branchDistribution: [] };
    else if (path.endsWith('/branch-revenue')) result = [{ branchId, branchName: branch.name, revenue: '100' }];
    else result = [];
    await route.fulfill({ json: result });
  });
}

async function openPage(page, name) {
  const menu = page.getByRole('button', { name: 'Toggle navigation' });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('button', { name, exact: true }).click();
  await expect(page.getByRole('heading', { name: name === 'Branches' ? 'Branches & tables' : name, exact: true })).toBeVisible();
  if (await menu.isVisible()) await expect(page.locator('.sidebar')).toHaveCSS('visibility', 'hidden');
  await page.locator('.page-view').evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
}

test('all administrator screens fit their viewports and keep page navigation in history', async ({ page }, testInfo) => {
  await mockApp(page);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 900 }, { width: 1280, height: 600 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Good to see you.' })).toBeVisible();
    for (const name of ['Athletes', 'Batches', 'Coaches', 'Branches', 'Attendance', 'Mobile Accounts', 'Fees', 'Finance']) {
      await openPage(page, name === 'Branches' ? 'Branches' : name);
      const overflow = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: innerWidth, elements: [...document.querySelectorAll('body *')].filter(element => element.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(element).position !== 'fixed').slice(0, 8).map(element => `${element.tagName}.${element.className}: ${Math.round(element.getBoundingClientRect().right)}`) }));
      expect(overflow.page <= overflow.viewport, `${name} at ${viewport.width}px: ${JSON.stringify(overflow.elements)}`).toBe(true);
      const heading = await page.evaluate(() => ({ top: document.querySelector('main h1').getBoundingClientRect().top, bar: document.querySelector('.topbar').getBoundingClientRect().bottom, scroll: scrollY }));
      expect(heading.top >= heading.bar, `${name} heading below topbar: ${JSON.stringify(heading)}`).toBe(true);
    }
    await page.screenshot({ path: testInfo.outputPath(`finance-${viewport.width}.png`) });
  }
  await openPage(page, 'Athletes');
  await openPage(page, 'Batches');
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Athletes', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Batches', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('mobile drawer traps focus, closes with Escape, and returns focus', async ({ page }) => {
  await mockApp(page);
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  await toggle.click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
  await expect(page.locator('.workspace')).toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toHaveCount(0);
  await expect(toggle).toBeFocused();
});

test('failed save stays in dialog and repeated submits send one request', async ({ page }) => {
  let attempts = 0;
  await mockApp(page);
  await page.route(`**/api/academies/${academyId}/athletes`, async route => {
    if (route.request().method() === 'POST') {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 300));
      await route.fulfill({ status: 422, json: { message: 'Please check this athlete.' } });
    } else await route.fulfill({ json: [athlete] });
  });
  await page.goto('/');
  await openPage(page, 'Athletes');
  await page.getByRole('button', { name: 'Add athlete' }).click();
  const dialog = page.getByRole('dialog', { name: 'Add athlete' });
  await dialog.getByLabel('Name', { exact: true }).fill('Asha Example');
  await dialog.locator('form').evaluate(form => { form.requestSubmit(); form.requestSubmit(); });
  await expect(dialog.getByRole('alert')).toContainText('Please check this athlete.');
  await expect(dialog.getByLabel('Name', { exact: true })).toHaveValue('Asha Example');
  expect(attempts).toBe(1);
});

test('calendar selection and billing month stay independent of other filters', async ({ page }) => {
  let summaries = 0;
  await mockApp(page, ['ADMIN'], request => { if (request.url().includes('finance-summary')) summaries++; });
  await page.goto('/');
  await openPage(page, 'Batches');
  await page.getByRole('button', { name: /Select .* at 12:00/ }).first().click();
  await page.getByRole('button', { name: 'New', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Add batch' }).getByLabel('Start time')).toHaveValue('12:00');
  await page.getByRole('button', { name: 'Close Add batch' }).click();
  await page.getByRole('button', { name: /Show details for Morning group/ }).first().click();
  await expect(page.getByRole('dialog', { name: 'Details for Morning group' })).toBeVisible();
  await openPage(page, 'Finance');
  await expect(page.getByRole('heading', { name: 'Revenue by branch' })).toBeVisible();
  const before = summaries;
  await page.getByLabel('Billing month').fill('2026-09');
  await expect(page.getByText('Branch revenue for billing month 2026-09')).toBeVisible();
  expect(summaries).toBe(before);
});

test('coach and finance navigation are restricted; reduced motion disables entrances', async ({ page }) => {
  await mockApp(page, ['COACH']);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Finance', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Mobile Accounts', exact: true })).toHaveCount(0);
  expect(await page.locator('.page-view').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});

test('athlete assignment refresh keeps the chosen calendar week and scroll position', async ({ page }) => {
  let updates = 0;
  await mockApp(page);
  await page.route(`**/api/academies/${academyId}/batches/${batchId}`, async route => { updates++; await new Promise(resolve => setTimeout(resolve, 400)); await route.fulfill({ json: batch }); });
  await page.goto('/');
  await openPage(page, 'Batches');
  await page.getByRole('button', { name: 'Previous week' }).click();
  const week = await page.locator('.batch-week-trigger').innerText();
  const scroll = page.locator('.batch-calendar-scroll');
  await scroll.evaluate(element => { element.scrollTop = 650; });
  await page.locator('.athlete-pool button').first().click();
  await page.getByRole('button', { name: /Add An unusually long athlete name.*to Morning group/ }).first().click();
  const before = await scroll.evaluate(element => element.scrollTop);
  await expect(page.locator('.batch-roster-status')).toContainText('Added An unusually long athlete name');
  await expect(page.locator('.batch-week-trigger')).toHaveText(week);
  expect(await scroll.evaluate(element => element.scrollTop)).toBe(before);
  expect(updates).toBe(1);
});

test('finance role sees finance pages without administrator pages', async ({ page }) => {
  await mockApp(page, ['FINANCE']);
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Finance', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fees', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Athletes', exact: true })).toHaveCount(0);
  await openPage(page, 'Finance');
});

test('sign-in and required password screens fit phone and desktop', async ({ page }, testInfo) => {
  await mockApp(page);
  await page.route('**/api/me', route => route.fulfill({ status: 401, json: { message: 'Sign in required.' } }));
  await page.route('**/api/auth/password/sign-in', route => route.fulfill({ status: 401, json: { message: 'Check your credentials.' } }));
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Sign in to your academy' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`sign-in-${viewport.width}.png`) });
  }
  await page.getByLabel('Username').fill('coach.arun');
  await page.getByLabel('Password', { exact: true }).fill('a-long-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Check your credentials.');
  await expect(page.getByLabel('Username')).toHaveValue('coach.arun');
  await page.unroute('**/api/me');
  await page.route('**/api/me', route => route.fulfill({ json: { id: 'user-1', email: 'test@example.test', name: 'Test User', platformOwner: false, passwordChangeRequired: true, workspaces: [] } }));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Create a new password' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('initial loading and empty and failed directory responses remain readable', async ({ page }) => {
  await mockApp(page);
  await page.route(`**/api/academies/${academyId}/dashboard`, async route => { await new Promise(resolve => setTimeout(resolve, 300)); await route.fulfill({ json: { branches: 0, tables: 0, members: 0, invitations: 0, currentMonthRevenue: '0' } }); });
  await page.route(`**/api/academies/${academyId}/athletes`, route => route.fulfill({ json: [] }));
  await page.goto('/');
  await expect(page.getByRole('status', { name: 'Loading workspace' })).toBeVisible();
  await openPage(page, 'Athletes');
  await expect(page.getByText('No athletes found.')).toBeVisible();
  await page.route(`**/api/academies/${academyId}/athletes`, route => route.fulfill({ status: 503, json: { message: 'Temporary issue.' } }));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('Temporary issue.');
});
