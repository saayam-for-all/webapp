import getGlobal from "./utils/getGlobal.js";
var g = getGlobal();
var lastTime = 0;

function _setTimeout(callback) {
  var currTime = Date.now();
  var timeDelay = Math.max(0, 16 - (currTime - lastTime));
  lastTime = currTime + timeDelay;
  return g.setTimeout(function () {
    callback(Date.now());
  }, timeDelay);
}
/**
 * @deprecated Use `requestAnimationFrame` instead.
 */


var requestAnimationFramePolyfill = g.requestAnimationFrame || _setTimeout;
export default requestAnimationFramePolyfill;