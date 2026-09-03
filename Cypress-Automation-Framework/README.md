# Cypress Automation Framework

A scalable, production-style Cypress E2E framework built with the **Page Object Model**,
custom commands, multi-environment configuration, tagging, and CI-ready HTML reporting.
Built against [saucedemo.com](https://www.saucedemo.com), a public demo app, so the entire
suite runs against a real, stable, publicly accessible site.

## Why this structure

| Layer | Purpose |
|---|---|
| `cypress/pages/` | Page Object Model — one class per page/screen. Selectors and low-level interactions live here, never in specs. |
| `cypress/e2e/tests/` | Test specs — read like plain English, call page-object methods, and assert outcomes. |
| `cypress/fixtures/` | Static/test data (users, checkout info) kept out of spec files. |
| `cypress/support/` | Custom commands (`cy.login`, etc.) and global hooks that run before every spec. |
| `cypress/utils/` | Pure JS helper functions (sorting checks, price parsing) — no Cypress dependency, easily unit-testable. |
| `cypress/config/` | Per-environment JSON (qa, staging) merged into `Cypress.env()` at runtime. |
| `.github/workflows/` | CI pipeline: matrix run across Chrome/Firefox, merged Mochawesome HTML report as a build artifact. |

## Design principles applied

- **Page Object Model** — tests never touch a CSS selector directly; only page objects do.
- **Method chaining** (`return this`) on page objects for a fluent, readable test style.
- **`cy.session()`** for login — session state is cached across tests in the same run, so the
  suite doesn't burn time re-logging-in for every spec.
- **Environment-driven config** — switch target environment with `--env environmentName=staging`
  without touching test code.
- **Tagging** (`@smoke`, `@regression`) via `@cypress/grep` so CI can run a fast smoke pass on
  every PR and a full regression pass on a schedule.
- **Retries in CI, not locally** — `retries.runMode: 2` absorbs environment flakiness in CI while
  keeping local debugging (`openMode: 0`) fast and honest.
- **Mochawesome HTML reporting** — merged, screenshot-embedded report published as a CI artifact.

## Getting started

```bash
npm install
npm run cy:open        # interactive runner
npm run cy:run         # headless run, default (qa) environment
npm run test:smoke     # only @smoke-tagged tests
npm run test:regression
npm run test:staging   # run against the staging config
npm run report         # merge + generate HTML report locally
```

## Adding a new page/flow

1. Create `cypress/pages/NewPage.js` extending `BasePage`.
2. Add selectors + action/assertion methods (return `this` for chaining).
3. Export a singleton: `module.exports = new NewPage();`
4. Write a spec in `cypress/e2e/tests/` that imports the page object(s) and reads like a user story.
5. Tag it `@smoke` or `@regression` depending on how critical/fast it is.

## CI

Every push/PR triggers `.github/workflows/cypress.yml`, which runs the suite against Chrome and
Firefox in parallel, then uploads the merged HTML report and any failure screenshots as build
artifacts.
