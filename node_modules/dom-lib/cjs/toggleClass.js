"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = toggleClass;

var _hasClass = _interopRequireDefault(require("./hasClass.js"));

var _addClass = _interopRequireDefault(require("./addClass.js"));

var _removeClass = _interopRequireDefault(require("./removeClass.js"));

/**
 * Toggle a class on an element
 * @param target The DOM element
 * @param className The class name
 * @returns The DOM element
 */
function toggleClass(target, className) {
  if ((0, _hasClass["default"])(target, className)) {
    return (0, _removeClass["default"])(target, className);
  }

  return (0, _addClass["default"])(target, className);
}

module.exports = exports.default;