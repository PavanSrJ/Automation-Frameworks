const { expect } = require('@playwright/test');
const { HeaderComponent } = require('./components/HeaderComponent');
const { CartWidget } = require('./components/CartWidget');

class ProductsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.cartWidget = new CartWidget(page);

    this.allProductsHeading = page.getByRole('heading', { name: 'All Products' });
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByText('Searched Products');

    this.productCards = page.locator('.product-image-wrapper');
    this.leftSidebarCategories = page.locator('.category-products');
    this.leftSidebarBrands = page.locator('.brands-name');

    this.reviewNameInput = page.locator('#name');
    this.reviewEmailInput = page.locator('#email');
    this.reviewTextarea = page.locator('#review');
    this.reviewSubmitButton = page.locator('#button-review');
    this.reviewSuccessAlert = page.getByText('Thank you for your review.');
  }

  async goto() {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
  }

  async searchProduct(term) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  /** Product card locator scoped by visible product name, for chaining actions. */
  productCardByName(name) {
    return this.page.locator('.product-image-wrapper').filter({ hasText: name });
  }

    async addFirstProductToCart() {
    const card = this.productCards.first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await Promise.all([
      this.page.waitForResponse(r => r.url().includes('/add_to_cart/') && r.status() === 200),
      card.getByText(/Add to cart/i).first().click({ force: true }),
    ]);
  }

  async addProductToCartByName(name) {
    const card = this.productCardByName(name);
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await Promise.all([
      this.page.waitForResponse(r => r.url().includes('/add_to_cart/') && r.status() === 200),
      card.getByText(/Add to cart/i).first().click({ force: true }),
    ]);
  }

  async viewFirstProductDetails() {
    await this.productCards.first().getByRole('link', { name: /View Product/i }).click();
  }

  /**
   * Expands a category in the left sidebar accordion then clicks a
   * subcategory link, e.g. openCategory('Women', 'Dress').
   */
  async openCategoryLink(categoryHeading, linkName) {
  await expect(this.leftSidebarCategories).toBeVisible();

  const headingRegex = new RegExp(`^\\s*${categoryHeading}\\s*$`, 'i');
  const linkRegex = new RegExp(`^\\s*${linkName}\\s*$`, 'i');

  // the panel that belongs to this category only
  const panel = this.leftSidebarCategories
    .locator('.panel')
    .filter({ has: this.page.locator('.panel-heading a').filter({ hasText: headingRegex }) });

  await panel.locator('.panel-heading a').click();

  const link = panel.locator('.panel-body a').filter({ hasText: linkRegex });
  await expect(link).toBeVisible({ timeout: 10000 });
  await link.click();
}

async openBrand(brandName) {
  // Brand links render as "(N) BrandName" (count prefix), so match
  // on the brand name appearing anywhere in the accessible name
  // rather than an exact match.
  await this.page.getByRole('link', { name: new RegExp(brandName, 'i') }).click();
}
 
}

module.exports = { ProductsPage };
