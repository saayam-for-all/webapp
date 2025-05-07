import inquirer from 'inquirer';
import {AvailableOptions} from './interfaces';

export const SETUP_CONFIG_QUES: inquirer.QuestionCollection = [
  {
    type: 'list',
    name: 'mode',
    message: 'Select target device(s):',
    choices: [
      {name: 'Real iOS device', value: 'real'},
      {name: 'iOS Simulator', value: 'simulator'},
      {name: 'Both', value: 'both'}
    ]
  }
];

export const AVAILABLE_OPTIONS: AvailableOptions = {
  help: {
    alias: ['h'],
    description: 'Help for ios command.'
  },
  setup: {
    alias: ['install', 'i'],
    description: 'Instruction to setup all the missing requirements.'
  },
  mode: {
    alias: ['m'],
    description: 'Verify/setup requirements for real-device or simulator. Available args: "real", "simulator", "both"'
  },
  appium: {
    alias: [],
    description: 'Make sure the final setup works with Appium out-of-the-box.'
  },
  standalone: {
    alias: [],
    description: 'Do standalone setup (no Nightwatch-related requirements will be downloaded).'
  }
};
