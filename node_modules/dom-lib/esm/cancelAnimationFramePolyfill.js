import getGlobal from "./utils/getGlobal.js";
var g = getGlobal();
/**
 * @deprecated use `cancelAnimationFrame` instead
 */

var cancelAnimationFramePolyfill = g.cancelAnimationFrame || g.clearTimeout;
export default cancelAnimationFramePolyfill;