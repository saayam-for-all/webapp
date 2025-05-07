export declare const BASE_DESIRED_CAP_CONSTRAINTS: {
    readonly platformName: {
        readonly presence: true;
        readonly isString: true;
    };
    readonly app: {
        readonly isString: true;
    };
    readonly platformVersion: {
        readonly isString: true;
    };
    readonly webSocketUrl: {
        readonly isBoolean: true;
    };
    readonly newCommandTimeout: {
        readonly isNumber: true;
    };
    readonly automationName: {
        readonly isString: true;
    };
    readonly autoLaunch: {
        readonly isBoolean: true;
    };
    readonly udid: {
        readonly isString: true;
    };
    readonly orientation: {
        readonly inclusion: readonly ["LANDSCAPE", "PORTRAIT"];
    };
    readonly autoWebview: {
        readonly isBoolean: true;
    };
    readonly noReset: {
        readonly isBoolean: true;
    };
    readonly fullReset: {
        readonly isBoolean: true;
    };
    readonly language: {
        readonly isString: true;
    };
    readonly locale: {
        readonly isString: true;
    };
    readonly eventTimings: {
        readonly isBoolean: true;
    };
    readonly printPageSourceOnFindFailure: {
        readonly isBoolean: true;
    };
};
export type BaseDriverCapConstraints = typeof BASE_DESIRED_CAP_CONSTRAINTS;
//# sourceMappingURL=constraints.d.ts.map