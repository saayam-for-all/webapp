"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useIconContext", {
    enumerable: true,
    get: function() {
        return useIconContext;
    }
});
var _react = require("react");
var _IconProvider = require("../IconProvider");
function useIconContext() {
    var _ref = (0, _react.useContext)(_IconProvider.IconContext) || {}, _ref_classPrefix = _ref.classPrefix, classPrefix = _ref_classPrefix === void 0 ? 'rs-' : _ref_classPrefix, csp = _ref.csp, _ref_disableInlineStyles = _ref.disableInlineStyles, disableInlineStyles = _ref_disableInlineStyles === void 0 ? false : _ref_disableInlineStyles;
    return {
        classPrefix: classPrefix,
        csp: csp,
        disableInlineStyles: disableInlineStyles
    };
}
