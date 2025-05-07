"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PLUGINS = exports.SUBCOMMAND_RESET = exports.SUBCOMMAND_BROWSER = exports.SUBCOMMAND_DESKTOP = exports.SUBCOMMAND_MOBILE = void 0;
exports.getPresetDrivers = getPresetDrivers;
exports.determinePlatformName = determinePlatformName;
exports.runSetupCommand = runSetupCommand;
const lodash_1 = __importDefault(require("lodash"));
const constants_1 = require("../constants");
const extension_1 = require("./extension");
const support_1 = require("@appium/support");
const logger_1 = __importDefault(require("../logger"));
/**
 * Subcommands of preset for setup
 */
exports.SUBCOMMAND_MOBILE = 'mobile';
exports.SUBCOMMAND_DESKTOP = 'desktop';
exports.SUBCOMMAND_BROWSER = 'browser';
exports.SUBCOMMAND_RESET = 'reset';
/**
 * Pairs of preset subcommand and driver candidates.
 * Driver names listed in KNOWN_DRIVERS to install by default
 */
const PRESET_PAIRS = Object.freeze(
/** @type {const} */ ({
    mobile: lodash_1.default.keys(constants_1.MOBILE_DRIVERS),
    desktop: lodash_1.default.keys(constants_1.DESKTOP_DRIVERS),
    browser: lodash_1.default.keys(constants_1.DESKTOP_BROWSERS)
}));
const DRIVERS_ONLY_MACOS = ['xcuitest', 'safari', 'mac2'];
const DRIVERS_ONLY_WINDOWS = ['windows'];
/**
 * Plugin names listed in KNOWN_PLUGINS to install by default.
 */
exports.DEFAULT_PLUGINS = ['images'];
/**
 * Return a list of drivers available for current host platform.
 * @param {import('appium/types').CliCommandSetupSubcommand} presetName
 * @returns {Array<string>}
 */
function getPresetDrivers(presetName) {
    return lodash_1.default.filter(PRESET_PAIRS[presetName], (driver) => {
        if (lodash_1.default.includes(DRIVERS_ONLY_MACOS, driver)) {
            return support_1.system.isMac();
        }
        if (lodash_1.default.includes(DRIVERS_ONLY_WINDOWS, driver)) {
            return support_1.system.isWindows();
        }
        return true;
    });
}
/**
 * Return desktop platform name for setup command description.
 * @returns {string}
 */
function determinePlatformName() {
    if (support_1.system.isMac()) {
        return 'macOS';
    }
    else if (support_1.system.isWindows()) {
        return 'Windows';
    }
    return 'Linux';
}
/**
 * Run 'setup' command to install drivers/plugins into the given appium home.
 * @template {import('appium/types').CliCommandSetup} SetupCmd
 * @param {import('appium/types').Args<SetupCmd>} preConfigArgs
 * @param {DriverConfig} driverConfig
 * @param {PluginConfig} pluginConfig
 * @returns {Promise<void>}
 */
async function runSetupCommand(preConfigArgs, driverConfig, pluginConfig) {
    switch (preConfigArgs.setupCommand) {
        case exports.SUBCOMMAND_DESKTOP:
            await setupDesktopAppDrivers(driverConfig);
            await setupDefaultPlugins(pluginConfig);
            break;
        case exports.SUBCOMMAND_BROWSER:
            await setupBrowserDrivers(driverConfig);
            await setupDefaultPlugins(pluginConfig);
            break;
        case exports.SUBCOMMAND_RESET:
            await resetAllExtensions(driverConfig, pluginConfig);
            break;
        default:
            await setupMobileDrivers(driverConfig);
            await setupDefaultPlugins(pluginConfig);
            break;
    }
}
;
/**
 * Resets all installed drivers and extensions
 *
 * @param {DriverConfig} driverConfig
 * @param {PluginConfig} pluginConfig
 * @returns {Promise<void>}
 */
async function resetAllExtensions(driverConfig, pluginConfig) {
    for (const [command, config] of [
        ['driver', driverConfig],
        ['plugin', pluginConfig],
    ]) {
        for (const extensionName of lodash_1.default.keys(/** @type {DriverConfig|PluginConfig} */ (config).installedExtensions)) {
            try {
                await uninstallExtension(extensionName, extensionCommandArgs(/** @type {CliExtensionCommand} */ (command), extensionName, 'uninstall'), 
                /** @type {DriverConfig|PluginConfig} */ (config));
            }
            catch (e) {
                logger_1.default.warn(`${extensionName} ${command} cannot be uninstalled. Will delete the manifest anyway. ` +
                    `Original error: ${e.stack}`);
            }
        }
        const manifestPath = /** @type {DriverConfig|PluginConfig} */ (config).manifestPath;
        if (!await support_1.fs.exists(manifestPath)) {
            continue;
        }
        await support_1.fs.rimraf(manifestPath);
        if (await support_1.fs.exists(manifestPath)) {
            throw new Error(`${command} manifest at '${manifestPath}' cannot be deleted. Is it accessible?`);
        }
        else {
            logger_1.default.info(`Successfully deleted ${command} manifest at '${manifestPath}'`);
        }
    }
}
/**
 * Install drivers listed in DEFAULT_DRIVERS.
 * @param {DriverConfig} driverConfig
 * @returns {Promise<void>}
 */
