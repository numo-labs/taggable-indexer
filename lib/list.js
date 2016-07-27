'use strict';
const AWS = require('aws-sdk');

AWS.config.region = 'eu-west-1';

const s3 = new AWS.S3();

function list (prefix, startToken, callback) {
  const params = {
    Bucket: 'numo-taggy',
    Prefix: prefix
  };
  if (startToken) {
    params.ContinuationToken = startToken;
  }
  s3.listObjectsV2(params, (err, data) => {
    if (err) { return callback(err); }

    const tiles = data.Contents;
    if (data.IsTruncated) {
      list(prefix, data.NextContinuationToken, (err, nextSet) => {
        callback(err, tiles.concat(nextSet));
      });
    } else {
      callback(null, tiles);
    }
  });
}

module.exports = list;
