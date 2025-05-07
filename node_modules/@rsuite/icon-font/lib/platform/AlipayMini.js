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

function AlipayMini(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M7.175.226A1.65 1.65 0 018.683.153l.142.073 5.495 3.173c.468.27.771.75.819 1.283l.006.146v6.345c0 .54-.264 1.043-.702 1.35l-.123.079-5.495 3.173a1.65 1.65 0 01-1.508.073l-.142-.073-5.495-3.173a1.651 1.651 0 01-.819-1.283l-.006-.146V4.828c0-.54.264-1.043.702-1.35l.123-.079L7.175.226zm4.859 8.519l-6.931 4.332 2.722 1.572a.35.35 0 00.282.03l.068-.03 5.495-3.173a.347.347 0 00.167-.23l.008-.074V9.859l-1.811-1.115zm-9.88-1.08l.001 3.508c0 .1.043.194.115.26l.06.044 1.498.865 2.939-1.837-4.613-2.839zm5.849-1.4l-2.801 1.75 2.795 1.72 2.801-1.75-2.795-1.72zm4.169-2.606L9.233 5.496l4.612 2.838V4.828c0-.1-.043-.194-.115-.26l-.06-.044-1.498-.866zM8.175 1.352a.35.35 0 00-.282-.03l-.068.03L2.33 4.525a.347.347 0 00-.167.23l-.008.074-.001 1.311 1.812 1.115 6.931-4.331-2.722-1.571z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(AlipayMini);
var _default = ForwardRef;
exports["default"] = _default;