import hasClass from "./hasClass.js";
import addClass from "./addClass.js";
import removeClass from "./removeClass.js";
/**
 * Toggle a class on an element
 * @param target The DOM element
 * @param className The class name
 * @returns The DOM element
 */

export default function toggleClass(target, className) {
  if (hasClass(target, className)) {
    return removeClass(target, className);
  }

  return addClass(target, className);
}