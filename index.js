const LRU = require('lru-cache');
const _ = require('lodash');
const lru_params =  [ 'max', 'maxAge', 'length', 'dispose', 'stale' ];

module.exports = function (options) {
  var cache = new LRU(_.pick(options, lru_params));
  var load = options.load;
  var hash = options.hash;

  var result = function () {
    var args = _.toArray(arguments);
    var parameters = args.slice(0, -1);
    var callback = args.slice(-1).pop();

    var key = hash.apply(options, parameters);

    var fromCache = cache.get(key);

    if (fromCache) {
      return setImmediate.apply(null, [callback, null].concat(fromCache));
    }

    load.apply(null, parameters.concat(function (err) {
      if (err) {
        return callback(err);
      }

      cache.set(key, _.toArray(arguments).slice(1));

      return callback.apply(null, arguments);

    }));

  };

  result.keys = cache.keys.bind(cache);

  return result;
};
