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

function PeopleFolder(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M5.947 0C6.438 0 6.9.219 7.2.579L8.253 2h4.734c1.061 0 1.931.815 2.008 1.851l.006.149v2.5a.5.5 0 01-.992.09l-.008-.09V4c0-.515-.394-.94-.903-.994L12.987 3H7.748L6.476 1.28a.632.632 0 00-.424-.271L5.947 1H2.014a1.01 1.01 0 00-1.008.891L1 2v9c0 .515.394.94.903.994l.111.006H3a.5.5 0 01.09.992L3 13h-.986a2.008 2.008 0 01-2.008-1.851L0 11V2C0 .945.822.082 1.863.005L2.013 0h3.933z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 6a2 2 0 11.001 3.999A2 2 0 0110 6zm0 1a1 1 0 100 2 1 1 0 000-2zm2 2.5a1.5 1.5 0 112.747.834 2.495 2.495 0 011.247 2.002l.005.164v2a.5.5 0 01-.41.492l-.09.008h-1.5a.5.5 0 01-.09-.992l.09-.008h1v-1.5a1.5 1.5 0 00-1.356-1.493L13.499 11a1.5 1.5 0 01-1.5-1.5zm1.5-.5a.5.5 0 100 1 .5.5 0 000-1zm-7-1a1.5 1.5 0 01.144 2.993l-.289.014A1.5 1.5 0 004.999 12.5V14h1l.09.008a.5.5 0 01-.09.992h-1.5l-.09-.008a.5.5 0 01-.41-.492v-2l.005-.164a2.5 2.5 0 011.249-2.004A1.5 1.5 0 016.499 8zm0 1a.5.5 0 100 1 .5.5 0 000-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 10a3 3 0 013 3v2.5a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5V13a3 3 0 013-3zm0 1a2.001 2.001 0 00-1.995 1.851L8 13v2h4v-2a2.001 2.001 0 00-1.851-1.995L10 11z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(PeopleFolder);
var _default = ForwardRef;
exports["default"] = _default;