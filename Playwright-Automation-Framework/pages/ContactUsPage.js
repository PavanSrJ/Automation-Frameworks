const { HeaderComponent } = require('./components/HeaderComponent');

/**
 * ContactUsPage
 * -------------
 * Submitting this form triggers a native `window.confirm()` dialog
 * before the page navigates. The dialog handler must be registered
 * BEFORE the click that triggers it, so `submitForm()` wires up the
 * listener itself rather than leaving that timing detail to the test.
 */
class ContactUsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new HeaderComponent(page);

    this.getInTouchHeading = page.getByRole('heading', { name: 'Get In Touch' });
    this.nameInput = page.getByTestId('name');
    this.emailInput = page.getByTestId('email');
    this.subjectInput = page.getByTestId('subject');
    this.messageTextarea = page.getByTestId('message');
    this.uploadFileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.getByTestId('submit-button');
    this.successAlert = page.locator('.status.alert-success');
    this.homeButton = page.locator('a.btn-success', { hasText: /Home/i });
  }

  async goto() {
  await this.page.goto('/contact_us', { waitUntil: 'domcontentloaded' });
  // Absorb any secondary nav triggered by ad/tracking scripts here,
  // inside goto(), instead of letting it interrupt the first assertion.
  await this.page.waitForLoadState('load').catch(() => {});
}

  /**
   * @param {{name: string, email: string, subject: string, message: string}} data
   */
  async fillForm(data) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.subjectInput.fill(data.subject);
    await this.messageTextarea.fill(data.message);
  }

  async submitForm() {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }
}

module.exports = { ContactUsPage };
