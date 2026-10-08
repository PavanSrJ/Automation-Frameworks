const base = require('@playwright/test');

const { HomePage } = require('../pages/HomePage');
const { LoginPage } = require('../pages/LoginPage');
const { SignupPage } = require('../pages/SignupPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { ProductDetailPage } = require('../pages/ProductDetailPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { PaymentPage } = require('../pages/PaymentPage');
const { ContactUsPage } = require('../pages/ContactUsPage');

/**
 * Extends Playwright's base `test` with one fixture per page object.
 * Tests declare only the page objects they need as parameters, e.g.:
 *
 *   test('adds a product to the cart', async ({ productsPage, cartPage }) => { ... })
 *
 * Each fixture is created lazily (only instantiated if a test actually
 * requests it) and is a fresh instance per test, so there is no shared
 * mutable state between tests.
 */
const test = base.test.extend({
   // Autouse: blocks Google Ads/AdSense network calls before any
  // navigation happens, so the "Vignette" interstitial ad can never
  // load and hijack a click mid-test. Applies to every UI test
  // automatically — no test needs to request it.
  blockAds: [
    async ({ page }, use) => {
      await page.route(
        /doubleclick\.net|googlesyndication\.com|adservice\.google\.com|pagead2\.googlesyndication|googletagservices\.com/i,
        (route) => route.abort()
      );
      await use();
    },
    { auto: true },
  ],
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page));
  },
});

module.exports = { test };
