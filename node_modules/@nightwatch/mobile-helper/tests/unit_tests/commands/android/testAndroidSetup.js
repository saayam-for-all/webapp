const assert = require('assert');
const fs = require('fs');
const mockery = require('mockery');
const path = require('path');
const os = require('os');
import {ABI} from '../../../../src/commands/android/constants';

describe('test showHelp', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('shows error for unknown options', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();
    androidSetup.showOptionsHelp(['random']);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('unknown option(s) passed: random'), true);
  });

  it('does not shows error for no unknown options', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();
    androidSetup.showOptionsHelp([]);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('unknown option(s) passed:'), false);
  });
});

describe('test getJavaHomeFromUser', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  test('JAVA_HOME auto-detected on mac and normally asked on others', async () => {
    const commandsExecuted = [];
    mockery.registerMock('child_process', {
      execSync(command) {
        commandsExecuted.push(command);

        return 'path/to/auto/detected/jdk';
      }
    });

    let javaHomePassedToPrompt = false;
    mockery.registerMock('inquirer', {
      prompt: async (questions, answers) => {
        if (!!answers.javaHome) {
          javaHomePassedToPrompt = true;

          return answers;
        }

        return {javaHome: 'path/to/prompt/jdk'};
      }
    });

    const rootDir = path.join(__dirname, 'fixtures');

    let appendFileSyncCalledWith;;
    mockery.registerMock('fs', {
      appendFileSync(path, content) {
        appendFileSyncCalledWith = content;
      }
    });

    mockery.registerMock('./adb', {});

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    const javaHome = await androidSetup.getJavaHomeFromUser();

    if (androidSetup.platform === 'mac') {
      assert.strictEqual(javaHomePassedToPrompt, true);
      assert.strictEqual(javaHome, 'path/to/auto/detected/jdk');
      assert.deepStrictEqual(commandsExecuted, ['/usr/libexec/java_home']);
      assert.strictEqual(appendFileSyncCalledWith, '\nJAVA_HOME=path/to/auto/detected/jdk');
    } else {
      assert.strictEqual(javaHomePassedToPrompt, false);
      assert.strictEqual(javaHome, 'path/to/prompt/jdk');
      assert.deepStrictEqual(commandsExecuted, []);
      assert.strictEqual(appendFileSyncCalledWith, '\nJAVA_HOME=path/to/prompt/jdk');
    }
  });

  test('JAVA_HOME normally asked on all platforms if auto-detection fail on mac', async () => {
    const commandsExecuted = [];
    mockery.registerMock('child_process', {
      execSync(command) {
        commandsExecuted.push(command);

        throw new Error();
      }
    });

    let javaHomePassedToPrompt = false;
    mockery.registerMock('inquirer', {
      prompt: async (questions, answers) => {
        if (!!answers.javaHome) {
          javaHomePassedToPrompt = true;

          return answers;
        }

        return {javaHome: 'path/to/prompt/jdk'};
      }
    });

    const rootDir = path.join(__dirname, 'fixtures');

    let appendFileSyncCalledWith;;
    mockery.registerMock('fs', {
      appendFileSync(path, content) {
        appendFileSyncCalledWith = content;
      }
    });

    mockery.registerMock('./adb', {});

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    const javaHome = await androidSetup.getJavaHomeFromUser();

    if (androidSetup.platform === 'mac') {
      assert.deepStrictEqual(commandsExecuted, ['/usr/libexec/java_home']);
    } else {
      assert.deepStrictEqual(commandsExecuted, []);
    }

    assert.strictEqual(javaHomePassedToPrompt, false);
    assert.strictEqual(javaHome, 'path/to/prompt/jdk');
    assert.strictEqual(appendFileSyncCalledWith, '\nJAVA_HOME=path/to/prompt/jdk');
  });
});

