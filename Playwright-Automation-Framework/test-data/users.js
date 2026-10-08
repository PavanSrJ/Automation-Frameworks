const { env } = require('../config/env');
const { generateAccountPayload } = require('../utils/dataGenerator');

/**
 * The persistent persona used for storageState-based authenticated UI
 * tests, and for direct API auth tests. Backed by .env so the same
 * account is reused run-to-run instead of piling up throwaway accounts.
 */
const existingUser = {
  name: env.users.existing.name,
  email: env.users.existing.email,
  password: env.users.existing.password,
};

/** Full createAccount payload for the persistent persona. */
function existingUserAccountPayload() {
  return generateAccountPayload({
    name: existingUser.name,
    email: existingUser.email,
    password: existingUser.password,
  });
}

/**
 * A brand-new, unique persona for tests that exercise the signup flow
 * itself. Uses NEW_USER_EMAIL from .env when provided, otherwise
 * generates a unique email per invocation so the test is re-runnable.
 */
function newSignupUser() {
  return generateAccountPayload({
    email: env.users.newUserEmail || undefined,
  });
}

/** Credentials that are syntactically valid but never registered. */
const invalidCredentials = {
  email: 'not.a.real.user.qa.portfolio@example.com',
  password: 'WrongPassword123!',
};

module.exports = {
  existingUser,
  existingUserAccountPayload,
  newSignupUser,
  invalidCredentials,
};
