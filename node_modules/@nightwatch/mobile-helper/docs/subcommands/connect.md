## Workflows of the `connect` subcommand

**Syntax**
```sh
npx @nightwatch/mobile-helper android connect FLAG [configs]
```

### 1. Connect a real device wirelessly

> Note: Only devices with Android version 11 or higher are supported.

Run the below command to connect to a real device wirelessly:
```sh
npx @nightwatch/mobile-helper android connect --wireless
```

### 2. Launch an Android Virtual Device

Run the below command to launch an AVD:
```sh
npx @nightwatch/mobile-helper android connect --emulator

# with configs
npx @nightwatch/mobile-helper android connect --emulator [--avd <avd_name>]
```

**Configs**

| Config             | Description               |
| ------------------ | ------------------------- |
| --avd <avd_name>   | Name of the AVD to launch |
