/**
 * AuthService
 * -----------
 * Wraps API 7-14 from https://automationexercise.com/api_list:
 * verifyLogin, createAccount, deleteAccount, updateAccount,
 * getUserDetailByEmail.
 *
 * This service is intentionally the ONLY thing that knows the shape of
 * the account payload. Page objects never build this payload for API
 * calls, and API tests never poke `request` directly - everything goes
 * through here so the field list only lives in one place.
 */
class AuthService {
  /** @param {import('../clients/apiClient').ApiClient} apiClient */
  constructor(apiClient) {
    this.api = apiClient;
  }

  /** API 7/10: POST To Verify Login (valid or invalid details) */
  async verifyLogin(email, password) {
    return this.api.post('/verifyLogin', { email, password });
  }

  /** API 8: POST To Verify Login without email parameter */
  async verifyLoginMissingEmail(password) {
    return this.api.post('/verifyLogin', { password });
  }

  /** API 9: DELETE To Verify Login (unsupported method, expect 405) */
  async deleteVerifyLogin() {
    return this.api.delete('/verifyLogin');
  }

  /**
   * API 11: POST To Create/Register User Account
   * @param {object} user full account payload, see test-data/users.js
   *   for the canonical shape (name, email, password, title, birth_date,
   *   birth_month, birth_year, firstname, lastname, company, address1,
   *   address2, country, zipcode, state, city, mobile_number)
   */
  async createAccount(user) {
    return this.api.post('/createAccount', user);
  }

  /** API 12: DELETE METHOD To Delete User Account */
  async deleteAccount(email, password) {
    return this.api.delete('/deleteAccount', { email, password });
  }

  /** API 13: PUT METHOD To Update User Account */
  async updateAccount(user) {
    return this.api.put('/updateAccount', user);
  }

  /** API 14: GET user account detail by email */
  async getUserDetailByEmail(email) {
    return this.api.get('/getUserDetailByEmail', { email });
  }

  /**
   * Convenience helper used by auth.setup.js: makes sure the persistent
   * test persona exists, treating "already exists" as success so the
   * setup step is idempotent across repeated runs.
   * @param {object} user
   */
  async ensureAccountExists(user) {
    const result = await this.createAccount(user);
    const alreadyExists =
      typeof result.body === 'object' &&
      /email already exists/i.test(result.body?.message || '');

    if (result.apiStatus !== 201 && !alreadyExists) {
      throw new Error(
        `Failed to provision test account via API: ${JSON.stringify(result.body)}`
      );
    }
    return result;
  }
}

module.exports = { AuthService };
