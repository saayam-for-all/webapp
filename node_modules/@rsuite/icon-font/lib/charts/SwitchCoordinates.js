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

function SwitchCoordinates(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 1a.5.5 0 01.5.5V12h11.5a.5.5 0 010 1h-12a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5zM.5 11h1a.5.5 0 010 1h-1a.5.5 0 010-1zM.5 8h1a.5.5 0 010 1h-1a.5.5 0 010-1zM.5 5h1a.5.5 0 010 1h-1a.5.5 0 010-1zM.5 2h1a.5.5 0 010 1h-1a.5.5 0 010-1zM5.5 14h1a.5.5 0 010 1h-1a.5.5 0 010-1zM9.5 14h1a.5.5 0 010 1h-1a.5.5 0 010-1zM13.5 14h1a.5.5 0 010 1h-1a.5.5 0 010-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6.089 3.216l.058-.069 2-2a.5.5 0 01.765.638l-.058.069L7.706 3H11.5a1.5 1.5 0 011.493 1.356L13 4.5v3.794l1.146-1.148a.5.5 0 01.638-.058l.069.058a.5.5 0 01.058.638l-.058.069-2 2a.5.5 0 01-.638.058l-.069-.058-2-2a.5.5 0 01.638-.765l.069.058 1.146 1.148V4.5a.5.5 0 00-.41-.492L11.499 4H7.705l1.148 1.146a.5.5 0 01.058.638l-.058.069a.5.5 0 01-.638.058l-.069-.058-2-2a.5.5 0 01-.058-.638z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SwitchCoordinates);
var _default = ForwardRef;
exports["default"] = _default;