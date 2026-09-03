const BasePage = require('./BasePage');

class InventoryPage extends BasePage {
  selectors = {
    inventoryList: '.inventory_list',
    inventoryItem: '.inventory_item',
    itemName: '.inventory_item_name',
    itemPrice: '.inventory_item_price',
    addToCartButton: (itemName) =>
      `[data-test="add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`,
    cartBadge: '.shopping_cart_badge',
    cartLink: '.shopping_cart_link',
    sortDropdown: '[data-test="product-sort-container"]',
    burgerMenuButton: '#react-burger-menu-btn',
    logoutLink: '#logout_sidebar_link',
  };

  assertOnInventoryPage() {
    this.assertUrlIncludes('/inventory.html');
    cy.get(this.selectors.inventoryList).should('be.visible');
    return this;
  }

  addItemToCartByName(itemName) {
    cy.get(this.selectors.itemName)
      .contains(itemName)
      .parents(this.selectors.inventoryItem)
      .find('button')
      .click();
    return this;
  }

  getCartBadgeCount() {
    return cy.get(this.selectors.cartBadge);
  }

  goToCart() {
    cy.get(this.selectors.cartLink).click();
    return this;
  }

  sortProductsBy(optionValue) {
    cy.get(this.selectors.sortDropdown).select(optionValue);
    return this;
  }

  getAllItemNames() {
    return cy.get(this.selectors.itemName);
  }

  getAllItemPrices() {
    return cy.get(this.selectors.itemPrice);
  }

  logout() {
    cy.get(this.selectors.burgerMenuButton).click();
    cy.get(this.selectors.logoutLink).should('be.visible').click();
    return this;
  }
}

module.exports = new InventoryPage();
