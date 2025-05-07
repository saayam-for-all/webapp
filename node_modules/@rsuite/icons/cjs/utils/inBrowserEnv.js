"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
function _default() {
    return typeof document !== 'undefined' && typeof window !== 'undefined' && typeof document.createElement === 'function';
}
