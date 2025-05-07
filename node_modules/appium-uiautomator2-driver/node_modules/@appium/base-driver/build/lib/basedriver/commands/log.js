"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const mixin_1 = require("./mixin");
const LogCommands = {
    supportedLogTypes: {},
    async getLogTypes() {
        this.log.debug('Retrieving supported log types');
        return Object.keys(this.supportedLogTypes);
    },
    async getLog(logType) {
        this.log.debug(`Retrieving '${String(logType)}' logs`);
        if (!(logType in this.supportedLogTypes)) {
            const logsTypesWithDescriptions = lodash_1.default.mapValues(this.supportedLogTypes, 'description');
            throw new Error(`Unsupported log type '${String(logType)}'. ` +
                `Supported types: ${JSON.stringify(logsTypesWithDescriptions)}`);
        }
        return await this.supportedLogTypes[logType].getter(this);
    },
};
(0, mixin_1.mixin)(LogCommands);
//# sourceMappingURL=log.js.map