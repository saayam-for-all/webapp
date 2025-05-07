const assert = require('assert');
const {config: dotenv_config} = require('dotenv');
const fs = require('fs');
const mockery = require('mockery');
const path = require('path');
const os = require('os');


describe('test loadEnvFromDotEnv', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});

    // Delete any set process.env
    delete process.env.ANDROID_HOME;
    delete process.env.JAVA_HOME;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();

    // Remove contents of .env file
    const rootDir = path.join(__dirname, 'fixtures');
    fs.writeFileSync(path.join(rootDir, '.env'), '');
  });

  test('ANDROID_HOME and JAVA_HOME set in env with ANDROID_HOME set in .env and no Appium', function() {
    let dotenvRead = false;
    mockery.registerMock('dotenv', {
      config: (options) => {
        if (fs.existsSync(options.path)) {
          dotenvRead = true;
        }

        dotenv_config(options);
      }
    });

    process.env.ANDROID_HOME = 'path/to/android/sdk';
    process.env.JAVA_HOME = 'path/to/java';

    const rootDir = path.join(__dirname, 'fixtures');
    fs.writeFileSync(path.join(rootDir, '.env'), '\nANDROID_HOME=path/to/random/sdk');

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.loadEnvFromDotEnv();

    assert.strictEqual(androidSetup.otherInfo.androidHomeInGlobalEnv, true);
    assert.strictEqual(androidSetup.otherInfo.javaHomeInGlobalEnv, false);

    assert.strictEqual(dotenvRead, true);
    assert.strictEqual(process.env.ANDROID_HOME, 'path/to/android/sdk');
    assert.strictEqual(process.env.JAVA_HOME, 'path/to/java');
  });

  test('JAVA_HOME set in env with Appium', function() {
    process.env.JAVA_HOME = 'path/to/java';

    const rootDir = path.join(__dirname, 'fixtures');

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.options.appium = true;
    androidSetup.loadEnvFromDotEnv();

    assert.strictEqual(androidSetup.otherInfo.androidHomeInGlobalEnv, false);
    assert.strictEqual(androidSetup.otherInfo.javaHomeInGlobalEnv, true);

    assert.strictEqual(process.env.ANDROID_HOME, undefined);
    assert.strictEqual(process.env.JAVA_HOME, 'path/to/java');
  });

  test('ANDROID_HOME and JAVA_HOME not set in env but in .env', function() {
    let dotenvRead = false;
    mockery.registerMock('dotenv', {
      config: (options) => {
        if (fs.existsSync(options.path)) {
          dotenvRead = true;
        }

        dotenv_config(options);
      }
    });

    const rootDir = path.join(__dirname, 'fixtures');

    fs.writeFileSync(path.join(rootDir, '.env'), '\nANDROID_HOME=path/to/android/sdk\nJAVA_HOME=path/to/java');

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.loadEnvFromDotEnv();

    assert.strictEqual(androidSetup.otherInfo.androidHomeInGlobalEnv, false);
    assert.strictEqual(androidSetup.otherInfo.javaHomeInGlobalEnv, false);

    assert.strictEqual(dotenvRead, true);
    assert.strictEqual(process.env.ANDROID_HOME, 'path/to/android/sdk');
    assert.strictEqual(process.env.JAVA_HOME, 'path/to/java');
  });
});

