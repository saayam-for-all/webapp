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

function SendToDashboard(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M2 1a1 1 0 00-1 1v3a1 1 0 001 1h4a1 1 0 001-1V2a1 1 0 00-1-1H2zm0-1h4a2 2 0 012 2v3a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm9 1a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V2a1 1 0 00-1-1h-3zm0-1h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V2a2 2 0 012-2zM10.902 7.51a.5.5 0 01.579.627l-.028.075-3.5 7.5a.5.5 0 01-.711.217l-.072-.052-2.138-1.871-1.157 1.324a.5.5 0 01-.869-.24l-.007-.089v-2.76l-2.312-1.85a.5.5 0 01.123-.854l.091-.027 10-2zm-.774 1.173l-7.979 1.596 1.461 1.168 3.252-.928c.423-.121.755.31.602.671l-.037.071-.051.068-1.685 1.924 1.637 1.432 2.8-6.002zm-4.621 3.263l-.987.282.42.366.567-.648zM14 9c1.054 0 1.918.816 1.995 1.851L16 11v3a2.001 2.001 0 01-1.851 1.995L14 16h-3a.5.5 0 01-.09-.992L11 15h3a1 1 0 00.993-.883L15 14v-3a1 1 0 00-.883-.993L14 10h-1a.5.5 0 01-.09-.992L13 9h1z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SendToDashboard);
var _default = ForwardRef;
exports["default"] = _default;