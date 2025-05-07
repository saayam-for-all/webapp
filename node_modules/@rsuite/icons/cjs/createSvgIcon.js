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
var _react = /*#__PURE__*/ _interop_require_default(require("react"));
var _Icon = /*#__PURE__*/ _interop_require_default(require("./Icon"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function createSvgIcon(param) {
    var as = param.as, ariaLabel = param.ariaLabel, displayName = param.displayName, category = param.category;
    var IconComponent = /*#__PURE__*/ _react.default.forwardRef(function(props, ref) {
        return /*#__PURE__*/ _react.default.createElement(_Icon.default, _object_spread({
            "aria-label": ariaLabel,
            "data-category": category,
            ref: ref,
            as: as
        }, props));
    });
    IconComponent.displayName = displayName;
    return IconComponent;
}
var _default = createSvgIcon;
