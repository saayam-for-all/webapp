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

function FlowStart(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M6 3.999c.198 0 .391.059.555.168l2.998 2.001a1.001 1.001 0 010 1.664L6.555 9.833A1 1 0 015 9.001V5a1 1 0 011-1zM8.998 7L6 5v4.001L8.998 7zM14.5 8a1.5 1.5 0 11-1.408 2.02 1.513 1.513 0 00-1.082.74l-.095.15a2.5 2.5 0 01-1.664 1.058c.05.051.099.106.146.163l.121.157.801 1.108c.195.27.473.461.786.549a1.5 1.5 0 11-.033 1.015 2.442 2.442 0 01-1.451-.836l-.111-.143-.801-1.108A2.107 2.107 0 008 11.999H6.5a.5.5 0 010-1h3.351l.144-.007a1.506 1.506 0 001.156-.745l.095-.151a2.517 2.517 0 011.835-1.086A1.501 1.501 0 0114.5 7.998zm-1 6a.5.5 0 100 1 .5.5 0 000-1zm1-5a.5.5 0 100 1 .5.5 0 000-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 0a7 7 0 017 7 .5.5 0 01-1 0 6 6 0 10-6 6 .5.5 0 010 1A7 7 0 117 0z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(FlowStart);
var _default = ForwardRef;
exports["default"] = _default;