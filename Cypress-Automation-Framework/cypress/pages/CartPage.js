const BasePage = require('./BasePage');

class CartPage extends BasePage {
  selectors = {
    cartItem: '.cart_item',
    cartItemName: '.inventory_item_name',
    checkoutButton: '[data-test="checkout"]',
    continueShoppingButton: '[data-test="continue-shopping"]',
    removeButton: (itemName) =>
      `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`,
  };

  assertOnCartPage() {
    this.assertUrlIncludes('/cart.html');
    return this;
  }

  assertItemInCart(itemName) {
    cy.get(this.selectors.cartItemName).should('contain.text', itemName);
    return this;
  }

  removeItem(itemName) {
    cy.get(this.selectors.removeButton(itemName)).click();
    return this;
  }

  clickCheckout() {
    cy.get(this.selectors.checkoutButton).click();
    return this;
  }
}

module.exports = new CartPage();
