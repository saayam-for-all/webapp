"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appium_android_driver_1 = require("appium-android-driver");
const UIAUTOMATOR2_CONSTRAINTS = {
    launchTimeout: {
        isNumber: true,
    },
    uiautomator2ServerLaunchTimeout: {
        isNumber: true,
    },
    uiautomator2ServerInstallTimeout: {
        isNumber: true,
    },
    uiautomator2ServerReadTimeout: {
        isNumber: true,
    },
    systemPort: {
        isNumber: true,
    },
    mjpegServerPort: {
        isNumber: true,
    },
    mjpegScreenshotUrl: {
        isString: true,
    },
    skipServerInstallation: {
        isBoolean: true,
    },
    disableSuppressAccessibilityService: {
        isBoolean: true,
    },
    forceAppLaunch: {
        isBoolean: true,
    },
    shouldTerminateApp: {
        isBoolean: true,
    },
    ...appium_android_driver_1.commonCapConstraints,
};
exports.default = UIAUTOMATOR2_CONSTRAINTS;
//# sourceMappingURL=constraints.js.map