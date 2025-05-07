import inquirer from 'inquirer';
import os from 'os';
import path from 'path';

import {AvailableOptions, SdkBinary} from './interfaces';
import {AvailableSubcommands} from './subcommands/interfaces';

export const AVAILABLE_OPTIONS: AvailableOptions = {
  help: {
    alias: ['h'],
    description: 'Help for android command.'
  },
  setup: {
    alias: ['install', 'i'],
    description: 'Automatically setup all the missing requirements.'
  },
  mode: {
    alias: ['m'],
    description: 'Verify/setup requirements for real-device or emulator. Available args: "real", "emulator", "both"'
  },
  browsers: {
    alias: ['browser', 'b'],
    description: 'Browsers to setup on Android emulator. Available args: "chrome", "firefox", "both", "none"'
  },
  appium: {
    alias: [],
    description: 'Make sure the final setup works with Appium out-of-the-box.'
  },
  standalone: {
    alias: [],
    description: 'Do standalone setup for Android Emulator (no Nightwatch-related requirements will be downloaded).'
  }
};

export const AVAILABLE_SUBCOMMANDS: AvailableSubcommands = {
  connect: {
    description: 'Connect to a device',
    flags: [
      {
        name: 'wireless',
        description: 'Connect a real device wirelessly'
      },
      {
        name: 'emulator',
        description: 'Launch an Android Virtual Device (AVD) inside the Emulator',
        cliConfigs: [{
          name: 'avd',
          alias: [],
          description: 'Name of the avd to launch',
          usageHelp: 'avd_name'
        }]
      }
    ]
  },
  list: {
    description: 'List connected devices or installed AVDs',
    flags: [{
      name: 'device',
      description: 'List connected devices (real devices and AVDs)'
    },
    {
      name: 'avd',
      description: 'List installed AVDs'
    }]
  },
  install: {
    description: 'Install system images, AVDs, or APKs on a device',
    flags: [
      {
        name: 'avd',
        description: 'Create an Android Virtual Device'
      },
      {
        name: 'app',
        description: 'Install an APK on the device',
        cliConfigs: [
          {
            name: 'path',
            alias: ['p'],
            description: 'Path to the APK file',
            usageHelp: 'path_to_apk'
          },
          {
            name: 'deviceId',
            alias: ['s'],
            description: 'Id of the device to install the APK to if multiple devices are connected',
            usageHelp: 'device_id'
          }
        ]
      },
      {
        name: 'system-image',
        description: 'Install a system image'
      }
    ]
  },
  uninstall: {
    description: 'Uninstall system images, AVDs, or apps from a device',
    flags: [
      {
        name: 'avd',
        description: 'Delete an Android Virtual Device'
      },
      {
        name: 'app',
        description: 'Uninstall an APK from a device',
        cliConfigs: [
          {
            name: 'deviceId',
            alias: ['s'],
            description: 'Id of the device to uninstall the APK from if multiple devices are connected',
            usageHelp: 'device_id'
          }
        ]
      },
      {
        name: 'system-image',
        description: 'Uninstall a system image'
      }
    ]
  }
};

export const NIGHTWATCH_AVD = 'nightwatch-android-11';
export const DEFAULT_FIREFOX_VERSION = '105.1.0';
export const DEFAULT_CHROME_VERSIONS = ['83', '91'];

export const ABI = (() => {
  const arch = process.arch;

  if (arch === 'arm') {
    return 'armeabi-v7a';
  } else if (arch === 'arm64') {
    return 'arm64-v8a';
  } else if (['ia32', 'mips', 'ppc', 's390'].includes(arch)) {
    return 'x86';
  }

  // Handle case when Apple M1's arch is switched to x64.
  if (arch === 'x64' && os.cpus()[0].model.includes('Apple')) {
    return 'arm64-v8a';
  }

  return 'x86_64';
})();

export const SETUP_CONFIG_QUES: inquirer.QuestionCollection = [
  {
    type: 'list',
    name: 'mode',
    message: 'Select target device(s):',
    choices: [
      {name: 'Real Android Device', value: 'real'},
      {name: 'Android Emulator', value: 'emulator'},
      {name: 'Both', value: 'both'}
    ]
  },
  {
    type: 'list',
    name: 'browsers',
    message: '[Emulator] Select browser(s) to set up on Emulator:',
    choices: [
      {name: 'Google Chrome', value: 'chrome'},
      {name: 'Mozilla Firefox', value: 'firefox'},
      {name: 'Both', value: 'both'},
      {name: 'None', value: 'none'}
    ],
    when: (answers) => ['emulator', 'both'].includes(answers.mode)
  }
];

export const SDK_BINARY_LOCATIONS: Record<SdkBinary, string> = {
  sdkmanager: path.join('cmdline-tools', 'latest', 'bin'),
  avdmanager: path.join('cmdline-tools', 'latest', 'bin'),
  adb: 'platform-tools',
  emulator: 'emulator'
};

export const BINARY_TO_PACKAGE_NAME: Record<SdkBinary | typeof NIGHTWATCH_AVD, string> = {
  sdkmanager: 'cmdline-tools;latest',
  avdmanager: 'cmdline-tools;latest',
  adb: 'platform-tools',
  emulator: 'emulator',
  [NIGHTWATCH_AVD]: `system-images;android-30;google_apis;${ABI}`
};

