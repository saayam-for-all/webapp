'use client';
"use strict";

exports.__esModule = true;
exports.alignMap = void 0;
exports.alignToJustifyContent = alignToJustifyContent;
exports["default"] = convertToFlex;
exports.verticalAlignMap = void 0;
exports.verticalAlignToAlignItems = verticalAlignToAlignItems;
var verticalAlignMap = exports.verticalAlignMap = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end'
};
var alignMap = exports.alignMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
};

// Convert verticalAlign to alignItems.
function verticalAlignToAlignItems(verticalAlign) {
  return verticalAlignMap[verticalAlign] || verticalAlign;
}

// Convert align to justifyContent.
function alignToJustifyContent(align) {
  return alignMap[align] || align;
}

// Convert verticalAlign and align to flex styles.
function convertToFlex(props) {
  var verticalAlign = props.verticalAlign,
    align = props.align;
  if (!verticalAlign && !align) return {};
  return {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: verticalAlignToAlignItems(verticalAlign),
    justifyContent: alignToJustifyContent(align)
  };
}