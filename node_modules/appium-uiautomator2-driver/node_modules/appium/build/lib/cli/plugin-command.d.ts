/**
 * @extends {ExtensionCliCommand<PluginType>}
 */
export default class PluginCliCommand extends ExtensionCliCommand<"plugin"> {
    /**
     *
     * @param {import('./extension-command').ExtensionCommandOptions<PluginType>} opts
     */
    constructor({ config, json }: import("./extension-command").ExtensionCommandOptions<PluginType>);
    /**
     * Install a plugin
     *
     * @param {PluginInstallOpts} opts
     * @returns {Promise<ExtRecord<PluginType>>}
     */
    install({ plugin, installType, packageName }: PluginInstallOpts): Promise<ExtRecord<PluginType>>;
    /**
     * Uninstall a plugin
     *
     * @param {PluginUninstallOpts} opts
     * @returns {Promise<ExtRecord<PluginType>>}
     */
    uninstall({ plugin }: PluginUninstallOpts): Promise<ExtRecord<PluginType>>;
    /**
     * Update a plugin
     *
     * @param {PluginUpdateOpts} opts
     * @returns {Promise<import('./extension-command').ExtensionUpdateResult>}
     */
    update({ plugin, unsafe }: PluginUpdateOpts): Promise<import("./extension-command").ExtensionUpdateResult>;
    /**
     *
     * @param {PluginRunOptions} opts
     * @returns {Promise<import('./extension-command').RunOutput>}
     */
    run({ plugin, scriptName, extraArgs }: PluginRunOptions): Promise<import("./extension-command").RunOutput>;
    /**
     * Runs doctor checks for the given plugin
     *
     * @param {PluginDoctorOptions} opts
     * @returns {Promise<number>} The amount of executed doctor checks.
     * @throws {Error} If any of the mandatory Doctor checks fails.
     */
    doctor({ plugin }: PluginDoctorOptions): Promise<number>;
}
export type ExtensionType = import("@appium/types").ExtensionType;
export type PluginType = import("@appium/types").PluginType;
export type ExtRecord<ExtType extends ExtensionType> = import("appium/types").ExtRecord<ExtType>;
/**
 * Options for {@linkcode PluginCliCommand.install}
 */
export type PluginInstallOpts = {
    /**
     * - the name or spec of a plugin to install
     */
    plugin: string;
    /**
     * - how to install this plugin. One of the INSTALL_TYPES
     */
    installType: InstallType;
    /**
     * - for git/github installs, the plugin node package name
     */
    packageName?: string | undefined;
};
export type InstallType = import("appium/types").InstallType;
/**
 * Options for {@linkcode PluginCliCommand.uninstall}
 */
export type PluginUninstallOpts = {
    /**
     * - the name or spec of a plugin to uninstall
     */
    plugin: string;
};
/**
 * Options for {@linkcode PluginCliCommand.update}
 */
export type PluginUpdateOpts = {
    /**
     * - the name of the plugin to update
     */
    plugin: string;
    /**
     * - if true, will perform unsafe updates past major revision boundaries
     */
    unsafe: boolean;
};
/**
 * Options for {@linkcode PluginCliCommand.run}.
 */
export type PluginRunOptions = {
    /**
     * - name of the plugin to run a script from
     */
    plugin: string;
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
 * Options for {@linkcode PluginCliCommand.doctor}.
 */
export type PluginDoctorOptions = {
    /**
     * - name of the plugin to run doctor checks for
     */
    plugin: string;
};
import ExtensionCliCommand from './extension-command';
//# sourceMappingURL=plugin-command.d.ts.map