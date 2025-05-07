"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommands = listCommands;
exports.listExtensions = listExtensions;
const lodash_1 = __importDefault(require("lodash"));
const base_driver_1 = require("@appium/base-driver");
async function listCommands(sessionId) {
    let driverRestMethodMap = {};
    let driverBiDiCommands = {};
    let pluginRestMethodMaps = {};
    let pluginBiDiCommands = {};
    if (sessionId) {
        const driverClass = this.driverForSession(sessionId)?.constructor;
        driverRestMethodMap = driverClass?.newMethodMap ?? {};
        driverBiDiCommands = driverClass?.newBidiCommands ?? {};
        const pluginClasses = this.pluginsForSession(sessionId)
            .map((p) => p.constructor);
        pluginRestMethodMaps = lodash_1.default.fromPairs(pluginClasses.map((c) => [c.name, c.newMethodMap ?? {}]));
        pluginBiDiCommands = lodash_1.default.fromPairs(pluginClasses.map((c) => [c.name, c.newBidiCommands ?? {}]));
    }
    return {
        rest: {
            base: methodMapToRestCommandsInfo(base_driver_1.METHOD_MAP),
            driver: methodMapToRestCommandsInfo(driverRestMethodMap),
            plugins: pluginRestMethodMaps ? lodash_1.default.mapValues(pluginRestMethodMaps, methodMapToRestCommandsInfo) : undefined,
        },
        bidi: toBiDiCommandsMap(base_driver_1.BIDI_COMMANDS, driverBiDiCommands, pluginBiDiCommands),
    };
}
async function listExtensions(sessionId) {
    let driverExecuteMethodMap = {};
    let pluginExecuteMethodMaps = {};
    if (sessionId) {
        const driverClass = this.driverForSession(sessionId)?.constructor;
        driverExecuteMethodMap = driverClass?.executeMethodMap ?? {};
        const pluginClasses = this.pluginsForSession(sessionId)
            .map((p) => p.constructor);
        pluginExecuteMethodMaps = lodash_1.default.fromPairs(pluginClasses.map((c) => [c.name, c.executeMethodMap ?? {}]));
    }
    return {
        rest: {
            driver: executeMethodMapToCommandsInfo(driverExecuteMethodMap),
            plugins: pluginExecuteMethodMaps ? lodash_1.default.mapValues(pluginExecuteMethodMaps, executeMethodMapToCommandsInfo) : undefined,
        },
    };
}
function toRestCommandParams(params) {
    if (!params) {
        return;
    }
    const toRestCommandItemParam = (x, isRequired) => {
        const isNameAnArray = lodash_1.default.isArray(x);
        const name = isNameAnArray ? x[0] : x;
        if (!lodash_1.default.isString(name)) {
            return;
        }
        // If parameter names are arrays then this means
        // either of them is required.
        // Not sure we could reflect that in here.
        const required = isRequired && !isNameAnArray;
        return {
            name,
            required,
        };
    };
    const requiredParams = (params.required ?? [])
        .map((name) => toRestCommandItemParam(name, true))
        .filter((x) => !lodash_1.default.isUndefined(x));
    const optionalParams = (params.optional ?? [])
        .map((name) => toRestCommandItemParam(name, false))
        .filter((x) => !lodash_1.default.isUndefined(x));
    return requiredParams.length || optionalParams.length
        ? [...requiredParams, ...optionalParams]
        : undefined;
}
function methodMapToRestCommandsInfo(mm) {
    const res = {};
    for (const [uriPath, methods] of lodash_1.default.toPairs(mm)) {
        const methodsMap = {};
        for (const [method, spec] of lodash_1.default.toPairs(methods)) {
            methodsMap[method] = {
                command: spec.command,
                deprecated: spec.deprecated,
                info: spec.info,
                params: toRestCommandParams(spec.payloadParams),
            };
        }
        res[uriPath] = methodsMap;
    }
    return res;
}
function executeMethodMapToCommandsInfo(emm) {
    const result = {};
    for (const [name, info] of lodash_1.default.toPairs(emm)) {
        result[name] = {
            command: info.command,
            deprecated: info.deprecated,
            info: info.info,
            params: toRestCommandParams(info.params),
        };
    }
    return result;
}
function toBiDiCommandsMap(baseModuleMap, driverModuleMap, pluginModuleMaps) {
    const toBiDiCommandParams = (params) => {
        if (!params) {
            return;
        }
        const toBiDiCommandItemParam = (x, isRequired) => {
            const isNameAnArray = lodash_1.default.isArray(x);
            const name = isNameAnArray ? x[0] : x;
            if (!lodash_1.default.isString(name)) {
                return;
            }
            // If parameter names are arrays then this means
            // either of them is required.
            // Not sure we could reflect that in here.
            const required = isRequired && !isNameAnArray;
            return {
                name,
                required,
            };
        };
        const requiredParams = (params.required ?? [])
            .map((name) => toBiDiCommandItemParam(name, true))
            .filter((x) => !lodash_1.default.isUndefined(x));
        const optionalParams = (params.optional ?? [])
            .map((name) => toBiDiCommandItemParam(name, false))
            .filter((x) => !lodash_1.default.isUndefined(x));
        return requiredParams.length || optionalParams.length
            ? [...requiredParams, ...optionalParams]
            : undefined;
    };
    const moduleMapToBiDiCommandsInfo = (mm) => {
        const res = {};
        for (const [domain, commands] of lodash_1.default.toPairs(mm)) {
            const commandsMap = {};
            for (const [name, spec] of lodash_1.default.toPairs(commands)) {
                commandsMap[name] = {
                    command: spec.command,
                    deprecated: spec.deprecated,
                    info: spec.info,
                    params: toBiDiCommandParams(spec.params),
                };
            }
            res[domain] = commandsMap;
        }
        return res;
    };
    return {
        base: moduleMapToBiDiCommandsInfo(baseModuleMap),
        driver: moduleMapToBiDiCommandsInfo(driverModuleMap),
        plugins: pluginModuleMaps ? lodash_1.default.mapValues(pluginModuleMaps, moduleMapToBiDiCommandsInfo) : undefined,
    };
}
//# sourceMappingURL=inspector-commands.js.map