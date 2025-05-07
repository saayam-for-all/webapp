import ownerDocument from "./ownerDocument.js";
import nodeName from "./nodeName.js";
import getStyle from "./getStyle.js";
/**
 * Get the offset parent of a DOM element
 * @param node The DOM element
 * @returns The offset parent of the DOM element
 */

export default function getOffsetParent(node) {
  var doc = ownerDocument(node);
  var offsetParent = node === null || node === void 0 ? void 0 : node.offsetParent;

  while (offsetParent && nodeName(node) !== 'html' && getStyle(offsetParent, 'position') === 'static') {
    offsetParent = offsetParent.offsetParent;
  }

  return offsetParent || doc.documentElement;
}