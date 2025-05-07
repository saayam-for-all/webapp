/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {any}
 */
export function allowCrossDomain(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction): any;
/**
 * @param {string} basePath
 * @returns {import('express').RequestHandler}
 */
export function allowCrossDomainAsyncExecute(basePath: string): import("express").RequestHandler;
/**
 *
 * @param {string} basePath
 * @returns {import('express').RequestHandler}
 */
export function fixPythonContentType(basePath: string): import("express").RequestHandler;
/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {any}
 */
export function handleLogContext(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction): any;
/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {any}
 */
export function defaultToJSONContentType(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction): any;
/**
 *
 * @param {import('@appium/types').StringRecord<import('@appium/types').WSServer>} webSocketsMapping
 * @returns {import('express').RequestHandler}
 */
export function handleUpgrade(webSocketsMapping: import("@appium/types").StringRecord<import("@appium/types").WSServer>): import("express").RequestHandler;
/**
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function catchAllHandler(err: Error, req: import("express").Request, res: import("express").Response, next: import("express").NextFunction): void;
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function catch404Handler(req: import("express").Request, res: import("express").Response): void;
export { handleIdempotency } from "./idempotency";
//# sourceMappingURL=middleware.d.ts.map