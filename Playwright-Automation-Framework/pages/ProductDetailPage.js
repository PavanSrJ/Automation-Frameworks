const { HeaderComponent } = require('./components/HeaderComponent');
const { CartWidget } = require('./components/CartWidget');

class ProductDetailPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.cartWidget = new CartWidget(page);

    this.productName = page.locator('.product-information').locator('h1, h2, h3').first();
    this.productPrice = page.locator('.product-information').getByText(/^Rs\.\s?\d+/);
    this.productCategory = page.locator('.product-information p', { hasText: 'Category' });
    this.availability = page.locator('.product-information p', { hasText: 'Availability' });
    this.condition = page.locator('.product-information p', { hasText: 'Condition' });
    this.brand = page.locator('.product-information p', { hasText: 'Brand' });

    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.getByText(/Add to cart/i).first();

    this.reviewNameInput = page.locator('#name');
    this.reviewEmailInput = page.locator('#email');
    this.reviewTextarea = page.locator('#review');
    this.reviewSubmitButton = page.locator('#button-review');
    this.reviewSuccessAlert = page.getByText('Thank you for your review.');
  }

  async setQuantity(quantity) {
    await this.quantityInput.fill(String(quantity));
  }

    async addToCart() {
    const [response] = await Promise.all([
      this.page.waitForResponse(r => r.url().includes('/add_to_cart/') && r.status() === 200),
      this.addToCartButton.click(),
    ]);
    return response;
  }

  async submitReview({ name, email, text }) {
    await this.reviewNameInput.fill(name);
    await this.reviewEmailInput.fill(email);
    await this.reviewTextarea.fill(text);
    await this.reviewSubmitButton.click();
  }
}

module.exports = { ProductDetailPage };
