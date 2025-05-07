"use strict";
/**
 * A custom error class. This exists so we can use `instanceof` to differentiate between "expected"
 * exceptions and unexpected ones.
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocutilsError = void 0;
class DocutilsError extends Error {
}
exports.DocutilsError = DocutilsError;
//# sourceMappingURL=error.js.map