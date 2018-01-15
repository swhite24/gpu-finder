const axios = require('axios');
const $ = require('cheerio');
const config = require('./config');

/**
 * Fetch product availabity from nowinstock.net.
 * Looks for entries with an `In Stock` availability, delivering
 * name, price, link.
 * @param {String} make
 * @param {String} model
 * @returns {Array}
 */
const load = async (make, model) => {
  const url = [config.base_url, make, model].join('/').toLowerCase();
  // console.log('fetch: ', url);
  const { data } = await axios.get(url);

  const rows = $(data).find('#data table tbody tr');

  return rows
    .map(function() {
      const $row = $(this);
      const $elems = $row.find('td');
      if ($elems.length !== 4) return;

      const available = $($elems[1]).text();

      if (/in stock/i.test(available)) {
        const link = $($elems[0])
          .find('a')
          .attr('href');
        const name = $($elems[0]).text();
        const price = $($elems[2]).text();
        return { link, name, price };
      }
    })
    .toArray();
};

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
