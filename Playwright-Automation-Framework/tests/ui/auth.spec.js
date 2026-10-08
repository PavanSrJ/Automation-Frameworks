const { test, expect } = require('../../fixtures');
const { newSignupUser, invalidCredentials, existingUser } = require('../../test-data/users');

/**
 * These tests intentionally exercise the login/signup UI flow itself,
 * so they must NOT reuse the shared authenticated storageState from
 * auth.setup.js (that would either short-circuit the login form or
 * pollute the shared session). Overriding storageState to an empty
 * one here gives every test in this file a genuinely logged-out
 * browser context, independent of the `ui` project's default.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication - Signup', () => {
  test('a new user can sign up with valid details @smoke', async ({ page, loginPage, signupPage }) => {
    const user = newSignupUser();

    await loginPage.goto();
    await loginPage.startSignup(user.name, user.email);

    await expect(signupPage.accountInfoHeading).toBeVisible();
    await signupPage.completeSignup(user);

    await expect(signupPage.accountCreatedHeading).toBeVisible();
    await expect(signupPage.accountCreatedHeading).toContainText('Account Created!');

    await signupPage.continueAfterAccountCreated();
    await expect(loginPage.header.loggedInAsText).toContainText(user.name);
  });

  test('signup is rejected for an email that is already registered', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.startSignup(existingUser.name, existingUser.email);

    await expect(loginPage.signupErrorText).toBeVisible();
  });
});

test.describe('Authentication - Login', () => {
  test('a registered user can log in with valid credentials @smoke', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(existingUser.email, existingUser.password);

    await expect(loginPage.header.logoutLink).toBeVisible();
    await expect(loginPage.header.loggedInAsText).toContainText(existingUser.name);
  });

  test('login is rejected with an incorrect password', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(existingUser.email, invalidCredentials.password);

    await expect(loginPage.loginErrorText).toBeVisible();
    await expect(loginPage.header.logoutLink).toBeHidden();
  });

  test('login is rejected for an unregistered email @smoke', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(invalidCredentials.email, invalidCredentials.password);

    await expect(loginPage.loginErrorText).toBeVisible();
  });

  test('a logged-in user can log out', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(existingUser.email, existingUser.password);
    await expect(loginPage.header.logoutLink).toBeVisible();

    await loginPage.header.logout();
    await expect(loginPage.loginToAccountHeading).toBeVisible();
  });
});
