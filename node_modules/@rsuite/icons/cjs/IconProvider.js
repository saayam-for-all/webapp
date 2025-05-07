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
    IconContext: function() {
        return IconContext;
    },
    default: function() {
        return _default;
    }
});
var _react = require("react");
var IconContext = /*#__PURE__*/ (0, _react.createContext)({});
var _default = IconContext.Provider;
