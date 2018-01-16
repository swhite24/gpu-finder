const AWS = require('aws-sdk');
const qs = require('querystring');
const { collect } = require('./services/collector');
const { notify } = require('./services/slack');
const config = require('./config');

const lambda = new AWS.Lambda({ region: config.region });

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const body = qs.parse(event.body) || {};
  const { response_url } = body;

  console.log('body: ', body);

  try {
    await invokeWorker({ slash_command: true, response_url });

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        response_type: 'in_channel',
        text: 'Sure thing. Let\'s see what we can find...'
      })
    });
  } catch (err) {
    callback(err);
  }
};

exports.worker = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(event);
  const { response_url } = event;

  try {
    const results = await collect();
    await notify(results, response_url);

    callback(null, {
      success: true,
      results
    });
  } catch (err) {
    callback(err);
  }
};

/**
 * Invoke worker lambda to process message
 * @param {Object} message
 * @returns {Promise}
 */
const invokeWorker = message => {
  return new Promise(resolve => {
    lambda.invoke(
      {
        FunctionName: config.worker_function,
        InvocationType: 'Event',
        Payload: JSON.stringify(message)
      },
      err => {
        if (err) console.log('failed to execute worker: ', message, err);
        resolve();
      }
    );
  });
};
