/**
 * Small, framework-agnostic helpers for shaping test data.
 * Keeping these out of specs/page-objects keeps both focused
 * on behavior rather than data plumbing.
 */

function parsePriceToNumber(priceText) {
  return parseFloat(priceText.replace('$', ''));
}

function sumPrices(prices) {
  return prices.reduce((total, price) => total + parsePriceToNumber(price), 0);
}

function isSortedAscending(values) {
  return values.every((value, index) => index === 0 || values[index - 1] <= value);
}

function isSortedDescending(values) {
  return values.every((value, index) => index === 0 || values[index - 1] >= value);
}

module.exports = {
  parsePriceToNumber,
  sumPrices,
  isSortedAscending,
  isSortedDescending,
};
