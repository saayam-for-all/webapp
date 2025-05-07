import { hyphenate } from "./stringFormatter.js";
var msPattern = /^ms-/;
export default (function (string) {
  return hyphenate(string).replace(msPattern, '-ms-');
});