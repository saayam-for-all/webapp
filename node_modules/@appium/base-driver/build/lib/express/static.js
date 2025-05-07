"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATIC_DIR = void 0;
exports.guineaPig = guineaPig;
exports.guineaPigScrollable = guineaPigScrollable;
exports.guineaPigAppBanner = guineaPigAppBanner;
exports.welcome = welcome;
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./logger"));
const lodash_1 = __importDefault(require("lodash"));
const support_1 = require("@appium/support");
const bluebird_1 = __importDefault(require("bluebird"));
let STATIC_DIR = path_1.default.resolve(__dirname, '..', '..', '..', 'static');
exports.STATIC_DIR = STATIC_DIR;
if (lodash_1.default.isNull(path_1.default.resolve(__dirname).match(/build[/\\]lib[/\\]express$/))) {
    // in some contexts we are not in the build directory,
    // so we don't want to go back the extra level
    exports.STATIC_DIR = STATIC_DIR = path_1.default.resolve(__dirname, '..', '..', 'static');
}
async function guineaPigTemplate(req, res, page) {
    const delay = parseInt(req.params.delay || req.query.delay || 0, 10);
    const throwError = req.params.throwError || req.query.throwError || '';
    let params = {
        throwError,
        serverTime: new Date(),
        userAgent: req.headers['user-agent'],
        comment: 'None',
    };
    if (req.method === 'POST') {
        params.comment = req.body.comments || params.comment;
    }
    logger_1.default.debug(`Sending guinea pig response with params: ${JSON.stringify(params)}`);
    if (delay) {
        logger_1.default.debug(`Waiting ${delay}ms before responding`);
        await bluebird_1.default.delay(delay);
    }
    res.set('content-type', 'text/html');
    res.cookie('guineacookie1', 'i am a cookie value', { path: '/' });
    res.cookie('guineacookie2', 'cookié2', { path: '/' });
    res.cookie('guineacookie3', 'cant access this', {
        domain: '.blargimarg.com',
        path: '/',
    });
    res.send((await getTemplate(page))(params));
}
/*
 * Dynamic page mapped to /test/guinea-pig
 */
async function guineaPig(req, res) {
    return await guineaPigTemplate(req, res, 'guinea-pig.html');
}
/*
 * Dynamic page mapped to /test/guinea-pig-scrollable
 */
async function guineaPigScrollable(req, res) {
    return await guineaPigTemplate(req, res, 'guinea-pig-scrollable.html');
}
/*
 * Dynamic page mapped to /test/guinea-pig-app-banner
 */
async function guineaPigAppBanner(req, res) {
    return await guineaPigTemplate(req, res, 'guinea-pig-app-banner.html');
}
/*
 * Dynamic page mapped to /welcome
 */
async function welcome(req, res) {
    let params = { message: "Let's browse!" };
    logger_1.default.debug(`Sending welcome response with params: ${JSON.stringify(params)}`);
    res.send((await getTemplate('welcome.html'))(params));
}
async function getTemplate(templateName) {
    let content = await support_1.fs.readFile(path_1.default.resolve(STATIC_DIR, 'test', templateName));
    return lodash_1.default.template(content.toString());
}
//# sourceMappingURL=static.js.map