const InventoryPage = require('../../pages/InventoryPage');
const { parsePriceToNumber, isSortedAscending, isSortedDescending } = require('../../utils/testDataHelper');

describe('Inventory Sorting', { tags: '@regression' }, () => {
  let users;

  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.login(users.standardUser.username, users.standardUser.password);
    InventoryPage.assertOnInventoryPage();
  });

  it('sorts products by price, low to high', () => {
    InventoryPage.sortProductsBy('lohi');

    InventoryPage.getAllItemPrices().then(($prices) => {
      const prices = [...$prices].map((el) => parsePriceToNumber(el.textContent));
      expect(isSortedAscending(prices)).to.be.true;
    });
  });

  it('sorts products by price, high to low', () => {
    InventoryPage.sortProductsBy('hilo');

    InventoryPage.getAllItemPrices().then(($prices) => {
      const prices = [...$prices].map((el) => parsePriceToNumber(el.textContent));
      expect(isSortedDescending(prices)).to.be.true;
    });
  });

  it('sorts products by name, A to Z', () => {
    InventoryPage.sortProductsBy('az');

    InventoryPage.getAllItemNames().then(($names) => {
      const names = [...$names].map((el) => el.textContent);
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).to.deep.equal(sorted);
    });
  });
});
