# automationexercise-playwright-framework

A production-style Playwright test automation framework covering both
**UI** and **API** testing for [automationexercise.com](https://automationexercise.com),
written in plain JavaScript (no TypeScript). Built as a portfolio piece
to demonstrate framework architecture decisions, not just individual
test scripts.

---

## Why this exists

Most "Playwright practice" repos are a folder of `.spec.js` files that
each log in through the UI, click around, and assert something. That
works, but it doesn't demonstrate how you'd structure automation for a
real team: shared page objects, a decoupled API layer, fast and reliable
auth, and CI that scales with the suite. This repo is an attempt at that,
scoped to a single public practice site so it's fully runnable and
verifiable by anyone who clones it.

---

## Architecture

```
.
├── auth.setup.js            # runs once: provisions account (API) + logs in (UI) + saves storageState
├── playwright.config.js     # 3 projects: setup / ui / api
├── config/
│   └── env.js                # single source of truth for env vars (.env)
├── api/
│   ├── clients/
│   │   └── apiClient.js       # low-level HTTP wrapper around APIRequestContext
│   └── services/
│       ├── productsService.js # productsList, searchProduct
│       ├── brandsService.js   # brandsList
│       └── authService.js     # verifyLogin, createAccount, deleteAccount, updateAccount, getUserDetailByEmail
├── pages/
│   ├── components/
│   │   ├── HeaderComponent.js # nav bar, reused by every page object
│   │   └── CartWidget.js      # "added to cart" modal, reused by 2 pages
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── SignupPage.js
│   ├── ProductsPage.js
│   ├── ProductDetailPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── PaymentPage.js
│   └── ContactUsPage.js
├── fixtures/
│   ├── pageFixtures.js        # one fixture per page object
│   ├── apiFixtures.js         # apiClient + productsApi/brandsApi/authApi
│   ├── authFixtures.js        # currentUser (the persona behind storageState)
│   └── index.js               # merged `test`/`expect` - import this everywhere
├── test-data/
│   ├── users.js                # persona definitions, sourced from env/faker
│   └── testData.js             # search terms, categories, payment/contact fixtures
├── utils/
│   ├── dataGenerator.js        # faker-backed unique account/email generation
│   └── logger.js
├── tests/
│   ├── ui/                     # browser-based Playwright tests
│   └── api/                    # pure HTTP tests, no browser
└── .github/workflows/playwright.yml
```

### Page Object Model

Every page object follows one rule: **locators and actions only, never
assertions.** `LoginPage.login(email, password)` fills the form and
clicks submit; it does not check whether login succeeded. That check
lives in the test, using `expect()`. This keeps page objects reusable
across both "happy path" and "negative path" tests — a page object that
already contains assertions about success can't be reused to test
failure.

Repeated UI fragments (the top nav, the "added to cart" modal) are
factored into `pages/components/` and composed into page objects rather
than duplicated. `HeaderComponent` alone is used by eight different page
objects.

### API layer is a separate service layer, not bolted onto page objects

`api/services/*.js` never imports a page object, and page objects never
import an API service. The two layers only meet inside test files and
`auth.setup.js`, via fixtures. This mirrors how you'd want these to
evolve independently on a real project — API contract changes shouldn't
force you to touch UI locators, and vice versa.

`ApiClient` (in `api/clients/apiClient.js`) is the only place that knows
how to actually make an HTTP call. automationexercise.com's API:

- expects `application/x-www-form-urlencoded` bodies, not JSON
- always responds `200 OK` at the HTTP level, even for "logical" errors,
  reporting the real result via a `responseCode` field in the JSON body

`ApiClient` normalizes this into `{ httpStatus, apiStatus, ok, body,
headers }` so tests can assert on `apiStatus` consistently instead of
every test re-deriving the "real" status from the body shape.

### Fixtures

`fixtures/index.js` merges three fixture files with Playwright's
`mergeTests`:

- **`pageFixtures.js`** — one fixture per page object (`loginPage`,
  `cartPage`, etc.), instantiated fresh per test.
- **`apiFixtures.js`** — builds a standalone `APIRequestContext` scoped
  to the API base URL and exposes `productsApi` / `brandsApi` /
  `authApi`. This context is independent of any browser, so API tests
  never launch Chromium.
- **`authFixtures.js`** — exposes `currentUser`, the persona backing the
  shared `storageState`, so UI tests can assert `"Logged in as
  <currentUser.name>"` without hardcoding credentials inline.

Every test file imports `{ test, expect }` from `fixtures/index.js`
rather than `@playwright/test` directly, so the full fixture surface is
always available.

---

## Auth strategy: why `auth.setup.js` + `storageState`, not UI login per test

automationexercise.com's `verifyLogin` API only **validates** a pair of
credentials — it responds `"User exists!"` or `"User not found!"`. It
does not return a session token, cookie, or anything a browser could use
to actually be logged in. There is no clean token-based auth path for
the UI here, so this framework uses the fallback the brief allows for,
but keeps it to a **single execution**, not per test:

1. **`auth.setup.js`** runs once, before any UI test:
   - Calls `AuthService.ensureAccountExists()` — the API layer — to make
     sure the persistent test persona (from `.env`) is registered.
     This is idempotent: if the account already exists, the API says so
     and setup treats that as success. A fresh clone of this repo works
     with zero manual "go sign up first" steps.
   - Performs **one real UI login** through `LoginPage`, because that's
     the only way to obtain the actual browser session this site
     recognizes.
   - Saves the resulting `storageState` (cookies + localStorage) to
     `storage/user.storageState.json`.

2. **`playwright.config.js`** declares the `ui` project with
   `dependencies: ['setup']` and `storageState:
   env.storageStatePath`. Every test in `tests/ui/` therefore starts
   with an already-authenticated browser context — the login form is
   never exercised again outside of the tests that are specifically
   about login.

3. **`tests/ui/auth.spec.js`** is the deliberate exception: it calls
   `test.use({ storageState: { cookies: [], origins: [] } })` at the top
   of the file to get a genuinely logged-out context, because those
   tests are testing the login/signup flow itself.

**Why this matters:** every other UI test (cart, checkout, contact us,
product browsing) gets a logged-in session for free, in ~0 extra
seconds, instead of paying the cost — and the flakiness risk — of a full
login flow at the start of every single test. This is the same pattern
you'd use against a real app with a "log in once, reuse the session"
identity provider; the API-based account provisioning step is the
adaptation for a site that doesn't expose a token endpoint.

### API tests are independent of the UI/auth setup entirely

`tests/api/*.spec.js` do not depend on the `setup` project and never
touch `storageState`. They authenticate purely at the HTTP level (or, in
the negative tests, deliberately don't) via `authApi.verifyLogin(...)`.
This is intentional: the API layer needs to be provably correct on its
own, independent of whatever the UI happens to be doing.

---

## Reliability choices

- **No `waitForTimeout` anywhere.** Every wait is an auto-retrying
  `expect(locator)...` assertion or a locator action that Playwright
  already retries (`.click()`, `.fill()`, etc.).
- **Locator strategy:** `getByRole`, `getByTestId` (see below), and
  scoped `.filter({ hasText })` are preferred over raw CSS/XPath. Raw
  CSS is only used where the site provides no accessible role/label and
  no `data-qa` hook (e.g. the cart quantity cell, the "added to cart"
  modal container).
- **`data-qa` as the test-id source:** automationexercise.com uses
  `data-qa="..."` attributes as its stable automation hooks instead of
  `data-testid`. `playwright.config.js` sets
  `use.testIdAttribute: 'data-qa'`, so `page.getByTestId(...)` in page
  objects transparently targets the site's real hooks.
- **Full test isolation:** every test gets its own fixture instances and
  its own browser context (via Playwright's built-in per-test context).
  No test relies on another test having run first or on shared mutable
  state. Tests that create data (new signups, new API accounts) either
  use uniquely generated emails (`utils/dataGenerator.js`) or clean up
  after themselves (see the `createAccount` → `deleteAccount` pairing in
  `tests/api/auth.api.spec.js`).
- **Environment-driven config:** `config/env.js` is the only file that
  reads `process.env` for app configuration; everything else imports
  from it. Copy `.env.example` to `.env` and fill in real values before
  running anything.

---

## Getting started

```bash
git clone <this repo>
cd automationexercise-playwright-framework
npm install
npx playwright install --with-deps chromium

cp .env.example .env
# edit .env - at minimum, leave TEST_USER_EMAIL/PASSWORD as-is or set
# your own; auth.setup.js will create the account via API if it doesn't
# exist yet.
```

### Running tests

```bash
# Everything (setup -> ui -> api)
npx playwright test

# Just the UI suite (runs "setup" first automatically, via project dependency)
npm run test:ui

# Just the API suite (no browser, no setup dependency)
npm run test:api

# Only @smoke-tagged tests
npm run test:smoke

# Headed, for debugging
npm run test:headed

# Open the last HTML report
npm run test:report
```

### Linting

```bash
npm run lint
npm run lint:fix
npm run format
```

---

## Test coverage

**UI (`tests/ui/`)**
| File | Covers |
|---|---|
| `auth.spec.js` | Signup (valid + duplicate email), login (valid, wrong password, unregistered email), logout |
| `productSearch.spec.js` | Search with/without results, category browsing, brand browsing, product detail navigation |
| `cart.spec.js` | Add to cart, quantity set on PDP reflected in cart, remove from cart, price × quantity = total |
| `checkout.spec.js` | Full cart → address review → payment → order confirmation flow |
| `contactUs.spec.js` | Contact form submission (incl. the native `confirm()` dialog), post-submit navigation |

**API (`tests/api/`)**
| File | Covers |
|---|---|
| `products.api.spec.js` | `GET productsList` (200 + schema), `POST productsList` (405) |
| `brands.api.spec.js` | `GET brandsList` (200 + schema), `PUT brandsList` (405) |
| `search.api.spec.js` | `POST searchProduct` (200, matches + empty results), missing param (400) |
| `auth.api.spec.js` | `verifyLogin` (valid/invalid/missing param/wrong method), `createAccount` → `getUserDetailByEmail` → `deleteAccount` full lifecycle, duplicate-email rejection |

All tests marked `@smoke` can be run standalone with `npm run test:smoke`
for a fast pre-merge signal.

---

## CI/CD

`.github/workflows/playwright.yml` runs on every push/PR to `main`:

- **`ui-tests`**: matrix job, 2 shards, each installs Chromium and runs
  `--project=ui --shard=N/2 --reporter=blob`.
- **`api-tests`**: single job, no browser install needed logically (kept
  for command uniformity), runs `--project=api`.
- **`merge-report`**: downloads all UI blob reports and merges them into
  one HTML report via `playwright merge-reports`, uploaded as a build
  artifact.
- Traces (`retain-on-failure`), screenshots (`only-on-failure`), and
  videos (`retain-on-failure`) are captured automatically per
  `playwright.config.js` and uploaded as artifacts whenever a job fails.

Set `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` as **repository secrets**
(not vars) before running this in your own fork — see
`.github/workflows/playwright.yml`'s `env:` block.

---

## Design decisions worth calling out in an interview

- **Why a service layer instead of calling `request` in tests directly?**
  So the shape of each API call (form fields, headers, base path) lives
  in exactly one place. If `createAccount`'s required fields change, one
  file changes, not every test that happens to create an account.
- **Why merge fixtures instead of one giant `test.extend()`?** Keeping
  page/API/auth fixtures in separate files means each can be understood,
  tested, and reused independently — e.g. the API fixtures file has zero
  knowledge of Playwright's `Page` object and could be lifted into a
  pure-API-testing repo unchanged.
- **Why not just re-login via UI every test?** It works, but it's slow
  and adds a flakiness surface (a form fill + navigation) to every single
  test regardless of what that test is actually about. Authenticating
  once and reusing `storageState` isolates "is login broken" to the
  dedicated login tests, and everything else gets a clean, fast,
  pre-authenticated context.
- **Known limitation:** because automationexercise.com is a shared public
  demo site, the persistent test account may already exist on
  first run with data from a previous run (e.g. an existing address).
  The setup step handles account creation idempotently; it does not
  attempt to reset the account's address/profile data to a known state,
  since the site's API doesn't expose an idempotent "reset" and doing
  so via UI on every setup run would reintroduce the exact per-run
  overhead this strategy avoids. Checkout tests read the address block
  back from whatever is on file rather than asserting specific values.

---

## License

MIT — this is a portfolio/demo project, use it however is useful to you.
