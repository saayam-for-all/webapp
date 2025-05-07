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
var _react = require("react");
var _insertCss = require("./insertCss");
var _useIconContext = require("./useIconContext");
// Generated with ../less/index.less
var getStyles = function() {
    var prefix = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'rs-';
    return ".".concat(prefix, "icon {\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  vertical-align: middle;\n}\n.").concat(prefix, "icon[tabindex] {\n  cursor: pointer;\n}\n.").concat(prefix, "icon-spin {\n  -webkit-animation: icon-spin 2s infinite linear;\n          animation: icon-spin 2s infinite linear;\n}\n.").concat(prefix, "icon-pulse {\n  -webkit-animation: icon-spin 1s infinite steps(8);\n          animation: icon-spin 1s infinite steps(8);\n}\n.").concat(prefix, "icon-flip-horizontal {\n  -webkit-transform: scaleX(-1);\n      -ms-transform: scaleX(-1);\n          transform: scaleX(-1);\n}\n.").concat(prefix, "icon-flip-vertical {\n  -webkit-transform: scaleY(-1);\n      -ms-transform: scaleY(-1);\n          transform: scaleY(-1);\n}\n@-webkit-keyframes icon-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n            transform: rotate(359deg);\n  }\n}\n@keyframes icon-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n            transform: rotate(359deg);\n  }\n}");
};
var cssInjected = false;
var useInsertStyles = function() {
    var _useIconContext1 = (0, _useIconContext.useIconContext)(), csp = _useIconContext1.csp, classPrefix = _useIconContext1.classPrefix, disableInlineStyles = _useIconContext1.disableInlineStyles;
    (0, _react.useEffect)(function() {
        // Make sure css injected once.
        if (!cssInjected && !disableInlineStyles) {
            (0, _insertCss.insertCss)(getStyles(classPrefix), {
                prepend: true,
                nonce: csp === null || csp === void 0 ? void 0 : csp.nonce
            });
            cssInjected = true;
        }
    }, []);
};
var _default = useInsertStyles;
