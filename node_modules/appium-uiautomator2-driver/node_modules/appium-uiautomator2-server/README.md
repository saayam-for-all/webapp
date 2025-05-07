
### appium-uiautomator2-server

[![NPM version](http://img.shields.io/npm/v/appium-uiautomator2-server.svg)](https://npmjs.org/package/appium-uiautomator2-server)
[![Downloads](http://img.shields.io/npm/dm/appium-uiautomator2-server.svg)](https://npmjs.org/package/appium-uiautomator2-server)

A netty server that runs on the device listening for commands and executes using UiAutomator V2.

### building project
build the android project using below commands

`gradle clean assembleServerDebug assembleServerDebugAndroidTest`


### Starting server
push both src and test apks to the device and execute the instrumentation tests.

`adb shell am instrument -w io.appium.uiautomator2.server.test/androidx.test.runner.AndroidJUnitRunner`



### run unitTest
build the unitTest flavor using the below commands

`gradle clean assembleE2ETestDebug assembleE2ETestDebugAndroidTest`


unitTest flavor contains tests for handlers and can be invoked by using following command

`gradle clean connectedE2ETestDebugAndroidTest`

the above command takes care about installing the AUT apk in to the testing device/emulator before running the tests.


you can also invoke the test using below command

`adb shell am instrument -w io.appium.uiautomator2.e2etest.test/androidx.test.runner.AndroidJUnitRunner`

Note: AUT apk should be installed before executing above command.


### Other Sections:
* [WIKI](https://github.com/appium/appium-uiautomator2-server/wiki)
* [Version Release](https://github.com/appium/appium-uiautomator2-server/blob/master/doc/release.md)
