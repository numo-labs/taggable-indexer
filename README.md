# taggable-indexer
Runs queries on taggable data in S3 and can perform filtered re-indexing

## Usage

```javascript
const indexer = require('./');

indexer({
  filter: (key, callback) => {
    const meetsCondition = sometest(key);
    callback(err, meetsCondition);
  },
  touch: true // touch option set as true will force re-indexing
}, (err, list) => {
  // list of files that were re-indexed
});
```

## Options

* `filter` - function - required - async filter function applied to the file list - takes two arguments, file path and callback
* `actor` - function - optional - function to run against files which match filter - takes two arguments, file path and callback - defaults to no-op
* `touch` - boolean - optional - if set to true sets the default `actor` function to touch the file in S3 and force a re-index
* `prefix` - string - optional - S3 prefix to search within - default `'ci'`

See examples folder for more usage.

## Required Environment Variables

```
export AWS_REGION=[redacted]
export AWS_IAM_ROLE=[redacted]
export AWS_ACCESS_KEY_ID=[redacted]
export AWS_SECRET_ACCESS_KEY=[redacted]
```

If using [taggable-searcher](https://github.com/numo-labs/taggable-searcher) for a condition then you will additionally also require `ELASTICSEARCH_ENDPOINT`.
