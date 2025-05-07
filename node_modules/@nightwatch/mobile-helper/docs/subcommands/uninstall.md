## Workflows of the `uninstall` subcommand

**Syntax**

```sh
npx @nightwatch/mobile-helper android uninstall FLAG [configs]
```

### 1. Delete an Android Virtual Device (AVD)

Run the below command to delete an AVD:

```sh
npx @nightwatch/mobile-helper android uninstall --avd
```

### 2. Uninstall a system image

Run the below command to uninstall a system image:
```sh
npx @nightwatch/mobile-helper android uninstall --system-image
```

### 3. Uninstall an app 

Run the below command to uninstall an app from a real device or an AVD:
```sh
npx @nightwatch/mobile-helper android uninstall --app

# with configs
npx @nightwatch/mobile-helper android uninstall --app [--deviceId <device_id>]
```

**Configs**

| Config                         | Description                                       |
| ------------------------------ | ------------------------------------------------- |
| --deviceId \| -s <device_id>   | Id of the device to uninstall the app from        |