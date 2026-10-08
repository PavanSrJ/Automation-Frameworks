const { HeaderComponent } = require('./components/HeaderComponent');

class HomePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new HeaderComponent(page);

    this.featuresItemsHeading = page.getByText('FEATURES ITEMS', { exact: false });
    this.subscriptionEmailInput = page.locator('#susbscribe_email');
    this.subscriptionSubmitButton = page.locator('#subscribe');
    this.subscriptionSuccessAlert = page.locator('#success-subscribe');
  }

  async goto() {
    await this.page.goto('/');
  }

  async subscribe(email) {
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitButton.click();
  }
}

module.exports = { HomePage };
