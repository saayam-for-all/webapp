/**
 * Utility function to extend node functionality, allowing us to require
 * modules that are installed globally. If the package cannot be required,
 * this will attempt to link the package and then re-require it
 *
 * @param {string} packageName - the name of the package to be required
 * @returns {Promise<unknown>} - the package object
 * @throws {Error} If the package is not found locally or globally
 */
export function requirePackage(packageName: string): Promise<unknown>;
/**
 * Calculate the in-depth size in memory of the provided object.
 * The original implementation is borrowed from https://github.com/miktam/sizeof.
 *
 * @param {*} obj An object whose size should be calculated
 * @returns {number} Object size in bytes.
 */
export function getObjectSize(obj: any): number;
/**
 * Calculates a unique object identifier
 *
 * @param {object} object Any valid ECMA object
 * @returns {string} A uuidV4 string that uniquely identifies given object
 */
export function getObjectId(object: object): string;
/**
 * Perform deep freeze of the given object (e. g.
 * all nested objects also become immutable).
 * If the passed object is of a plain type
 * then no change is done and the same object
 * is returned.
 * ! This function changes the given object,
 * so it becomes immutable.
 *
 * @param {*} object Any valid ECMA object
 * @returns {*} The same object that was passed to the
 * function after it was made immutable.
 */
export function deepFreeze(object: any): any;
/**
 * Tries to synchronously detect the absolute path to the folder
 * where the given `moduleName` is located.
 *
 * @param {string} moduleName The name of the module as it is written in package.json
 * @param {string} filePath Full path to any of files that `moduleName` contains. Use
 * `__filename` to find the root of the module where this helper is called.
 * @returns {string?} Full path to the module root
 */
export function getModuleRootSync(moduleName: string, filePath: string): string | null;
//# sourceMappingURL=node.d.ts.map