describe('test getSdkRootFromUser', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  test('when ANDROID_HOME defined in env (empty string) and user passed absolute path', async () => {
    const platformAbsoluteAndroidHome = (process.platform === 'win32')
      ? 'C:\\users\\nightwatch\\android_sdk' : '/Users/nightwatch/android_sdk';

    let filterFn;
    mockery.registerMock('inquirer', {
      prompt: async (questions) => {
        filterFn = questions[0].filter;

        return {sdkRoot: filterFn(platformAbsoluteAndroidHome)};
      }
    });

    const rootDir = path.join(__dirname, 'fixtures');

    let appendFileSyncCalled = false;
    mockery.registerMock('fs', {
      appendFileSync(path, content) {
        appendFileSyncCalled = true;
      }
    });

    mockery.registerMock('./adb', {});

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.otherInfo.androidHomeInGlobalEnv = true;
    const sdkRoot = await androidSetup.getSdkRootFromUser();

    // sdkRoot is absolute
    assert.strictEqual(sdkRoot, path.resolve(sdkRoot));
    // sdkRoot is as expected
    assert.strictEqual(sdkRoot, platformAbsoluteAndroidHome);

    assert.strictEqual(appendFileSyncCalled, false);
  });

  test('when ANDROID_HOME defined in env (empty string) and user passed ~ path', async () => {
    const androidHome = path.join('~', 'android_sdk_tilde');

    let filterFn;
    mockery.registerMock('inquirer', {
      prompt: async (questions) => {
        filterFn = questions[0].filter;

        return {sdkRoot: filterFn(androidHome)};
      }
    });

    const rootDir = path.join(__dirname, 'fixtures');

    let appendFileSyncCalled = false;
    mockery.registerMock('fs', {
      appendFileSync(path, content) {
        appendFileSyncCalled = true;
      }
    });

    mockery.registerMock('./adb', {});

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.otherInfo.androidHomeInGlobalEnv = true;
    const sdkRoot = await androidSetup.getSdkRootFromUser();

    // sdkRoot is absolute
    assert.strictEqual(sdkRoot, path.resolve(sdkRoot));
    // sdkRoot is as expected
    assert.strictEqual(sdkRoot, path.join(os.homedir(), 'android_sdk_tilde'));

    assert.strictEqual(appendFileSyncCalled, false);
  });

  test('when ANDROID_HOME not defined in env and user passed relative path', async () => {
    const androidHome = 'android_sdk_relative';

    let filterFn;
    mockery.registerMock('inquirer', {
      prompt: async (questions) => {
        filterFn = questions[0].filter;

        return {sdkRoot: filterFn(androidHome)};
      }
    });

    const rootDir = path.join(__dirname, 'fixtures');

    let appendFileSyncCalled = false;
    let envPath;
    let envContent;
    mockery.registerMock('fs', {
      appendFileSync(path, content) {
        appendFileSyncCalled = true;
        envPath = path;
        envContent = content;
      }
    });

    mockery.registerMock('./adb', {});

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.otherInfo.androidHomeInGlobalEnv = false;
    const sdkRoot = await androidSetup.getSdkRootFromUser();

    // sdkRoot is absolute
    assert.strictEqual(sdkRoot, path.resolve(sdkRoot));
    // sdkRoot is as expected
    const androidHomeAbsolute = path.join(rootDir, androidHome);
    assert.strictEqual(sdkRoot, androidHomeAbsolute);

    assert.strictEqual(appendFileSyncCalled, true);
    assert.strictEqual(envPath, path.join(rootDir, '.env'));
    assert.strictEqual(envContent.includes(`ANDROID_HOME=${androidHomeAbsolute}`), true);
  });
});

describe('test getConfigFromOptions', function() {
  test('with different arguments', () => {
    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    let configs = androidSetup.getConfigFromOptions({mode: 'emulator,real', browsers: 'chrome,firefox,something'});
    assert.deepStrictEqual(configs, {mode: 'both', browsers: 'both'});

    configs = androidSetup.getConfigFromOptions({mode: 'emulator,both', browsers: 'chrome,both'});
    assert.deepStrictEqual(configs, {mode: 'both', browsers: 'both'});

    configs = androidSetup.getConfigFromOptions({mode: 'something', browsers: 'chrome,firefox,none'});
    assert.deepStrictEqual(configs, {browsers: 'none'});

    configs = androidSetup.getConfigFromOptions({mode: 'emulator', browsers: 'something'});
    assert.deepStrictEqual(configs, {mode: 'emulator'});

    configs = androidSetup.getConfigFromOptions({mode: 'real', browsers: 'firefox'});
    assert.deepStrictEqual(configs, {mode: 'real', browsers: 'firefox'});

    configs = androidSetup.getConfigFromOptions({mode: ['real', 'emulator'], browsers: ['chrome', 'something']});
    assert.deepStrictEqual(configs, {mode: 'both', browsers: 'chrome'});

    configs = androidSetup.getConfigFromOptions({mode: true, browsers: []});
    assert.deepStrictEqual(configs, {});

    configs = androidSetup.getConfigFromOptions({standalone: true});
    assert.deepStrictEqual(configs, {browsers: 'none'});

    configs = androidSetup.getConfigFromOptions({standalone: true, browsers: false});
    assert.deepStrictEqual(configs, {browsers: 'none'});

    // if just `--browsers` option is passed with no argument, ask the browsers question.
    configs = androidSetup.getConfigFromOptions({standalone: true, browsers: true});
    assert.deepStrictEqual(configs, {});

    configs = androidSetup.getConfigFromOptions({standalone: true, browsers: 'chrome'});
    assert.deepStrictEqual(configs, {browsers: 'chrome'});

    configs = androidSetup.getConfigFromOptions({standalone: true, browsers: 'chrome,firefox'});
    assert.deepStrictEqual(configs, {browsers: 'both'});

    configs = androidSetup.getConfigFromOptions({standalone: true, browsers: 'brave'});
    assert.deepStrictEqual(configs, {browsers: 'none'});
  });
});

