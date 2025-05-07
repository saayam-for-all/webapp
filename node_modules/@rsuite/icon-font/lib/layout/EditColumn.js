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

function EditColumn(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M3 4a1 1 0 011 1v10a1 1 0 01-1 1H1a1 1 0 01-1-1V5a1 1 0 011-1h2zm0 1H1v10h2V5zM14.5 0a.5.5 0 01.5.5V1h.5a.5.5 0 010 1H15v.5a.5.5 0 01-1 0V2h-.5a.5.5 0 010-1h.5V.5a.5.5 0 01.5-.5zM.5 1h2a.5.5 0 010 1h-2a.5.5 0 010-1zM9 4a1 1 0 011 1v10a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1h2zm0 1H7v10h2V5zM13 4h.5a.5.5 0 010 1H13v.5a.5.5 0 01-1 0V5a1 1 0 011-1zM12.5 10a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM12.5 7a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM12.5 13a.5.5 0 01.5.5V16a1 1 0 01-1-1v-1.5a.5.5 0 01.5-.5zM15 4a1 1 0 011 1v1.5a.5.5 0 01-1 0V4zM15.5 8a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM15.5 11a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM14.5 15H16a1 1 0 01-1 1h-.5a.5.5 0 010-1zm1-1a.5.5 0 01.5.5v.5h-1v-.5a.5.5 0 01.5-.5z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(EditColumn);
var _default = ForwardRef;
exports["default"] = _default;