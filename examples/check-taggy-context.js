'use strict';
const indexer = require('../');

const taggy = require('taggable-searcher');

function checkTaggyContext (key, callback) {
  const tag = key.split('/').pop().replace(/\.json$/, '');
  taggy.suggest({ text: tag, context: 'taggy' }, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result.data.hits.hit.length === 0);
  });
}

indexer({
  filter: checkTaggyContext,
  touch: false // set to true to force re-indexing
}, (err, result) => {
  if (err) throw err;
  console.log(`Found ${result.length} tags without a "taggy" context in elasticsearch`);
  console.log(result.join('\n'));
});
