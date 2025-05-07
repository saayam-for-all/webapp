"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return useClassNames;
    }
});
var _prefix = require("./prefix");
var _useIconContext = require("./useIconContext");
function useClassNames() {
    var classPrefix = (0, _useIconContext.useIconContext)().classPrefix;
    var className = "".concat(classPrefix, "icon");
    return [
        className,
        (0, _prefix.prefix)(className)
    ];
}
