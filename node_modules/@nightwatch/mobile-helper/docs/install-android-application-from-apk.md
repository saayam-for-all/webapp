# Installing an application from APK

## Introduction

This guide will show you how to install an application from an APK file on an Android emulator or a real device.

## Prerequisites

- Setup Android Emulator using [mobile-helper-tool](https://github.com/nightwatchjs/mobile-helper-tool): `npx @nightwatch/mobile-helper android`.
- APK file of the application you want to install

### Android Device Bridge (adb)

The whole process is done using `adb` command line tool. So, you would need to make sure that `adb` is available from your terminal. You can check this by running `adb --version`.

If `adb` is not available directly, you can either add its location to your `PATH` environment variable, or `cd` to the location where the `adb` binary is present and use it directly from there.

For both the cases, you'd need the location where you've setup your Android SDK, which you can get that by running `npx @nightwatch/mobile-helper android` again:

<img width="517" alt="ANDROID_HOME" src="https://github.com/nightwatchjs/mobile-helper-tool/assets/39924567/20289460-1f1b-489e-9558-b0a7764d15e0">

The `adb` binary will be present in the `platform-tools` sub-directory of your Android SDK setup location from above. Eg: `/path/to/Android/sdk/platform-tools/`.

### Adding `adb` location to `PATH`

Add the path of `platform-tools` directory to your `PATH` environment variable.

**Linux/Mac**:

Add the below command at the end of your `~/.bashrc` or `~./bash_profile` file and restart the terminal.

```bash
export PATH=$PATH:/path/to/Android/sdk/platform-tools/
```

**Windows**:

Add the below path to your `PATH` environment variable in the Control Panel and restart the terminal.

```bash
\path\to\Android\sdk\platform-tools\
```

### Using `adb` directly

To use `adb` directly (without adding it to `PATH`), simply go to the directly where the binary is present and use it as follows:

```bash
cd /path/to/Android/sdk/platform-tools/

# for windows
adb.exe --version

# for mac/linux
./adb --version
```

## Assumptions

- APK path is `/path/to/your/app.apk`
- Application package name is `your.app.package`

## Steps

### Check if device is connected

```bash
adb devices
```

### Install the application

```bash
adb install /path/to/your/app.apk
```

### Verify the installation

```bash
adb shell pm list packages -f your.app.package
```

**Note:** If the don't know the exact name of your package, you can use `grep` to find it from the list of installed packages. `grep` comes pre-installed on Linux and Mac terminals.

```bash
adb shell pm list packages -f | grep package_name
```

### Overwrite the existing application

If you want to overwrite the existing application with the new APK, you can use the `-r` option with the `install` command.

```bash
adb install -r /path/to/your/app.apk
```

### Remove the application

```bash
adb uninstall your.app.package
```

### Install the application on a specific device

If you have multiple devices/emulators connected to your adb, you will get an error when you try to install the application.
You need to specify the device on which you want to install the application.

This is not just for installation, you need to specify the device for any `adb` command you run.

To install the application on a specific device, you need to specify the device using the `-s` option before the `install` command.

```bash
adb -s <device_id> install /path/to/your/app.apk
```

You can get the device id by running the below command.

```bash
adb devices
```

```bash
# Output of adb devices
List of devices attached
emulator-5554	device
emulator-5556	device
```

Here, `emulator-5554` and `emulator-5556` are the device ids.
