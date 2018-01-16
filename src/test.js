const config = require('./config');
const { load } = require('./services/nowinstock');

/**
 * Utility to pretty print product listings
 * @param {Object} product
 */
const print = ({ name, price, link }) => {
  console.log(`${name} - ${price}
${link}`);
};

// Run helper
const run = async () => {
  for (let i = 0; i < config.cards.length; i++) {
    const { make, models } = config.cards[i];
    console.log(`\n\nStarting ${make} cards...`);
    for (let j = 0; j < models.length; j++) {
      const model = models[j];
      console.log(`\nCheck ${make} ${model}`);
      try {
        const products = await load(make, model);

        products.map(print);
      } catch (err) {
        console.log(`failed ${make} ${model} - ${err.message}`);
      }
    }
  }
};

// Kick off
run().catch(err => console.log('failed to fetch gpu availability: ', err));
