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

function FolderVerify(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M6.586 2c.349 0 .684.119.951.338l.11.1 1.414 1.419a.488.488 0 00.274.137l.08.006h5.586c.728 0 .97.197.997.861l.003.139v.5a.5.5 0 01-.992.09l-.008-.09L15 5H9.415c-.349 0-.684-.119-.951-.338l-.11-.1-1.413-1.419a.488.488 0 00-.274-.137L6.587 3H1l.001 10h5.5a.5.5 0 01.09.992l-.09.008h-5.5c-.728 0-.97-.197-.997-.861L.001 13V3c0-.728.197-.97.861-.997L1.001 2h5.586z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.146 9.146a.5.5 0 01.638-.058l.069.058 3 3a.5.5 0 01.058.638l-.058.069-3 3a.5.5 0 01-.765-.638l.058-.069 2.647-2.646-2.647-2.646a.5.5 0 01-.058-.638l.058-.069zM15.854 7.146a.5.5 0 00-.638-.058l-.069.058-3 3a.5.5 0 00-.058.638l.058.069 3 3a.5.5 0 00.765-.638l-.058-.069-2.647-2.646 2.647-2.646a.5.5 0 00.058-.638l-.058-.069z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(FolderVerify);
var _default = ForwardRef;
exports["default"] = _default;