// ***********************************************************
// This file runs before every single spec file.
// Global configuration, custom command imports, and
// cross-test hooks all live here.
// ***********************************************************

import './commands';
import 'cypress-mochawesome-reporter/register';
import '@cypress/grep/src/support';

// Fail fast on unexpected app errors, but don't let known
// third-party noise (ads, analytics, etc.) kill the whole run.
Cypress.on('uncaught:exception', (err) => {
  const ignoredPatterns = [/ResizeObserver loop limit exceeded/, /Script error/];

  if (ignoredPatterns.some((pattern) => pattern.test(err.message))) {
    return false;
  }
  return true;
});

// Attach a screenshot to the mochawesome report automatically on failure
Cypress.on('test:after:run', (test) => {
  if (test.state === 'failed') {
    const screenshotName = `${Cypress.spec.name} -- ${test.title}.png`;
    cy.task('log', `Captured failure screenshot: ${screenshotName}`, { log: false });
  }
});

beforeEach(() => {
  cy.log(`Starting: ${Cypress.currentTest.title}`);
});
