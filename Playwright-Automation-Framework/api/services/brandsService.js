/**
 * BrandsService
 * -------------
 * Wraps API 3/4 (brandsList) from https://automationexercise.com/api_list
 */
class BrandsService {
  /** @param {import('../clients/apiClient').ApiClient} apiClient */
  constructor(apiClient) {
    this.api = apiClient;
  }

  /** API 3: GET All Brands List */
  async getAllBrands() {
    return this.api.get('/brandsList');
  }

  /** API 4: PUT To All Brands List (unsupported method, expect 405) */
  async putAllBrands() {
    return this.api.put('/brandsList');
  }
}

module.exports = { BrandsService };
