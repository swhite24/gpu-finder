const AWS = require('aws-sdk');
const { collect } = require('./services/collector');
const { notify } = require('./services/slack');
const config = require('./config');

const lambda = new AWS.Lambda({ region: config.region });

exports.handler = async (event, context, callback) => {
  console.log(event);
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await invokeWorker({ slash_command: true });

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
  console.log(event);
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const results = await collect();
    await notify(results);

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
