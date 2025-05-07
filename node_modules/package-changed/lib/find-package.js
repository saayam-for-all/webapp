"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPackage = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
exports.findPackage = function (_a) {
    var cwd = (_a === void 0 ? {
        cwd: process.cwd(),
    } : _a).cwd;
    var current = cwd;
    var last = current;
    do {
        var search = path_1.default.join(current, 'package.json');
        if (fs_1.default.existsSync(search)) {
            return search;
        }
        last = current;
        current = path_1.default.dirname(current);
    } while (current !== last);
};
