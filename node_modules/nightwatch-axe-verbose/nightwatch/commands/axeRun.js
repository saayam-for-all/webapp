const axeInjectFn = require('./axeInjectFunc2');

module.exports = class AxeRun {
  async command(selector = null, options = {}, callback = function cb() {}) {
    let returnValue;

    const mergedOptions = AxeRun.mergeGlobalOptions(
      options,
      this.api.globals.axeSettings
    );

    try {
      const results = await this.api.executeAsync(axeInjectFn, [
        AxeRun.returnSelectorContext(selector, this.api.globals.axeSettings),
        mergedOptions,
      ]);
      const runAssertions =
        mergedOptions.runAssertions ||
        typeof mergedOptions.runAssertions === 'undefined';
      const { passes = [], violations = [] } = results;

      if (runAssertions) {
        for (let i = 0; i < passes.length; i += 1) {
          // eslint-disable-next-line
          this.api.assert.ok(
            true,
            `aXe rule: ${passes[i].id} (${passes[i].nodes.length} elements checked)`
          );
        }

        for (let i = 0; i < violations.length; i += 1) {
          for (let n = 0; n < violations[i].nodes.length; n += 1) {
            let nodeName = violations[i].nodes[n].target.toString();
            if (nodeName.length > 100) {
              nodeName = `...${nodeName.slice(-100)}`;
            }

            const assertionFailureMessage = `aXe rule: ${violations[i].id} - ${violations[i].help}\r\n\tIn element: ${nodeName}`;
            this.api.verify.fail(assertionFailureMessage);
          }
        }
      }
      returnValue = results;
    } catch (err) {
      returnValue = {
        status: -1,
        error: err.message,
      };
    }
    callback.call(this.api, returnValue);
    return returnValue;
  }

  static mergeGlobalOptions(options, globalAxeSettings) {
    if (
      globalAxeSettings &&
      Object.prototype.hasOwnProperty.call(globalAxeSettings, 'options')
    ) {
      const globalOptions = globalAxeSettings.options;
      return Object.assign(globalOptions, options);
    }

    if (!options) {
      return {};
    }

    return options;
  }

  /**
   * Use the context provided in the specific test, fall back to the global configuration if not provided, or use 'html' as the default value if neither exist.
   * @param {*} suppliedContext aXe context supplied in axe call from test
   * @param {*} globalAxeSettings aXe context supplied in browser.globals.axeSettings.context
   * @returns supplied context or the global config, else html if neither are supplied.
   */
  static returnSelectorContext(suppliedContext, globalAxeSettings) {
    if (suppliedContext) {
      return suppliedContext;
    }
    if (
      globalAxeSettings &&
      Object.prototype.hasOwnProperty.call(globalAxeSettings, 'context')
    ) {
      return globalAxeSettings.context;
    }

    return 'html';
  }
};
