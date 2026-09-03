// ***********************************************************
// Custom commands extend Cypress's `cy.` API with reusable,
// framework-level actions so specs and page objects stay thin.
// ***********************************************************

/**
 * Login helper that bypasses re-typing credentials in every spec.
 * Wraps the LoginPage flow so specs can call cy.login(user, pass)
 * directly without importing the page object.
 */
// Cypress.Commands.add('login', (username, password) => {
//   cy.session(
//     [username, password],
//     () => {
//       cy.visit('/');
//       cy.get('[data-test="username"]').type(username);
//       cy.get('[data-test="password"]').type(password, { log: false });
//       cy.get('[data-test="login-button"]').click();
//       cy.url().should('include', '/inventory.html');
//     },
//     {
//       cacheAcrossSpecs: true,
//     }
//   );
// });

// Updated code

Cypress.Commands.add('login', (username, password) => {
  cy.visit('/');

  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').type(password, { log: false });
  cy.get('[data-test="login-button"]').click();

  cy.url().should('include', '/inventory.html');
  cy.get('.inventory_list').should('be.visible');
});

/**
 * Get an element by its data-test attribute.
 * Centralizing the selector strategy here means if the app's
 * testing-hook convention ever changes, only this command needs updating.
 */
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-test="${testId}"]`);
});

/**
 * Adds friendly retry-safe assertion for element count.
 */
Cypress.Commands.add('shouldHaveCount', { prevSubject: true }, (subject, count) => {
  cy.wrap(subject).should('have.length', count);
});

/**
 * Resets app state (cart, local storage) between tests without a full reload,
 * which keeps the suite fast while still guaranteeing test isolation.
 */
Cypress.Commands.add('resetAppState', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
});
