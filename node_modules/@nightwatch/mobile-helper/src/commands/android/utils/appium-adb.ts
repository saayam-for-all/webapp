const _TESTING = process.env._TESTING;
process.env._TESTING = '1';

import ADB from 'appium-adb';

process.env._TESTING = _TESTING;

export default ADB;
