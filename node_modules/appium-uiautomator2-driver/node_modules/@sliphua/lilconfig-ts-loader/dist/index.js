"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptLoader = void 0;
const tslib_1 = require("tslib");
const lodash_get_1 = tslib_1.__importDefault(require("lodash.get"));
const TypeScriptCompileError_1 = tslib_1.__importDefault(require("./Errors/TypeScriptCompileError"));
exports.TypeScriptLoader = (filePath) => {
    try {
        require('ts-node').register({
            compilerOptions: {
                module: 'commonjs',
            },
        });
        const result = require(filePath);
        return lodash_get_1.default(result, 'default', result);
    }
    catch (error) {
        // Replace with logger class OR throw a more specific error
        throw TypeScriptCompileError_1.default.fromError(error);
    }
};
exports.default = exports.TypeScriptLoader;
//# sourceMappingURL=index.js.map