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

function Zoomout(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M9.5 1a.5.5 0 01.5.5V6h4.5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5zm-4-1a.5.5 0 01.5.5v5l-.003.053-.014.075-.021.063-.039.076-.04.055-.029.031-.042.037-.062.042-.059.029-.062.021-.082.014-.046.002h-5a.5.5 0 010-1h3.793L.147.852A.5.5 0 01.785.087l.069.058L5 4.292V.499a.5.5 0 01.5-.5zm10 10a.5.5 0 010 1h-3.793l4.147 4.146a.5.5 0 01-.638.765l-.069-.058-4.146-4.147v3.793a.5.5 0 01-1 0v-5.011c0-.021.002-.042.005-.063l-.005.074.003-.053.014-.075.021-.063.039-.076.04-.055.029-.031.042-.037.062-.042.059-.029.062-.021.054-.011.032-.004L15.5 10zm-9-1a.5.5 0 01.5.5v5a.5.5 0 01-1 0V10H1.5a.5.5 0 010-1h5z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(Zoomout);
var _default = ForwardRef;
exports["default"] = _default;