const base = require('@playwright/test');

const { env } = require('../config/env');
const { ApiClient } = require('../api/clients/apiClient');
const { ProductsService } = require('../api/services/productsService');
const { BrandsService } = require('../api/services/brandsService');
const { AuthService } = require('../api/services/authService');

/**
 * Extends Playwright's base `test` with:
 *  - `apiClient`: the low-level HTTP wrapper (rarely used directly by tests)
 *  - `productsApi` / `brandsApi` / `authApi`: resource-oriented service
 *    objects tests actually call
 *
 * These fixtures build their own APIRequestContext scoped to
 * config/env.js's API base URL, independent of any `page`/browser
 * context - API tests never need to launch a browser.
 */
const test = base.test.extend({
  apiClient: async ({ playwright }, use) => {
    const requestContext = await playwright.request.newContext({
      baseURL: env.api.baseURL,
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });
    const client = new ApiClient(requestContext, env.api.baseURL);
    await use(client);
    await requestContext.dispose();
  },

  productsApi: async ({ apiClient }, use) => {
    await use(new ProductsService(apiClient));
  },

  brandsApi: async ({ apiClient }, use) => {
    await use(new BrandsService(apiClient));
  },

  authApi: async ({ apiClient }, use) => {
    await use(new AuthService(apiClient));
  },
});

module.exports = { test };
