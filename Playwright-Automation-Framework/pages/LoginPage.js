const { HeaderComponent } = require('./components/HeaderComponent');

/**
 * LoginPage
 * ---------
 * /login hosts BOTH the "Login to your account" form and the
 * "New User Signup!" form side by side, so this page object exposes
 * both. SignupPage (the post-signup account-info page) is separate.
 */
class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new HeaderComponent(page);

    // Login form
    this.loginEmailInput = page.getByTestId('login-email');
    this.loginPasswordInput = page.getByTestId('login-password');
    this.loginButton = page.getByTestId('login-button');
    this.loginErrorText = page.getByText('Your email or password is incorrect!');

    // Signup form (name + email only - full details captured on next page)
    this.signupNameInput = page.getByTestId('signup-name');
    this.signupEmailInput = page.getByTestId('signup-email');
    this.signupButton = page.getByTestId('signup-button');
    this.signupErrorText = page.getByText('Email Address already exist!');

    this.loginToAccountHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.newUserSignupHeading = page.getByRole('heading', { name: 'New User Signup!' });
  }

  async goto() {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
  }

  async login(email, password) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async startSignup(name, email) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
}

module.exports = { LoginPage };
