var flag = require('./flag');
var objDisplay = require('./objDisplay');

/**
 *
 * @param {Promise} object
 * @param {String} name
 * @param {Function} getter
 * @param {Boolean} hasAssertion
 */
module.exports = function(object, name, getter, hasAssertion, isProperty, args) {
  var handlers = flag(this, 'handlers') || [];

  if (handlers.length === 0) {
    object
      .then(result => {
        flag(this, 'object', result);
        var actionFn = flag(this, 'actionFn');
        var queueActionFn;

        var currentHandlers = flag(this, 'handlers');
        var handler;
        var assertionName = [''];
        var assertions = [];
        var valueDisplay = objDisplay(result);
        queueActionFn = actionFn();

        while (currentHandlers.length) {
          handler = currentHandlers.shift();

          assertionName.push(handler.isProperty ? handler.name : `${handler.name}(${objDisplay(handler.args)})`);

          if (handler.hasAssertion) {
            assertions.push(handler.action);
          }
        }

        var action;
        queueActionFn(valueDisplay, assertionName, function() {
          while (assertions.length) {
            action = assertions.shift();
            action(this);
          }

          return flag(this, 'assertMessage');
        }.bind(this));
      })
      .catch((err) => {
        flag(this, 'error', err);
      });
  }

  handlers.push({
    name: name,
    isProperty: isProperty,
    args: args ? args[0] : '',
    hasAssertion: hasAssertion,
    action: function(assertion) {
      return getter.call(assertion);
    }
  });
  flag(this, 'handlers', handlers);
}