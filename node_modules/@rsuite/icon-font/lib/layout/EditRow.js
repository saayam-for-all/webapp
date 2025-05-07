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

function EditRow(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M15 0a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V1a1 1 0 011-1h10zm0 1H5v2h10V1zM1.5 13a.5.5 0 01.5.5v.5h.5a.5.5 0 010 1H2v.5a.5.5 0 01-1 0V15H.5a.5.5 0 010-1H1v-.5a.5.5 0 01.5-.5zM.5 1h2a.5.5 0 010 1h-2a.5.5 0 010-1zM15 6a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h10zm0 1H5v2h10V7zM5 12h.5a.5.5 0 010 1H5v.5a.5.5 0 01-1 0V13a1 1 0 011-1zm8.5 0H15a1 1 0 011 1h-2.5a.5.5 0 010-1zM4 15h2.5a.5.5 0 010 1H5a1 1 0 01-1-1zM10.5 12h1a.5.5 0 010 1h-1a.5.5 0 010-1zM7.5 12h1a.5.5 0 010 1h-1a.5.5 0 010-1zM8.5 15h1a.5.5 0 010 1h-1a.5.5 0 010-1zM11.5 15h1a.5.5 0 010 1h-1a.5.5 0 010-1zM15 15v-.5a.5.5 0 011 0v.5a1 1 0 01-1 1h-.5a.5.5 0 010-1h.5z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(EditRow);
var _default = ForwardRef;
exports["default"] = _default;