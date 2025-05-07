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

function BatchPlus(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 4A1.5 1.5 0 0110 5.5a.5.5 0 01-.992.09L9 5.5a.5.5 0 00-.41-.492L8.5 5h-7a.5.5 0 00-.492.41L1 5.5v9a.5.5 0 00.41.492L1.5 15h5a.5.5 0 01.09.992L6.5 16h-5a1.5 1.5 0 01-1.493-1.356L0 14.5v-9a1.5 1.5 0 011.356-1.493L1.5 4h7z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.5 2a1.5 1.5 0 011.493 1.356L12 3.5v1a.5.5 0 01-.992.09L11 4.5v-1a.5.5 0 00-.41-.492L10.5 3h-8a.5.5 0 01-.09-.992L2.5 2h8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12.5 0a1.5 1.5 0 011.493 1.356L14 1.5v3a.5.5 0 01-.992.09L13 4.5v-3a.5.5 0 00-.41-.492L12.5 1h-8a.5.5 0 01-.09-.992L4.5 0h8zM11.5 15a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm0 1a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.5 9a.5.5 0 01.5.5V11h1.5a.5.5 0 010 1H12v1.5a.5.5 0 01-1 0V12H9.5a.5.5 0 010-1H11V9.5a.5.5 0 01.5-.5z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(BatchPlus);
var _default = ForwardRef;
exports["default"] = _default;