const fs = require('fs');
const path = require('path');
const { test: base, expect } = require('@playwright/test');

const { env } = require('./config/env');
const { existingUser, existingUserAccountPayload } = require('./test-data/users');
const { ApiClient } = require('./api/clients/apiClient');
const { AuthService } = require('./api/services/authService');
const { LoginPage } = require('./pages/LoginPage');
const { logger } = require('./utils/logger');

const log = logger('auth.setup');

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * automationexercise.com's `verifyLogin` API only *validates* credentials
 * (it returns "User exists!" / "User not found!") - it does not issue a
 * session token, cookie, or anything a browser could use to be
 * "logged in". There is no clean API-token auth path for the UI here.
 *
 * So the strategy is a hybrid, and it runs exactly ONCE for the whole
 * suite instead of once per test:
 *
 *   1. Use the API layer (AuthService.ensureAccountExists) to make sure
 *      the persistent test persona exists. This is idempotent - if the
 *      account is already registered, the API tells us so and we treat
 *      that as success. This means a fresh checkout of this repo works
 *      with zero manual "go create an account first" steps.
 *
 *   2. Perform ONE real UI login through LoginPage, because that's the
 *      only way to obtain the actual browser session (cookies) the site
 *      recognizes.
 *
 *   3. Save the resulting storageState (cookies + localStorage) to
 *      storage/user.storageState.json.
 *
 * playwright.config.js's `ui` project then sets `storageState` to that
 * file and declares a dependency on this setup project, so every UI
 * test in the suite starts already authenticated - the login form is
 * never exercised again outside of the dedicated login tests
 * (tests/ui/auth.spec.js), which intentionally use a clean, storageState
 * -free context to test login itself.
 */
const authFile = env.storageStatePath;

base('authenticate once and persist storage state', async ({ page, request }) => {
  // --- Step 1: provision the account via the API layer -----------------
  const apiClient = new ApiClient(request, env.api.baseURL);
  const authApi = new AuthService(apiClient);

  await authApi.ensureAccountExists(existingUserAccountPayload());
  const verify = await authApi.verifyLogin(existingUser.email, existingUser.password);
  expect(verify.apiStatus, `Account should be verifiable via API before UI login. Got: ${JSON.stringify(verify.body)}`).toBe(200);
  log.info('Persistent test account verified via API', { email: existingUser.email });

  // --- Step 2: one real UI login to mint an actual browser session -----
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(existingUser.email, existingUser.password);

  await expect(loginPage.header.logoutLink).toBeVisible();
  await expect(loginPage.header.loggedInAsText).toContainText(existingUser.name);
  log.info('UI login succeeded, session established');

  // --- Step 3: persist storage state for reuse across the UI project ---
  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
  log.info('storageState saved', { path: authFile });
});