describe('test getSetupConfigs', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  test('options being passed to prompt correctly', async () => {
    mockery.registerMock('inquirer', {
      async prompt(questions, answers) {
        return answers;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    let configs = await androidSetup.getSetupConfigs({mode: 'emulator,real', browsers: 'chrome,firefox,something'});
    assert.deepStrictEqual(configs, {mode: 'both', browsers: 'both'});

    configs = await androidSetup.getSetupConfigs({mode: 'something', browsers: 'chrome,firefox,none'});
    assert.deepStrictEqual(configs, {browsers: 'none'});
  });
});

describe('test checkBinariesPresent', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  test('missing binaries reported correctly', () => {
    mockery.registerMock('./utils/common', {
      getBinaryLocation: (sdkRoot, platform, binaryName) => {
        if (binaryName === 'emulator') {
          return '';
        }

        return 'some/location';
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    let missingBinaries = androidSetup.checkBinariesPresent(['adb', 'emulator', 'avdmanager']);
    assert.deepStrictEqual(missingBinaries, ['emulator']);
  });
});

describe('test checkBinariesWorking', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  test('non-working binaries reported correctly', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    mockery.registerMock('./utils/common', {
      getBinaryLocation: (sdkRoot, platform, binaryName) => {
        if (binaryName === 'sdkmanager') {
          return '';
        }

        return 'some/location';
      }
    });

    const commandsExecuted = [];
    mockery.registerMock('./utils/sdk', {
      execBinarySync: (binaryPath, binaryName, platform, cmd) => {
        commandsExecuted.push(binaryName + ' ' + cmd);

        if (binaryName === 'avdmanager') {
          return null;
        }

        return 'some stdout';
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    let missingBinaries = androidSetup.checkBinariesWorking(['adb', 'emulator', 'avdmanager', 'sdkmanager']);
    assert.deepStrictEqual(missingBinaries, ['avdmanager', 'sdkmanager']);
    assert.deepStrictEqual(commandsExecuted, ['adb --version', 'emulator -version', 'avdmanager list avd']);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('sdkmanager binary not found.'), true);
  });
});

describe('test verifyAvdPresent', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('returns false when avd binary location not found', () => {
    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return '';
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    let avdPresent = androidSetup.verifyAvdPresent();
    assert.strictEqual(avdPresent, false);
  });

  it('returns false when avd is not already present', () => {
    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return 'some/location';
      }
    });

    mockery.registerMock('./utils/sdk', {
      execBinarySync: () => {
        return 'something not avd';
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    let avdPresent = androidSetup.verifyAvdPresent();
    assert.strictEqual(avdPresent, false);
  });

  it('returns false when avd command face error (returns null)', () => {
    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return 'some/location';
      }
    });

    mockery.registerMock('./utils/sdk', {
      execBinarySync: () => {
        return null;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    let avdPresent = androidSetup.verifyAvdPresent();
    assert.strictEqual(avdPresent, false);
  });

  it('returns true when avd is already present', () => {
    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return 'some/location';
      }
    });

    mockery.registerMock('./utils/sdk', {
      execBinarySync: () => {
        return `something not avd
        nightwatch-android-11
        Android Virtual Devices could not be loaded
        something not avd`;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    let avdPresent = androidSetup.verifyAvdPresent();
    assert.strictEqual(avdPresent, true);
  });

  it('returns false when avd is already present but could not be loaded', () => {
    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return 'some/location';
      }
    });

    mockery.registerMock('./utils/sdk', {
      execBinarySync: () => {
        return `something not avd
        something not avd again
        Android Virtual Devices could not be loaded
        nightwatch-android-11`;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    let avdPresent = androidSetup.verifyAvdPresent();
    assert.strictEqual(avdPresent, false);
  });
});

describe('test verifyAdbRunning', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  test('if adb binary location not found', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return '';
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();
    androidSetup.verifyAdbRunning();

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('adb binary not found.'), true);
  });

  test('if adb command face error (returns null)', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return 'some/location';
      }
    });

    mockery.registerMock('./utils/sdk', {
      execBinarySync: () => {
        return null;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();
    androidSetup.verifyAdbRunning();

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('try running the above command'), true);
  });

  test('if adb server is running', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return 'some/location';
      }
    });

    mockery.registerMock('./utils/sdk', {
      execBinarySync: () => {
        return '';
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();
    androidSetup.verifyAdbRunning();

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('adb server is running'), true);
  });
});

