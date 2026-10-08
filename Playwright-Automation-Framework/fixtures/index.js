const { mergeTests, expect, test: base } = require('@playwright/test');
const { blockAds } = require('../utils/blockAds');

const { test: pageTest } = require('./pageFixtures');
const { test: apiTest } = require('./apiFixtures');
const { test: authTest } = require('./authFixtures');

/**
 * Blocks ad/tracker traffic on every browser context so third-party
 * scripts can't delay page load or overlay the UI.
 */
const adBlockTest = base.extend({
  context: async ({ context }, use) => {
    await blockAds(context);
    await use(context);
  },
});

/**
 * Single merged `test` combining page-object fixtures, API service
 * fixtures, the authenticated-session fixture and ad blocking. Every
 * spec file imports `test`/`expect` from here rather than from
 * '@playwright/test' directly, so the whole fixture surface is always
 * available regardless of whether a given test is UI or API flavored.
 */
const test = mergeTests(pageTest, apiTest, authTest, adBlockTest);

module.exports = { test, expect };