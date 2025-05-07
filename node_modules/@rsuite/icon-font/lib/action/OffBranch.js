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

function OffBranch(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M14.5 7a1.5 1.5 0 11-1.414 2.001L10.364 9c-.859 0-1.66.416-2.154 1.109l-.101.153-.262.426c-.068.11-.143.215-.224.313h3.463a1.5 1.5 0 11.001 1.001l-3.111-.001c.091.124.171.257.238.399l.07.163.321.825a.967.967 0 00.513.534 1.5 1.5 0 11-.048 1.032 1.958 1.958 0 01-1.333-1.055l-.064-.147-.321-.825a1.45 1.45 0 00-1.351-.924h-1.5a.5.5 0 01-.09-.992l.09-.008h1c.559 0 1.08-.266 1.409-.71l.085-.126.262-.426a3.648 3.648 0 012.885-1.732l.223-.007h2.722a1.5 1.5 0 011.415-1zm-4 7a.5.5 0 100 1 .5.5 0 000-1zM4.462 1.833a.5.5 0 01-.247.663A5.5 5.5 0 001 7.501a5.49 5.49 0 002.306 4.478.5.5 0 11-.582.814A6.5 6.5 0 013.799 1.587a.5.5 0 01.663.247zM12.5 11a.5.5 0 100 1 .5.5 0 000-1zm2-3a.5.5 0 100 1 .5.5 0 000-1zM9.216 1.593A6.515 6.515 0 0112.8 5.895a.5.5 0 01-.969.247 5.514 5.514 0 00-3.033-3.64.5.5 0 11.418-.908zM6.5 0a.5.5 0 01.5.5v4a.5.5 0 01-1 0v-4a.5.5 0 01.5-.5z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(OffBranch);
var _default = ForwardRef;
exports["default"] = _default;