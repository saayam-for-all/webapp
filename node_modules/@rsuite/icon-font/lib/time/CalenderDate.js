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

function CalenderDate(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M4.5 0a.5.5 0 01.5.5V2h6V.5a.5.5 0 011 0V2h1.5A1.5 1.5 0 0115 3.5v10a1.5 1.5 0 01-1.5 1.5h-2a.5.5 0 010-1h2a.5.5 0 00.5-.5V6H2v7.5a.5.5 0 00.5.5h5a.5.5 0 010 1h-5A1.5 1.5 0 011 13.5v-10A1.5 1.5 0 012.5 2H4V.5a.5.5 0 01.5-.5zM14 5V3.5a.5.5 0 00-.5-.5H12v2h2zm-3 0V3H5v2h6zM4 5V3H2.5a.5.5 0 00-.5.5V5h2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.691 7.038A.5.5 0 0112 7.5v5a.5.5 0 01-1 0V8.707l-.146.146a.5.5 0 01-.707-.707l1-1a.499.499 0 01.545-.108zM5 8.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v.086a.316.316 0 01-.028.141c-.012.022-.021.028-.028.031C6.712 8.862 6.261 9 5.5 9a.5.5 0 000 1c.889 0 1.317.415 1.477.616.002.003.023.033.023.12v.764a.5.5 0 01-.5.5h-1c-.276 0-.5-.224-.5-.5a.5.5 0 00-1 0A1.5 1.5 0 005.5 13h1A1.5 1.5 0 008 11.5v-.764c0-.223-.05-.503-.241-.743a2.396 2.396 0 00-.346-.352C7.85 9.412 8 8.953 8 8.586V8.5A1.5 1.5 0 006.5 7h-1A1.5 1.5 0 004 8.5a.5.5 0 001 0z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(CalenderDate);
var _default = ForwardRef;
exports["default"] = _default;