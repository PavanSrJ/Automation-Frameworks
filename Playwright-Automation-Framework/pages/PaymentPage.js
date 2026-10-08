const { HeaderComponent } = require('./components/HeaderComponent');

class PaymentPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new HeaderComponent(page);

    this.nameOnCardInput = page.getByTestId('name-on-card');
    this.cardNumberInput = page.getByTestId('card-number');
    this.cvcInput = page.getByTestId('cvc');
    this.expiryMonthInput = page.getByTestId('expiry-month');
    this.expiryYearInput = page.getByTestId('expiry-year');
    this.payAndConfirmButton = page.getByTestId('pay-button');

    this.orderConfirmationHeading = page.getByTestId('order-placed');
    this.orderConfirmationText = page.getByText('Congratulations! Your order has been confirmed!');
    this.downloadInvoiceLink = page.getByRole('link', { name: /Download Invoice/i });
    this.continueButton = page.getByRole('link', { name: /^Continue$/i });
  }

  /**
   * @param {{nameOnCard: string, cardNumber: string, cvc: string,
   *   expiryMonth: string, expiryYear: string}} payment
   */
  async payWithCard(payment) {
    await this.nameOnCardInput.fill(payment.nameOnCard);
    await this.cardNumberInput.fill(payment.cardNumber);
    await this.cvcInput.fill(payment.cvc);
    await this.expiryMonthInput.fill(payment.expiryMonth);
    await this.expiryYearInput.fill(payment.expiryYear);
    await this.payAndConfirmButton.click();
  }
}

module.exports = { PaymentPage };
