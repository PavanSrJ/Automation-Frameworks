const { HeaderComponent } = require('./components/HeaderComponent');

class CheckoutPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new HeaderComponent(page);

    this.reviewOrderHeading = page.getByText('Review Your Order');
    this.deliveryAddressBlock = page.locator('#address_delivery');
    this.billingAddressBlock = page.locator('#address_invoice');
    this.orderCommentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole('link', { name: /Place Order/i });
  }

  async addOrderComment(comment) {
    await this.orderCommentTextarea.fill(comment);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}

module.exports = { CheckoutPage };
