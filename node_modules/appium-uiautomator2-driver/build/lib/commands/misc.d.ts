/**
 * @this {AndroidUiautomator2Driver}
 * @returns {Promise<string>}
 */
export function getPageSource(this: import("../driver").AndroidUiautomator2Driver): Promise<string>;
/**
 * @this {AndroidUiautomator2Driver}
 * @returns {Promise<import('@appium/types').Orientation>}
 */
export function getOrientation(this: import("../driver").AndroidUiautomator2Driver): Promise<import("@appium/types").Orientation>;
/**
 * @this {AndroidUiautomator2Driver}
 * @param {import('@appium/types').Orientation} orientation
 * @returns {Promise<void>}
 */
export function setOrientation(this: import("../driver").AndroidUiautomator2Driver, orientation: import("@appium/types").Orientation): Promise<void>;
/**
 * @this {AndroidUiautomator2Driver}
 * @returns {Promise<void>}
 */
export function openNotifications(this: import("../driver").AndroidUiautomator2Driver): Promise<void>;
/**
 * Stop proxying to any Chromedriver and redirect to uiautomator2
 * @this {AndroidUiautomator2Driver}
 * @returns {void}
 */
export function suspendChromedriverProxy(this: import("../driver").AndroidUiautomator2Driver): void;
export class suspendChromedriverProxy {
    chromedriver: any;
    proxyReqRes: any;
    proxyCommand: (<TReq = any, TRes = unknown>(url: string, method: import("@appium/types").HTTPMethod, body?: TReq) => Promise<TRes>) | undefined;
    jwpProxyActive: boolean | undefined;
}
/**
 * The list of available info entries can be found at
 * https://github.com/appium/appium-uiautomator2-server/blob/master/app/src/main/java/io/appium/uiautomator2/handler/GetDeviceInfo.java
 * @this {AndroidUiautomator2Driver}
 * @returns {Promise<StringRecord>}
 */
export function mobileGetDeviceInfo(this: import("../driver").AndroidUiautomator2Driver): Promise<StringRecord>;
export type StringRecord<T = any> = import("@appium/types").StringRecord<T>;
export type AndroidUiautomator2Driver<T = any> = import("../driver").AndroidUiautomator2Driver;
//# sourceMappingURL=misc.d.ts.map