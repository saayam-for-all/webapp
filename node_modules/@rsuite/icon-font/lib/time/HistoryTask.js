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

function HistoryTask(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M2 .5v1.601A7 7 0 0114 7a.5.5 0 01-1 0A6 6 0 002.528 3H4.5a.5.5 0 010 1h-3a.5.5 0 01-.5-.5v-3a.5.5 0 011 0zM1.071 7.924a.5.5 0 00-.988.152 6.995 6.995 0 002.61 4.441.5.5 0 10.616-.788 5.994 5.994 0 01-2.237-3.806zM8.854 8.854a.5.5 0 00-.707-.707L6.501 9.793l-.646-.646a.5.5 0 00-.707.707l1 1a.5.5 0 00.707 0l2-2zM10 9.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zM10 12.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zM10.5 15a.5.5 0 000 1h5a.5.5 0 000-1h-5zM6 15.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM8.854 11.146a.5.5 0 010 .707l-2 2a.5.5 0 01-.707 0l-1-1a.5.5 0 01.707-.707l.646.646 1.646-1.646a.5.5 0 01.707 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.825 4.88a.5.5 0 10-.651-.759L6.878 6.946 3.637 6.02a.5.5 0 10-.275.961l3.5 1a.502.502 0 00.463-.101l3.5-3z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(HistoryTask);
var _default = ForwardRef;
exports["default"] = _default;