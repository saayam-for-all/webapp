const assert = require('assert');
const mockery = require('mockery');

describe('test getAllAvailableOptions', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('returns all options correctly', () => {
    mockery.registerMock('../constants', {
      AVAILABLE_OPTIONS: {
        something: {
          alias: ['s', 'some']
        },
        other_thing: {
          alias: ['other']
        },
        some_other_thing: {
          alias: []
        }
      }
    });

    const {getAllAvailableOptions} = require('../../../../src/commands/android/utils/common');
    const allOptions = getAllAvailableOptions();

    assert.deepStrictEqual(allOptions, ['something', 's', 'some', 'other_thing', 'other', 'some_other_thing']);
  });
});

describe('test getBinaryNameForOS', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('returns all binary names correctly', () => {
    const {getBinaryNameForOS} = require('../../../../src/commands/android/utils/common');

    // for windows
    assert.strictEqual(getBinaryNameForOS('windows', 'sdkmanager'), 'sdkmanager.bat');
    assert.strictEqual(getBinaryNameForOS('windows', 'avdmanager'), 'avdmanager.bat');
    assert.strictEqual(getBinaryNameForOS('windows', 'sdkmanager.bat'), 'sdkmanager.bat');
    assert.strictEqual(getBinaryNameForOS('windows', 'adb'), 'adb.exe');
    assert.strictEqual(getBinaryNameForOS('windows', 'emulator'), 'emulator.exe');
    assert.strictEqual(getBinaryNameForOS('windows', 'adb.exe'), 'adb.exe');

    // for others
    assert.strictEqual(getBinaryNameForOS('mac', 'sdkmanager'), 'sdkmanager');
    assert.strictEqual(getBinaryNameForOS('mac', 'avdmanager.exe'), 'avdmanager.exe');
    assert.strictEqual(getBinaryNameForOS('mac', 'adb'), 'adb');
    assert.strictEqual(getBinaryNameForOS('linux', 'sdkmanager'), 'sdkmanager');
    assert.strictEqual(getBinaryNameForOS('linux', 'avdmanager.exe'), 'avdmanager.exe');
    assert.strictEqual(getBinaryNameForOS('linux', 'adb'), 'adb');
  });
});

describe('test downloadWithProgressBar', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('returns true when completed successfully', async () => {
    let progressBarInitialized = false;
    let progressBarStarted = false;
    let progressBarUpdated = false;
    let progressBarStopped = false;
    mockery.registerMock('cli-progress', {
      Bar: class {
        constructor() {
          progressBarInitialized = true;
        }
        start() {
          progressBarStarted = true;
        }
        update() {
          progressBarUpdated = true;
        }
        stop() {
          progressBarStopped = true;
        }
      },
      Presets: {
        shade_classic: 'something'
      }
    });

    let urlPassed;
    let destPassed;
    let isExtracted;
    mockery.registerMock('download', (url, dest, options) => {
      urlPassed = url;
      destPassed = dest;
      isExtracted = options.extract;

      return {
        on: (event, callback) => {
          callback({percent: 1});
        }
      };
    });

    const url = 'some_url';
    const dest = 'some/dest/path';
    const extract = true;

    const {downloadWithProgressBar} = require('../../../../src/commands/android/utils/common');
    const result = await downloadWithProgressBar(url, dest, extract);

    assert.strictEqual(progressBarInitialized, true);
    assert.strictEqual(urlPassed, url);
    assert.strictEqual(destPassed, dest);
    assert.strictEqual(isExtracted, extract);
    assert.strictEqual(progressBarStarted, true);
    assert.strictEqual(progressBarUpdated, true);
    assert.strictEqual(progressBarStopped, true);
    assert.strictEqual(result, true);
  });

  it('returns false and stops progress when error occur', async () => {
    let progressBarInitialized = false;
    let progressBarStarted = false;
    let progressBarUpdated = false;
    let progressBarStopped = false;
    mockery.registerMock('cli-progress', {
      Bar: class {
        constructor() {
          progressBarInitialized = true;
        }
        start() {
          progressBarStarted = true;
        }
        update() {
          progressBarUpdated = true;
        }
        stop() {
          progressBarStopped = true;
        }
      },
      Presets: {
        shade_classic: 'something'
      }
    });

    let urlPassed;
    let destPassed;
    let isExtracted;
    mockery.registerMock('download', (url, dest, options) => {
      urlPassed = url;
      destPassed = dest;
      isExtracted = options.extract;

      return {
        on: () => {
          throw Error();
        }
      };
    });

    const url = 'some_url';
    const dest = 'some/dest/path';
    const extract = false;

    const {downloadWithProgressBar} = require('../../../../src/commands/android/utils/common');
    const result = await downloadWithProgressBar(url, dest, extract);

    assert.strictEqual(progressBarInitialized, true);
    assert.strictEqual(urlPassed, url);
    assert.strictEqual(destPassed, dest);
    assert.strictEqual(isExtracted, extract);
    assert.strictEqual(progressBarStarted, true);
    assert.strictEqual(progressBarUpdated, false);
    assert.strictEqual(progressBarStopped, true);
    assert.strictEqual(result, false);
  });
});

describe('test checkJavaInstallation', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('returns true if command executed successfully', () => {
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
      grey: colorFn
    });

    const commandsExecuted = [];
    mockery.registerMock('child_process', {
      execSync(command) {
        commandsExecuted.push(command);
      }
    });

    const {checkJavaInstallation} = require('../../../../src/commands/android/utils/common');
    const result = checkJavaInstallation(process.cwd());

    assert.strictEqual(result, true);
    assert.strictEqual(commandsExecuted[0], 'java -version');

    const output = consoleOutput.toString();
    assert.strictEqual(output, '');
  });

  it('returns false if command execution failed', () => {
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
      grey: colorFn
    });

    const commandsExecuted = [];
    mockery.registerMock('child_process', {
      execSync(command) {
        commandsExecuted.push(command);
        throw Error();
      }
    });

    const {checkJavaInstallation} = require('../../../../src/commands/android/utils/common');
    const result = checkJavaInstallation(process.cwd());

    assert.strictEqual(result, false);
    assert.strictEqual(commandsExecuted[0], 'java -version');

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Java Development Kit v9 or above is required'), true);
    assert.strictEqual(output.includes('Make sure Java is installed by running java -version'), true);
  });
});