describe('test isJavaHomeEnvSet', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});

    // Delete any set process.env
    delete process.env.ANDROID_HOME;
    delete process.env.JAVA_HOME;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();

    // Remove contents of .env file
    const rootDir = path.join(__dirname, 'fixtures');
    fs.writeFileSync(path.join(rootDir, '.env'), '');
  });

  test('JAVA_HOME set correctly with bin inside (in env and .env)', () => {
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

    mockery.registerMock('fs', {
      existsSync() {
        return true;
      }
    });

    const javaHomePath = 'path/to/jdk';
    process.env.JAVA_HOME = javaHomePath;

    const rootDir = path.join(__dirname, 'fixtures');

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.otherInfo.javaHomeInGlobalEnv = true;
    const result = androidSetup.isJavaHomeEnvSet();

    assert.strictEqual(result, true);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes(`JAVA_HOME is set to '${javaHomePath}'`), true);
    assert.strictEqual(output.includes(`JAVA_HOME is set to '${javaHomePath}' (taken from .env)`), false);
    assert.strictEqual(output.includes(`'bin' subfolder exists under '${javaHomePath}'\n`), true);

    // With JAVA_HOME in .env
    consoleOutput.length = 0;

    androidSetup.otherInfo.javaHomeInGlobalEnv = false;
    const result1 = androidSetup.isJavaHomeEnvSet();

    assert.strictEqual(result1, true);

    const output1 = consoleOutput.toString();
    assert.strictEqual(output1.includes(`JAVA_HOME is set to '${javaHomePath}' (taken from .env)`), true);
    assert.strictEqual(output1.includes(`'bin' subfolder exists under '${javaHomePath}'\n`), true);
  });

  test('JAVA_HOME set correctly with bin not found (in env and .env)', () => {
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

    mockery.registerMock('fs', {
      existsSync(path) {
        if (path.includes('bin')) {
          return false;
        }

        return true;
      }
    });

    const javaHomePath = 'path/to/jdk';
    process.env.JAVA_HOME = javaHomePath;

    const rootDir = path.join(__dirname, 'fixtures');

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.otherInfo.javaHomeInGlobalEnv = true;
    const result = androidSetup.isJavaHomeEnvSet();

    assert.strictEqual(result, false);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes(`JAVA_HOME is set to '${javaHomePath}'`), true);
    assert.strictEqual(output.includes(`JAVA_HOME is set to '${javaHomePath}' (taken from .env)`), false);
    assert.strictEqual(output.includes(`'bin' subfolder does not exist under '${javaHomePath}'.`), true);

    // With JAVA_HOME in .env
    consoleOutput.length = 0;

    androidSetup.otherInfo.javaHomeInGlobalEnv = false;
    const result1 = androidSetup.isJavaHomeEnvSet();

    assert.strictEqual(result1, null);

    const output1 = consoleOutput.toString();
    assert.strictEqual(output1.includes(`JAVA_HOME is set to '${javaHomePath}' (taken from .env)`), true);
    assert.strictEqual(output1.includes(`'bin' subfolder does not exist under '${javaHomePath}'.`), true);
  });

  test('JAVA_HOME set but path does not exist (in env and .env)', () => {
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

    mockery.registerMock('fs', {
      existsSync() {
        return false;
      }
    });

    const javaHomePath = 'path/to/jdk';
    process.env.JAVA_HOME = javaHomePath;

    const rootDir = path.join(__dirname, 'fixtures');

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.otherInfo.javaHomeInGlobalEnv = true;
    const result = androidSetup.isJavaHomeEnvSet();

    assert.strictEqual(result, false);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes(`JAVA_HOME is set to '${javaHomePath}' but this is NOT`), true);

    // With JAVA_HOME in .env
    consoleOutput.length = 0;

    androidSetup.otherInfo.javaHomeInGlobalEnv = false;
    const result1 = androidSetup.isJavaHomeEnvSet();

    assert.strictEqual(result1, null);

    const output1 = consoleOutput.toString();
    assert.strictEqual(output1.includes(`JAVA_HOME is set to '${javaHomePath}' (taken from .env) but this is NOT`), true);
  });

  test('JAVA_HOME not set', () => {
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

    mockery.registerMock('fs', {
      existsSync() {
        return false;
      }
    });

    const rootDir = path.join(__dirname, 'fixtures');

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const androidSetup = new AndroidSetup({}, rootDir);
    const result = androidSetup.isJavaHomeEnvSet();

    assert.strictEqual(result, null);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('JAVA_HOME env variable is NOT set!\n'), true);
  });
});

