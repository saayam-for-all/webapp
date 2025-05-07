/**
 * @extends {ExtensionCliCommand<DriverType>}
 */
export default class DriverCliCommand extends ExtensionCliCommand<"driver"> {
    /**
     * @param {import('./extension-command').ExtensionCommandOptions<DriverType>} opts
     */
    constructor({ config, json }: import("./extension-command").ExtensionCommandOptions<DriverType>);
    /**
     * Install a driver
     *
     * @param {DriverInstallOpts} opts
     * @return {Promise<ExtRecord<DriverType>>}
     */
    install({ driver, installType, packageName }: DriverInstallOpts): Promise<ExtRecord<DriverType>>;
    /**
     * Uninstall a driver
     *
     * @param {DriverUninstallOpts} opts
     * @return {Promise<ExtRecord<DriverType>>}
     */
    uninstall({ driver }: DriverUninstallOpts): Promise<ExtRecord<DriverType>>;
    /**
     * Update a driver
     *
     * @param {DriverUpdateOpts} opts
     * @return {Promise<import('./extension-command').ExtensionUpdateResult>}
     */
    update({ driver, unsafe }: DriverUpdateOpts): Promise<import("./extension-command").ExtensionUpdateResult>;
    /**
     *
     * @param {DriverRunOptions} opts
     * @return {Promise<import('./extension-command').RunOutput>}
     */
    run({ driver, scriptName, extraArgs }: DriverRunOptions): Promise<import("./extension-command").RunOutput>;
    /**
     * Runs doctor checks for the given driver.
     *
     * @param {DriverDoctorOptions} opts
     * @returns {Promise<number>} The amount of executed doctor checks.
     * @throws {Error} If any of the mandatory Doctor checks fails.
     */
    doctor({ driver }: DriverDoctorOptions): Promise<number>;
}
export type ExtensionType = import("@appium/types").ExtensionType;
export type DriverType = import("@appium/types").DriverType;
export type ExtRecord<ExtType extends ExtensionType> = import("appium/types").ExtRecord<ExtType>;
export type DriverCommandOptions = {
    config: import("../extension/extension-config").ExtensionConfig<DriverType>;
    json: boolean;
};
/**
 * Options for {@linkcode DriverCliCommand.install}
 */
export type DriverInstallOpts = {
    /**
     * - the name or spec of a driver to install
     */
    driver: string;
    /**
     * - how to install this driver. One of the INSTALL_TYPES
     */
    installType: InstallType;
    /**
     * - for git/github installs, the driver node package name
     */
    packageName?: string | undefined;
};
export type InstallType = import("appium/types").InstallType;
/**
 * Options for {@linkcode DriverCliCommand.uninstall}
 */
export type DriverUninstallOpts = {
    /**
     * - the name or spec of a driver to uninstall
     */
    driver: string;
};
/**
 * Options for {@linkcode DriverCliCommand.update}
 */
export type DriverUpdateOpts = {
    /**
     * - the name of the driver to update
     */
    driver: string;
    /**
     * - if true, will perform unsafe updates past major revision boundaries
     */
    unsafe: boolean;
};
/**
 * Options for {@linkcode DriverCliCommand.run}.
 */
export type DriverRunOptions = {
    /**
     * - name of the driver to run a script from
     */
    driver: string;
    /**
     * - name of the script to run
     */
    scriptName: string;
    /**
     * - arguments to pass to the script
     */
    extraArgs?: string[] | undefined;
};
/**
 * Options for {@linkcode DriverCliCommand.doctor}.
 */
export type DriverDoctorOptions = {
    /**
     * - name of the driver to run doctor checks for
     */
    driver: string;
};
import ExtensionCliCommand from './extension-command';
//# sourceMappingURL=driver-command.d.ts.map