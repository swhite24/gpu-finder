const axios = require('axios');
const $ = require('cheerio');
const config = require('../config');

/**
 * Fetch product availabity from nowinstock.net.
 * Looks for entries with an `In Stock` availability, delivering
 * name, price, link.
 * @param {String} make
 * @param {String} model
 * @returns {Array}
 */
exports.load = async (make, model) => {
  const url = [config.base_url, make, model].join('/').toLowerCase();
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
        const last = $($elems[3]).text();
        return { link, name, last, price };
      }
    })
    .toArray();
};
