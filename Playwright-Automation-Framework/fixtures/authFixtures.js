const base = require('@playwright/test');

const { existingUser } = require('../test-data/users');

/**
 * Exposes the persona whose session is baked into the storageState file
 * produced by auth.setup.js (see fixtures/index.js + playwright.config.js
 * for how the `ui` project consumes that file).
 *
 * Tests that run against an authenticated context can request
 * `currentUser` to assert against ("Logged in as <currentUser.name>")
 * without re-declaring credentials inline.
 */
const test = base.test.extend({
  currentUser: async ({}, use) => {
    await use(existingUser);
  },
});

module.exports = { test };
