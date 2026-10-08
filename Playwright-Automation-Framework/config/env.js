/**
 * Centralized, env-driven configuration.
 *
 * Every other file (playwright.config.js, fixtures, page objects, api
 * services) should import from here rather than reading process.env
 * directly. That keeps "where does this value come from" answerable in
 * one place, and makes it trivial to point the whole suite at a different
 * environment (staging, a Docker Compose host, etc.) via .env alone.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(
      `Missing required environment variable "${name}". Did you copy .env.example to .env?`
    );
  }
  return value;
}

const env = {
  ui: {
    baseURL: required('UI_BASE_URL', 'https://automationexercise.com'),
  },
  api: {
    baseURL: required('API_BASE_URL', 'https://automationexercise.com/api'),
  },
  users: {
    // Persistent persona: reused across the suite via storageState.
    existing: {
      name: process.env.TEST_USER_NAME || 'QA Portfolio User',
      email: required('TEST_USER_EMAIL', 'qa.portfolio.user@example.com'),
      password: required('TEST_USER_PASSWORD', 'Str0ngP@ssw0rd!'),
    },
    // Optional fixed email for signup-flow tests; falls back to a
    // generated unique address when left blank so signup tests are
    // re-runnable without manual cleanup.
    newUserEmail: process.env.NEW_USER_EMAIL || null,
  },
  ci: process.env.CI === 'true' || process.env.CI === '1',
  storageStatePath: path.resolve(__dirname, '..', 'storage', 'user.storageState.json'),
};

module.exports = { env };
