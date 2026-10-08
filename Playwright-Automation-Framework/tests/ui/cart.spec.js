const { test, expect } = require('../../fixtures');

test.beforeEach(async ({ cartPage }) => {
  await cartPage.goto();
  await cartPage.page.waitForLoadState('networkidle').catch(() => {}); // let cart rows actually render before counting
  let count = await cartPage.cartRows.count();
  while (count > 0) {
    await cartPage.removeFirstProduct();
    await expect(cartPage.cartRows).toHaveCount(count - 1, { timeout: 15000 });
    count -= 1;
  }
});

test.describe('Shopping cart', () => {
  test('adding a product from the listing page shows it in the cart @smoke', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.goto();
    const productName = await productsPage.productCards
      .first()
      .locator('.productinfo p')
      .innerText();

    await productsPage.addFirstProductToCart();
    await productsPage.cartWidget.viewCart();

    await expect(cartPage.page).toHaveURL(/view_cart/i);
    await expect(cartPage.rowByProductName(productName.trim())).toBeVisible();
  });

  test('setting a quantity on the product page is reflected in the cart', async ({
    productsPage,
    productDetailPage,
    cartPage,
  }) => {
    await productsPage.goto();
    await productsPage.viewFirstProductDetails();

    const productName = (await productDetailPage.productName.innerText()).trim();
    await productDetailPage.setQuantity(4);
    await productDetailPage.addToCart();
    await productDetailPage.cartWidget.viewCart();

    await expect(cartPage.page).toHaveURL(/view_cart/i);
    await expect(cartPage.quantityValueFor(productName)).toHaveText('4');
  });

  test('removing a product from the cart removes its row', async ({ productsPage, cartPage }) => {
    await productsPage.goto();
    const productName = await productsPage.productCards
      .first()
      .locator('.productinfo p')
      .innerText();

    await productsPage.addFirstProductToCart();
    await productsPage.cartWidget.viewCart();
    await expect(cartPage.rowByProductName(productName.trim())).toBeVisible();

    await cartPage.removeProduct(productName.trim());

    await expect(cartPage.rowByProductName(productName.trim())).toHaveCount(0);
  });

  test('cart total reflects price x quantity for a single item', async ({
    productsPage,
    productDetailPage,
    cartPage,
  }) => {
    await productsPage.goto();
    await productsPage.viewFirstProductDetails();

    const productName = (await productDetailPage.productName.innerText()).trim();
    await productDetailPage.setQuantity(2);
    await productDetailPage.addToCart();
    await productDetailPage.cartWidget.viewCart();
    await expect(cartPage.rowByProductName(productName)).toBeVisible({ timeout: 10000 });

    const unitPriceText = await cartPage.priceFor(productName).innerText();
    const totalText = await cartPage.totalFor(productName).innerText();
    const unitPrice = Number(unitPriceText.replace(/[^\d]/g, ''));
    const total = Number(totalText.replace(/[^\d]/g, ''));

    expect(total).toBe(unitPrice * 2);
  });
});
