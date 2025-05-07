# Mobile app testing

Nightwatch.js now supports testing of native mobile applications via Appium, on both Android and iOS devices. For more details, follow this [guide](https://nightwatchjs.org/guide/mobile-app-testing/introduction.html).

If you're setting up Nightwatch.js for the first time in your project, the process is pretty straightforward. To setup Nightwatch.js in your new/existing project with support for mobile app testing out-of-the-box, run:

```sh
# go to your project root directory
cd path/to/project/root

# run the init command
npm init nightwatch@latest .
```

and answer the questions that follow. That's it!

For existing Nightwatch.js project, the setup for mobile app testing can be done by following the steps below:

* [Setup for Android](#android)
* [Setup for iOS](#ios)

## Android

### Setup Android SDK requirements

1. From your [Nightwatch](https://nightwatchjs.org) project's root dir, run:

   ```sh
   npx @nightwatch/mobile-helper android --appium
   ```

2. Answer a few questions related to your requirements:

   <img width="689" alt="image" src="https://user-images.githubusercontent.com/39924567/199205454-e321f143-9757-4f6f-809b-b143519bddae.png">

3. It will verify if all the requirements are being met.
4. If some requirements are not being met, it will ask whether to download and setup those requirements:

   <img width="600" alt="image" src="https://user-images.githubusercontent.com/39924567/199204970-f95f1bce-35a6-4958-b0eb-f642331c9fb7.png">

5. And done! :tada: Your setup is now complete. (If something fails, follow the instructions and re-run the command.)

### Setup mobile app testing and run first sample test

1. In your [Nightwatch](https://nightwatchjs.org) project, install Appium v2 as a dev-dependency:

   ```sh
   npm i appium@next --save-dev
   ```

2. Install Appium UiAutomator2 driver for Android:

   ```sh
   npx appium driver install uiautomator2
   ```

3. Download the [sample wikipedia app](https://raw.githubusercontent.com/priyansh3133/wikipedia/main/wikipedia.apk) and save it in your project's root directory (alongside `nightwatch.conf.js` file).
4. Add the following env configuration to your `nightwatch.conf.js` file:

   ```js
   "test_settings": {
    // other envs above this line

    app: {
      selenium: {
        start_process: true,
        use_appium: true,
        host: 'localhost',
        port: 4723,
        // args to pass when starting the Appium server
        cli_args: [
          // automatically download the required chromedriver
          // '--allow-insecure=chromedriver_autodownload'
        ],
        // Remove below line if using Appium v1
        default_path_prefix: '',
        // Uncomment below line if Appium is installed globally
        // server_path: 'appium'
      },
      webdriver: {
        timeout_options: {
          timeout: 150000,
          retry_attempts: 3
        },
        keep_alive: false,
        start_process: false
      }
    },

    'app.android.emulator': {
      extends: 'app',
      'desiredCapabilities': {
        // More capabilities can be found at https://github.com/appium/appium-uiautomator2-driver#capabilities
        browserName: null,
        platformName: 'android',
        // `appium:options` is not natively supported in Appium v1, but works with Nightwatch.
        // If copying these capabilities elsewhere while using Appium v1, make sure to remove `appium:options`
        // and add `appium:` prefix to each one of its capabilities, e.g. change 'app' to 'appium:app'.
        'appium:options': {
          automationName: 'UiAutomator2',
          // Android Virtual Device to run tests on
          avd: 'nightwatch-android-11',
          // While Appium v1 supports relative paths, it's more safe to use absolute paths instead.
          // Appium v2 does not support relative paths.
          app: `${__dirname}/wikipedia.apk`,
          appPackage: 'org.wikipedia',
          appActivity: 'org.wikipedia.main.MainActivity',
          appWaitActivity: 'org.wikipedia.onboarding.InitialOnboardingActivity',
          // chromedriver executable to use for testing web-views in hybrid apps.
          // add '.exe' at the end below (making it 'chromedriver.exe') if testing on windows.
          chromedriverExecutable: `${__dirname}/chromedriver-mobile/chromedriver`,
          newCommandTimeout: 0
        }
      }
    },

    'app.android.real': {
      extends: 'app',
      'desiredCapabilities': {
        // More capabilities can be found at https://github.com/appium/appium-uiautomator2-driver#capabilities
        browserName: null,
        platformName: 'android',
        // `appium:options` is not natively supported in Appium v1, but works with Nightwatch.
        // If copying these capabilities elsewhere while using Appium v1, make sure to remove `appium:options`
        // and add `appium:` prefix to each one of its capabilities, e.g. change 'app' to 'appium:app'.
        'appium:options': {
          automationName: 'UiAutomator2',
          // While Appium v1 supports relative paths, it's more safe to use absolute paths instead.
          // Appium v2 does not support relative paths.
          app: `${__dirname}/wikipedia.apk`,
          appPackage: 'org.wikipedia',
          appActivity: 'org.wikipedia.main.MainActivity',
          appWaitActivity: 'org.wikipedia.onboarding.InitialOnboardingActivity',
          // 'chromedriver' binary is required while testing hybrid mobile apps.
          // 
          // Set `chromedriverExecutable` to '' to use binary from `chromedriver` NPM package (if installed).
          // Or, put '--allow-insecure=chromedriver_autodownload' in `cli_args` property of `selenium`
          // config (see 'app' env above) to automatically download the required version of chromedriver
          // (delete `chromedriverExecutable` capability below in that case).
          chromedriverExecutable: '',
          newCommandTimeout: 0,
          // add device id of the device to run tests on, if multiple devices are online
          // Run command: `$ANDROID_HOME/platform-tools/adb devices` to get all connected devices
          // udid: '',
        }
      }
    },
   }
   ```

5. Add the following sample test to your test-suite (`test/wikipedia-android.js`):

   ```js
   describe('Wikipedia Android app test', function() {
     before(function(app) {
       app.click('id', 'org.wikipedia:id/fragment_onboarding_skip_button');
     });

     it('Search for BrowserStack', async function(app) {
       app
         .click('id', 'org.wikipedia:id/search_container')
         .sendKeys('id', 'org.wikipedia:id/search_src_text', 'browserstack')
         .click({selector: 'org.wikipedia:id/page_list_item_title', locateStrategy: 'id', index: 0})
         .waitUntil(async function() {
           // wait for webview context to be available
           const contexts = await this.appium.getContexts();

           return contexts.includes('WEBVIEW_org.wikipedia');
         })
         .appium.setContext('WEBVIEW_org.wikipedia')
         .assert.textEquals('.pcs-edit-section-title', 'BrowserStack');  // command run in webview context
     });
   });
   ```

6. If testing on real-device:
   1. [Turn on USB Debugging](https://developer.android.com/studio/debug/dev-options#enable) on your Android Device and connect it to your system via data cable.
   2. Make sure latest version of Chrome browser is installed on your Android device. If not, install from Google Play Store.
   3. Make sure latest version of `chromedriver` NPM package is installed in your project. If not, install by running:

      ```sh
      npm i chromedriver@latest --save-dev
      ```

7. If testing on emulator, make sure `chromedriver-mobile/chromedriver` is present in your Nightwatch project's root dir. If not present, re-run the command:

   ```sh
   npx @nightwatch/mobile-helper android --appium
   ```

8. Run your Nightwatch tests on Android emulator/real device:

   ```sh
    # test on emulator (assuming test saved as `test/wikipedia-android.js`)
    npx nightwatch test/wikipedia-android.js --env app.android.emulator
    # test on real-device (assuming test saved as `test/wikipedia-android.js`)
    npx nightwatch test/wikipedia-android.js --env app.android.real
   ```

## iOS

### Setup iOS SDK requirements

1. From your [Nightwatch](https://nightwatchjs.org) project's root dir, run:

   ```sh
   npx @nightwatch/mobile-helper ios --setup
   ```

2. Answer a device related question:

   <img width="352" alt="image" src="https://user-images.githubusercontent.com/94462364/199410412-e40da151-e545-4039-90db-e68697358665.png">

3. It will verify if all the requirements are being met.
4. If some requirements are not being met, follow the guide to setup those requirements.

   <img width="662" alt="image" src="https://user-images.githubusercontent.com/94462364/199419711-43e7793a-df82-4d67-a832-679eb5c1f7b9.png">

5. And done! :tada: Your setup is now complete. (Re-run the command in the first step to verify.)

### Setup mobile app testing and run first sample test

1. In your [Nightwatch](https://nightwatchjs.org) project, install Appium v2 as a dev-dependency:

   ```sh
   npm i appium@next --save-dev
   ```

2. Install Appium XCUITest driver for iOS:

   ```sh
   npx appium driver install xcuitest
   ```

3. Download the [sample wikipedia app](https://raw.githubusercontent.com/priyansh3133/wikipedia/main/wikipedia.zip) and save it in your project's root directory (alongside `nightwatch.conf.js` file).
4. Add the following env configuration to your `nightwatch.conf.js` file (skip 'app' env if already followed Android setup above):

   ```js
   "test_settings": {
    // other envs above this line

    app: {
      selenium: {
        start_process: true,
        use_appium: true,
        host: 'localhost',
        port: 4723,
        // args to pass when starting the Appium server
        cli_args: [
          // automatically download the required chromedriver
          // '--allow-insecure=chromedriver_autodownload'
        ],
        // Remove below line if using Appium v1
        default_path_prefix: '',
        // Uncomment below line if Appium is installed globally
        // server_path: 'appium'
      },
      webdriver: {
        timeout_options: {
          timeout: 150000,
          retry_attempts: 3
        },
        keep_alive: false,
        start_process: false
      }
    },

    'app.ios.simulator': {
      extends: 'app',
      'desiredCapabilities': {
        // More capabilities can be found at https://github.com/appium/appium-xcuitest-driver#capabilities
        browserName: null,
        platformName: 'ios',
        // `appium:options` is not natively supported in Appium v1, but works with Nightwatch.
        // If copying these capabilities elsewhere while using Appium v1, make sure to remove `appium:options`
        // and add `appium:` prefix to each one of its capabilities, e.g. change 'app' to 'appium:app'.
        'appium:options': {
          automationName: 'XCUITest',
          // platformVersion: '15.5',
          deviceName: 'iPhone 13',
          // While Appium v1 supports relative paths, it's more safe to use absolute paths instead.
          // Appium v2 does not support relative paths.
          app: `${__dirname}/wikipedia.zip`,
          bundleId: 'org.wikimedia.wikipedia',
          newCommandTimeout: 0
        }
      }
    },

    'app.ios.real': {
      extends: 'app',
      'desiredCapabilities': {
        // More capabilities can be found at https://github.com/appium/appium-xcuitest-driver#capabilities
        browserName: null,
        platformName: 'ios',
        // `appium:options` is not natively supported in Appium v1, but works with Nightwatch.
        // If copying these capabilities elsewhere while using Appium v1, make sure to remove `appium:options`
        // and add `appium:` prefix to each one of its capabilities, e.g. change 'app' to 'appium:app'.
        'appium:options': {
          automationName: 'XCUITest',
          // While Appium v1 supports relative paths, it's more safe to use absolute paths instead.
          // Appium v2 does not support relative paths.
          app: `${__dirname}/wikipedia.zip`,
          bundleId: 'org.wikimedia.wikipedia',
          newCommandTimeout: 0,
          // add udid of the device to run tests on. Or, pass the id to `--deviceId` flag when running tests.
          // device id could be retrieved from Xcode > Window > "Devices and Simulators" window.
          // udid: '00008030-00024C2C3453402E'
        }
      }
    },
   }
   ```

5. Add the following sample test to your test-suite (`test/wikipedia-ios.js`):

   ```js
   describe('Wikipedia iOS app test', function() {
     before(function(app) {
       app.click('xpath', '//XCUIElementTypeButton[@name="Skip"]');
     });

     it('Search for BrowserStack', async function(app) {
       app
         .useXpath()
         .click('//XCUIElementTypeSearchField[@name="Search Wikipedia"]')
         .sendKeys('//XCUIElementTypeSearchField[@name="Search Wikipedia"]', 'browserstack')
         .click('//XCUIElementTypeStaticText[@name="BrowserStack"]')
         .waitUntil(async function() {
           // wait for webview context to be available
           const contexts = await this.appium.getContexts();

           return contexts.length > 1;
         }, 5000)
         .perform(async function() {
           // switch to webview context
           const contexts = await this.appium.getContexts();

           await this.appium.setContext(contexts[1]);
         })
         .useCss()
         .assert.textEquals('.pcs-edit-section-title', 'BrowserStack');  // command run in webview context
     });
   });
   ```

6. (**Real Device**) Run the following command to get the *UDID*:

   ```sh
    system_profiler SPUSBDataType | sed -n '/iPhone/,/Serial/p' | grep 'Serial Number:' | awk -F ': ' '{print $2}'
    ```

7. (**Optional**) Update the configurations : 

    **Real Device**

    In your Nightwatch configuration, set `udid` property of `appium:options` capability inside `app.ios.real` environment to *UDID* from the previous step.

    **Simulators**

    Run the following command to get a list of simulators:

    ```sh
    xcrun simctl list devices
    ```

    And then update `deviceName` (eg: 'iPhone 13') and `platformVersion` (eg: '15.0') properties of `appium:options` capability, defined for `app.ios.simulator` environment in your Nightwatch configuration, according to your preference.

8. Run your Nightwatch tests on iOS simulator/real device:

   ```sh
    # test on simulator (assuming test saved as `test/wikipedia-ios.js`)
    npx nightwatch test/wikipedia-ios.js --env app.ios.simulator
    
    # test on real-device (assuming test saved as `test/wikipedia-ios.js`)
    npx nightwatch test/wikipedia-ios.js --env app.ios.real
   ```
