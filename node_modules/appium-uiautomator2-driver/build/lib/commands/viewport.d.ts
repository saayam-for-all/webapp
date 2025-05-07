/**
 * @this {AndroidUiautomator2Driver}
 * @returns {Promise<number>}
 */
export function getStatusBarHeight(this: import("../driver").AndroidUiautomator2Driver): Promise<number>;
/**
 * @this {AndroidUiautomator2Driver}
 * @returns {Promise<string>}
 */
export function getDevicePixelRatio(this: import("../driver").AndroidUiautomator2Driver): Promise<string>;
/**
 * @this {AndroidUiautomator2Driver}
 * @returns {Promise<import('./types').RelativeRect>}
 */
export function getViewPortRect(this: import("../driver").AndroidUiautomator2Driver): Promise<import("./types").RelativeRect>;
/**
 * Returns the viewport coordinates.
 * @this {AndroidUiautomator2Driver}
 * @returns {Promise<import('./types').RelativeRect>} The viewport coordinates.
 */
export function mobileViewPortRect(this: import("../driver").AndroidUiautomator2Driver): Promise<import("./types").RelativeRect>;
/**
 * @this {AndroidUiautomator2Driver}
 * @returns {Promise<import('@appium/types').Rect>}
 */
export function getWindowRect(this: import("../driver").AndroidUiautomator2Driver): Promise<import("@appium/types").Rect>;
/**
 * @this {AndroidUiautomator2Driver}
 * @returns {Promise<number>}
 */
export function getDisplayDensity(this: import("../driver").AndroidUiautomator2Driver): Promise<number>;
/**
 * @this {AndroidUiautomator2Driver}
 * @returns {Promise<import('@appium/types').Size>}
 */
export function getWindowSize(this: import("../driver").AndroidUiautomator2Driver): Promise<import("@appium/types").Size>;
export type AndroidUiautomator2Driver = import("../driver").AndroidUiautomator2Driver;
//# sourceMappingURL=viewport.d.ts.map