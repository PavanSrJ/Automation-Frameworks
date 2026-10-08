const { faker } = require('@faker-js/faker');

/**
 * Builds a full createAccount/updateAccount payload matching the field
 * list documented for API 11 / API 13, with sensible random defaults.
 * Any field can be overridden via `overrides`.
 *
 * @param {Partial<{
 *   name: string, email: string, password: string, title: 'Mr'|'Mrs',
 *   birth_date: string, birth_month: string, birth_year: string,
 *   firstname: string, lastname: string, company: string,
 *   address1: string, address2: string, country: string, zipcode: string,
 *   state: string, city: string, mobile_number: string
 * }>} overrides
 */
function generateAccountPayload(overrides = {}) {
  const firstname = overrides.firstname || faker.person.firstName();
  const lastname = overrides.lastname || faker.person.lastName();
  const title = overrides.title || faker.helpers.arrayElement(['Mr', 'Mrs']);

  return {
    name: overrides.name || `${firstname} ${lastname}`,
    email: overrides.email || uniqueEmail(),
    password: overrides.password || `Qa${faker.internet.password({ length: 10 })}1!`,
    title,
    birth_date: overrides.birth_date || String(faker.number.int({ min: 1, max: 28 })),
    birth_month: overrides.birth_month || String(faker.number.int({ min: 1, max: 12 })),
    birth_year: overrides.birth_year || String(faker.number.int({ min: 1970, max: 2002 })),
    firstname,
    lastname,
    company: overrides.company || faker.company.name(),
    address1: overrides.address1 || faker.location.streetAddress(),
    address2: overrides.address2 || faker.location.secondaryAddress(),
    country: overrides.country || faker.helpers.arrayElement([
      'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore',
    ]),
    zipcode: overrides.zipcode || faker.location.zipCode('#####'),
    state: overrides.state || faker.location.state(),
    city: overrides.city || faker.location.city(),
    mobile_number: overrides.mobile_number || faker.phone.number({ style: 'national' }),
  };
}

/** Unique, obviously-a-test-account email so runs never collide. */
function uniqueEmail(prefix = 'qa.auto') {
  const stamp = Date.now();
  const rand = faker.string.alphanumeric(6).toLowerCase();
  return `${prefix}.${stamp}.${rand}@example.com`;
}

module.exports = { generateAccountPayload, uniqueEmail };
