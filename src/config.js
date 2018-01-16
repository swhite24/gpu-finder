module.exports = {
  base_url: 'http://www.nowinstock.net/computers/videocards',
  cards: [
    {
      make: 'AMD',
      models: ['RX570', 'RX580', 'RXVEGA56', 'RXVEGA64']
    },
    {
      make: 'NVIDIA',
      models: ['GTX1060', 'GTX1070', 'GTX1070ti', 'GTX1080', 'GTX1080ti']
    }
  ],
  slack_hook: process.env.SLACK_WEBHOOK_URL,
  region: process.env.REGION,
  worker_function: process.env.WORKER_FUNCTION
};
