"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    inBrowserEnv: function() {
        return _inBrowserEnv.default;
    },
    useClassNames: function() {
        return _useClassNames.default;
    },
    useInsertStyles: function() {
        return _useInsertStyles.default;
    }
});
_export_star(require("./prefix"), exports);
var _useClassNames = /*#__PURE__*/ _interop_require_default(require("./useClassNames"));
var _inBrowserEnv = /*#__PURE__*/ _interop_require_default(require("./inBrowserEnv"));
var _useInsertStyles = /*#__PURE__*/ _interop_require_default(require("./useInsertStyles"));
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
