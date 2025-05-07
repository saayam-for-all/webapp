"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageDidChange = packageDidChange;
const support_1 = require("@appium/support");
const package_changed_1 = require("package-changed");
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
const logger_1 = __importDefault(require("../logger"));
/**
 * Determines if extensions have changed, and updates a hash the `package.json` in `appiumHome` if so.
 *
 * If they have, we need to sync them with the `extensions.yaml` manifest.
 *
 * _Warning: this makes a blocking call to `writeFileSync`._
 * @param {string} appiumHome
 * @returns {Promise<boolean>} `true` if `package.json` `appiumHome` changed
 */
async function packageDidChange(appiumHome) {
    const hashFilename = path_1.default.join(appiumHome, constants_1.PKG_HASHFILE_RELATIVE_PATH);
    // XXX: the types in `package-changed` seem to be wrong.
    /** @type {boolean} */
    let isChanged;
    /** @type {() => void} */
    let writeHash;
    /** @type {string} */
    let hash;
    /** @type {string|undefined} */
    let oldHash;
    // first mkdirp the target dir.
    const hashFilenameDir = path_1.default.dirname(hashFilename);
    logger_1.default.debug(`Creating hash file directory: ${hashFilenameDir}`);
    try {
        await support_1.fs.mkdirp(hashFilenameDir);
    }
    catch (err) {
        throw new Error(`Appium could not create the directory for hash file: ${hashFilenameDir}. Original error: ${err.message}`);
    }
    try {
        ({ isChanged, writeHash, oldHash, hash } = await (0, package_changed_1.isPackageChanged)({
            cwd: appiumHome,
            hashFilename: constants_1.PKG_HASHFILE_RELATIVE_PATH,
        }));
    }
    catch {
        return true;
    }
    if (isChanged) {
        try {
            writeHash();
            logger_1.default.debug(`Updated hash of ${appiumHome}/package.json from: ${oldHash ?? '(none)'} to: ${hash}`);
        }
        catch (err) {
            throw new Error(`Appium could not write hash file: ${hashFilenameDir}. Original error: ${err.message}`);
        }
    }
    return isChanged;
}
//# sourceMappingURL=package-changed.js.map