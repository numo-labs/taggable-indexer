'use strict';
const indexer = require('../');

const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
const s3 = new AWS.S3();

function checkInactive (key, callback) {
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
    callback(null, body.active === false);
  });
}

indexer({
  filter: checkInactive
}, (err, result) => {
  if (err) throw err;
  console.log(`Found ${result.length} inactive tiles`);
  console.log(result.join('\n'));
});
