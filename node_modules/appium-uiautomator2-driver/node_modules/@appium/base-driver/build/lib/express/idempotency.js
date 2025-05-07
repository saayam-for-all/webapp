"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleIdempotency = handleIdempotency;
const logger_1 = __importDefault(require("./logger"));
const lru_cache_1 = require("lru-cache");
const lodash_1 = __importDefault(require("lodash"));
const events_1 = require("events");
const IDEMPOTENT_RESPONSES = new lru_cache_1.LRUCache({
    max: 64,
    ttl: 30 * 60 * 1000,
    updateAgeOnGet: true,
    updateAgeOnHas: true,
    // @ts-ignore The value must contain responseStateListener
    dispose: ({ responseStateListener }) => {
        responseStateListener?.removeAllListeners();
    }
});
const MONITORED_METHODS = ['POST', 'PATCH'];
const IDEMPOTENCY_KEY_HEADER = 'x-idempotency-key';
const MAX_CACHED_PAYLOAD_SIZE_BYTES = 1 * 1024 * 1024; // 1 MiB
/**
 * @typedef {Object} CachedResponse
 * @property {string} method
 * @property {string} path
 * @property {Buffer?} response
 * @property {EventEmitter|null|undefined} responseStateListener
 */
/**
 *
 * @param {string} key
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function cacheResponse(key, req, res) {
    if (!res.socket) {
        return;
    }
    const responseStateListener = new events_1.EventEmitter();
    IDEMPOTENT_RESPONSES.set(key, {
        method: req.method,
        path: req.path,
        response: null,
        responseStateListener,
    });
    const socket = res.socket;
    const originalSocketWriter = socket.write.bind(socket);
    const responseRef = new WeakRef(res);
    let responseChunks = [];
    let responseSize = 0;
    let errorMessage = null;
    const patchedWriter = (chunk, encoding, next) => {
        if (errorMessage || !responseRef.deref()) {
            responseChunks = [];
            responseSize = 0;
            return originalSocketWriter(chunk, encoding, next);
        }
        const buf = Buffer.from(chunk, encoding);
        responseChunks.push(buf);
        responseSize += buf.length;
        if (responseSize > MAX_CACHED_PAYLOAD_SIZE_BYTES) {
            errorMessage = `The actual response size exceeds ` +
                `the maximum allowed limit of ${MAX_CACHED_PAYLOAD_SIZE_BYTES} bytes`;
        }
        return originalSocketWriter(chunk, encoding, next);
    };
    socket.write = patchedWriter;
    let didEmitReady = false;
    res.once('error', (e) => {
        errorMessage = e.message;
        if (socket.write === patchedWriter) {
            socket.write = originalSocketWriter;
        }
        if (!IDEMPOTENT_RESPONSES.has(key)) {
            logger_1.default.info(`Could not cache the response identified by '${key}'. ` +
                `Cache consistency has been damaged`);
        }
        else {
            logger_1.default.info(`Could not cache the response identified by '${key}': ${errorMessage}`);
            IDEMPOTENT_RESPONSES.delete(key);
        }
        responseChunks = [];
        responseSize = 0;
        if (!didEmitReady) {
            responseStateListener.emit('ready', null);
            didEmitReady = true;
        }
    });
    res.once('finish', () => {
        if (socket.write === patchedWriter) {
            socket.write = originalSocketWriter;
        }
        if (!IDEMPOTENT_RESPONSES.has(key)) {
            logger_1.default.info(`Could not cache the response identified by '${key}'. ` +
                `Cache consistency has been damaged`);
        }
        else if (errorMessage) {
            logger_1.default.info(`Could not cache the response identified by '${key}': ${errorMessage}`);
            IDEMPOTENT_RESPONSES.delete(key);
        }
        /** @type {CachedResponse|undefined} */
        // @ts-ignore The returned type is ok
        const value = IDEMPOTENT_RESPONSES.get(key);
        if (value) {
            value.response = Buffer.concat(responseChunks);
        }
        responseChunks = [];
        responseSize = 0;
        if (!didEmitReady) {
            responseStateListener.emit('ready', value?.response ?? null);
            didEmitReady = true;
        }
    });
    res.once('close', () => {
        if (socket.write === patchedWriter) {
            socket.write = originalSocketWriter;
        }
        if (!didEmitReady) {
            /** @type {CachedResponse|undefined} */
            // @ts-ignore The returned type is ok
            const value = IDEMPOTENT_RESPONSES.get(key);
            responseStateListener.emit('ready', value?.response ?? null);
            didEmitReady = true;
        }
    });
}
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function handleIdempotency(req, res, next) {
    const keyOrArr = req.headers[IDEMPOTENCY_KEY_HEADER];
    if (lodash_1.default.isEmpty(keyOrArr) || !keyOrArr) {
        return next();
    }
    const key = lodash_1.default.isArray(keyOrArr) ? keyOrArr[0] : keyOrArr;
    logger_1.default.updateAsyncContext({ idempotencyKey: key });
    if (!MONITORED_METHODS.includes(req.method)) {
        // GET, DELETE, etc. requests are idempotent by default
        // there is no need to cache them
        return next();
    }
    logger_1.default.debug(`Request idempotency key: ${key}`);
    if (!IDEMPOTENT_RESPONSES.has(key)) {
        cacheResponse(key, req, res);
        return next();
    }
    const { 
    // @ts-ignore We have asserted the presence of the key above
    method, path, response, responseStateListener, } = IDEMPOTENT_RESPONSES.get(key);
    if (req.method !== method || req.path !== path) {
        logger_1.default.warn(`Got two different requests with the same idempotency key '${key}'`);
        logger_1.default.warn('Is the client generating idempotency keys properly?');
        return next();
    }
    if (response) {
        logger_1.default.info(`The same request with the idempotency key '${key}' has been already processed`);
        logger_1.default.info(`Rerouting its response to the current request`);
        if (!res.socket?.writable) {
            return next();
        }
        res.socket.write(response.toString('utf8'));
    }
    else {
        logger_1.default.info(`The same request with the idempotency key '${key}' is being processed`);
        logger_1.default.info(`Waiting for the response to be rerouted to the current request`);
        responseStateListener.once('ready', async (/** @type {Buffer?} */ cachedResponse) => {
            if (!cachedResponse || !res.socket?.writable) {
                return next();
            }
            res.socket.write(cachedResponse.toString('utf8'));
        });
    }
}
//# sourceMappingURL=idempotency.js.map