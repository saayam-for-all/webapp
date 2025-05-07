"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackagelock = void 0;
var path_1 = __importDefault(require("path"));
exports.getPackagelock = function (_a) {
    var packagePath = _a.packagePath;
    return path_1.default.join(path_1.default.dirname(packagePath), 'package-lock.json');
};
