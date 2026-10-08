const { test, expect } = require('../../fixtures');
const { generatePaymentDetails } = require('../../test-data/testData');

test.beforeEach(async ({ cartPage }) => {
  await cartPage.goto();
  let count = await cartPage.cartRows.count();
  while (count > 0) {
    await cartPage.removeFirstProduct();
    await expect(cartPage.cartRows).toHaveCount(count - 1, { timeout: 15000 });
    count -= 1;
  }
});

test.describe('Checkout flow', () => {
  test.setTimeout(90000);
  test(
    'a logged-in user can complete checkout from cart to order confirmation @smoke',
    async ({ productsPage, cartPage, checkoutPage, paymentPage, currentUser }) => {
      const payment = generatePaymentDetails();

      await productsPage.goto();
      await productsPage.addFirstProductToCart();
      await productsPage.cartWidget.viewCart();

      await expect(cartPage.page).toHaveURL(/view_cart/i);
      await cartPage.proceedToCheckout();

      await expect(checkoutPage.reviewOrderHeading).toBeVisible();
      await expect(checkoutPage.deliveryAddressBlock).toContainText(/your delivery address/i);
      await checkoutPage.addOrderComment('Please deliver during business hours. (QA automated order)');
      await checkoutPage.placeOrder();

      await expect(paymentPage.nameOnCardInput).toBeVisible();
      await paymentPage.payWithCard(payment);

      await expect(paymentPage.orderConfirmationHeading).toBeVisible();
      await expect(paymentPage.orderConfirmationText).toBeVisible();
    }
  );

  test('checkout page shows both delivery and billing addresses for the account', async ({
    productsPage,
    cartPage,
    checkoutPage,
    currentUser,
  }) => {
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await productsPage.cartWidget.viewCart();
    await cartPage.proceedToCheckout();

    await expect(checkoutPage.deliveryAddressBlock).toContainText(/your delivery address/i);
    await expect(checkoutPage.billingAddressBlock).toContainText(/your billing address/i);

// By default the site uses the same address for delivery and billing
const clean = (text, heading) =>
  text.replace(new RegExp(`^\\s*${heading}\\s*`, 'i'), '').replace(/\s+/g, ' ').trim();

const delivery = clean(await checkoutPage.deliveryAddressBlock.innerText(), 'your delivery address');
const billing = clean(await checkoutPage.billingAddressBlock.innerText(), 'your billing address');

expect(delivery.length).toBeGreaterThan(0);
expect(billing).toBe(delivery);
  });
});
