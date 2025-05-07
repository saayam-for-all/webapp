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
    Icon: function() {
        return _Icon.default;
    },
    IconProvider: function() {
        return _IconProvider.default;
    },
    createIconFont: function() {
        return _createIconFont.default;
    },
    createSvgIcon: function() {
        return _createSvgIcon.default;
    }
});
var _Icon = /*#__PURE__*/ _interop_require_default(require("./Icon"));
var _createIconFont = /*#__PURE__*/ _interop_require_default(require("./createIconFont"));
var _createSvgIcon = /*#__PURE__*/ _interop_require_default(require("./createSvgIcon"));
var _IconProvider = /*#__PURE__*/ _interop_require_default(require("./IconProvider"));
_export_star(require("./react"), exports);
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
