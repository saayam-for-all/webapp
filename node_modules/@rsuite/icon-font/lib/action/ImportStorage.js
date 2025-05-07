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

function ImportStorage(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M2 12h6a2 2 0 01.149 3.995L8 16H2a2 2 0 01-.149-3.995L2 12zm0 1a1 1 0 00-.117 1.993L2 15h6a1 1 0 00.117-1.993L8 13H2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 9a.5.5 0 01.09.992L3.5 10H2a1 1 0 00-.117 1.993L2 12h1.5a.5.5 0 01.09.992L3.5 13H2a2 2 0 01-.149-3.995L2 9h1.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4.5 6a.5.5 0 01.09.992L4.5 7H2a1 1 0 00-.117 1.993L2 9h2.5a.5.5 0 01.09.992L4.5 10H2a2 2 0 01-.149-3.995L2 6h2.5zM2 14h1v1H2v-1zM2 11h1v1H2v-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 8h1v1H2V8zM8.426 6.005l.032-.004.054-.002a.42.42 0 01.062.005L8.5 5.999l.053.003.075.014.063.021.093.051.057.046 2.012 2.012a.5.5 0 01-.638.765l-.069-.058L9 7.705v2.794a.5.5 0 01-1 0V7.705L6.854 8.853a.5.5 0 01-.638.058l-.069-.058a.5.5 0 01-.058-.638l.058-.069 2-2 .042-.037.062-.042.059-.029.062-.021.054-.011z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 0a3.5 3.5 0 013.495 3.308L12 3.5l-.001.028.129.015a4.5 4.5 0 013.867 4.245L16 8a4.5 4.5 0 01-4.5 4.5.5.5 0 010-1A3.5 3.5 0 0015 8a3.498 3.498 0 00-3.29-3.495l-.19-.005-.042.002a.5.5 0 01-.513-.583 2.5 2.5 0 10-4.935-.803.5.5 0 01-.57.419 2.991 2.991 0 00-2.694.963.499.499 0 11-.744-.668 3.994 3.994 0 012.749-1.324L5 2.5l.145.004.026-.087A3.5 3.5 0 018.308.006l.191-.005z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(ImportStorage);
var _default = ForwardRef;
exports["default"] = _default;