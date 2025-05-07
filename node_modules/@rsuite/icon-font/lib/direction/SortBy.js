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

function SortBy(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M.216 12.089a.5.5 0 01.638.058L2.5 13.794l1.646-1.647.069-.058a.5.5 0 01.638.765l-2 2-.069.058a.5.5 0 01-.638-.058l-2-2-.058-.069a.5.5 0 01.058-.638zM9.5 13a.5.5 0 010 1h-2a.5.5 0 010-1h2zm2-4a.5.5 0 010 1h-4a.5.5 0 010-1h4zm2-4a.5.5 0 010 1h-6a.5.5 0 010-1h6zM2.784 1.089l.069.058 2 2a.5.5 0 01-.638.765l-.069-.058L2.5 2.207.854 3.854a.5.5 0 01-.638.058l-.069-.058a.5.5 0 01-.058-.638l.058-.069 2-2a.5.5 0 01.638-.058zM15.5 1a.5.5 0 010 1h-8a.5.5 0 010-1h8z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SortBy);
var _default = ForwardRef;
exports["default"] = _default;