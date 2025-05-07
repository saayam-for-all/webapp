"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produceError = produceError;
exports.produceCrash = produceCrash;
const protocol_1 = require("../protocol");
function produceError() {
    throw new protocol_1.errors.UnknownCommandError('Produced generic error for testing');
}
function produceCrash() {
    throw new Error('We just tried to crash Appium!');
}
//# sourceMappingURL=crash.js.map