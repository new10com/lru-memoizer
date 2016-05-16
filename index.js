const LRU        = require('lru-cache');
const _          = require('lodash');
const lru_params = [ 'max', 'maxAge', 'length', 'dispose', 'stale' ];

module.exports = function (options) {
  const cache = new LRU(_.pick(options, lru_params));
  const load  = options.load;
  const hash  = options.hash;
  const loading  = new Map();

  const result = function () {
    const args       = _.toArray(arguments);
    const parameters = args.slice(0, -1);
    const callback   = args.slice(-1).pop();

    var key;

    if (parameters.length === 0 && !hash) {
      //the load function only receives callback.
      key = '_';
    } else {
      key = hash.apply(options, parameters);
    }

    var fromCache = cache.get(key);

    if (fromCache) {
      return callback.apply(null, [null].concat(fromCache));
    }

    if (!loading.get(key)) {
      loading.set(key, []);

      load.apply(null, parameters.concat(function (err) {
        if (err) {
          loading.get(key).forEach(function (callback) {
            callback(err);
          });
          loading.delete(key);
          return callback(err);
        }

        const args = _.toArray(arguments);

        cache.set(key, args.slice(1));

        //immediately call every other callback waiting
        loading.get(key).forEach(function (callback) {
          callback.apply(null, args);
        });

        loading.delete(key);
        /////////

        callback.apply(null, args);
      }));
    } else {
      loading.get(key).push(callback);
    }
  };

  result.keys = cache.keys.bind(cache);

  return result;
};


module.exports.sync = function (options) {
  var cache = new LRU(_.pick(options, lru_params));
  var load = options.load;
  var hash = options.hash;

  var result = function () {
    var args = _.toArray(arguments);

    var key = hash.apply(options, args);

    var fromCache = cache.get(key);

    if (fromCache) {
      return fromCache;
    }

    var result = load.apply(null, args);

    cache.set(key, result);

    return result;
  };

  result.keys = cache.keys.bind(cache);

  return result;
};
