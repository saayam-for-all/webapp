"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_DESIRED_CAP_CONSTRAINTS = void 0;
exports.BASE_DESIRED_CAP_CONSTRAINTS = {
    platformName: {
        presence: true,
        isString: true,
    },
    app: {
        isString: true,
    },
    platformVersion: {
        isString: true,
    },
    webSocketUrl: {
        isBoolean: true,
    },
    newCommandTimeout: {
        isNumber: true,
    },
    automationName: {
        isString: true,
    },
    autoLaunch: {
        isBoolean: true,
    },
    udid: {
        isString: true,
    },
    orientation: {
        inclusion: ['LANDSCAPE', 'PORTRAIT'],
    },
    autoWebview: {
        isBoolean: true,
    },
    noReset: {
        isBoolean: true,
    },
    fullReset: {
        isBoolean: true,
    },
    language: {
        isString: true,
    },
    locale: {
        isString: true,
    },
    eventTimings: {
        isBoolean: true,
    },
    printPageSourceOnFindFailure: {
        isBoolean: true,
    },
};
//# sourceMappingURL=constraints.js.map