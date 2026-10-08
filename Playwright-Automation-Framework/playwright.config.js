const { defineConfig, devices } = require('@playwright/test');
const { env } = require('./config/env');

/**
 * Three projects:
 *
 *  - "setup"  runs auth.setup.js once, provisions the test account via
 *             the API layer, logs in once via the UI, and writes
 *             storage/user.storageState.json.
 *  - "ui"     depends on "setup" and reuses the saved storageState for
 *             every test, so no test re-runs the login UI flow. Browser
 *             based, testDir tests/ui.
 *  - "api"    pure HTTP tests via Playwright's APIRequestContext. No
 *             browser, no storageState, no dependency on "setup" - the
 *             API layer is tested completely independently of the UI
 *             layer, as its own thing.
 *
 * `ui` and `api` are separate projects (not separate configs) so a
 * single `npx playwright test` run still exercises both, while
 * `--project=ui` / `--project=api` lets you run either in isolation -
 * which is exactly what the CI workflow's sharded jobs do.
 */
module.exports = defineConfig({
  testDir: '.',
  fullyParallel: this,
  forbidOnly: !!env.ci,
    retries: env.ci ? 2 : 1,
  workers: process.env.WORKERS ? Number(process.env.WORKERS) : 1,
  timeout: 60000,

  reporter: env.ci
    ? [['html', { open: 'never' }], ['github'], ['list']]
    : [['html', { open: 'never' }], ['list']],

  // Global default; each project narrows testDir / baseURL further.
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-qa',
    navigationTimeout: 45000,
    actionTimeout: 15000,

    // automationexercise.com uses data-qa="..." attributes as its stable
    // hooks instead of data-testid. Pointing Playwright's testId
    // attribute here lets page objects use getByTestId() everywhere the
    // site provides one, matching the "prefer role/label/testid over
    // CSS/XPath" locator strategy.
    testIdAttribute: 'data-qa',
  },

  projects: [
    {
      name: 'setup',
      testDir: '.',
      testMatch: 'auth.setup.js',
      use: {
        baseURL: env.ui.baseURL,
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'ui',
      testDir: 'tests/ui',
      dependencies: ['setup'],
      use: {
        baseURL: env.ui.baseURL,
        storageState: env.storageStatePath,
        channel: 'chrome',
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'api',
      testDir: 'tests/api',
      use: {
        baseURL: env.api.baseURL,
      },
    },
  ],
});
