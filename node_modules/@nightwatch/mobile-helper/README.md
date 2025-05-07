# @nightwatch/mobile-helper

Official Nightwatch tool to help easily setup all the requirements needed to get started with mobile testing in [Nightwatch.js](https://nightwatchjs.org). Nightwatch.js supports web and native app testing in both Android and iOS devices.

**BONUS:** For Android folks, there's much more this tool has to offer now apart for setting up requirements for testing:

* Setup fully functional Android Emulator environment in a matter of minutes (without downloading Android Studio).
* Alternatively, setup just `adb` to only connect to real devices.
* Easy-to-use CLI flows for common use-cases like connecting to emulator/real devices, downloading new system-images, creating/deleting AVDs, installing/uninstalling apps, and much more.
* For use-cases not covered above, run commands with major Android SDK tools like `adb`, `emualator`, `sdkmanager`, `avdmanager` directly from a single CLI.
* Update your SDK tools automatically and seamlessly (WIP).

## Usage

* [Setup for mobile-web testing](docs/mobile-web-testing.md)
* [Setup for mobile-app testing](docs/mobile-app-testing.md)
* [Do more with Android](#do-more-with-android)
  * [Setup Android SDKs for standalone usage](#setup-android-sdks)
  * [Simple CLI flows for common use-cases](#cli-flows-for-common-use-cases)
    * [Connect to real devices or start an emulator](#1-connect)
    * [List connected devices and installed AVDs](#2-list)
    * [Install system images, AVDs and Android apps](#3-install)
    * [Uninstall system images, AVDs and Android apps](#4-uninstall)
  * [Run Android SDK tool commands directly from CLI](#run-android-sdk-tool-commands)

## Do more with Android

### Setup Android SDKs

You can now setup a fully functional Android Emulator environment, or just `adb` for connecting to real device, without the need to download the whole Android Studio IDE.

Run the below command to download all the required Android SDKs needed to get the Android Emulator setup and running with Android v11:

```sh
npx @nightwatch/mobile-helper android --standalone
```

The above command makes sure that you have everything you need to use Android Emulator as well as connect your computer to real Android devices.

### CLI Flows for common use-cases

This tool allows you to do a lot of things with simple and tailored flows, accessible through the following subcommands:

1. [connect](./docs/subcommands/connect.md)
2. [list](./docs/subcommands/list.md)
3. [install](./docs/subcommands/install.md)
4. [uninstall](./docs/subcommands/uninstall.md)

**Syntax**

The following syntax is used for executing subcommands:

```bash
npx @nightwatch/mobile-helper android <subcommand> [flags|cliConfigs]
```

#### 1. connect

This subcommand allows you to connect to a real device using `adb` or launch an AVD (Android Virtual Device) inside Android Emulator.

```sh
npx @nightwatch/mobile-helper android connect [flags]
```

| Flag       | Description                           |
| ---------- | ------------------------------------- |
| --wireless | Connect a real device wirelessly      |
| --emulator | Launch an AVD inside Android Emulator.|

For more details on the usage of the `connect` subcommand, please refer to [this doc](docs/subcommands/connect.md).

#### 2. list

This subcommand allows you to list all connected devices and installed AVDs.

```sh
npx @nightwatch/mobile-helper android list [flags]
```

| Flag       | Description                                            |
| ---------- | ------------------------------------------------------ |
| --device   | Show a list of all the connected real devices and AVDs |
| --avd      | Show a list of all the currently installed AVDs        |

For more details on the usage of the `list` subcommand, please refer to [this doc](docs/subcommands/list.md).

#### 3. install

This subcommand allows you to install a new system-image, create a new AVD or install an app to a target AVD/device.

```sh
npx @nightwatch/mobile-helper android install [flags]
```

| Flag           | Description                                |
| -------------- | ------------------------------------------ |
| --app          | Install an APK on a real device or an AVD  |
| --avd          | Create a new AVD                           |
| --system-image | Install a new system-image                 |

For more details on the usage of the `install` subcommand, please refer to [this doc](docs/subcommands/install.md).

#### 4. uninstall

This subcommand allows you to uninstall a system-image, delete an AVD, or uninstall an app from a target device.

```sh
npx @nightwatch/mobile-helper android uninstall [flags]
```

| Flag           | Description                                    |
| -------------- | ---------------------------------------------- |
| --app          | Uninstall an app from a real device or an AVD  |
| --avd          | Delete an AVD                                  |
| --system-image | Uninstall a system-image                       |

For more details on the usage of the `uninstall` subcommand, please refer to [this doc](docs/subcommands/uninstall.md).

### Run Android SDK tool commands

Run commands with major Android SDK tools/binaries directly from a single CLI without the need to locate and then run the binaries manually.

**Syntax**

```sh
npx @nightwatch/mobile-helper android.<binary_name> [args]
```

Currently supported binaries: `adb`, `avdmanager`, `sdkmanager` and `emulator`.

#### Examples

1. List all the devices connected through `adb`:
   ```sh
   npx @nightwatch/mobile-helper android.adb devices
   ```
2. Start the Android Emulator with an AVD:
   ```sh
   npx @nightwatch/mobile-helper android.emulator @nightwatch-android-11
   ```
3. List all installed system images (along with other packages):
   ```sh
   npx @nightwatch/mobile-helper android.sdkmanager --list_installed
   ```
4. List all installed Android Virtual Devices (AVDs):
   ```sh
   npx @nightwatch/mobile-helper android.avdmanager list avd
   ```

Check the following docs to know more about the usage of the above mentioned binaries:

* [Installing Android application](./docs/install-android-application-from-apk.md)
* [Using emulator from CLI](./docs/use-emulator-from-command-line.md)
