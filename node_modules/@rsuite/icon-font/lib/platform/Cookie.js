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

function Cookie(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M8 0c.578 0 .404.501-.52 1.502a.721.721 0 00.02.998c.32.32.5.754.5 1.207v.851a2 2 0 001.368 1.897l1.185.395c.295.098.562.264.782.483l.666.666a1.778 1.778 0 002.144.283c1.238-.713 1.856-.808 1.856-.283a8 8 0 11-8-8zm1.92 8.548a.5.5 0 00-.66.253l-.66 1.48-.105-.273a1 1 0 10-1.867.717l1.075 2.801a1 1 0 101.867-.717l-.464-1.208 1.067-2.394.029-.085a.5.5 0 00-.283-.575zm-.013 3.118l-.09-.001a.5.5 0 00-.007.996l2.226.217.09.001a.5.5 0 00.007-.996l-2.226-.217zM4 9a1 1 0 100 2 1 1 0 000-2zm.5-6a1.5 1.5 0 10.001 3.001A1.5 1.5 0 004.5 3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.794 1.493a1 1 0 11-1.88-.684 1 1 0 011.88.684zM10.171 3.03a1 1 0 01.598 1.282l-.684 1.879a1 1 0 01-1.88-.684l.684-1.879a1 1 0 011.282-.598zM11.882 3.396c.295-1.269 1.327-2.131 2.369-1.947s1.717 1.347 1.561 2.64a.166.166 0 01-.189.14l-.004-.001-2.786-.491c-.148.842.216 1.561.724 1.651.146.026.37-.073.672-.355a.5.5 0 01.684.73c-.509.477-1.019.7-1.529.61-1.124-.198-1.771-1.475-1.536-2.809l.034-.168z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(Cookie);
var _default = ForwardRef;
exports["default"] = _default;