export declare const isNil: <T>(value?: T | undefined) => boolean;
export declare const bothNilOrEqual: (original?: string, output?: string) => boolean;
/**
 * This function is used to determine if a value is an object.
 * It excludes arrays and null values.
 *
 * @param value
 * @returns
 */
export declare const isObject: <T>(value?: T | undefined) => boolean;
/**
 * This function is used to compare two objects and determine if they are equal.
 * It handles nested objects and arrays as well.
 * Array order is not taken into account.
 *
 * @param object
 * @param other
 * @returns
 */
export declare const isEqual: <T>(object: T, other: T) => boolean;
