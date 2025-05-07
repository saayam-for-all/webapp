/**
 * @privateRemarks Overriding helpers.doFindElementOrEls functionality of appium-android-driver,
 * this.element initialized in find.js of appium-android-drive.
 *
 * @this {AndroidUiautomator2Driver}
 * @param {import('appium-android-driver').FindElementOpts} params
 * @returns {Promise<Element | Element[]>}
 */
export function doFindElementOrEls(this: import("../driver").AndroidUiautomator2Driver, params: import("appium-android-driver").FindElementOpts): Promise<Element | Element[]>;
export type Element = import("@appium/types").Element;
export type AndroidUiautomator2Driver = import("../driver").AndroidUiautomator2Driver;
//# sourceMappingURL=find.d.ts.map