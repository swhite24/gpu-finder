const config = require('../config');
const { load } = require('./nowinstock');

exports.collect = async () => {
  const results = [];
  for (let i = 0; i < config.cards.length; i++) {
    const { make, models } = config.cards[i];
    for (let j = 0; j < models.length; j++) {
      const model = models[j];
      try {
        const products = await load(make, model);

        results.push({ make, model, products });
      } catch (err) {
        throw err;
      }
    }
  }

  return results;
};
