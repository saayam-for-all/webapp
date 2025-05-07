"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function DonutChart(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M5.993.254l1.016 4.914a3 3 0 103.747 4.018l.068-.171 4.923.988A8 8 0 115.748.321l.245-.067zm-.751 1.309l-.189.085a7 7 0 109.3 9.297l.082-.186-3.06-.614-.078.122a4.002 4.002 0 01-3.085 1.728L8 12.001a4 4 0 01-2.211-7.334l.083-.054-.63-3.049z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 0a8 8 0 017.996 7.751L16 8h-5a3 3 0 00-2.824-2.995L8 5V0zm1 1.071v3.055l.155.043a4.008 4.008 0 012.675 2.675l.042.155h3.055l-.027-.182a7.006 7.006 0 00-5.719-5.719l-.182-.028z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(DonutChart);
var _default = ForwardRef;
exports["default"] = _default;