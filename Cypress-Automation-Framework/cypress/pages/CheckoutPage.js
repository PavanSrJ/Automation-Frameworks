const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
  selectors = {
    firstNameInput: '[data-test="firstName"]',
    lastNameInput: '[data-test="lastName"]',
    postalCodeInput: '[data-test="postalCode"]',
    continueButton: '[data-test="continue"]',
    finishButton: '[data-test="finish"]',
    cancelButton: '[data-test="cancel"]',
    summarySubtotal: '.summary_subtotal_label',
    summaryTotal: '.summary_total_label',
    completeHeader: '.complete-header',
    errorMessage: '[data-test="error"]',
  };

fillCustomerInfo({ firstName, lastName, postalCode }) {

  if (firstName) {
    cy.get(this.selectors.firstNameInput).type(firstName);
  }

  if (lastName) {
    cy.get(this.selectors.lastNameInput).type(lastName);
  }

  if (postalCode) {
    cy.get(this.selectors.postalCodeInput).type(postalCode);
  }

  return this;
}

  clickContinue() {
    cy.get(this.selectors.continueButton).click();
    return this;
  }

  clickFinish() {
    cy.get(this.selectors.finishButton).click();
    return this;
  }

  assertOrderComplete() {
    cy.get(this.selectors.completeHeader).should('be.visible').and('contain.text', 'Thank you');
    return this;
  }

  assertValidationError(expectedMessage) {
    cy.get(this.selectors.errorMessage).should('be.visible').and('contain.text', expectedMessage);
    return this;
  }
}

module.exports = new CheckoutPage();
