/*!
 * Chai - addProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var Assertion = require('../assertion');
var flag = require('./flag');
var isProxyEnabled = require('./isProxyEnabled');
var transferFlags = require('./transferFlags');
var deferAssertion = require('./deferAssertion');

/**
 * ### .addProperty(ctx, name, getter)
 *
 * Adds a property to the prototype of an object.
 *
 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.instanceof(Foo);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.foo;
 *
 * @param {Object} ctx object to which the property is added
 * @param {String} name of property to add
 * @param {Function} getter function to be used for name
 * @namespace Utils
 * @name addProperty
 * @api public
 */

module.exports = function addProperty(ctx, name, getter) {
  var hasAssertion = true;

  if (getter === undefined) {
    hasAssertion = false;
    getter = function () {
      flag(this, name, true);
      return this;
    }
  } else {
    hasAssertion = ![
      'name', 'deep', 'nested', 'own', 'ordered', 'any', 'all',
    ].includes(name);
  }

  Object.defineProperty(ctx, name,
    { get: function propertyGetter() {
        // Setting the `ssfi` flag to `propertyGetter` causes this function to
        // be the starting point for removing implementation frames from the
        // stack trace of a failed assertion.
        //
        // However, we only want to use this function as the starting point if
        // the `lockSsfi` flag isn't set and proxy protection is disabled.
        //
        // If the `lockSsfi` flag is set, then either this assertion has been
        // overwritten by another assertion, or this assertion is being invoked
        // from inside of another assertion. In the first case, the `ssfi` flag
        // has already been set by the overwriting assertion. In the second
        // case, the `ssfi` flag has already been set by the outer assertion.
        //
        // If proxy protection is enabled, then the `ssfi` flag has already been
        // set by the proxy getter.
        if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
          flag(this, 'ssfi', propertyGetter);
        }

        var newAssertion = new Assertion();
        var result;
        var object = flag(this, 'object');

        if (object instanceof Promise) {
          deferAssertion.call(this, object, name, getter, hasAssertion, true);
        } else {
          result = getter.call(this);
        }

        if (result !== undefined) {
          return result;
        }

        transferFlags(this, newAssertion);
        return newAssertion;
      }
    , configurable: true
  });
};
