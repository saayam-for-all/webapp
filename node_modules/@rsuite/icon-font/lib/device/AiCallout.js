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

function AiCallout(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M3.852 0c.632 0 1.191.396 1.407.98l.041.128.55 2.034c.13.481.012.992-.307 1.366l-.102.108-1.033.992a1 1 0 00-.275.973C4.497 7.98 5.119 9.119 6 10c.884.884 2.028 1.508 3.433 1.87a1 1 0 00.858-.174l.099-.087 1.009-1.009c.335-.335.807-.49 1.271-.425l.154.03 2.04.51a1.5 1.5 0 011.13 1.319l.006.136v1.757l-.006.149a2 2 0 01-2.144 1.845c-4.272-.319-7.555-1.627-9.851-3.922S.396 6.42.076 2.148L.07 1.999C.07.945.886.081 1.921.004l.149-.005L3.852 0zm-1.78 1a1 1 0 00-1 1l.003.075c.303 4.048 1.521 7.106 3.632 9.218s5.17 3.33 9.218 3.632a1 1 0 001.072-.923l.003-.075V12.17a.501.501 0 00-.299-.458l-.08-.027-2.04-.51a.495.495 0 00-.408.076l-.066.056-1.009 1.009a2 2 0 01-1.915.522c-1.572-.406-2.875-1.116-3.89-2.132-1.012-1.012-1.721-2.31-2.128-3.875A2.001 2.001 0 013.6 5.005l.115-.12 1.033-.992a.5.5 0 00.152-.402l-.016-.089-.55-2.034a.499.499 0 00-.399-.362L3.852.999 2.072 1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 4v3.5a.5.5 0 001 0V6h2v1.5a.5.5 0 001 0V4a2 2 0 10-4 0zm1 0a1 1 0 012 0v1H9V4zM13.5 2a.5.5 0 00-.5.5v5a.5.5 0 001 0v-5a.5.5 0 00-.5-.5z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(AiCallout);
var _default = ForwardRef;
exports["default"] = _default;