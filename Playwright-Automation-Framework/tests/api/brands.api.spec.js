const { test, expect } = require('../../fixtures');

test.describe('API: Brands list', () => {
  test('GET brandsList returns 200 with a non-empty list of brands @smoke', async ({ brandsApi }) => {
    const result = await brandsApi.getAllBrands();

    expect(result.httpStatus).toBe(200);
    expect(result.apiStatus).toBe(200);
    expect(Array.isArray(result.body.brands)).toBe(true);
    expect(result.body.brands.length).toBeGreaterThan(0);

    const brand = result.body.brands[0];
    expect(brand).toHaveProperty('id');
    expect(brand).toHaveProperty('brand');
  });

  test('PUT brandsList (unsupported method) returns 405', async ({ brandsApi }) => {
    const result = await brandsApi.putAllBrands();

    expect(result.apiStatus).toBe(405);
    expect(result.body.message).toMatch(/not supported/i);
  });
});
