const assert = require('assert');
const mockery = require('mockery');

describe('test verifyOptions', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  // --- (allowedFlags.length > 0) starts here ---
  it('shows error if more than one flags passed', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../../logger',
      class {
        static log(...msgs) {
          consoleOutput.push(...msgs);
        }
      }
    );

    const colorFn = (arg) => arg;
    mockery.registerMock('ansi-colors', {
      green: colorFn,
      yellow: colorFn,
      magenta: colorFn,
      cyan: colorFn,
      red: colorFn,
      gray: colorFn,
      grey: colorFn
    });

    mockery.registerMock('../constants', {
      AVAILABLE_SUBCOMMANDS: {
        subcmd1: {
          flags: [{
            name: 'flag1'
          },
          {
            name: 'flag2'
          }]
        }
      }
    });

    // without configs
    const {verifyOptions} = require('../../../../../src/commands/android/subcommands/common');
    const result1 = verifyOptions('subcmd1', {flag1: true, flag2: true});
    const output1 = consoleOutput.toString();
    assert.strictEqual(output1.includes('Too many flags passed for \'subcmd1\' subcommand: flag1, flag2 (only one expected)'), true);
    assert.deepStrictEqual(result1, false);

    // with configs other than flag
    consoleOutput.length = 0;
    const result2 = verifyOptions('subcmd1', {flag1: true, flag2: true, random: true});
    const output2 = consoleOutput.toString();
    assert.strictEqual(output2.includes('Too many flags passed for \'subcmd1\' subcommand: flag1, flag2 (only one expected)'), true);
    assert.deepStrictEqual(result2, false);
  });

  it('shows error for unknown flags', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../../logger',
      class {
        static log(...msgs) {
          consoleOutput.push(...msgs);
        }
      }
    );

    const colorFn = (arg) => arg;
    mockery.registerMock('ansi-colors', {
      green: colorFn,
      yellow: colorFn,
      magenta: colorFn,
      cyan: colorFn,
      red: colorFn,
      gray: colorFn,
      grey: colorFn
    });

    mockery.registerMock('../constants', {
      AVAILABLE_SUBCOMMANDS: {
        subcmd1: {
          flags: [{
            name: 'flag1'
          }]
        }
      }
    });

    const {verifyOptions} = require('../../../../../src/commands/android/subcommands/common');
    const result = verifyOptions('subcmd1', {random: true});
    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Unknown flag(s) passed for \'subcmd1\' subcommand: random'), true);
    assert.deepStrictEqual(result, false);

    consoleOutput.length = 0;
    const result2 = verifyOptions('subcmd1', {random: 'something'});
    const output2 = consoleOutput.toString();
    assert.strictEqual(output2.includes('Unknown flag(s) passed for \'subcmd1\' subcommand: random'), true);
    assert.deepStrictEqual(result2, false);
  });

  it('works and does not log anything for no flag and no config passed', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../../logger',
      class {
        static log(...msgs) {
          consoleOutput.push(...msgs);
        }
      }
    );

    const colorFn = (arg) => arg;
    mockery.registerMock('ansi-colors', {
      green: colorFn,
      yellow: colorFn,
      magenta: colorFn,
      cyan: colorFn,
      red: colorFn,
      gray: colorFn,
      grey: colorFn
    });

    mockery.registerMock('../constants', {
      AVAILABLE_SUBCOMMANDS: {
        subcmd1: {
          flags: [{
            name: 'flag1',
            cliConfigs: [{
              name: 'config1',
              alias: ['c1']
            }]
          }]
        },
        subcmd2: {
          flags: [],
          cliConfigs: [{
            name: 'config2',
            alias: ['c2']
          }]
        },
        subcmd3: {
          flags: [{
            name: 'flag1'
          }],
          cliConfigs: []
        }
      }
    });

    const {verifyOptions} = require('../../../../../src/commands/android/subcommands/common');
    const result1 = verifyOptions('subcmd1', {});
    assert.strictEqual(consoleOutput.length, 0);
    assert.deepStrictEqual(result1, {subcommandFlag: '', configs: []});

    consoleOutput.length = 0;
    const result2 = verifyOptions('subcmd2', {});
    assert.strictEqual(consoleOutput.length, 0);
    assert.deepStrictEqual(result2, {subcommandFlag: '', configs: []});

    consoleOutput.length = 0;
    const result3 = verifyOptions('subcmd3', {});
    assert.strictEqual(consoleOutput.length, 0);
    assert.deepStrictEqual(result3, {subcommandFlag: '', configs: []});
  });

  it('works for correct flag (without configs)', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../../logger',
      class {
        static log(...msgs) {
          consoleOutput.push(...msgs);
        }
      }
    );

    const colorFn = (arg) => arg;
    mockery.registerMock('ansi-colors', {
      green: colorFn,
      yellow: colorFn,
      magenta: colorFn,
      cyan: colorFn,
      red: colorFn,
      gray: colorFn,
      grey: colorFn
    });

    mockery.registerMock('../constants', {
      AVAILABLE_SUBCOMMANDS: {
        subcmd1: {
          flags: [{
            name: 'flag1'
          },
          {
            name: 'flag2'
          }]
        }
      }
    });

    const {verifyOptions} = require('../../../../../src/commands/android/subcommands/common');
    const result1 = verifyOptions('subcmd1', {flag1: true});
    const output1 = consoleOutput.toString();
    assert.strictEqual(output1.includes('Unknown flag(s) passed'), false);
    assert.deepStrictEqual(result1, {subcommandFlag: 'flag1', configs: []});

    consoleOutput.length = 0;
    const result2 = verifyOptions('subcmd1', {flag2: true});
    const output2 = consoleOutput.toString();
    assert.strictEqual(output2.includes('Unknown flag(s) passed'), false);
    assert.deepStrictEqual(result2, {subcommandFlag: 'flag2', configs: []});
  });

  it('shows error for correct flag but unknown configs (allowedConfigs = 0)', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../../logger',
      class {
        static log(...msgs) {
          consoleOutput.push(...msgs);
        }
      }
    );

    const colorFn = (arg) => arg;
    mockery.registerMock('ansi-colors', {
      green: colorFn,
      yellow: colorFn,
      magenta: colorFn,
      cyan: colorFn,
      red: colorFn,
      gray: colorFn,
      grey: colorFn
    });

    mockery.registerMock('../constants', {
      AVAILABLE_SUBCOMMANDS: {
        subcmd1: {
          flags: [{
            name: 'flag1',
            cliConfigs: []
          }]
        }
      }
    });

    const {verifyOptions} = require('../../../../../src/commands/android/subcommands/common');
    const result = verifyOptions('subcmd1', {flag1: true, random: true});
    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Unknown config(s) passed for \'--flag1\' flag: random (none expected)'), true);
    assert.deepStrictEqual(result, false);
  });

  it('shows error for correct flag but unknown configs (allowedConfigs > 0)', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../../logger',
      class {
        static log(...msgs) {
          consoleOutput.push(...msgs);
        }
      }
    );

    const colorFn = (arg) => arg;
    mockery.registerMock('ansi-colors', {
      green: colorFn,
      yellow: colorFn,
      magenta: colorFn,
      cyan: colorFn,
      red: colorFn,
      gray: colorFn,
      grey: colorFn
    });

    mockery.registerMock('../constants', {
      AVAILABLE_SUBCOMMANDS: {
        subcmd1: {
          flags: [{
            name: 'flag1',
            cliConfigs: [{
              name: 'config1',
              alias: []
            }]
          }]
        }
      }
    });

    const {verifyOptions} = require('../../../../../src/commands/android/subcommands/common');
    const result = verifyOptions('subcmd1', {flag1: true, random: true});
    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Unknown config(s) passed for \'--flag1\' flag: random'), true);
    assert.strictEqual(output.includes('(none expected)'), false);
    assert.deepStrictEqual(result, false);
  });

  it('works for correct flag and correct corresponding configs', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../../logger',
      class {
        static log(...msgs) {
          consoleOutput.push(...msgs);
        }
      }
    );

    const colorFn = (arg) => arg;
    mockery.registerMock('ansi-colors', {
      green: colorFn,
      yellow: colorFn,
      magenta: colorFn,
      cyan: colorFn,
      red: colorFn,
      gray: colorFn,
      grey: colorFn
    });

    mockery.registerMock('../constants', {
      AVAILABLE_SUBCOMMANDS: {
        subcmd1: {
          flags: [{
            name: 'flag1',
            cliConfigs: [{
              name: 'config1',
              alias: ['c1']
            }]
          }]
        }
      }
    });

    const {verifyOptions} = require('../../../../../src/commands/android/subcommands/common');
    const result1 = verifyOptions('subcmd1', {flag1: true, config1: true});
    const output1 = consoleOutput.toString();
    assert.strictEqual(output1.includes('Unknown config(s) passed'), false);
    assert.deepStrictEqual(result1, {subcommandFlag: 'flag1', configs: ['config1']});

    consoleOutput.length = 0;
    const options = {flag1: true, c1: true};

    const result2 = verifyOptions('subcmd1', options);
    const output2 = consoleOutput.toString();
    assert.strictEqual(output2.includes('Unknown config(s) passed'), false);
    assert.deepStrictEqual(result2, {subcommandFlag: 'flag1', configs: ['c1']});

    // main config gets added to options for aliases
    assert.deepStrictEqual(options, {flag1: true, c1: true, config1: true});
  });
  // --- (allowedFlags.length > 0) ends here ---

  // --- (allowedFlags.length = 0) starts here ---
  it('shows error for unknown config (allowedConfigs = 0)', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../../logger',
      class {
        static log(...msgs) {
          consoleOutput.push(...msgs);
        }
      }
    );

    const colorFn = (arg) => arg;
    mockery.registerMock('ansi-colors', {
      green: colorFn,
      yellow: colorFn,
      magenta: colorFn,
      cyan: colorFn,
      red: colorFn,
      gray: colorFn,
      grey: colorFn
    });

    mockery.registerMock('../constants', {
      AVAILABLE_SUBCOMMANDS: {
        subcmd1: {
          flags: [],
          cliConfigs: []
        }
      }
    });

    const {verifyOptions} = require('../../../../../src/commands/android/subcommands/common');
    const result = verifyOptions('subcmd1', {random: true});
    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Unknown config(s) passed for \'subcmd1\' subcommand: random (none expected)'), true);
    assert.deepStrictEqual(result, false);
  });

  it('shows error for unknown config (allowedConfigs > 0)', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../../logger',
      class {
        static log(...msgs) {
          consoleOutput.push(...msgs);
        }
      }
    );

    const colorFn = (arg) => arg;
    mockery.registerMock('ansi-colors', {
      green: colorFn,
      yellow: colorFn,
      magenta: colorFn,
      cyan: colorFn,
      red: colorFn,
      gray: colorFn,
      grey: colorFn
    });

    mockery.registerMock('../constants', {
      AVAILABLE_SUBCOMMANDS: {
        subcmd1: {
          flags: [],
          cliConfigs: [{
            name: 'config1',
            alias: []
          }]
        }
      }
    });

    const {verifyOptions} = require('../../../../../src/commands/android/subcommands/common');
    const result = verifyOptions('subcmd1', {random: true});
    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Unknown config(s) passed for \'subcmd1\' subcommand: random'), true);
    assert.strictEqual(output.includes('(none expected)'), false);
    assert.deepStrictEqual(result, false);
  });

  it('works for correct configs corresponding to the subcommand', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../../logger',
      class {
        static log(...msgs) {
          consoleOutput.push(...msgs);
        }
      }
    );

    const colorFn = (arg) => arg;
    mockery.registerMock('ansi-colors', {
      green: colorFn,
      yellow: colorFn,
      magenta: colorFn,
      cyan: colorFn,
      red: colorFn,
      gray: colorFn,
      grey: colorFn
    });

    mockery.registerMock('../constants', {
      AVAILABLE_SUBCOMMANDS: {
        subcmd1: {
          flags: [],
          cliConfigs: [{
            name: 'config1',
            alias: ['c1']
          }]
        }
      }
    });

    const {verifyOptions} = require('../../../../../src/commands/android/subcommands/common');
    const result1 = verifyOptions('subcmd1', {config1: true});
    const output1 = consoleOutput.toString();
    assert.strictEqual(output1.includes('Unknown config(s) passed'), false);
    assert.deepStrictEqual(result1, {subcommandFlag: '', configs: ['config1']});

    consoleOutput.length = 0;
    const options = {c1: 'something'};
    const result2 = verifyOptions('subcmd1', options);
    const output2 = consoleOutput.toString();
    assert.strictEqual(output2.includes('Unknown config(s) passed'), false);
    assert.deepStrictEqual(result2, {subcommandFlag: '', configs: ['c1']});

    // main config gets added to options for aliases
    assert.deepStrictEqual(options, {c1: 'something', config1: 'something'});
  });
  // --- (allowedFlags.length = 0) ends here ---
});
