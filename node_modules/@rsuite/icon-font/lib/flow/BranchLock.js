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

function BranchLock(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M9 11v4h6v-4H9zm0-1h6a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4a1 1 0 011-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 12a1 1 0 110 2 1 1 0 010-2zM13 10V8.8c0-.417-.426-.8-1-.8s-1 .383-1 .8V10h-1V8.8c0-.994.895-1.8 2-1.8s2 .806 2 1.8V10h-1zM12.5 0a1.5 1.5 0 11-1.414 2.001L8.805 2a2.94 2.94 0 00-2.579 1.529l-.09.18-.394.855a2.479 2.479 0 01-.259.437L8.085 5a1.5 1.5 0 11.001 1.001L2.886 6c.098.145.181.303.245.472l.056.168.373 1.28A1.5 1.5 0 005 9l.083.007a1.5 1.5 0 110 .986L5 10a2.498 2.498 0 01-2.345-1.634L2.6 8.2l-.373-1.28A1.278 1.278 0 001 6H.5a.5.5 0 01-.09-.992L.5 5h3c.525 0 1.007-.28 1.268-.728l.066-.126.394-.855a3.94 3.94 0 013.369-2.285l.209-.005h2.28a1.5 1.5 0 011.415-1zm-6 9a.5.5 0 100 1 .5.5 0 000-1zm3-4a.5.5 0 100 1 .5.5 0 000-1zm3-4a.5.5 0 100 1 .5.5 0 000-1z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(BranchLock);
var _default = ForwardRef;
exports["default"] = _default;