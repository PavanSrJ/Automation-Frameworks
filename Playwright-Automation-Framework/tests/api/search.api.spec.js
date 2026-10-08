const { test, expect } = require('../../fixtures');
const { productSearchTerms } = require('../../test-data/testData');

test.describe('API: Product search', () => {
  test('POST searchProduct with a known term returns matching products @smoke', async ({ productsApi }) => {
    const result = await productsApi.searchProduct(productSearchTerms.withResults);

    expect(result.httpStatus).toBe(200);
    expect(result.apiStatus).toBe(200);
    expect(Array.isArray(result.body.products)).toBe(true);
    expect(result.body.products.length).toBeGreaterThan(0);

    const matchesTerm = result.body.products.every((p) =>
      p.name.toLowerCase().includes(productSearchTerms.withResults.toLowerCase())
    );
    // Not asserted strictly (the API's matching logic is server-side and
    // may include category matches too) but logged for visibility.
    if (!matchesTerm) {
      // eslint-disable-next-line no-console
      console.log('Note: some results did not include the search term in the name field.');
    }
  });

  test('POST searchProduct with a nonsense term returns an empty list, not an error', async ({ productsApi }) => {
    const result = await productsApi.searchProduct(productSearchTerms.noResults);

    expect(result.apiStatus).toBe(200);
    expect(result.body.products).toEqual([]);
  });

  test('POST searchProduct without search_product param returns 400', async ({ productsApi }) => {
    const result = await productsApi.searchProductMissingParam();

    expect(result.apiStatus).toBe(400);
    expect(result.body.message).toMatch(/search_product parameter is missing/i);
  });
});
