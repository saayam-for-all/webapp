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

function Log(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v2.5a.5.5 0 001 0V2a2 2 0 00-2-2H2a2 2 0 00-2 2v12a2 2 0 002 2h3.5a.5.5 0 000-1H2a1 1 0 01-1-1V2a1 1 0 011-1h9a1 1 0 011 1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 6a.5.5 0 000 1h2a.5.5 0 000-1h-2zM3 3.5a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5zM9 11.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM12.5 11a.5.5 0 000 1h1a.5.5 0 000-1h-1zM12 13.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM9.5 13a.5.5 0 000 1h1a.5.5 0 000-1h-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 7v-.5a.5.5 0 011 0V7h3v-.5a.5.5 0 011 0V7a2 2 0 012 2v5a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2zm0 1a1 1 0 00-1 1h1V8zm1 0v1h3V8h-3zm-2 2v4a1 1 0 001 1h5a1 1 0 001-1v-4H8zm6-2v1h1a1 1 0 00-1-1zM3.5 9a.5.5 0 000 1h2a.5.5 0 000-1h-2zM3 12.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(Log);
var _default = ForwardRef;
exports["default"] = _default;