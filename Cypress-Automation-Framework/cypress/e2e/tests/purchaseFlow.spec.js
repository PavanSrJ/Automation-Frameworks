const InventoryPage = require('../../pages/InventoryPage');
const CartPage = require('../../pages/CartPage');
const CheckoutPage = require('../../pages/CheckoutPage');

describe('End-to-End Purchase Flow', { tags: '@regression' }, () => {
  let users;
  let checkoutInfo;
  const itemToPurchase = 'Sauce Labs Backpack';

  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
    cy.fixture('checkoutInfo').then((data) => {
      checkoutInfo = data;
    });
  });

  // beforeEach(() => {
  //   cy.login(users.standardUser.username, users.standardUser.password);
  //   InventoryPage.visit('/inventory.html');
  // });

  //Updated Code to fix 404 error
  beforeEach(() => {
  cy.login(users.standardUser.username, users.standardUser.password);
  InventoryPage.assertOnInventoryPage();
});

  it('completes a purchase from product selection to order confirmation', () => {
    InventoryPage.addItemToCartByName(itemToPurchase);
    InventoryPage.getCartBadgeCount().should('have.text', '1');

    InventoryPage.goToCart();
    CartPage.assertOnCartPage();
    CartPage.assertItemInCart(itemToPurchase);

    CartPage.clickCheckout();
    CheckoutPage.fillCustomerInfo(checkoutInfo.validCustomer);
    CheckoutPage.clickContinue();
    CheckoutPage.clickFinish();

    CheckoutPage.assertOrderComplete();
  });

  it('blocks checkout when required customer info is missing', () => {
    InventoryPage.addItemToCartByName(itemToPurchase);
    InventoryPage.goToCart();
    CartPage.clickCheckout();

    CheckoutPage.fillCustomerInfo(checkoutInfo.missingLastName);
    CheckoutPage.clickContinue();

    CheckoutPage.assertValidationError('Last Name is required');
  });
});
