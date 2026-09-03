const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  // ---- Selectors -----------------------------------------------------
  selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    errorCloseButton: '.error-button',
  };

  // ---- Actions ---------------------------------------------------------
  visitLoginPage() {
    return this.visit('/');
  }

  enterUsername(username) {
    cy.get(this.selectors.usernameInput).clear().type(username);
    return this;
  }

  enterPassword(password) {
    cy.get(this.selectors.passwordInput).clear().type(password, { log: false });
    return this;
  }

  clickLoginButton() {
    cy.get(this.selectors.loginButton).click();
    return this;
  }

  login(username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLoginButton();
    return this;
  }

  // ---- Assertions --------------------------------------------------
  assertErrorMessageVisible(expectedMessage) {
    cy.get(this.selectors.errorMessage).should('be.visible').and('contain.text', expectedMessage);
    return this;
  }

  assertLoginButtonVisible() {
    cy.get(this.selectors.loginButton).should('be.visible');
    return this;
  }
}

module.exports = new LoginPage();