describe('test getSdkRootFromEnv', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('./adb', {});

    // Delete any set process.env
    delete process.env.ANDROID_HOME;
    delete process.env.JAVA_HOME;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();

    // Remove contents of .env file
    const rootDir = path.join(__dirname, 'fixtures');
    fs.writeFileSync(path.join(rootDir, '.env'), '');
  });

  test('when ANDROID_HOME defined in env with absolute path', () => {
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

    const platformAndroidHome = (process.platform === 'win32')
      ? 'C:\\users\\nightwatch\\android_sdk' : '/Users/nightwatch/android_sdk';

    process.env.ANDROID_HOME = platformAndroidHome;

    const rootDir = path.join(__dirname, 'fixtures');

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const {getSdkRootFromEnv} = require('../../../../src/commands/android/utils/common');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.loadEnvFromDotEnv();
    const result = getSdkRootFromEnv(androidSetup.rootDir, androidSetup.otherInfo.androidHomeInGlobalEnv);

    assert.strictEqual(result, platformAndroidHome);
    assert.strictEqual(androidSetup.otherInfo.androidHomeInGlobalEnv, true);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes(`ANDROID_HOME is set to '${platformAndroidHome}'\n`), true);
  });

  test('when ANDROID_HOME defined in env with ~ path and in .env with absolute path', () => {
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

    let dotenvRead = false;
    mockery.registerMock('dotenv', {
      config: (options) => {
        if (fs.existsSync(options.path)) {
          dotenvRead = true;
        }

        dotenv_config(options);
      }
    });

    const platformAbsoluteAndroidHome = (process.platform === 'win32')
      ? 'C:\\users\\nightwatch\\android_sdk' : '/Users/nightwatch/android_sdk';

    // set absolute ANDROID_HOME to .env file.
    const rootDir = path.join(__dirname, 'fixtures');
    fs.writeFileSync(path.join(rootDir, '.env'), `ANDROID_HOME=${platformAbsoluteAndroidHome}`);

    // set ~ ANDROID_HOME to process.env
    const androidHome = path.join('~', 'android_sdk_tilde');
    process.env.ANDROID_HOME = androidHome;

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const {getSdkRootFromEnv} = require('../../../../src/commands/android/utils/common');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.loadEnvFromDotEnv();
    const result = getSdkRootFromEnv(androidSetup.rootDir, androidSetup.otherInfo.androidHomeInGlobalEnv);

    const absoluteAndroidHome = path.join(os.homedir(), 'android_sdk_tilde');
    assert.strictEqual(result, absoluteAndroidHome);
    assert.strictEqual(androidSetup.otherInfo.androidHomeInGlobalEnv, true);
    assert.strictEqual(dotenvRead, true);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes(`ANDROID_HOME is set to '${absoluteAndroidHome}'\n`), true);
  });

  test('when ANDROID_HOME defined in env with relative path and in .env with absolute path', () => {
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

    let dotenvRead = false;
    mockery.registerMock('dotenv', {
      config: (options) => {
        if (fs.existsSync(options.path)) {
          dotenvRead = true;
        }

        dotenv_config(options);
      }
    });

    const platformAbsoluteAndroidHome = (process.platform === 'win32')
      ? 'C:\\users\\nightwatch\\android_sdk' : '/Users/nightwatch/android_sdk';

    // set absolute ANDROID_HOME to .env file.
    const rootDir = path.join(__dirname, 'fixtures');
    fs.writeFileSync(path.join(rootDir, '.env'), `ANDROID_HOME=${platformAbsoluteAndroidHome}`);

    // set relative ANDROID_HOME to process.env
    const androidHome = 'android_sdk_relative';
    process.env.ANDROID_HOME = androidHome;

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const {getSdkRootFromEnv} = require('../../../../src/commands/android/utils/common');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.loadEnvFromDotEnv();
    const result = getSdkRootFromEnv(androidSetup.rootDir, androidSetup.otherInfo.androidHomeInGlobalEnv);

    const absoluteAndroidHome = path.join(rootDir, androidHome);
    // ANDROID_HOME should be absolute now.
    assert.strictEqual(result, absoluteAndroidHome);
    assert.strictEqual(androidSetup.otherInfo.androidHomeInGlobalEnv, true);
    assert.strictEqual(dotenvRead, true);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes(`ANDROID_HOME is set to '${androidHome}' which is NOT`), true);
    assert.strictEqual(output.includes(`Considering ANDROID_HOME to be '${absoluteAndroidHome}'\n`), true);
  });

  test('when ANDROID_HOME defined in env with empty path and in .env with absolute path', () => {
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

    let dotenvRead = false;
    mockery.registerMock('dotenv', {
      config: (options) => {
        if (fs.existsSync(options.path)) {
          dotenvRead = true;
        }

        dotenv_config(options);
      }
    });

    const platformAbsoluteAndroidHome = (process.platform === 'win32')
      ? 'C:\\users\\nightwatch\\android_sdk' : '/Users/nightwatch/android_sdk';

    // set absolute ANDROID_HOME to .env file.
    const rootDir = path.join(__dirname, 'fixtures');
    fs.writeFileSync(path.join(rootDir, '.env'), `ANDROID_HOME=${platformAbsoluteAndroidHome}`);

    // set ANDROID_HOME='' to process.env
    const androidHome = '';
    process.env.ANDROID_HOME = androidHome;

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const {getSdkRootFromEnv} = require('../../../../src/commands/android/utils/common');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.loadEnvFromDotEnv();
    const result = getSdkRootFromEnv(androidSetup.rootDir, androidSetup.otherInfo.androidHomeInGlobalEnv);

    assert.strictEqual(result, '');
    assert.strictEqual(androidSetup.otherInfo.androidHomeInGlobalEnv, true);
    assert.strictEqual(dotenvRead, true);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('ANDROID_HOME is set to \'\' which is NOT a valid path!'), true);
  });

  test('when ANDROID_HOME not defined in env and not defined in .env as well', () => {
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

    // set ANDROID_HOME to undefined in process.env
    delete process.env.ANDROID_HOME;

    const rootDir = path.join(__dirname, 'fixtures');

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const {getSdkRootFromEnv} = require('../../../../src/commands/android/utils/common');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.loadEnvFromDotEnv();
    const result = getSdkRootFromEnv(androidSetup.rootDir, androidSetup.otherInfo.androidHomeInGlobalEnv);

    assert.strictEqual(result, '');
    assert.strictEqual(androidSetup.otherInfo.androidHomeInGlobalEnv, false);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('ANDROID_HOME environment variable is NOT set!'), true);
  });

  test('when ANDROID_HOME not defined in env but defined in .env with absolute path', () => {
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

    let dotenvRead = false;
    mockery.registerMock('dotenv', {
      config: (options) => {
        if (fs.existsSync(options.path)) {
          dotenvRead = true;
        }

        dotenv_config(options);
      }
    });

    const platformAbsoluteAndroidHome = (process.platform === 'win32')
      ? 'C:\\users\\nightwatch\\android_sdk' : '/Users/nightwatch/android_sdk';

    // set absolute ANDROID_HOME to .env file.
    const rootDir = path.join(__dirname, 'fixtures');
    fs.writeFileSync(path.join(rootDir, '.env'), `ANDROID_HOME=${platformAbsoluteAndroidHome}`);

    // set ANDROID_HOME to undefined in process.env
    delete process.env.ANDROID_HOME;

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const {getSdkRootFromEnv} = require('../../../../src/commands/android/utils/common');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.loadEnvFromDotEnv();
    const result = getSdkRootFromEnv(androidSetup.rootDir, androidSetup.otherInfo.androidHomeInGlobalEnv);

    assert.strictEqual(result, platformAbsoluteAndroidHome);
    assert.strictEqual(androidSetup.otherInfo.androidHomeInGlobalEnv, false);
    assert.strictEqual(dotenvRead, true);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes(`ANDROID_HOME is set to '${platformAbsoluteAndroidHome}' (taken from .env)`), true);
  });

  test('when ANDROID_HOME not defined in env but defined in .env with relative path', () => {
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

    let dotenvRead = false;
    mockery.registerMock('dotenv', {
      config: (options) => {
        if (fs.existsSync(options.path)) {
          dotenvRead = true;
        }

        dotenv_config(options);
      }
    });

    const androidHome = 'android_sdk_relative';

    // set relative ANDROID_HOME to .env file.
    const rootDir = path.join(__dirname, 'fixtures');
    fs.writeFileSync(path.join(rootDir, '.env'), `ANDROID_HOME=${androidHome}`);

    // set ANDROID_HOME to undefined in process.env
    delete process.env.ANDROID_HOME;

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const {getSdkRootFromEnv} = require('../../../../src/commands/android/utils/common');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.loadEnvFromDotEnv();
    const result = getSdkRootFromEnv(androidSetup.rootDir, androidSetup.otherInfo.androidHomeInGlobalEnv);

    const absoluteAndroidHome = path.join(rootDir, androidHome);
    assert.strictEqual(result, absoluteAndroidHome);
    assert.strictEqual(androidSetup.otherInfo.androidHomeInGlobalEnv, false);
    assert.strictEqual(dotenvRead, true);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes(`ANDROID_HOME is set to '${androidHome}' (taken from .env) which is NOT`), true);
    assert.strictEqual(output.includes(`Considering ANDROID_HOME to be '${absoluteAndroidHome}'\n`), true);
  });

  test('when ANDROID_HOME not defined in env but defined in .env with empty path', () => {
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

    let dotenvRead = false;
    mockery.registerMock('dotenv', {
      config: (options) => {
        if (fs.existsSync(options.path)) {
          dotenvRead = true;
        }

        dotenv_config(options);
      }
    });

    const androidHome = '';

    // set relative ANDROID_HOME to .env file.
    const rootDir = path.join(__dirname, 'fixtures');
    fs.writeFileSync(path.join(rootDir, '.env'), `ANDROID_HOME=${androidHome}`);

    // set ANDROID_HOME to undefined in process.env
    delete process.env.ANDROID_HOME;

    const {AndroidSetup} = require('../../../../src/commands/android/androidSetup');
    const {getSdkRootFromEnv} = require('../../../../src/commands/android/utils/common');
    const androidSetup = new AndroidSetup({}, rootDir);
    androidSetup.loadEnvFromDotEnv();
    const result = getSdkRootFromEnv(androidSetup.rootDir, androidSetup.otherInfo.androidHomeInGlobalEnv);

    assert.strictEqual(result, '');
    assert.strictEqual(androidSetup.otherInfo.androidHomeInGlobalEnv, false);
    assert.strictEqual(dotenvRead, true);

    const output = consoleOutput.toString();
    assert.strictEqual(output.includes('ANDROID_HOME is set to \'\' (taken from .env) which is NOT a valid path!'), true);
  });
});

