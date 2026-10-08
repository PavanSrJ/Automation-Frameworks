/**
 * ApiClient
 * ---------
 * Thin wrapper around Playwright's APIRequestContext. This is the ONLY
 * place that knows how to make an HTTP call (method, headers, form
 * encoding, response parsing). Resource-specific services (products,
 * brands, auth...) sit on top of this and never touch `request` directly.
 *
 * automationexercise.com's API expects classic `application/x-www-form-
 * urlencoded` bodies (it's a Django app, not a JSON API), and it always
 * responds 200 with a `responseCode` field in the JSON body even for
 * logical errors (400/404/405 style outcomes are reported inside the
 * payload, not always via the HTTP status). This client normalizes both
 * so tests can assert consistently.
 */
class ApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * @param {string} baseURL
   */
  constructor(request, baseURL) {
    this.request = request;
    this.baseURL = baseURL;
  }

  _url(path) {
    return `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  /**
   * @param {string} path
   * @param {Record<string, any>} [params]
   */
  async get(path, params) {
    const response = await this.request.get(this._url(path), { params });
    return this._toResult(response);
  }

  /**
   * @param {string} path
   * @param {Record<string, any>} [form] form-urlencoded fields
   */
  async post(path, form) {
    const response = await this.request.post(this._url(path), { form });
    return this._toResult(response);
  }

  /**
   * @param {string} path
   * @param {Record<string, any>} [form]
   */
  async put(path, form) {
    const response = await this.request.put(this._url(path), { form });
    return this._toResult(response);
  }

  /**
   * @param {string} path
   * @param {Record<string, any>} [form]
   */
  async delete(path, form) {
    const response = await this.request.delete(this._url(path), { form });
    return this._toResult(response);
  }

  /**
   * Normalizes a Playwright APIResponse into a plain object tests can
   * assert on without re-awaiting anything. Falls back gracefully when
   * the body isn't valid JSON (some negative-path responses aren't).
   */
  async _toResult(response) {
    const httpStatus = response.status();
    let body;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }
    return {
      httpStatus,
      ok: response.ok(),
      body,
      // The API's own reported status code, e.g. body.responseCode.
      // Falls back to httpStatus when the payload has none.
      apiStatus: body && typeof body === 'object' && 'responseCode' in body
        ? body.responseCode
        : httpStatus,
      headers: response.headers(),
    };
  }
}

module.exports = { ApiClient };
