const { faker } = require('@faker-js/faker');

/** Search terms known to return results on automationexercise.com. */
const productSearchTerms = {
  withResults: 'Dress',
  anotherWithResults: 'Top',
  noResults: 'zzz-not-a-real-product-zzz',
};

/** Category/subcategory pairs exposed in the left-hand nav. */
// const categories = {
//   women: { category: 'Women', subCategory: 'Dress' },
//   men: { category: 'Men', subCategory: 'Tshirts' },
//   kids: { category: 'Kids', subCategory: 'Tops & Shirts' },
// };
const categories = {
   women: { categoryHeading: 'Women', linkName: 'Dress' },
  // men / kids link text not yet confirmed against the live site —
  // verify with codegen before writing tests that use these.
};

/** A known brand name shown on /brand pages. */
const brand = 'Polo';

function generateContactMessage() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    subject: faker.lorem.sentence(4),
    message: faker.lorem.paragraph(2),
  };
}

/** Deterministic, valid test payment details (site is a sandbox, no real charge). */
function generatePaymentDetails() {
  return {
    nameOnCard: faker.person.fullName(),
    cardNumber: '4111111111111111',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: String(new Date().getFullYear() + 3),
  };
}

module.exports = {
  productSearchTerms,
  categories,
  brand,
  generateContactMessage,
  generatePaymentDetails,
};
