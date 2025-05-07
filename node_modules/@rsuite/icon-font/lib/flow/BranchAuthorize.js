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

function BranchAuthorize(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M16 9a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-2h-1v2H9V9h7z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15.175 10.12a.5.5 0 01.651.759l-3.5 3a.5.5 0 01-.741-.102l-1-1.5a.5.5 0 11.832-.554l.687 1.03 3.072-2.633zM12.5 0a1.5 1.5 0 11-1.414 2.001L8.805 2a2.94 2.94 0 00-2.579 1.529l-.09.18-.394.855a2.479 2.479 0 01-.259.437L8.085 5a1.5 1.5 0 11.001 1.001L2.886 6c.098.145.181.303.245.472l.056.168L3.7 8.4a.833.833 0 00.422.509 1.499 1.499 0 11-.054 1.04 1.834 1.834 0 01-1.28-1.125L2.74 8.68l-.513-1.76A1.278 1.278 0 001 6H.5a.5.5 0 01-.09-.992L.5 5h3c.525 0 1.007-.28 1.268-.728l.066-.126.394-.855a3.94 3.94 0 013.369-2.285l.209-.005h2.28a1.5 1.5 0 011.415-1zm-7 9a.5.5 0 100 1 .5.5 0 000-1zm4-4a.5.5 0 100 1 .5.5 0 000-1zm3-4a.5.5 0 100 1 .5.5 0 000-1z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(BranchAuthorize);
var _default = ForwardRef;
exports["default"] = _default;