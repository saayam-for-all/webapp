/**
 * Determines if extensions have changed, and updates a hash the `package.json` in `appiumHome` if so.
 *
 * If they have, we need to sync them with the `extensions.yaml` manifest.
 *
 * _Warning: this makes a blocking call to `writeFileSync`._
 * @param {string} appiumHome
 * @returns {Promise<boolean>} `true` if `package.json` `appiumHome` changed
 */
export function packageDidChange(appiumHome: string): Promise<boolean>;
//# sourceMappingURL=package-changed.d.ts.map