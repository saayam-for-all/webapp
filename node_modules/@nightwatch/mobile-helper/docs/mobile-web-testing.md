# Mobile web testing

With Nightwatch.js, users can now test websites on real mobile browsers, along with the desktop browsers.

For new users, the setup is pretty easy. To set up a new Nightwatch.js project with support for mobile-web testing out-of-the-box, run:

```sh
npm init nightwatch@latest <project-name>
```

and answer the questions that follow. And that's it!

For existing Nightwatch.js users, the setup for mobile-web testing can be done by following the steps below:

* [Setup on Android](#android)
* [Setup on iOS](#ios)

## Android

1. In your [Nightwatch](https://nightwatchjs.org) project, install `@nightwatch/mobile-helper` as a dev-dependency:

   ```sh
   npm i @nightwatch/mobile-helper --save-dev
   ```

2. From your project's root dir, run:

   ```sh
   npx @nightwatch/mobile-helper android
   ```

3. Answer a few questions related to your requirements:

   <img width="689" alt="image" src="https://user-images.githubusercontent.com/39924567/199205454-e321f143-9757-4f6f-809b-b143519bddae.png">

4. It will verify if all the requirements are being met.
5. If some requirements are not being met, it will ask whether to download and setup those requirements:

   <img width="600" alt="image" src="https://user-images.githubusercontent.com/39924567/199204970-f95f1bce-35a6-4958-b0eb-f642331c9fb7.png">

6. Voila :tada: Your setup is now complete. (If something fails, follow the instructions and re-run the command.)
7. Add the following env configuration to your `nightwatch.conf.js` or `nightwatch.json` file:

   ```js
   "test_settings": {
    // other envs above this line
    'android.chrome': {
      desiredCapabilities: {
        real_mobile: false,
        avd: 'nightwatch-android-11',
        browserName: 'chrome',
        'goog:chromeOptions': {
          w3c: true,
          args: [
            //'--no-sandbox',
            //'--ignore-certificate-errors',
            //'--allow-insecure-localhost',
            //'--headless'
          ],
          androidPackage: 'com.android.chrome',
          // add the device serial to run tests on, if multiple devices are online
          // Run command: `$ANDROID_HOME/platform-tools/adb devices`
          // androidDeviceSerial: ''
        },
      },

      webdriver: {
        start_process: true,
        server_path: 'chromedriver-mobile/chromedriver',
        cli_args: [
          // --verbose
        ]
      }
    },

    'android.firefox': {
      desiredCapabilities: {
        real_mobile: false,
        avd: 'nightwatch-android-11',
        browserName: 'firefox',
        acceptInsecureCerts: true,
        'moz:firefoxOptions': {
          args: [
            // '-headless',
            // '-verbose'
          ],
          androidPackage: 'org.mozilla.firefox',
          // add the device serial to run tests on, if multiple devices are online
          // Run command: `$ANDROID_HOME/platform-tools/adb devices`
          // androidDeviceSerial: 'ZD2222W62Y'
        }
      },
      webdriver: {
        start_process: true,
        server_path: '',
        cli_args: [
          // very verbose geckodriver logs
          // '-vv'
        ]
      }
    },
   }
   ```

8. If testing on real-device:
   1. Make sure latest version of Chrome/Firefox browsers are installed. If not, install them from Google Play Store.
   2. [Turn on USB Debugging](https://developer.android.com/studio/debug/dev-options#enable) on your Android Device and connect it to your system via data cable.
   3. Set `real_mobile` capability to true in the configuration.

9. If testing on emulator, make sure `chromedriver-mobile/chromedriver` is present in your Nightwatch project's root dir. If not present, re-run the command:

   ```sh
   npx @nightwatch/mobile-helper android
   ```

10. Run your nightwatch tests on Android mobile browsers:

    ```sh
    # for firefox
    npx nightwatch --env android.firefox
    # for chrome
    npx nightwatch --env android.chrome
    ```

## iOS

1. In your [Nightwatch](https://nightwatchjs.org) project, install `@nightwatch/mobile-helper` as a dev-dependency:

   ```sh
   npm i @nightwatch/mobile-helper --save-dev
   ```

2. From your project's root dir, run:

   ```sh
   npx @nightwatch/mobile-helper ios
   ```

3. Answer a device related question:

   <img width="352" alt="image" src="https://user-images.githubusercontent.com/94462364/199410412-e40da151-e545-4039-90db-e68697358665.png">

4. It will verify if all the requirements are being met.
5. If some requirements are not being met, follow the guide to setup those requirements.

   <img width="662" alt="image" src="https://user-images.githubusercontent.com/94462364/199419711-43e7793a-df82-4d67-a832-679eb5c1f7b9.png">

6. Great :tada: Your setup is now complete. (Re-run the command in the first step to verify.)

7. Add the following env configuration to your `nightwatch.conf.js` or `nightwatch.json` file:

   ```js
   "test_settings": {
     // other envs above this line
     'ios.real.safari': {
       desiredCapabilities: {
         browserName: 'safari',
         platformName: 'iOS',
         // add udid of the device to run tests on (necessary)
         // Run command: `xcrun xctrace list devices`
         // 'safari:deviceUDID': '00008030-00024C2C3453402E',
       },
   
       webdriver: {
         start_process: true,
         server_path: '',
         cli_args: [
           // --verbose
         ]
       }
     },

     'ios.simulator.safari': {
       desiredCapabilities: {
         browserName: 'safari',
         platformName: 'iOS',
         'safari:useSimulator': true,
         // To find the available deviceName/platformName to run tests on,
         // run command: `xcrun simctl list devices`
         // 'safari:platformVersion': '15.0',
         'safari:deviceName': 'iPhone 13'
       },

       webdriver: {
         start_process: true,
         server_path: '',
         cli_args: [
           // --verbose
         ]
       }
     },
   }
   ```

8. (**Real Device**) Run the following command to get the *UDID*:

   ```sh
    system_profiler SPUSBDataType | sed -n '/iPhone/,/Serial/p' | grep 'Serial Number:' | awk -F ': ' '{print $2}'
    ```

9. (**Optional**) Update the configurations : 

    **Real Device**

    In your Nightwatch configuration, set `safari:deviceUDID` capability of `ios.real.safari` environment to *UDID* from the previous step.

    **Simulators**

    Run the following command to get a list of simulators:

    ```sh
    xcrun simctl list devices
    ```

    And then update `safari:deviceName` (eg: 'iPhone 13') and `safari:platformVersion` (eg: '15.0') capabilities of `ios.simulator.safari` environment in your Nightwatch configuration according to your preference.

10. Run your nightwatch tests on Android mobile browsers:

    ```sh
    # for simulators
    npx nightwatch --env ios.simulator.safari

    # for real device
    npx nightwatch --env ios.real.safari --deviceId <YOUR-DEVICE-UDID>
    # for real device (if updated the config in the previous step)
    npx nightwatch --env ios.real.safari
    ```
