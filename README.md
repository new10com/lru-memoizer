# @new10com/lru-memoizer

[![NPM version][npm-image]][npm-url]
[![NPM downloads][download-image]][npm-url]
[![Install Size][install-size-image]][install-size-url]
[![Release][release-image]][release-url]

[npm-image]: https://img.shields.io/npm/v/@new10com/lru-memoizer.svg
[npm-url]: https://www.npmjs.org/package/@new10com/lru-memoizer
[download-image]: https://img.shields.io/npm/dm/@new10com/lru-memoizer.svg
[install-size-image]: https://packagephobia.now.sh/badge?p=@new10com/lru-memoizer
[install-size-url]: https://packagephobia.now.sh/result?p=@new10com/lru-memoizer
[release-image]: https://img.shields.io/github/release/new10com/lru-memoizer.svg
[release-url]: https://github.com/new10com/lru-memoizer/releases/latest

Memoize functions results using an lru-cache.

## Installation

```
npm i @new10com/lru-memoizer
```

## Intro

**Forked from https://github.com/jfromaniello/lru-memoizer**

This module uses an [lru-cache](https://github.com/isaacs/node-lru-cache) internally to cache the results of an async function.

The `load` function can have N parameters and the last one must be a callback. The callback should be an errback (first parameter is `err`).

The `hash` function purpose is generate a custom hash for storing results. It has all the arguments applied to it minus the callback, and must return an string synchronous.

The `freeze` option (defaults to **false**) allows you to deep-freeze the result of the async function.

The `clone` option (defaults to **false**) allows you to deep-clone the result every time is returned from the cache.

## Usage

```javascript

var memoizer = require('@new10com/lru-memoizer');

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

## Sync lru-memoizer

Use `memoizer.sync` to cache things that are slow to calculate or methods returning promises.

```
var memoizer = require('@new10com/lru-memoizer');
var memoizedGet = memoizer.sync({
  //defines how to load the resource when
  //it is not in the cache.
  load: function (params) {
    //return something_hard_to_compute;s
  },

  //defines how to create a cache key from the params.
  hash: function (params) {
    return params.foo;
  },

  //all other params for the LRU cache.
  max: 100,
  maxAge: 1000 * 60
});
```

## Similar modules

This module is very similar to [async-cache](https://github.com/isaacs/async-cache), the main difference is the `hash` function.

## License

MIT 2016 - José F. Romaniello
