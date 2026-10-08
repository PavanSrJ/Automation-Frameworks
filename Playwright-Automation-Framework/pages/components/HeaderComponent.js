/**
 * HeaderComponent
 * ---------------
 * The top nav bar appears identically on every page of the site. Rather
 * than duplicating its locators inside every page object, each page
 * object composes a HeaderComponent instance. Component objects follow
 * the same rule as page objects: locators + actions only, no assertions.
 */
class HeaderComponent {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.homeLink = page.getByRole('link', { name: /^Home$/i });
    this.productsLink = page.getByRole('link', { name: /Products/i });
    this.cartLink = page.getByRole('link', { name: /Cart/i });
    this.signupLoginLink = page.getByRole('link', { name: /Signup \/ Login/i });
    this.logoutLink = page.getByRole('link', { name: /Logout/i });
    this.deleteAccountLink = page.getByRole('link', { name: /Delete Account/i });
    this.contactUsLink = page.getByRole('link', { name: /Contact us/i });
    this.testCasesLink = page.getByRole('link', { name: /Test Cases/i });
    // "Logged in as <username>" nav item - present only when authenticated.
    this.loggedInAsText = page.locator('a', { hasText: /Logged in as/i });
  }

  async goToHome() {
    await this.homeLink.click();
  }

  async goToProducts() {
    await this.productsLink.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async goToSignupLogin() {
    await this.signupLoginLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  async goToContactUs() {
    await this.contactUsLink.click();
  }

  /** Search box lives inline in the header only on the /products page. */
}

module.exports = { HeaderComponent };
