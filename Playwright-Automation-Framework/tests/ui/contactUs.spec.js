const { test, expect } = require('../../fixtures');
const { generateContactMessage } = require('../../test-data/testData');

test.describe('Contact us form', () => {
  test('submitting a complete contact form shows a success message @smoke', async ({ contactUsPage }) => {
    const message = generateContactMessage();

    await contactUsPage.goto();
    await expect(contactUsPage.getInTouchHeading).toBeVisible();

    await contactUsPage.fillForm(message);
    await contactUsPage.submitForm();

    await expect(contactUsPage.successAlert).toBeVisible();
    await expect(contactUsPage.successAlert).toContainText('Success! Your details have been submitted successfully.');
  });

  test('the Home button on the success state navigates back to the homepage', async ({ contactUsPage, page }) => {
    const message = generateContactMessage();

    await contactUsPage.goto();
    await contactUsPage.fillForm(message);
    await contactUsPage.submitForm();
    await expect(contactUsPage.successAlert).toBeVisible();

    await contactUsPage.homeButton.click();
    await expect(page).toHaveURL(/automationexercise\.com\/?$/);
  });
});
