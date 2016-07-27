'use strict';

const AWS = require('aws-sdk');

AWS.config.region = 'eu-west-1';

const s3 = new AWS.S3();

function touch (key, callback) {
  s3.copyObject({
    Bucket: 'numo-taggy',
    CopySource: `numo-taggy/${key}`,
    Key: key,
    MetadataDirective: 'REPLACE'
  }, callback);
}

module.exports = touch;
