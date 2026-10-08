/**
 * SignupPage
 * ----------
 * The "Enter Account Information" form shown after submitting name+email
 * on the login page's signup form. Name/email fields here are pre-filled
 * and read-only in the UI, so this object only fills the remaining
 * required account details.
 */
class SignupPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.accountInfoHeading = page.getByText('Enter Account Information');

    this.titleMrRadio = page.locator('#id_gender1');
    this.titleMrsRadio = page.locator('#id_gender2');
    this.passwordInput = page.getByTestId('password');
    this.daysSelect = page.locator('#days');
    this.monthsSelect = page.locator('#months');
    this.yearsSelect = page.locator('#years');

    this.newsletterCheckbox = page.locator('#newsletter');
    this.specialOffersCheckbox = page.locator('#optin');

    this.firstNameInput = page.getByTestId('first_name');
    this.lastNameInput = page.getByTestId('last_name');
    this.companyInput = page.getByTestId('company');
    this.address1Input = page.getByTestId('address');
    this.address2Input = page.getByTestId('address2');
    this.countrySelect = page.getByTestId('country');
    this.stateInput = page.getByTestId('state');
    this.cityInput = page.getByTestId('city');
    this.zipcodeInput = page.getByTestId('zipcode');
    this.mobileNumberInput = page.getByTestId('mobile_number');

    this.createAccountButton = page.getByTestId('create-account');
    this.accountCreatedHeading = page.getByTestId('account-created');
    this.continueButton = page.getByTestId('continue-button');
  }

  /**
   * Fills out and submits the full account-information form.
   * @param {ReturnType<typeof import('../utils/dataGenerator').generateAccountPayload>} user
   */
  async completeSignup(user) {
    if (user.title === 'Mrs') {
      await this.titleMrsRadio.check();
    } else {
      await this.titleMrRadio.check();
    }

    await this.passwordInput.fill(user.password);
    await this.daysSelect.selectOption(user.birth_date);
    await this.monthsSelect.selectOption(user.birth_month);
    await this.yearsSelect.selectOption(user.birth_year);

    await this.firstNameInput.fill(user.firstname);
    await this.lastNameInput.fill(user.lastname);
    await this.companyInput.fill(user.company);
    await this.address1Input.fill(user.address1);
    await this.address2Input.fill(user.address2);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipcodeInput.fill(user.zipcode);
    await this.mobileNumberInput.fill(user.mobile_number);

    await this.createAccountButton.click();
  }

  async continueAfterAccountCreated() {
    await this.continueButton.click();
  }
}

module.exports = { SignupPage };
