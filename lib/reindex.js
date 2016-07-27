'use strict';

const async = require('async');
const Progress = require('cli-progress');

const list = require('./list');

function reindex (prefix, condition, actor, callback) {
  condition = condition || (_ => true);
  list(prefix, null, (err, tiles) => {
    if (err) { return callback(err); }
    const keys = tiles
      .map(tile => tile.Key)
      .filter(key => key.match(/\.json$/));

    const touched = [];

    const bar = new Progress.Bar({ etaBuffer: 100 });
    bar.start(keys.length, 0);

    function updateProgress () {
      bar.update(bar.value + 1);
    }

    async.eachLimit(keys, 10, (tile, callback) => {
      function done (err) {
        updateProgress();
        callback(err);
      }
      condition(tile, (err, shouldTouch) => {
        if (err) { return callback(err); }
        if (shouldTouch) {
          touched.push(tile);
          actor(tile, done);
        } else {
          done();
        }
      });
    }, (err) => {
      bar.stop();
      if (err) { return callback(err); }
      callback(err, touched);
    });
  });
}

module.exports = reindex;
