"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceSettings = exports.MAX_SETTINGS_SIZE = void 0;
const lodash_1 = __importDefault(require("lodash"));
const logger_1 = __importDefault(require("./logger"));
const support_1 = require("@appium/support");
const errors_1 = require("../protocol/errors");
/**
 * Maximum size (in bytes) of a given driver's settings object (which is internal to {@linkcode DriverSettings}).
 */
exports.MAX_SETTINGS_SIZE = 20 * 1024 * 1024; // 20 MB
/**
 * @template {StringRecord} T
 * @implements {IDeviceSettings<T>}
 */
class DeviceSettings {
    /**
     * Creates a _shallow copy_ of the `defaultSettings` parameter!
     * @param {T} [defaultSettings]
     * @param {import('@appium/types').SettingsUpdateListener<T>} [onSettingsUpdate]
     */
    constructor(defaultSettings = /** @type {T} */ ({}), onSettingsUpdate = async () => { }) {
        this._settings = { ...defaultSettings };
        this._onSettingsUpdate = onSettingsUpdate;
    }
    /**
     * calls updateSettings from implementing driver every time a setting is changed.
     * @param {T} newSettings
     */
    async update(newSettings) {
        if (!lodash_1.default.isPlainObject(newSettings)) {
            throw new errors_1.errors.InvalidArgumentError(`Settings update should be called with valid JSON. Got ` +
                `${JSON.stringify(newSettings)} instead`);
        }
        if (support_1.node.getObjectSize({ ...this._settings, ...newSettings }) >= exports.MAX_SETTINGS_SIZE) {
            throw new errors_1.errors.InvalidArgumentError(`New settings cannot be applied, because the overall ` +
                `object size exceeds the allowed limit of ${support_1.util.toReadableSizeString(exports.MAX_SETTINGS_SIZE)}`);
        }
        for (const prop in newSettings) {
            if (!lodash_1.default.isUndefined(this._settings[prop])) {
                if (this._settings[prop] === newSettings[prop]) {
                    logger_1.default.debug(`The value of '${prop}' setting did not change. Skipping the update for it`);
                    continue;
                }
            }
            await this._onSettingsUpdate(prop, newSettings[prop], this._settings[prop]);
            this._settings[prop] = newSettings[prop];
        }
    }
    getSettings() {
        return this._settings;
    }
}
exports.DeviceSettings = DeviceSettings;
exports.default = DeviceSettings;
/**
 * @typedef {import('@appium/types').StringRecord} StringRecord
 */
/**
 * @template {StringRecord} [T=StringRecord]
 * @typedef {import('@appium/types').IDeviceSettings<T>} IDeviceSettings
 */
//# sourceMappingURL=device-settings.js.map