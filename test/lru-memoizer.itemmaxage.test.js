var memoizer = require('./..');
var assert = require('chai').assert;

describe('lru-memoizer (itemMaxAge)', function () {
  var loadTimes = 0, memoized;

  beforeEach(function () {
    loadTimes = 0;
  });

  it('should use default behavior if not configured', function (done) {
    memoized = memoizer({
      load: function (a, b, callback) {
        loadTimes++;
        setTimeout(function () {
          callback(null, a + b);
        }, 100);
      },
      hash: function (a, b) {
        return a + '-' + b;
      },
      max: 10,
      maxAge: 500
    });

    memoized(1,2, function (err, result) {
      assert.isNull(err);
      assert.strictEqual(result, 3);
      assert.strictEqual(loadTimes, 1);

      // Not expired yet.
      setTimeout(function() {
        memoized(1,2, function (err, result) {
          assert.isNull(err);
          assert.strictEqual(result, 3);
          assert.strictEqual(loadTimes, 1);

          // Expired, load times will increase.
          setTimeout(function() {
            memoized(1,2, function (err, result) {
              assert.isNull(err);
              assert.strictEqual(result, 3);
              assert.strictEqual(loadTimes, 2);
              done();
            });
          }, 200);
        });
      }, 400);
    });
  });

  it('should overwrite the default behavior if configured', function (done) {
    var maxAge = 0;
    memoized = memoizer({
      load: function (a, b, callback) {
        loadTimes++;
        setTimeout(function () {
          callback(null, a + b);
        }, 100);
      },
      itemMaxAge: function (result) {
        // In this test, we set the maxAge of the current item to (result*100).
        // If the result is 3, the max age of this item will be 300.
        maxAge = result * 100;
        return maxAge;
      },
      hash: function (a, b) {
        return a + '-' + b;
      },
      max: 10,
      maxAge: 600
    });

    memoized(1,2, function (err, result) {
      assert.isNull(err);
      assert.strictEqual(maxAge, 300);
      assert.strictEqual(result, 3);
      assert.strictEqual(loadTimes, 1);

      // Not expired yet after 200 ms, because the expiration is 300
      setTimeout(function() {
        memoized(1,2, function (err, result) {
          assert.isNull(err);
          assert.strictEqual(maxAge, 300);
          assert.strictEqual(result, 3);
          assert.strictEqual(loadTimes, 1);

          // Expired because now we are at 350 ms (even though gloabl expiration has been set to 600)
          setTimeout(function() {
            memoized(1,2, function (err, result) {
              assert.isNull(err);
              assert.strictEqual(maxAge, 300);
              assert.strictEqual(result, 3);
              assert.strictEqual(loadTimes, 2);

              // Expired again, because 350ms have passed again.
              setTimeout(function() {
                memoized(1,2, function (err, result) {
                  assert.isNull(err);
                  assert.strictEqual(maxAge, 300);
                  assert.strictEqual(result, 3);
                  assert.strictEqual(loadTimes, 3);
                  done();
                });
              }, 350);
            });
          }, 150);
        });
      }, 200);
    });
  });
});
