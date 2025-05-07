"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageHash = void 0;
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
exports.getPackageHash = function (packagePath) {
    var hashSum = crypto_1.default.createHash('md5');
    var contents = fs_1.default.readFileSync(packagePath, 'utf-8');
    var packageBlob = JSON.parse(contents);
    var dependencies = {
        dependencies: packageBlob['dependencies'] || {},
        devDependencies: packageBlob['devDependencies'] || {},
    };
    var depsJson = JSON.stringify(dependencies);
    hashSum.update(Buffer.from(depsJson));
    return hashSum.digest('hex');
};
