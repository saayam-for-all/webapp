"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctor = exports.console = exports.env = exports.timing = exports.node = exports.mjpeg = exports.net = exports.imageUtil = exports.zip = exports.process = exports.logger = exports.mkdirp = exports.plist = exports.cancellableDelay = exports.fs = exports.util = exports.system = exports.tempDir = exports.npm = void 0;
const tempDir = __importStar(require("./tempdir"));
exports.tempDir = tempDir;
const system = __importStar(require("./system"));
exports.system = system;
const util = __importStar(require("./util"));
exports.util = util;
const fs_1 = require("./fs");
Object.defineProperty(exports, "fs", { enumerable: true, get: function () { return fs_1.fs; } });
const net = __importStar(require("./net"));
exports.net = net;
const plist = __importStar(require("./plist"));
exports.plist = plist;
const mkdirp_1 = require("./mkdirp");
Object.defineProperty(exports, "mkdirp", { enumerable: true, get: function () { return mkdirp_1.mkdirp; } });
const logger = __importStar(require("./logging"));
exports.logger = logger;
const process = __importStar(require("./process"));
exports.process = process;
const zip = __importStar(require("./zip"));
exports.zip = zip;
const imageUtil = __importStar(require("./image-util"));
exports.imageUtil = imageUtil;
const mjpeg = __importStar(require("./mjpeg"));
exports.mjpeg = mjpeg;
const node = __importStar(require("./node"));
exports.node = node;
const timing = __importStar(require("./timing"));
exports.timing = timing;
const env = __importStar(require("./env"));
exports.env = env;
const console = __importStar(require("./console"));
exports.console = console;
const doctor = __importStar(require("./doctor"));
exports.doctor = doctor;
var npm_1 = require("./npm");
Object.defineProperty(exports, "npm", { enumerable: true, get: function () { return npm_1.npm; } });
const { cancellableDelay } = util;
exports.cancellableDelay = cancellableDelay;
exports.default = {
    tempDir,
    system,
    util,
    fs: fs_1.fs,
    cancellableDelay,
    plist,
    mkdirp: mkdirp_1.mkdirp,
    logger,
    process,
    zip,
    imageUtil,
    net,
    mjpeg,
    node,
    timing,
    env,
    console,
    doctor,
};
//# sourceMappingURL=index.js.map