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

function FolderSpeaker(props, svgRef) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: svgRef
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M6.586 2c.349 0 .684.119.951.338l.11.1 1.414 1.419a.488.488 0 00.274.137l.08.006h5.586c.728 0 .97.197.997.861l.003.139v.5a.5.5 0 01-.992.09l-.008-.09L15 5H9.415c-.349 0-.684-.119-.951-.338l-.11-.1-1.413-1.419a.488.488 0 00-.274-.137L6.587 3H1l.001 10h4.5a.5.5 0 01.09.992l-.09.008h-4.5c-.728 0-.97-.197-.997-.861L.001 13V3c0-.728.197-.97.861-.997L1.001 2h5.586z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15.867 7.751c.088.189.133.397.133.608v5.283c0 .75-.566 1.358-1.263 1.358-.196 0-.389-.049-.565-.143L12 13.689v.811c0 .782-.664 1.421-1.368 1.493L10.5 16c-.706 0-1.412-.592-1.492-1.355L9 14.5V13H7.842A.842.842 0 017 12.158V9.842C7 9.377 7.377 9 7.842 9h2.877l3.453-1.856c.624-.336 1.383-.064 1.695.608zM10.719 13H10v1.5c0 .216.21.443.421.491L10.5 15c.208 0 .441-.203.491-.419L11 14.5v-1.349L10.719 13zm3.982-4.996l-.056.02-3.646 1.96v2.031l3.646 1.961a.2.2 0 00.046.018l.046.006c.11 0 .225-.106.255-.271l.008-.087V8.359a.443.443 0 00-.018-.127l-.022-.059c-.062-.132-.164-.187-.259-.169zM10 10H8v2h2v-2z"
  }));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(FolderSpeaker);
var _default = ForwardRef;
exports["default"] = _default;