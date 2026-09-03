/**
 * BasePage
 * Every page object extends this class so common, cross-page behavior
 * (navigation, generic waits, shared assertions) lives in exactly one
 * place instead of being copy-pasted across page objects.
 */
class BasePage {
  visit(path = '/') {
    cy.visit(path);
    return this;
  }

  getTitle() {
    return cy.title();
  }

  getElement(selector) {
    return cy.get(selector);
  }

  getByTestId(testId) {
    return cy.get(`[data-test="${testId}"]`);
  }

  waitForPageLoad() {
    cy.document().its('readyState').should('eq', 'complete');
    return this;
  }

  assertUrlIncludes(partialUrl) {
    cy.url().should('include', partialUrl);
    return this;
  }
}

module.exports = BasePage;
