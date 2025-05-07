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

function Indirect(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M14.5 6a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 0114.5 6zm0 1a.5.5 0 100 1 .5.5 0 000-1zm-13-1a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 011.5 6zm0 1a.5.5 0 100 1 .5.5 0 000-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.75 2a2.25 2.25 0 012.245 2.096L12 4.25V6.5a.5.5 0 00.41.492L12.5 7h1a.5.5 0 01.09.992L13.5 8h-1a1.5 1.5 0 01-1.493-1.356L11 6.5V4.25a1.25 1.25 0 00-2.494-.128L8.5 4.25v7.5a2.25 2.25 0 01-4.495.154L4 11.75V8.5a.5.5 0 00-.41-.492L3.5 8h-1a.5.5 0 01-.09-.992L2.5 7h1a1.5 1.5 0 011.493 1.356L5 8.5v3.25a1.25 1.25 0 002.494.128l.006-.128v-7.5A2.25 2.25 0 019.75 2z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(Indirect);
var _default = ForwardRef;
exports["default"] = _default;