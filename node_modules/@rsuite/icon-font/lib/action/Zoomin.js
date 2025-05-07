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

function Zoomin(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M10.5 0h5.012a.42.42 0 01.062.005L15.5 0l.053.003.075.014.063.021.076.039.055.04.031.029.037.042.042.062.029.059.021.062.011.056.005.072v5a.5.5 0 01-1 0V1.705L9.852 6.853a.5.5 0 01-.765-.638l.058-.069L14.291 1h-3.792a.5.5 0 010-1zm-4 1a.5.5 0 010 1H2v4.5a.5.5 0 01-1 0v-5a.5.5 0 01.5-.5h5zm3 14a.5.5 0 010-1H14V9.5a.5.5 0 011 0v5a.5.5 0 01-.41.492L14.5 15h-5zM6.854 9.146a.5.5 0 01.058.638l-.058.069-5.148 5.146H5.5a.5.5 0 010 1l-5.053-.003-.075-.014-.063-.021-.076-.039-.055-.04-.031-.029-.037-.042-.042-.062-.029-.059-.021-.062-.011-.054-.004-.031L.001 10.5a.5.5 0 011 0v3.792l5.146-5.146a.5.5 0 01.707 0z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(Zoomin);
var _default = ForwardRef;
exports["default"] = _default;