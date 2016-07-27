'use strict';
const indexer = require('../');

const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
const s3 = new AWS.S3();

function checkLabels (key, callback) {
  s3.getObject({
    Bucket: 'numo-taggy',
    Key: key
  }, (err, data) => {
    if (err) { return callback(err); }
    let body;
    try {
      body = JSON.parse(data.Body.toString());
    } catch (e) {
      return callback(e);
    }
    if (!body.markets) {
      return callback(null, false);
    }
    let isSearch = false;
    Object.keys(body.markets).forEach((market) => {
      Object.keys(body.markets[market]).forEach((lang) => {
        if (body.markets[market][lang].label === 'search') {
          isSearch = true;
        }
      });
    });
    callback(null, isSearch);
  });
}

indexer({
  filter: checkLabels
}, (err, result) => {
  if (err) throw err;
  console.log(`Found ${result.length} tags with a "search" label`);
  console.log(result.join('\n'));
});
