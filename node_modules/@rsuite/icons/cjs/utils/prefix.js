"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "prefix", {
    enumerable: true,
    get: function() {
        return prefix;
    }
});
var _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var prefix = function(pre) {
    return function(className) {
        if (!pre || !className) {
            return '';
        }
        if (Array.isArray(className)) {
            return (0, _classnames.default)(className.filter(function(name) {
                return !!name;
            }).map(function(name) {
                return "".concat(pre, "-").concat(name);
            }));
        }
        return "".concat(pre, "-").concat(className);
    };
};
