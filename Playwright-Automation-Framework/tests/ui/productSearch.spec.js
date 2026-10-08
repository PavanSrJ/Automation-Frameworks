const { test, expect } = require('../../fixtures');
const { productSearchTerms, categories, brand } = require('../../test-data/testData');

test.describe('Product search and browsing', () => {
  test('searching a known term returns matching products @smoke', async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.searchProduct(productSearchTerms.withResults);

    await expect(productsPage.searchedProductsHeading).toBeVisible();
    await expect(productsPage.productCards.first()).toBeVisible();
    expect(await productsPage.productCards.count()).toBeGreaterThan(0);
  });

  test('searching a term with no matches returns an empty result set', async ({ productsPage }) => {
  await productsPage.goto();
  await productsPage.searchProduct(productSearchTerms.noResults);

  await expect(productsPage.searchedProductsHeading).toBeVisible();
  await expect(productsPage.productCards).toHaveCount(0);
});

  test('browsing by category filters the product list', async ({ productsPage }) => {
  await productsPage.goto();
  await productsPage.openCategoryLink(categories.women.categoryHeading, categories.women.linkName);

  await expect(productsPage.page).toHaveURL(/category_products/i);
  expect(await productsPage.productCards.count()).toBeGreaterThan(0);
});

test('browsing by brand filters the product list', async ({ productsPage }) => {
  await productsPage.goto();
  await productsPage.openBrand(brand);

  await expect(productsPage.page).toHaveURL(/brand_products/i);
  expect(await productsPage.productCards.count()).toBeGreaterThan(0);
});

  test('viewing a product opens its detail page', async ({ productsPage, productDetailPage }) => {
    await productsPage.goto();

    await productsPage.viewFirstProductDetails();

    await expect(productDetailPage.page).toHaveURL(/product_details/i);
    await expect(productDetailPage.productName).toBeVisible();
    await expect(productDetailPage.productName).not.toBeEmpty();
  });
});
