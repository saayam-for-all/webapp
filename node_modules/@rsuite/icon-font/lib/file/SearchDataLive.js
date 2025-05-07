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

function SearchDataLive(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M12 4.5V2a1 1 0 00-1-1H2a1 1 0 00-1 1v12a1 1 0 001 1h4.5a.5.5 0 010 1H2a2 2 0 01-2-2V2a2 2 0 012-2h9a2 2 0 012 2v2.5a.5.5 0 01-1 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 6.5a.5.5 0 01.5-.5h2a.5.5 0 01.41.787A4.492 4.492 0 019.5 5c.764 0 1.484.191 2.115.527a.5.5 0 11-.471.882 3.5 3.5 0 101.745 2.215.5.5 0 11.969-.249c.093.36.142.737.142 1.125a4.48 4.48 0 01-.984 2.809l2.838 2.838a.5.5 0 01-.707.707l-2.838-2.838A4.48 4.48 0 019.5 14a4.49 4.49 0 01-3.59-1.787.5.5 0 01-.41.787h-2a.5.5 0 010-1h2a.5.5 0 01.39.187C5.331 11.437 5 10.507 5 9.5s.331-1.937.89-2.687A.5.5 0 015.5 7h-2a.5.5 0 01-.5-.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 9.5a.5.5 0 01-.5.5h-1a.5.5 0 010-1h1a.5.5 0 01.5.5zM3.5 3a.5.5 0 000 1h6a.5.5 0 000-1h-6zM10 7.5a.5.5 0 00-1 0v2a.5.5 0 00.276.447l2 1a.5.5 0 00.447-.895L9.999 9.19V7.499z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SearchDataLive);
var _default = ForwardRef;
exports["default"] = _default;