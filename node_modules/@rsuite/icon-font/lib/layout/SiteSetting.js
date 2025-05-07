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

function SiteSetting(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M5 6H1V5h14v1H6v8H5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 8V5 3a1 1 0 00-1-1H2a1 1 0 00-1 1v10a1 1 0 001 1h6v1H2a2 2 0 01-2-2V3a2 2 0 012-2h12a2 2 0 012 2v5h-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 12a1 1 0 11-2 0 1 1 0 012 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14.19 8.646c.397.229.588.7.461 1.141l-.234.817.826.207a1 1 0 01.757.97v.438a1 1 0 01-.757.97l-.826.206.235.818a1 1 0 01-.461 1.141l-.38.219a1 1 0 01-1.219-.171L12 14.79l-.591.612a1 1 0 01-1.219.171l-.38-.219a.999.999 0 01-.461-1.141l.234-.818-.825-.206a1 1 0 01-.757-.97v-.438a1 1 0 01.757-.97l.826-.207-.235-.817a1 1 0 01.461-1.141l.38-.219a1 1 0 011.219.171l.591.611.591-.611a1 1 0 011.219-.171l.38.219zm-.5.866l-.38-.219-.591.611h-1.437l-.592-.611-.38.218.235.817-.718 1.246-.827.207-.001.438.825.206.72 1.245-.234.819.379.22.591-.612 1.439-.001.592.612.38-.218-.235-.818.72-1.247.825-.205-.001-.439-.826-.207-.718-1.246.234-.816z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SiteSetting);
var _default = ForwardRef;
exports["default"] = _default;