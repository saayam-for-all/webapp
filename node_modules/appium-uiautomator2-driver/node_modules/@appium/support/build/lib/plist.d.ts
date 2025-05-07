/**
 * Parses a file in xml or binary format of plist
 * @param {string} plist The plist file path
 * @param {boolean} mustExist If set to false, this method will return an empty object when the file doesn't exist
 * @param {boolean} quiet If set to false, the plist path will be logged in debug level
 * @returns {Promise<any>} parsed plist JS Object
 */
export function parsePlistFile(plist: string, mustExist?: boolean, quiet?: boolean): Promise<any>;
/**
 * Parses an buffer or a string to a JS object a plist from an object
 * @param {string|Buffer} data The plist in the form of string or Buffer
 * @returns {Object} parsed plist JS Object
 * @throws Will throw an error if the plist type is unknown
 */
export function parsePlist(data: string | Buffer): any;
/**
 * Creates a plist from an object
 * @param {Object} object The JS object to be turned into a plist
 * @param {boolean} binary Set it to true for a binary plist
 * @returns {string|Buffer} returns a buffer or a string in respect to the binary parameter
 */
export function createPlist(object: any, binary?: boolean): string | Buffer;
/**
 * Updates a plist file with the given fields
 * @param {string} plist The plist file path
 * @param {Object} updatedFields The updated fields-value pairs
 * @param {boolean} binary If set to false, the file will be created as a xml plist
 * @param {boolean} mustExist If set to false, this method will update an empty plist
 * @param {boolean} quiet If set to false, the plist path will be logged in debug level
 */
export function updatePlistFile(plist: string, updatedFields: any, binary?: boolean, mustExist?: boolean, quiet?: boolean): Promise<void>;
/**
 * Creates a binary plist Buffer from an object
 * @param {Object} data The object to be turned into a binary plist
 * @returns {Buffer} plist in the form of a binary buffer
 */
export function createBinaryPlist(data: any): Buffer;
/**
 * Parses a Buffer into an Object
 * @param {Buffer} data The beffer of a binary plist
 */
export function parseBinaryPlist(data: Buffer): [any];
//# sourceMappingURL=plist.d.ts.map