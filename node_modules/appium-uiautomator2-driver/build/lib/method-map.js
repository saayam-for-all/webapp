"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newMethodMap = void 0;
const appium_android_driver_1 = require("appium-android-driver");
exports.newMethodMap = {
    ...appium_android_driver_1.AndroidDriver.newMethodMap,
    '/session/:sessionId/appium/device/get_clipboard': {
        POST: {
            command: 'getClipboard',
            payloadParams: { optional: ['contentType'] },
        },
    },
};
//# sourceMappingURL=method-map.js.map