describe('test verifySetup', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  test('for real mode and adb binary not present', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    let platformFolderChecked = false;
    mockery.registerMock('fs', {
      existsSync(path, ...args) {
        if (path.endsWith('platforms')) {
          platformFolderChecked = true;

          return false;
        }

        return fs.existsSync(path, ...args);
      }
    });

    let buildToolsChecked = false;
    mockery.registerMock('./utils/sdk', {
      getBuildToolsAvailableVersions() {
        buildToolsChecked = true;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    const binariesCheckedForPresent = [];
    androidSetup.checkBinariesPresent = (binaries) => {
      binariesCheckedForPresent.push(...binaries);

      // all binaries missing
      return binaries;
    };

    let checkBinariesWorkingCalled = false;
    const binariesCheckedForWorking = [];
    androidSetup.checkBinariesWorking = (binaries) => {
      checkBinariesWorkingCalled = true;
      binariesCheckedForWorking.push(...binaries);

      // all binaries not working
      return binaries;
    };

    let avdChecked = false;
    androidSetup.verifyAvdPresent = () => {
      avdChecked = true;

      return false;
    };

    let adbRunningChecked = false;
    androidSetup.verifyAdbRunning = () => {
      adbRunningChecked = true;
    };

    const missingRequirements = androidSetup.verifySetup({mode: 'real'});

    assert.deepStrictEqual(binariesCheckedForPresent, ['adb']);
    assert.strictEqual(platformFolderChecked, false);
    assert.strictEqual(buildToolsChecked, false);
    assert.strictEqual(avdChecked, false);
    // adb binary not present
    assert.strictEqual(checkBinariesWorkingCalled, false);
    assert.strictEqual(adbRunningChecked, false);
    assert.deepStrictEqual(missingRequirements, ['adb']);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Verifying the setup requirements for real devices...'), true);
  });

  test('for real mode and adb binary present and working', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    let platformFolderChecked = false;
    mockery.registerMock('fs', {
      existsSync(path, ...args) {
        if (path.endsWith('platforms')) {
          platformFolderChecked = true;

          return false;
        }

        return fs.existsSync(path, ...args);
      }
    });

    let buildToolsChecked = false;
    mockery.registerMock('./utils/sdk', {
      getBuildToolsAvailableVersions() {
        buildToolsChecked = true;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    const binariesCheckedForPresent = [];
    androidSetup.checkBinariesPresent = (binaries) => {
      binariesCheckedForPresent.push(...binaries);

      // all binaries present
      return [];
    };

    let checkBinariesWorkingCalled = false;
    const binariesCheckedForWorking = [];
    androidSetup.checkBinariesWorking = (binaries) => {
      checkBinariesWorkingCalled = true;
      binariesCheckedForWorking.push(...binaries);

      // all binaries working
      return [];
    };

    let avdChecked = false;
    androidSetup.verifyAvdPresent = () => {
      avdChecked = true;

      return false;
    };

    let adbRunningChecked = false;
    androidSetup.verifyAdbRunning = () => {
      adbRunningChecked = true;
    };

    const missingRequirements = androidSetup.verifySetup({mode: 'real'});

    assert.deepStrictEqual(binariesCheckedForPresent, ['adb']);
    assert.strictEqual(platformFolderChecked, false);
    assert.strictEqual(buildToolsChecked, false);
    assert.strictEqual(avdChecked, false);
    // adb binary present and working
    assert.strictEqual(checkBinariesWorkingCalled, true);
    assert.deepStrictEqual(binariesCheckedForWorking, ['adb']);
    assert.strictEqual(adbRunningChecked, true);
    assert.deepStrictEqual(missingRequirements, []);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Verifying the setup requirements for real devices...'), true);
  });

  test('for real mode and Appium with adb binary present not working and build-tools not present', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    let platformFolderChecked = false;
    mockery.registerMock('fs', {
      existsSync(path, ...args) {
        if (path.endsWith('platforms')) {
          platformFolderChecked = true;

          return false;
        }

        return fs.existsSync(path, ...args);
      }
    });

    let buildToolsChecked = false;
    mockery.registerMock('./utils/sdk', {
      getBuildToolsAvailableVersions() {
        buildToolsChecked = true;

        return [];
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({appium: true});

    const binariesCheckedForPresent = [];
    androidSetup.checkBinariesPresent = (binaries) => {
      binariesCheckedForPresent.push(...binaries);

      // all listed binaries present
      return [];
    };

    let checkBinariesWorkingCalled = false;
    const binariesCheckedForWorking = [];
    androidSetup.checkBinariesWorking = (binaries) => {
      checkBinariesWorkingCalled = true;
      binariesCheckedForWorking.push(...binaries);

      // adb not working
      return ['adb'];
    };

    let avdChecked = false;
    androidSetup.verifyAvdPresent = () => {
      avdChecked = true;

      return false;
    };

    let adbRunningChecked = false;
    androidSetup.verifyAdbRunning = () => {
      adbRunningChecked = true;
    };

    const missingRequirements = androidSetup.verifySetup({mode: 'real'});

    assert.deepStrictEqual(binariesCheckedForPresent, ['adb']);
    assert.strictEqual(platformFolderChecked, false);
    assert.strictEqual(buildToolsChecked, true);
    assert.strictEqual(avdChecked, false);
    // adb binary present not working
    assert.strictEqual(checkBinariesWorkingCalled, true);
    assert.deepStrictEqual(binariesCheckedForWorking, ['adb']);
    assert.strictEqual(adbRunningChecked, false);
    assert.deepStrictEqual(missingRequirements, ['build-tools', 'adb']);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Verifying the setup requirements for real devices...'), true);
    assert.strictEqual(output.includes('Android Build Tools not present at'), true);
  });

  test('for emulator mode and emulator, platforms not present and adb not working', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    let platformFolderChecked = false;
    mockery.registerMock('fs', {
      existsSync(path, ...args) {
        if (path.endsWith('platforms')) {
          platformFolderChecked = true;

          return false;
        }

        return fs.existsSync(path, ...args);
      }
    });

    let buildToolsChecked = false;
    mockery.registerMock('./utils/sdk', {
      getBuildToolsAvailableVersions() {
        buildToolsChecked = true;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    const binariesCheckedForPresent = [];
    androidSetup.checkBinariesPresent = (binaries) => {
      binariesCheckedForPresent.push(...binaries);

      // binaries not present
      return ['emulator'];
    };

    let checkBinariesWorkingCalled = false;
    const binariesCheckedForWorking = [];
    androidSetup.checkBinariesWorking = (binaries) => {
      checkBinariesWorkingCalled = true;
      binariesCheckedForWorking.push(...binaries);

      // binaries not working
      return ['adb'];
    };

    let avdChecked = false;
    androidSetup.verifyAvdPresent = () => {
      avdChecked = true;

      return true;
    };

    let adbRunningChecked = false;
    androidSetup.verifyAdbRunning = () => {
      adbRunningChecked = true;
    };

    const missingRequirements = androidSetup.verifySetup({mode: 'emulator'});

    assert.deepStrictEqual(binariesCheckedForPresent, ['adb', 'avdmanager', 'emulator']);
    assert.strictEqual(platformFolderChecked, true);
    assert.strictEqual(buildToolsChecked, false);
    assert.strictEqual(avdChecked, true);

    assert.strictEqual(checkBinariesWorkingCalled, true);
    assert.deepStrictEqual(binariesCheckedForWorking, ['adb', 'avdmanager']);
    assert.strictEqual(adbRunningChecked, false);
    assert.deepStrictEqual(missingRequirements, ['emulator', 'platforms', 'adb']);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Verifying the setup requirements for Android emulator...'), true);
    assert.strictEqual(output.includes('platforms subdirectory not present at'), true);
    assert.strictEqual(output.includes('AVD is present and ready to be used.'), true);
  });

  test('for both modes with Appium and AVD not present and everything working', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    let platformFolderChecked = false;
    mockery.registerMock('fs', {
      existsSync(path, ...args) {
        if (path.endsWith('platforms')) {
          platformFolderChecked = true;

          return true;
        }

        return fs.existsSync(path, ...args);
      }
    });

    let buildToolsChecked = false;
    mockery.registerMock('./utils/sdk', {
      getBuildToolsAvailableVersions() {
        buildToolsChecked = true;

        return ['31.0.1'];
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({appium: true});

    const binariesCheckedForPresent = [];
    androidSetup.checkBinariesPresent = (binaries) => {
      binariesCheckedForPresent.push(...binaries);

      // binaries not present
      return [];
    };

    let checkBinariesWorkingCalled = false;
    const binariesCheckedForWorking = [];
    androidSetup.checkBinariesWorking = (binaries) => {
      checkBinariesWorkingCalled = true;
      binariesCheckedForWorking.push(...binaries);

      // binaries not working
      return [];
    };

    let avdChecked = false;
    androidSetup.verifyAvdPresent = () => {
      avdChecked = true;

      return false;
    };

    let adbRunningChecked = false;
    androidSetup.verifyAdbRunning = () => {
      adbRunningChecked = true;
    };

    const missingRequirements = androidSetup.verifySetup({mode: 'both'});

    assert.deepStrictEqual(binariesCheckedForPresent, ['adb', 'avdmanager', 'emulator']);
    assert.strictEqual(platformFolderChecked, true);
    assert.strictEqual(buildToolsChecked, true);
    assert.strictEqual(avdChecked, true);

    assert.strictEqual(checkBinariesWorkingCalled, true);
    assert.deepStrictEqual(binariesCheckedForWorking, ['adb', 'avdmanager', 'emulator']);
    assert.strictEqual(adbRunningChecked, false);
    assert.deepStrictEqual(missingRequirements, ['nightwatch-android-11']);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Verifying the setup requirements for real devices/emulator...'), true);
    assert.strictEqual(output.includes('Android Build Tools present at'), true);
    assert.strictEqual(output.includes('Available versions: 31.0.1'), true);
    assert.strictEqual(output.includes('platforms subdirectory is present at'), true);
    assert.strictEqual(output.includes('AVD not found.'), true);
  });

  test('for both modes and everything present and working', () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    let platformFolderChecked = false;
    mockery.registerMock('fs', {
      existsSync(path, ...args) {
        if (path.endsWith('platforms')) {
          platformFolderChecked = true;

          return true;
        }

        return fs.existsSync(path, ...args);
      }
    });

    let buildToolsChecked = false;
    mockery.registerMock('./utils/sdk', {
      getBuildToolsAvailableVersions() {
        buildToolsChecked = true;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    const binariesCheckedForPresent = [];
    androidSetup.checkBinariesPresent = (binaries) => {
      binariesCheckedForPresent.push(...binaries);

      // binaries not present
      return [];
    };

    let checkBinariesWorkingCalled = false;
    const binariesCheckedForWorking = [];
    androidSetup.checkBinariesWorking = (binaries) => {
      checkBinariesWorkingCalled = true;
      binariesCheckedForWorking.push(...binaries);

      // binaries not working
      return [];
    };

    let avdChecked = false;
    androidSetup.verifyAvdPresent = () => {
      avdChecked = true;

      return true;
    };

    let adbRunningChecked = false;
    androidSetup.verifyAdbRunning = () => {
      adbRunningChecked = true;
    };

    const missingRequirements = androidSetup.verifySetup({mode: 'both'});

    assert.deepStrictEqual(binariesCheckedForPresent, ['adb', 'avdmanager', 'emulator']);
    assert.strictEqual(platformFolderChecked, true);
    assert.strictEqual(buildToolsChecked, false);
    assert.strictEqual(avdChecked, true);

    assert.strictEqual(checkBinariesWorkingCalled, true);
    assert.deepStrictEqual(binariesCheckedForWorking, ['adb', 'avdmanager', 'emulator']);
    assert.strictEqual(adbRunningChecked, true);
    assert.deepStrictEqual(missingRequirements, []);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Verifying the setup requirements for real devices/emulator...'), true);
    assert.strictEqual(output.includes('platforms subdirectory is present at'), true);
    assert.strictEqual(output.includes('AVD is present and ready to be used.'), true);
  });
});

describe('test setupAndroid', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  test('for real mode and Appium with adb, sdkmanager not present and build-tools present', async () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return '';
      }
    });

    let cmdlineToolsDownloaded = false;
    const packagesInstalled = [];
    let avdCreationInitiated = false;
    let buildToolsDownloaded = false;
    mockery.registerMock('./utils/sdk', {
      downloadAndSetupAndroidSdk: () => {
        cmdlineToolsDownloaded = true;
      },
      installPackagesUsingSdkManager: (sdkmanagerLocation, platform, packagesToInstall) => {
        packagesInstalled.push(...packagesToInstall);

        return true;
      },
      execBinarySync: () => {
        avdCreationInitiated = true;

        return '';
      },
      downloadSdkBuildTools() {
        buildToolsDownloaded = true;

        return true;
      }
    });

    let platformFolderCreated = false;
    mockery.registerMock('fs', {
      mkdirSync() {
        platformFolderCreated = true;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({appium: true});

    const binariesCheckedForWorking = [];
    androidSetup.checkBinariesWorking = (binaries) => {
      binariesCheckedForWorking.push(...binaries);

      // all binaries not working
      return binaries;
    };

    let avdChecked = false;
    androidSetup.verifyAvdPresent = () => {
      avdChecked = true;

      return false;
    };

    let adbRunningChecked = false;
    androidSetup.verifyAdbRunning = () => {
      adbRunningChecked = true;
    };

    const result = await androidSetup.setupAndroid({mode: 'real'}, ['adb']);

    assert.deepStrictEqual(binariesCheckedForWorking, ['sdkmanager']);
    assert.strictEqual(cmdlineToolsDownloaded, true);
    assert.deepStrictEqual(packagesInstalled, ['platform-tools']);
    assert.strictEqual(platformFolderCreated, false);
    assert.strictEqual(buildToolsDownloaded, true);
    assert.strictEqual(avdChecked, false);
    assert.strictEqual(avdCreationInitiated, false);
    assert.strictEqual(adbRunningChecked, true);
    assert.strictEqual(result, true);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Setting up missing requirements for real devices...'), true);
    assert.strictEqual(output.includes('Verifying that sdkmanager is present and working...'), true);
    assert.strictEqual(output.includes('Success!'), false); // sdkmanager not present/working
    assert.strictEqual(output.includes('Downloading cmdline-tools...'), true);
  });

  test('for emulator mode and Appium with avdmanager, platforms, AVD not present', async () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return '';
      }
    });

    let cmdlineToolsDownloaded = false;
    const packagesInstalled = [];
    let avdCreationInitiated = false;
    let buildToolsDownloaded = false;
    mockery.registerMock('./utils/sdk', {
      downloadAndSetupAndroidSdk: () => {
        cmdlineToolsDownloaded = true;
      },
      installPackagesUsingSdkManager: (sdkmanagerLocation, platform, packagesToInstall) => {
        packagesInstalled.push(...packagesToInstall);

        return true;
      },
      execBinarySync: () => {
        avdCreationInitiated = true;

        return '';
      },
      downloadSdkBuildTools() {
        buildToolsDownloaded = true;

        return true;
      }
    });

    let platformFolderCreated = false;
    mockery.registerMock('fs', {
      mkdirSync() {
        platformFolderCreated = true;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({appium: true});

    const binariesCheckedForWorking = [];
    androidSetup.checkBinariesWorking = (binaries) => {
      binariesCheckedForWorking.push(...binaries);

      // all binaries working
      return [];
    };

    let avdChecked = false;
    androidSetup.verifyAvdPresent = () => {
      avdChecked = true;

      return false;
    };

    let adbRunningChecked = false;
    androidSetup.verifyAdbRunning = () => {
      adbRunningChecked = true;
    };

    const result = await androidSetup.setupAndroid({mode: 'emulator'}, ['avdmanager', 'platforms', 'nightwatch-android-11']);

    assert.deepStrictEqual(binariesCheckedForWorking, ['sdkmanager']);
    assert.strictEqual(cmdlineToolsDownloaded, true);
    assert.deepStrictEqual(packagesInstalled, [`system-images;android-30;google_apis;${ABI}`, 'emulator']); // emulator updated
    assert.strictEqual(platformFolderCreated, true);
    assert.strictEqual(buildToolsDownloaded, true);
    assert.strictEqual(avdChecked, true);
    assert.strictEqual(avdCreationInitiated, true);
    assert.strictEqual(adbRunningChecked, true);
    assert.strictEqual(result, true);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Setting up missing requirements for Android emulator...'), true);
    assert.strictEqual(output.includes('Verifying that sdkmanager is present and working...'), true);
    assert.strictEqual(output.includes('Success!'), true); // sdkmanager present and working
    assert.strictEqual(output.includes('Downloading cmdline-tools...'), true);
    assert.strictEqual(output.includes('Creating platforms subdirectory...'), true);
    assert.strictEqual(output.includes('Success! Created platforms subdirectory at'), true);
    assert.strictEqual(output.includes('Creating AVD "nightwatch-android-11" using pixel_5 hardware profile...'), true);
    assert.strictEqual(output.includes('Success! AVD "nightwatch-android-11" created successfully!'), true);
  });

  test('for both modes with sdkmanager, avdmanager, emulator not present and emulator install failed', async () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return '';
      }
    });

    let cmdlineToolsDownloaded = false;
    const packagesToInstall = [];
    let avdCreationInitiated = false;
    let buildToolsDownloaded = false;
    mockery.registerMock('./utils/sdk', {
      downloadAndSetupAndroidSdk: () => {
        cmdlineToolsDownloaded = true;
      },
      installPackagesUsingSdkManager: (sdkmanagerLocation, platform, packages) => {
        packagesToInstall.push(...packages);

        return false;
      },
      execBinarySync: () => {
        avdCreationInitiated = true;

        return '';
      },
      downloadSdkBuildTools() {
        buildToolsDownloaded = true;

        return true;
      }
    });

    let platformFolderCreated = false;
    mockery.registerMock('fs', {
      mkdirSync() {
        platformFolderCreated = true;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    const binariesCheckedForWorking = [];
    androidSetup.checkBinariesWorking = (binaries) => {
      binariesCheckedForWorking.push(...binaries);

      // all binaries not working
      return binaries;
    };

    let avdChecked = false;
    androidSetup.verifyAvdPresent = () => {
      avdChecked = true;

      return true;
    };

    let adbRunningChecked = false;
    androidSetup.verifyAdbRunning = () => {
      adbRunningChecked = true;
    };

    const result = await androidSetup.setupAndroid({mode: 'both'}, ['avdmanager', 'emulator']);

    assert.deepStrictEqual(binariesCheckedForWorking, ['sdkmanager']);
    assert.strictEqual(cmdlineToolsDownloaded, true);
    assert.deepStrictEqual(packagesToInstall, ['emulator']);
    assert.strictEqual(platformFolderCreated, false);
    assert.strictEqual(buildToolsDownloaded, false);
    assert.strictEqual(avdChecked, false);
    assert.strictEqual(avdCreationInitiated, false);
    assert.strictEqual(adbRunningChecked, true);
    // emulator install failed
    assert.strictEqual(result, false);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Setting up missing requirements for real devices/emulator...'), true);
    assert.strictEqual(output.includes('Verifying that sdkmanager is present and working...'), true);
    assert.strictEqual(output.includes('Success!'), false); // sdkmanager not present/working
    assert.strictEqual(output.includes('Downloading cmdline-tools...'), true);
    assert.strictEqual(output.includes('Creating AVD "nightwatch-android-11" using pixel_5 hardware profile...'), false);
  });

  test('for both modes with sdkmanager, avdmanager present and avd not present + creation failed', async () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return '';
      }
    });

    let cmdlineToolsDownloaded = false;
    const packagesToInstall = [];
    let avdCreationInitiated = false;
    let buildToolsDownloaded = false;
    mockery.registerMock('./utils/sdk', {
      downloadAndSetupAndroidSdk: () => {
        cmdlineToolsDownloaded = true;
      },
      installPackagesUsingSdkManager: (sdkmanagerLocation, platform, packages) => {
        packagesToInstall.push(...packages);

        return true;
      },
      execBinarySync: () => {
        avdCreationInitiated = true;

        return null;
      },
      downloadSdkBuildTools() {
        buildToolsDownloaded = true;

        return true;
      }
    });

    let platformFolderCreated = false;
    mockery.registerMock('fs', {
      mkdirSync() {
        platformFolderCreated = true;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup();

    const binariesCheckedForWorking = [];
    androidSetup.checkBinariesWorking = (binaries) => {
      binariesCheckedForWorking.push(...binaries);

      // all binaries working
      return [];
    };

    let avdChecked = false;
    androidSetup.verifyAvdPresent = () => {
      avdChecked = true;

      return false;
    };

    let adbRunningChecked = false;
    androidSetup.verifyAdbRunning = () => {
      adbRunningChecked = true;
    };

    const result = await androidSetup.setupAndroid({mode: 'both'}, ['nightwatch-android-11']);

    assert.deepStrictEqual(binariesCheckedForWorking, ['sdkmanager']);
    assert.strictEqual(cmdlineToolsDownloaded, false);
    assert.deepStrictEqual(packagesToInstall, [`system-images;android-30;google_apis;${ABI}`, 'emulator']); // emulator updated
    assert.strictEqual(platformFolderCreated, false);
    assert.strictEqual(buildToolsDownloaded, false);
    assert.strictEqual(avdChecked, true);
    assert.strictEqual(avdCreationInitiated, true);
    assert.strictEqual(adbRunningChecked, true);
    // avd creation failed
    assert.strictEqual(result, false);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Setting up missing requirements for real devices/emulator...'), true);
    assert.strictEqual(output.includes('Verifying that sdkmanager is present and working...'), true);
    assert.strictEqual(output.includes('Success!'), true); // sdkmanager present and working
    assert.strictEqual(output.includes('Downloading cmdline-tools...'), false);
    assert.strictEqual(output.includes('Creating AVD "nightwatch-android-11" using pixel_5 hardware profile...'), true);
    assert.strictEqual(output.includes('Success! AVD "nightwatch-android-11" created successfully!'), false);
  });

  test('for both modes and Appium with system-image not installed but avd already present and build-tools not present and failed', async () => {
    const consoleOutput = [];
    mockery.registerMock(
      '../../logger',
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

    mockery.registerMock('./utils/common', {
      getBinaryLocation: () => {
        return '';
      }
    });

    let cmdlineToolsDownloaded = false;
    const packagesToInstall = [];
    let avdCreationInitiated = false;
    let buildToolsDownloaded = false;
    mockery.registerMock('./utils/sdk', {
      downloadAndSetupAndroidSdk: () => {
        cmdlineToolsDownloaded = true;
      },
      installPackagesUsingSdkManager: (sdkmanagerLocation, platform, packages) => {
        packagesToInstall.push(...packages);

        return true;
      },
      execBinarySync: () => {
        avdCreationInitiated = true;

        return 'something (stdout)';
      },
      downloadSdkBuildTools() {
        buildToolsDownloaded = true;

        return false;
      }
    });

    let platformFolderCreated = false;
    mockery.registerMock('fs', {
      mkdirSync() {
        platformFolderCreated = true;
      }
    });

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({appium: true});

    const binariesCheckedForWorking = [];
    androidSetup.checkBinariesWorking = (binaries) => {
      binariesCheckedForWorking.push(...binaries);

      // all binaries working
      return [];
    };

    let avdChecked = false;
    androidSetup.verifyAvdPresent = () => {
      avdChecked = true;

      return true;
    };

    let adbRunningChecked = false;
    androidSetup.verifyAdbRunning = () => {
      adbRunningChecked = true;
    };

    const result = await androidSetup.setupAndroid({mode: 'both'}, ['nightwatch-android-11', 'build-tools']);

    assert.deepStrictEqual(binariesCheckedForWorking, ['sdkmanager']);
    assert.strictEqual(cmdlineToolsDownloaded, false);
    assert.deepStrictEqual(packagesToInstall, [`system-images;android-30;google_apis;${ABI}`, 'emulator']); // emulator updated
    assert.strictEqual(platformFolderCreated, false);
    assert.strictEqual(buildToolsDownloaded, true);
    assert.strictEqual(avdChecked, true);
    assert.strictEqual(avdCreationInitiated, false);
    assert.strictEqual(adbRunningChecked, true);
    // build-tools failed
    assert.strictEqual(result, false);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('Setting up missing requirements for real devices/emulator...'), true);
    assert.strictEqual(output.includes('Verifying that sdkmanager is present and working...'), true);
    assert.strictEqual(output.includes('Success!'), true); // sdkmanager present and working
    assert.strictEqual(output.includes('Downloading cmdline-tools...'), false);
    assert.strictEqual(output.includes('Creating AVD "nightwatch-android-11" using pixel_5 hardware profile...'), false);
  });
});
