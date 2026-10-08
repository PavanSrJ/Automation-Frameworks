const { test, expect } = require('../../fixtures');
const { existingUser, invalidCredentials } = require('../../test-data/users');
const { generateAccountPayload, uniqueEmail } = require('../../utils/dataGenerator');

/**
 * These tests validate the API layer on its own merit - independent of
 * any UI flow. They reuse the same AuthService the UI's auth.setup.js
 * relies on, which is itself a form of coverage: if createAccount /
 * verifyLogin ever change shape, both the setup step and these tests
 * fail together and point straight at api/services/authService.js.
 */
test.describe('API: Login verification', () => {
  test('POST verifyLogin with valid credentials returns 200 @smoke', async ({ authApi }) => {
    const result = await authApi.verifyLogin(existingUser.email, existingUser.password);

    expect(result.httpStatus).toBe(200);
    expect(result.apiStatus).toBe(200);
    expect(result.body.message).toMatch(/user exists/i);
  });

  test('POST verifyLogin with invalid credentials returns 404', async ({ authApi }) => {
    const result = await authApi.verifyLogin(invalidCredentials.email, invalidCredentials.password);

    expect(result.apiStatus).toBe(404);
    expect(result.body.message).toMatch(/user not found/i);
  });

  test('POST verifyLogin without email parameter returns 400', async ({ authApi }) => {
    const result = await authApi.verifyLoginMissingEmail(existingUser.password);

    expect(result.apiStatus).toBe(400);
    expect(result.body.message).toMatch(/missing/i);
  });

  test('DELETE verifyLogin (unsupported method) returns 405', async ({ authApi }) => {
    const result = await authApi.deleteVerifyLogin();

    expect(result.apiStatus).toBe(405);
    expect(result.body.message).toMatch(/not supported/i);
  });
});

test.describe('API: Account creation', () => {
  test('POST createAccount registers a new user, then the account is deleted @smoke', async ({ authApi }) => {
    const user = generateAccountPayload({ email: uniqueEmail('qa.api') });

    const created = await authApi.createAccount(user);
    expect(created.apiStatus).toBe(201);
    expect(created.body.message).toMatch(/user created/i);

    const verify = await authApi.verifyLogin(user.email, user.password);
    expect(verify.apiStatus).toBe(200);

    const details = await authApi.getUserDetailByEmail(user.email);
    expect(details.httpStatus).toBe(200);
    expect(details.body.user.email).toBe(user.email);
    expect(details.body.user.first_name).toBe(user.firstname);

    // Clean up so repeated runs never collide on this generated email.
    const deleted = await authApi.deleteAccount(user.email, user.password);
    expect(deleted.apiStatus).toBe(200);
    expect(deleted.body.message).toMatch(/account deleted/i);
  });

  test('POST createAccount with an email that already exists is rejected', async ({ authApi }) => {
    const result = await authApi.createAccount(
      generateAccountPayload({ email: existingUser.email, password: existingUser.password })
    );

    expect(result.apiStatus).toBe(400);
    expect(result.body.message).toMatch(/email already exists/i);
  });
});
