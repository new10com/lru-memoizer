Memoize functions results using an lru-cache.

## Installation

```
npm i lru-memoizer --save
```

## Intro

This module uses an [lru-cache](https://github.com/isaacs/node-lru-cache) internally to cache the results of an async function.

The `load` function can have N parameters and the last one must be a callback. The callback should be an errback (first parameter is `err`).

The `hash` function purpose is generate a custom hash for storing results. It has all the arguments applied to it minus the callback, and must return an string synchronous.

## Usage

```javascript

var memoizer = require('lru-memoizer');

var memoizedGet = memoizer({
  //defines how to load the resource when
  //it is not in the cache.
  load: function (options, callback) {
    request.get(options, callback);
  },

  //defines how to create a cache key from the params.
  hash: function (options) {
    return options.url + qs.stringify(options.qs);
  },

  //all other params for the LRU cache.
  max: 100,
  maxAge: 1000 * 60
});

memoizedGet({
  url: 'https://google.com',
  qs: { foo: 123 }
}, function (err, result, body) {
 //console.log(body);
})

```

## Similar modules

This module is very similar to [async-cache](https://github.com/isaacs/async-cache), the main difference is the `hash` function.

## License

MIT 2016 - José F. Romaniello
