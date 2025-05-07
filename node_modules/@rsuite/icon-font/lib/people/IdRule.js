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

function IdRule(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M10 15.5a.5.5 0 00-.5-.5H2a1 1 0 01-.993-.883L1 14V2a1 1 0 01.883-.993L2 1h9a1 1 0 01.993.883L12 2v2.5a.5.5 0 00.992.09L13 4.5V2A2.001 2.001 0 0011.149.005L11 0H2A2.001 2.001 0 00.005 1.851L0 2v12c0 1.054.816 1.918 1.851 1.995L2 16h7.5a.5.5 0 00.5-.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 3v3c1.105 0 2-.395 2-1.5S7.105 3 6 3zM5 2h1c1.657 0 3 .843 3 2.5S7.657 7 6 7H5V2zM8.5 8h2a.5.5 0 010 1h-2a.5.5 0 010-1zM7.5 12h3a.5.5 0 010 1h-3a.5.5 0 010-1zM15.847 11.153a.523.523 0 010 .739L14.739 13l1.108 1.108a.523.523 0 01-.739.739L14 13.739l-1.108 1.108a.523.523 0 01-.739-.739L13.261 13l-1.108-1.108a.523.523 0 01.739-.739L14 12.261l1.108-1.108a.523.523 0 01.739 0zM15.084 6.223a.5.5 0 01.875.475l-.043.079-2 3a.501.501 0 01-.773.074l-.06-.074-1-1.5a.5.5 0 01.776-.625l.057.07.584.874 1.584-2.374zM3 2h1v5H3z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(IdRule);
var _default = ForwardRef;
exports["default"] = _default;