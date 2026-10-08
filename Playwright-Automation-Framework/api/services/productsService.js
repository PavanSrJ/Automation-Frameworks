/**
 * ProductsService
 * ---------------
 * Wraps API 1/2 (productsList) and API 5/6 (searchProduct) from
 * https://automationexercise.com/api_list
 */
class ProductsService {
  /** @param {import('../clients/apiClient').ApiClient} apiClient */
  constructor(apiClient) {
    this.api = apiClient;
  }

  /** API 1: GET All Products List */
  async getAllProducts() {
    return this.api.get('/productsList');
  }

  /** API 2: POST To All Products List (unsupported method, expect 405) */
  async postAllProducts() {
    return this.api.post('/productsList');
  }

  /** API 5: POST To Search Product */
  async searchProduct(searchTerm) {
    return this.api.post('/searchProduct', { search_product: searchTerm });
  }

  /** API 6: POST To Search Product without search_product parameter */
  async searchProductMissingParam() {
    return this.api.post('/searchProduct');
  }
}

module.exports = { ProductsService };
