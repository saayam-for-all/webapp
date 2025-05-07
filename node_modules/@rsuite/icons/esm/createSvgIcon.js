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
import React from 'react';
import Icon from './Icon';
function createSvgIcon(param) {
    var as = param.as, ariaLabel = param.ariaLabel, displayName = param.displayName, category = param.category;
    var IconComponent = /*#__PURE__*/ React.forwardRef(function(props, ref) {
        return /*#__PURE__*/ React.createElement(Icon, _object_spread({
            "aria-label": ariaLabel,
            "data-category": category,
            ref: ref,
            as: as
        }, props));
    });
    IconComponent.displayName = displayName;
    return IconComponent;
}
export default createSvgIcon;
