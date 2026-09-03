const LoginPage = require('../../pages/LoginPage');
const InventoryPage = require('../../pages/InventoryPage');

describe('Login', { tags: '@smoke' }, () => {
  let users;

  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    LoginPage.visitLoginPage();
  });

  it('logs in successfully with valid standard-user credentials', () => {
    LoginPage.login(users.standardUser.username, users.standardUser.password);
    InventoryPage.assertOnInventoryPage();
  });

  it('shows an error for a locked-out user', { tags: '@regression' }, () => {
    LoginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
    LoginPage.assertErrorMessageVisible('Sorry, this user has been locked out');
  });

  it('shows an error when credentials are invalid', { tags: '@regression' }, () => {
    LoginPage.login(users.invalidUser.username, users.invalidUser.password);
    LoginPage.assertErrorMessageVisible('Username and password do not match');
  });

  it('shows an error when the password is missing', { tags: '@regression' }, () => {
    LoginPage.enterUsername(users.standardUser.username).clickLoginButton();
    LoginPage.assertErrorMessageVisible('Password is required');
  });
});
