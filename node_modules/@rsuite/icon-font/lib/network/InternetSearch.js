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

function InternetSearch(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M7.5 0a7.5 7.5 0 017.498 7.334 5.501 5.501 0 00-1.14-1.19 6.479 6.479 0 00-1.339-2.775l-.319.245a8.084 8.084 0 01-.785.426c.116.366.213.734.292 1.093a5.571 5.571 0 00-1-.129 11.557 11.557 0 00-.154-.603c-.817.3-1.713.515-2.554.579v.619a5.533 5.533 0 00-1 .657V4.979C6.158 4.915 5.262 4.7 4.445 4.4c-.236.831-.39 1.731-.433 2.599h2.244a5.428 5.428 0 00-.657 1H4.012c.044.867.197 1.767.433 2.599.181-.066.367-.129.555-.187l-.001.088c0 .319.027.633.08.937-.106.035-.212.072-.316.11.283.723.631 1.347 1.02 1.785a5.534 5.534 0 001.55 1.667A7.5 7.5 0 017.499 0zM3.917 11.906a6.097 6.097 0 00-.757.434c.459.412.978.76 1.541 1.029a7.684 7.684 0 01-.785-1.463zM3.017 8H1.018a6.47 6.47 0 001.462 3.63l.319-.245c.236-.147.498-.289.778-.423a13.243 13.243 0 01-.56-2.963zm-.536-4.631A6.476 6.476 0 001.019 7h1.999c.053-.811.229-1.892.567-2.96a8.084 8.084 0 01-.785-.426l-.319-.245zM8 1.019v2.958a9.106 9.106 0 002.236-.523C9.757 2.23 9.091 1.289 8.352 1.056A6.876 6.876 0 008 1.02zm-1 0a6.762 6.762 0 00-.352.036c-.739.232-1.405 1.173-1.884 2.398A9.016 9.016 0 007 3.976zm3.24.585c.327.446.602.958.83 1.496.286-.139.546-.287.769-.44a6.54 6.54 0 00-1.599-1.057zm-5.48 0a6.492 6.492 0 00-1.599 1.057c.223.152.483.301.769.44a7.405 7.405 0 01.83-1.496z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.408 12.449l2.463 2.715a.5.5 0 11-.74.672l-2.396-2.641a3.5 3.5 0 11.674-.745zM10.5 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(InternetSearch);
var _default = ForwardRef;
exports["default"] = _default;