/**
 * Netlify serverless function wrapper for the readiness check API.
 * Deploy to Netlify; the function runs at /.netlify/functions/submit-readiness-check.
 * Set env vars in Netlify: Site settings → Environment variables.
 */

const apiHandler = require('../../api/submit-readiness-check.js');

exports.handler = async (event) => {
  const body = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : (event.body || '');

  const req = {
    method: event.httpMethod,
    body: body,
  };

  let statusCode = 200;
  let responseBody = {};

  const res = {
    setHeader: () => {},
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseBody = data;
    },
  };

  await apiHandler(req, res);

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(responseBody),
  };
};