async function setupMobileDrivers(driverConfig) {
    await installDrivers(exports.SUBCOMMAND_MOBILE, driverConfig);
}
/**
 * Install all of known drivers listed in BROWSER_DRIVERS.
 * @param {DriverConfig} driverConfig
 * @returns {Promise<void>}
 */
async function setupBrowserDrivers(driverConfig) {
    await installDrivers(exports.SUBCOMMAND_BROWSER, driverConfig);
}
/**
 * Install all of known drivers listed in DESKTOP_APP_DRIVERS.
 * @param {DriverConfig} driverConfig
 * @returns {Promise<void>}
 */
async function setupDesktopAppDrivers(driverConfig) {
    await installDrivers(exports.SUBCOMMAND_DESKTOP, driverConfig);
}
/**
 * Install the given driver name. It skips the installation if the given driver name was already installed.
 * @param {import('appium/types').CliCommandSetupSubcommand} subcommand
 * @param {DriverConfig} driverConfig
 * @returns {Promise<void>}
 */
async function installDrivers(subcommand, driverConfig) {
    for (const driverName of getPresetDrivers(subcommand)) {
        await installExtension(driverName, extensionCommandArgs('driver', driverName, 'install'), driverConfig);
    }
}
/**
 * Install plugins listed in DEFAULT_PLUGINS.
 * @param {PluginConfig} pluginConfig
 * @returns {Promise<void>}
 */
async function setupDefaultPlugins(pluginConfig) {
    for (const pluginName of exports.DEFAULT_PLUGINS) {
        await installExtension(pluginName, extensionCommandArgs('plugin', pluginName, 'install'), pluginConfig);
    }
}
/**
 * Run the given extensionConfigArgs command after checking if the given extensionName was already installed.
 * @param {string} extensionName
 * @param {Args} extensionConfigArgs
 * @param {DriverConfig|PluginConfig} extensionConfig
 * @returns {Promise<void>}
 */
async function installExtension(extensionName, extensionConfigArgs, extensionConfig) {
    if (lodash_1.default.keys(extensionConfig.installedExtensions).includes(extensionName)) {
        logger_1.default.info(`${extensionName} (${extensionConfig.installedExtensions[extensionName].version}) is already installed. ` +
            `Skipping the installation.`);
        return;
    }
    await (0, extension_1.runExtensionCommand)(extensionConfigArgs, extensionConfig);
}
/**
 * Run the given extensionConfigArgs command after checking if the given extensionName was already installed.
 * @param {string} extensionName
 * @param {Args} extensionConfigArgs
 * @param {DriverConfig|PluginConfig} extensionConfig
 * @returns {Promise<void>}
 */
async function uninstallExtension(extensionName, extensionConfigArgs, extensionConfig) {
    if (!lodash_1.default.keys(extensionConfig.installedExtensions).includes(extensionName)) {
        logger_1.default.info(`${extensionName} (${extensionConfig.installedExtensions[extensionName].version}) is not installed. ` +
            `Skipping its uninstall.`);
        return;
    }
    await (0, extension_1.runExtensionCommand)(extensionConfigArgs, extensionConfig);
}
/**
 * Return the command config for driver or plugin.
 * @param {CliExtensionCommand} extensionCommand
 * @param {string} extensionName
 * @param {CliExtensionSubcommand} command
 * @returns {Args}
 */
function extensionCommandArgs(extensionCommand, extensionName, command) {
    return (extensionCommand === 'plugin')
        ? { 'subcommand': 'plugin', 'pluginCommand': command, 'plugin': extensionName }
        : { 'subcommand': 'driver', 'driverCommand': command, 'driver': extensionName };
}
/**
 * @typedef {import('appium/types').CliExtensionCommand} CliExtensionCommand
 * @typedef {import('appium/types').CliExtensionSubcommand} CliExtensionSubcommand
 * @typedef {import('../extension/extension-config').ExtensionConfig<CliExtensionCommand>} PluginConfig
 * @typedef {import('../extension/extension-config').ExtensionConfig<CliExtensionCommand>} DriverConfig
 */
/**
 * @typedef {import('appium/types').Args<CliExtensionCommand, CliExtensionSubcommand>} Args
 */
//# sourceMappingURL=setup-command.js.map