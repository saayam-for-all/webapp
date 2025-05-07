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

function Signature(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M10.167 5.876l.212-.919 3.858-3.858c.122-.122.297-.128.389-.035l.354.354c.092.092.087.267-.035.389l-.943.943.707.707.943-.943c.503-.503.529-1.31.035-1.803l-.354-.354c-.493-.493-1.3-.467-1.803.035l-3.96 3.96a.502.502 0 00-.134.241l-.424 1.838a.5.5 0 00.6.6l1.838-.424a.494.494 0 00.241-.134l2.263-2.263-.707-.707-2.161 2.161-.919.212z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.571 1.005c2.038.291 2.256 2.828 1.217 6.025-.075.231-.154.458-.237.681l-.142.366.025.006c1.158.309 1.559 1.095 1.479 2.269l-.015.17-.047.371-.075.538-.019.192-.005.142.008.108a.34.34 0 00.009.046c.012.052.021.071.1.077l.132.003c.094 0 .181-.067.314-.282l.109-.19.131-.252c.464-.928.754-1.276 1.447-1.276.557 0 1.131.638 1.583 1.538l.092.189.061-.056c.404-.364.805-.611 1.141-.661l.123-.009c.784 0 1.703.368 2.777 1.084a.5.5 0 11-.554.832C14.3 12.299 13.552 12 13.002 12c-.127 0-.438.24-.786.601l-.145.155.031.101.041.143h2.358a.5.5 0 010 1l-2.162.001c.113 1.125-.232 1.924-1.198 1.994l-.14.005c-.753 0-1.2-.456-1.171-1.146.011-.257.087-.545.217-.853L1.502 14a.5.5 0 010-1h9.105l.039-.059a7.36 7.36 0 01.205-.285l.082-.108-.048-.118a6.788 6.788 0 00-.149-.33l-.153-.302c-.229-.427-.448-.731-.551-.788l-.03-.009c-.094 0-.181.067-.314.282l-.109.19-.131.252c-.464.928-.754 1.276-1.447 1.276-.647 0-1.076-.304-1.205-.851a1.829 1.829 0 01-.032-.659l.032-.273.101-.722.008-.075c.09-.864-.077-1.236-.844-1.399l-.057-.012-.095.196c-.875 1.752-1.953 2.931-2.91 2.804l-.119-.023c-1.35-.337-1.524-1.617-.638-2.68.664-.797 1.741-1.314 2.931-1.357l.203-.003.026-.056c.126-.298.246-.609.356-.928l.081-.241c.863-2.657.699-4.567-.408-4.725C3.43 1.711 1.938 3.502.989 7.614a.5.5 0 01-.975-.225C1.065 2.835 2.906.626 5.572 1.006zm5.763 12.996L11.16 14l-.045.083c-.178.334-.279.622-.287.813l-.001.074c.004.023.02.029.066.03H11c.282 0 .417-.351.334-.999zM4.886 8.974l-.178.028c-.701.13-1.307.473-1.699.943-.466.559-.415.938.112 1.07.346.087 1.028-.688 1.681-1.883l.084-.158z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.5 8.5a1 1 0 11-2 0 1 1 0 012 0zM12.5 9h2a.5.5 0 010 1h-2a.5.5 0 010-1z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(Signature);
var _default = ForwardRef;
exports["default"] = _default;