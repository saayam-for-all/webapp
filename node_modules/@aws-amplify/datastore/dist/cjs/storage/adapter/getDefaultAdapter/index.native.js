'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// eslint-disable-next-line import/no-named-as-default
const AsyncStorageAdapter_1 = tslib_1.__importDefault(require("../AsyncStorageAdapter"));
const getDefaultAdapter = () => {
    return AsyncStorageAdapter_1.default;
};
exports.default = getDefaultAdapter;
//# sourceMappingURL=index.native.js.map
