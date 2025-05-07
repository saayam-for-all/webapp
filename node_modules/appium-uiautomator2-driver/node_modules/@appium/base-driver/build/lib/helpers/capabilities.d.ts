export type Constraints = import("@appium/types").Constraints;
export type AppiumLogger = import("@appium/types").AppiumLogger;
export type StringRecord = import("@appium/types").StringRecord;
export type BaseDriverCapConstraints = import("@appium/types").BaseDriverCapConstraints;
export type Capabilities<C extends Constraints> = import("@appium/types").Capabilities<C>;
export function isW3cCaps(caps: any): boolean;
/**
 *
 * @template {Constraints} C
 * @param {any} oldCaps
 * @param {C} desiredCapConstraints
 * @param {AppiumLogger} log
 * @returns {Capabilities<C>}
 */
export function fixCaps<C extends Constraints>(oldCaps: any, desiredCapConstraints: C, log: AppiumLogger): Capabilities<C>;
//# sourceMappingURL=capabilities.d.ts.map