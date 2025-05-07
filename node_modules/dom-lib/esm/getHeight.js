import getWindow from "./getWindow.js";
import getOffset from "./getOffset.js";
/**
 * Get the height of a DOM element
 * @param node The DOM element
 * @param client Whether to get the client height
 * @returns The height of the DOM element
 */

export default function getHeight(node, client) {
  var win = getWindow(node);

  if (win) {
    return win.innerHeight;
  }

  return client ? node.clientHeight : getOffset(node).height;
}