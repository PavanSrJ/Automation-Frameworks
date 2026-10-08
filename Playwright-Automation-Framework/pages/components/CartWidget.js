/**
 * CartWidget
 * ----------
 * The "Added!" confirmation modal that appears after clicking Add to
 * Cart from the products listing or product detail page. Reused by both
 * ProductsPage and ProductDetailPage, so it's factored out here rather
 * than duplicated.
 */
class CartWidget {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.addedModal = page.locator('#cartModal');
    this.continueShoppingButton = this.addedModal.getByRole('button', { name: /Continue Shopping/i });
    this.viewCartLink = this.addedModal.getByRole('link', { name: /View Cart/i });
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async viewCart() {
    await this.addedModal.waitFor({ state: 'visible', timeout: 20000 });
    await this.viewCartLink.click();
  }
}

module.exports = { CartWidget };
