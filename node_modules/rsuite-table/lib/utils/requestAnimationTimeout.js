'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.requestAnimationTimeout = exports.cancelAnimationTimeout = void 0;
var _requestAnimationFramePolyfill = _interopRequireDefault(require("dom-lib/requestAnimationFramePolyfill"));
var _cancelAnimationFramePolyfill = _interopRequireDefault(require("dom-lib/cancelAnimationFramePolyfill"));
var cancelAnimationTimeout = exports.cancelAnimationTimeout = function cancelAnimationTimeout(frame) {
  return (0, _cancelAnimationFramePolyfill["default"])(frame.id);
};

/**
 * Recursively calls requestAnimationFrame until a specified delay has been met or exceeded.
 * When the delay time has been reached the function you're timing out will be called.
 *
 * Credit: Joe Lambert (https://gist.github.com/joelambert/1002116#file-requesttimeout-js)
 */
var requestAnimationTimeout = exports.requestAnimationTimeout = function requestAnimationTimeout(callback, delay) {
  var start;
  // wait for end of processing current event handler, because event handler may be long
  Promise.resolve().then(function () {
    start = Date.now();
  });
  var frame = {};
  var _timeout = function timeout() {
    if (Date.now() - start >= delay) {
      callback.call(null);
    } else {
      frame.id = (0, _requestAnimationFramePolyfill["default"])(_timeout);
    }
  };
  frame = {
    id: (0, _requestAnimationFramePolyfill["default"])(_timeout)
  };
  return frame;
};