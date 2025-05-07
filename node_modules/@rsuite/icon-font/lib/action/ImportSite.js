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

function ImportSite(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M1 11v3.5a.5.5 0 00.41.492L1.5 15H2v-4H1zm0-1h4v1H3v4h5.5a.5.5 0 00.492-.41L9 14.5V11a.5.5 0 01.992-.09L10 11v3.5a1.5 1.5 0 01-1.356 1.493L8.5 16h-7a1.5 1.5 0 01-1.493-1.356L0 14.5v-5a1.5 1.5 0 011.356-1.493L1.5 8h1.857a.5.5 0 01.09.992L3.357 9H1.5a.5.5 0 00-.492.41L1 9.5v.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.426 6.005l.032-.004.054-.002a.42.42 0 01.062.005L7.5 5.999l.053.003.075.014.063.021.093.051.057.046 2.012 2.012a.5.5 0 01-.638.765l-.069-.058L8 7.705v2.794a.5.5 0 01-1 0V7.705L5.854 8.853a.5.5 0 01-.638.058l-.069-.058a.5.5 0 01-.058-.638l.058-.069 2-2 .042-.037.062-.042.059-.029.062-.021.054-.011z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 0a3.5 3.5 0 013.495 3.308L12 3.5l-.001.028.129.015a4.5 4.5 0 013.867 4.245L16 8a4.5 4.5 0 01-4.5 4.5.5.5 0 010-1A3.5 3.5 0 0015 8a3.498 3.498 0 00-3.29-3.495l-.19-.005-.042.002a.5.5 0 01-.513-.583 2.5 2.5 0 10-4.935-.803.5.5 0 01-.57.419A3 3 0 002 6.5a.5.5 0 01-1 0 4 4 0 013.8-3.995L5 2.5l.145.004.026-.087A3.5 3.5 0 018.308.006l.191-.005z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(ImportSite);
var _default = ForwardRef;
exports["default"] = _default;