const axios = require('axios');
const { slack_hook } = require('../config');

exports.build = cards => {
  return cards.map(card => {
    const payload = { text: `${card.make} ${card.model}` };
    if (!card.products || !card.products.length) {
      payload.attachments = [
        {
          color: '#ff0000',
          title: 'None available :('
        }
      ];
    } else {
      payload.attachments = card.products.map(p => ({
        fallback: p.name,
        color: '#36a64f',
        title: p.name,
        title_link: p.link,
        fields: [{ title: 'Price', value: p.price, short: false }, { title: 'Last Stock', value: p.last, short: false }]
      }));
    }

    return payload;
  });
};

exports.notify = async cards => {
  const payloads = exports.build(cards);
  for (let i = 0; i < payloads.length; i++) {
    await send(payloads[i]);
    await new Promise(resolve => setTimeout(resolve, 1e3));
  }
};

const send = async message => {
  await axios.post(slack_hook, message, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
