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

function PeopleRule(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M8 0a3 3 0 110 6 3 3 0 010-6zm0 1a2 2 0 10-.001 3.999A2 2 0 008 1zM3 4a2 2 0 11.001 3.999A2 2 0 013 4zm0 1a1 1 0 100 2 1 1 0 000-2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 6a.5.5 0 010 1 3 3 0 00-2.995 2.824L5 10v5h4a.5.5 0 01.09.992L9 16H5a1 1 0 01-.993-.883L4 15v-5a4 4 0 014-4zM2.474 8.342a.499.499 0 00-.632-.316C.681 8.413.064 9.365.005 10.774L0 11v3.5c0 .276.25.5.5.5s.5-.22.5-.5V11c0-1.133.38-1.766 1.158-2.026a.499.499 0 00.316-.632z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 9h2a.5.5 0 010 1h-2a.5.5 0 010-1zM8.5 13h2a.5.5 0 010 1h-2a.5.5 0 010-1zM15.847 12.153a.523.523 0 010 .739L14.739 14l1.108 1.108a.523.523 0 01-.739.739L14 14.739l-1.108 1.108a.523.523 0 01-.739-.739L13.261 14l-1.108-1.108a.523.523 0 01.739-.739L14 13.261l1.108-1.108a.523.523 0 01.739 0zM15.084 7.223a.5.5 0 01.875.475l-.043.079-2 3a.501.501 0 01-.773.074l-.06-.074-1-1.5a.5.5 0 01.776-.625l.057.07.584.874 1.584-2.374z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(PeopleRule);
var _default = ForwardRef;
exports["default"] = _default;