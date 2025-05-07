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
var _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
var _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
var _Icon = /*#__PURE__*/ _interop_require_default(require("./Icon"));
var _utils = require("./utils");
var _useIconContext = require("./utils/useIconContext");
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
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = _object_without_properties_loose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
var cache = new Set();
function isValidScriptUrl(scriptUrl) {
    return typeof scriptUrl === 'string' && scriptUrl.length && !cache.has(scriptUrl);
}
function insertScripts(scriptUrls) {
    var index = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, loadedCallback = arguments.length > 2 ? arguments[2] : void 0;
    var nextIndex = index + 1;
    var currentScriptUrl = scriptUrls[index];
    var loadNextScript = function() {
        insertScripts(scriptUrls, nextIndex, loadedCallback);
    };
    if (isValidScriptUrl(currentScriptUrl)) {
        var script = document.createElement('script');
        script.setAttribute('src', currentScriptUrl);
        script.setAttribute('data-prop', 'icon-font');
        if (scriptUrls.length > nextIndex) {
            script.onload = loadNextScript;
            script.onerror = loadNextScript;
        }
        cache.add(currentScriptUrl);
        document.body.appendChild(script);
    } else if (scriptUrls.length > nextIndex) {
        loadNextScript();
    }
    if (nextIndex >= scriptUrls.length && typeof loadedCallback === 'function') {
        loadedCallback();
    }
}
function createIconFont() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, scriptUrl = _ref.scriptUrl, _ref_commonProps = _ref.commonProps, commonProps = _ref_commonProps === void 0 ? {} : _ref_commonProps, onLoaded = _ref.onLoaded;
    if (scriptUrl && (0, _utils.inBrowserEnv)()) {
        var scriptUrls = Array.isArray(scriptUrl) ? scriptUrl : [
            scriptUrl
        ];
        insertScripts(scriptUrls.reverse(), 0, onLoaded);
    }
    var IconFont = /*#__PURE__*/ _react.default.forwardRef(function(props, ref) {
        var icon = props.icon, children = props.children, className = props.className, restProps = _object_without_properties(props, [
            "icon",
            "children",
            "className"
        ]);
        var classPrefix = (0, _useIconContext.useIconContext)().classPrefix;
        var clesses = (0, _classnames.default)(className, commonProps.className, "".concat(classPrefix, "icon-font"));
        /**
       * Children will overwrite <use />
       */ var content = (0, _react.useMemo)(function() {
            if (children) {
                return children;
            }
            if (icon) {
                return /*#__PURE__*/ _react.default.createElement("use", {
                    xlinkHref: "#".concat(icon)
                });
            }
        }, [
            icon,
            children
        ]);
        return /*#__PURE__*/ _react.default.createElement(_Icon.default, _object_spread_props(_object_spread({}, commonProps, restProps), {
            className: clesses,
            ref: ref
        }), content);
    });
    IconFont.displayName = 'IconFont';
    return IconFont;
}
var _default = createIconFont;
