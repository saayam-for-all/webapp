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

function WechatCustomerOutline(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M7.377 0a5.78 5.78 0 015.516 4.052A1.5 1.5 0 0114 5.5V7l-1-.5v-1a.5.5 0 00-.5-.5H12v1.5h-1v-2a.5.5 0 01.5-.5l.314.001a4.783 4.783 0 00-4.219-2.996L7.377 1h-.754a4.78 4.78 0 00-4.437 3.001L2.5 4a.5.5 0 01.5.5V8h1.085a1.5 1.5 0 11.001 1.001l-1.61.001c.19.313.426.606.704.87l.388.368-.263 1.047 1.124-.556.373.136c.545.198 1.13.301 1.732.301.338 0 .672-.033.996-.096l.179.899a6.05 6.05 0 01-1.175.114 6.001 6.001 0 01-2.049-.357l-2.563 1.274.62-2.466A5.048 5.048 0 011.431 9l.068.002a1.5 1.5 0 01-1.5-1.5v-2a1.5 1.5 0 011.107-1.448A5.78 5.78 0 016.381.007l.24-.005h.754zM5.5 8a.5.5 0 100 1 .5.5 0 000-1zM2 5h-.5a.5.5 0 00-.492.41L1 5.5v2a.5.5 0 00.41.492L1.5 8H2V5zm3.5-1a.5.5 0 110 1 .5.5 0 010-1zm3 0a.5.5 0 110 1 .5.5 0 010-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.5 7c2.485 0 4.5 1.813 4.5 4.05 0 1.157-.539 2.2-1.403 2.938L15.1 16l-2.2-1.1c-.441.13-.911.2-1.4.2-2.485 0-4.5-1.813-4.5-4.05S9.015 7 11.5 7zm0 1C9.545 8 8 9.39 8 11.05s1.545 3.05 3.5 3.05c.308 0 .611-.035.902-.102l.216-.057.378-.111.607.302-.125-.502.471-.402c.673-.575 1.052-1.353 1.052-2.178 0-1.66-1.545-3.05-3.5-3.05zm-1 2a.5.5 0 110 1 .5.5 0 010-1zm2 0a.5.5 0 110 1 .5.5 0 010-1z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(WechatCustomerOutline);
var _default = ForwardRef;
exports["default"] = _default;