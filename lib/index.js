'use strict';

const touch = require('./touch');
const reindex = require('./reindex');

module.exports = function (options, callback) {
  options = options || {};
  if (typeof options.filter !== 'function') {
    callback(new Error('options.filter must be a function'));
  }
  const prefix = options.prefix || 'ci';
  const actor = options.actor || (options.touch ? touch : (key, cb) => { cb(); });
  reindex(prefix, options.filter, actor, callback);
};
