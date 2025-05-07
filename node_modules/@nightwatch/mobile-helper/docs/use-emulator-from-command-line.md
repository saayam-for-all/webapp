# Launch Android Emulator using `emulator` command-line tool

## Introduction

This guide will show you how to launch an Android Emulator with various start-up options using the `emulator` command-line tool.

## Prerequisites

- Setup Android Emulator environment from scratch using [mobile-helper-tool](https://github.com/nightwatchjs/mobile-helper-tool): `npx @nightwatch/mobile-helper android --standalone`.

## Check if `emulator` is available and working

The whole process depends on the `emulator` command line tool. So, you would need to make sure that `emulator` is available from your terminal. You can check this by running `emulator -version`.

If `emulator` is not available directly, you can either add its location to your `PATH` environment variable, or `cd` to the location where the `emulator` binary is present and use it directly from there.

> For both cases, you'd need the location where you've set up your Android SDK, which you can get by running `npx @nightwatch/mobile-helper android` again:
>
> <img width="517" alt="ANDROID_HOME" src="https://github.com/nightwatchjs/mobile-helper-tool/assets/39924567/20289460-1f1b-489e-9558-b0a7764d15e0">   

You can find the `emulator` binary located within the `emulator/` sub-directory of your Android SDK setup location from above. Eg: `/path/to/Android/sdk/emulator/`.

### Adding `emulator` location to `PATH`

Add the path of the `emulator/` directory to your `PATH` environment variable.

**Linux/Mac**:

Add the below command at the end of your `~/.bashrc` or `~./bash_profile` file and restart the terminal.

```bash
export PATH=$PATH:/path/to/Android/sdk/emulator/
```

**Windows**:

Add the below path to your `PATH` environment variable in the Control Panel and restart the terminal.

```bash
\path\to\Android\sdk\emulator\
```

### Using `emulator` binary directly

To use `emulator` binary directly (without adding it to `PATH`), simply go to the directory where the binary is present and use it as follows:

```bash
cd /path/to/Android/Sdk/emulator/

# for windows
emulator.exe -version

# for mac/linux
./emulator -version
```

## Commands

> **Note:** The "avd" below represents Android Virtual Device (AVD), which is what you run inside an Android Emulator. Each AVD can have different configurations representing different Android devices.

### Basic command syntax

```bash
emulator -avd avd_name [ {-option [value]} … ]

# or

emulator @avd_name [ {-option [value]} … ]
```

### Start the emulator

```bash
# to list all the available AVDs
emulator -list-avds

# to launch an AVD
emulator @nightwatch-android-11
```

### Startup Options

The following are the most commonly used emulator start up commands.

**Quick Boot**

These commands all control how the Android emulator uses snapshot images, which can significantly impact the emulator's boot time:

- **-no-snapshot-load**
  
    - This option forces the emulator to perform a cold boot. This means it starts from scratch, loading the entire operating system (kernel, ramdisk, system image) and user data from their respective image files.

    - **Saving state:** Even though it performs a cold boot, `-no-snapshot-load` still captures the emulator's state on exit. This refers to the final state of the emulated device after the cold boot process, including any user-made changes during that session.

- **-no-snapshot-save**

    - This option instructs the emulator to attempt a quick boot if possible. This means, the emulator checks for an existing snapshot image. If a valid snapshot is available, it can be used to restore the emulator's state from a previous run, significantly speeding up the boot process compared to a cold boot.

    - **Not saving state:** Unlike `-no-snapshot-load`, this option specifically prevents the emulator from saving its state upon exiting. This means the emulator won't create a new snapshot image after the boot process and any changes made by the user will be lost.

- **-no-snapshot**

    - This option is the most comprehensive way to disable the Quick Boot feature entirely. It has the following effects:
        
        - **Disables loading snapshots:** The emulator won't attempt to use an existing snapshot image for quick boot, always resulting in a cold boot.

        - **Disables saving snapshots:** Similar to -no-snapshot-save, the emulator won't create a new snapshot image to capture the state upon exiting.

```bash
# Forces a cold boot but still saves the final state.
emulator @nightwatch-android-11 -no-snapshot-load

# Allows a quick boot (if possible) but doesn't save the final state.
emulator @nightwatch-android-11 -no-snapshot-save

# Completely disables Quick Boot, always performing a cold boot and never saving the state.
emulator @nightwatch-android-11 -no-snapshot
```

**Device Hardware**

In an Android emulator, the -camera-back mode and -camera-front mode options are used to specify the operational mode for the emulated device's back and front cameras, respectively. These options allow users to simulate different camera functionalities without needing a physical device.

- **webcam-list**

    Lists the webcams on your development computer that are available for emulation. 

- **-camera-back mode**

    This option configures the behavior of the emulated device's back (rear-facing) camera.

- **-camera-front mode**

    This option configures the behavior of the emulated device's front (selfie or user-facing) camera.

**mode** can be any of the following values:

- **emulated:** Uses a simulated camera. This is useful for basic testing of camera features without requiring real camera input.

- **webcam*n*:** The emulator uses a webcam connected to your development computer, specified by number. For a list of webcams, use the -webcam-list option. For example, **webcam0**.

- **none:** Disables the camera in the virtual device.

```bash
# shows a list of available webcams
emulator @nightwatch-android-11 -webcam-list

# configures front camera of the emulated device
emulator @nightwatch-android-11 -camera-front <mode>

# configures back camera of the emulated device
emulator @nightwatch-android-11 -camera-back <mode>
```

**Disk images and memory**

The following options are about disk images and memory configurations of the emulated device.

- **-memory *size***

    - Specifies the amount of physical RAM (Random Access Memory) for the emulated device.

    - Ranges from 128 MB to 4096 MB.

    - This setting overrides any RAM size configuration specified in the AVD itself.

- **-sdcard *filepath***

    - Specifies the filename and path to an SD card partition image file.

    - If the file isn't found, the emulator still launches, but without an SD card. The command returns a **No SD Card Image** warning.

    - If no option is specified, the default is **sdcard.img** in data directory.

- **-wipe-data**

    - Deletes user data and copies data from the initial data file. This option clears the data for the virtual device and returns it to the same state as when it was first defined. All installed apps and settings are removed.

    - This can be useful for testing scenarios where you need to start with a fresh device setup, removing all previous user data and settings.

    - This option doesn't affect the **sdcard.img**.

```bash
# Specifies ram size to 2048 MBs
emulator @nightwatch-android-11 -memory 2048

# Specifies the filename and path to an SD card partition image file.
emulator @nightwatch-android-11 -sdcard C:/sd/sdcard.img

# Delets all the users data
emulator @nightwatch-android-11 -wipe-data
```

**UI**

The following options are about configuring the starting animation and touch functionality of the emulated device.

- **-no-boot-anim**

    - Disables the boot animation during emulator startup for faster booting.

    - On slower computers, this option can significantly speed up the boot sequence.

- **-screen *mode***

    Configures the touch functionality of the device. The mode can take any of the following three values.

    - **touch:** Emulates a touch screen (default).

    - **multi-touch:** Emulates a multi-touch screen.

    - **no-touch:** Disables touch screen and multi touch-screen emulation.

```bash
# Disables boot animation
emulator @nightwatch-android-11 -no-boot-anim

# Emulates touch screen (default)
emulator @nightwatch-android-11 -screen touch

# Emulates a multi-touch screen
emulator @nightwatch-android-11 -screen multi-touch

# Disables touch and multi-touch emulation
emulator @nightwatch-android-11 -screen no-touch
```
