const { expect } = require('@playwright/test');
const { HeaderComponent } = require('./components/HeaderComponent');

class CartPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new HeaderComponent(page);

    this.cartTable = page.locator('#cart_info_table');
    this.cartRows = this.cartTable.locator('tbody tr');
    this.proceedToCheckoutButton = page.locator('a.check_out, a:has-text("Proceed To Checkout")');
    this.emptyCartMessage = page.getByText('Cart is empty!');
  }

  async goto() {
    await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded' });
  }

  /** Row locator scoped by the product name shown in the cart. */
  rowByProductName(name) {
    return this.cartRows.filter({ hasText: name });
  }

  quantityValueFor(name) {
    return this.rowByProductName(name).locator('.cart_quantity button');
  }

  async removeFirstProduct() {
    await this.cartRows.first().locator('.cart_quantity_delete').click();
  }

  async removeProduct(name) {
    await this.rowByProductName(name).locator('.cart_quantity_delete').click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.scrollIntoViewIfNeeded();
    await this.proceedToCheckoutButton.click();

    // Don't wait for the full "load" event; ads on this site delay it indefinitely.
    await this.page.waitForURL(/checkout/i, {
      timeout: 15000,
      waitUntil: 'domcontentloaded',
    });
  }

  priceFor(name) {
    return this.rowByProductName(name).locator('.cart_price p');
  }

  totalFor(name) {
    return this.rowByProductName(name).locator('.cart_total .cart_total_price');
  }

  async clearCart() {
    await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded' });
    const deleteButtons = this.page.locator('.cart_quantity_delete');
    let count = await deleteButtons.count();
    while (count > 0) {
      await deleteButtons.first().click();
      await deleteButtons.nth(count - 1).waitFor({ state: 'hidden' });
      count = await deleteButtons.count();
    }
  }
}

module.exports = { CartPage };
