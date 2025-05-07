/**
 * It's a logger.
 *
 * Since this is a CLI app only, it doesn't necessarily make sense to consume `@appium/support`'s logger.
 *
 * @module
 */
declare const LogLevel: any;
import { LogLevelMap } from './constants';
/**
 * Type guard to see if a string is a recognized log level
 * @param level any value
 */
export declare function isLogLevelString(level: any): level is keyof typeof LogLevelMap;
export declare function getLogger(tag: string, parent?: any): any;
/**
 * Initialize the logging system.
 *
 * This should only be called once. The loglevel cannot be changed once it is set.
 *
 * @remarks Child loggers seem to inherit the "paused" state of the parent, so when this is called, we must resume all of them.
 */
export declare const initLogger: (level: keyof typeof LogLevelMap | typeof LogLevel) => void;
export {};
//# sourceMappingURL=logger.d.ts.map