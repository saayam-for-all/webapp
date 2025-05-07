"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcSignature = calcSignature;
/**
 * Extract the first 8 characters of session ID to prefix the log.
 *
 * @param sessionId session identifier
 */
function calcSignature(sessionId) {
    return sessionId.substring(0, 8);
}
//# sourceMappingURL=session.js.map