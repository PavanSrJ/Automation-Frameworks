const { test, expect } = require('../../fixtures');

test.describe('API: Products list', () => {
  test('GET productsList returns 200 with a well-formed product schema @smoke', async ({ productsApi }) => {
    const result = await productsApi.getAllProducts();

    expect(result.httpStatus).toBe(200);
    expect(result.apiStatus).toBe(200);
    expect(Array.isArray(result.body.products)).toBe(true);
    expect(result.body.products.length).toBeGreaterThan(0);

    const product = result.body.products[0];
    for (const field of ['id', 'name', 'price', 'brand', 'category']) {
      expect(product, `product should have field "${field}"`).toHaveProperty(field);
    }
    expect(product.category).toHaveProperty('usertype');
    expect(product.category).toHaveProperty('category');
  });

  test('POST productsList (unsupported method) returns 405', async ({ productsApi }) => {
    const result = await productsApi.postAllProducts();

    expect(result.apiStatus).toBe(405);
    expect(result.body.message).toMatch(/not supported/i);
  });
});
