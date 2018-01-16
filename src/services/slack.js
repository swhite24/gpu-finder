const axios = require('axios');
const { slack_hook } = require('../config');

exports.build = cards => {
  const payload = { text: 'Here\'s what\'s available right now', attachments: [] };
  cards.forEach(card => {
    if (!card.products || !card.products.length) {
      payload.attachments.push({
        pretext: `${card.make} ${card.model}`,
        color: '#ff0000',
        title: 'None available :('
      });
    } else {
      payload.attachments = payload.attachments.concat(
        card.products.map((p, i) => ({
          pretext: i === 0 ? `${card.make} ${card.model}` : '',
          fallback: p.name,
          color: '#36a64f',
          title: p.name,
          title_link: p.link,
          fields: [{ title: 'Price', value: p.price, short: false }, { title: 'Last Stock', value: p.last, short: false }]
        }))
      );
    }
  });

  return payload;
};

exports.notify = async (cards, response_url) => {
  const payload = exports.build(cards);
  await send(Object.assign({ response_type: 'in_channel' }, payload), response_url);
};

const send = async (message, url = slack_hook) => {
  await axios.post(url, message, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
