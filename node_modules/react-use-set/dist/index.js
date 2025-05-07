"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useSet: () => useSet
});
module.exports = __toCommonJS(src_exports);

// src/useSet.ts
var import_react = require("react");
function useSet(iterable) {
  const [set, setSet] = (0, import_react.useState)(() => new Set(iterable));
  const add = (0, import_react.useCallback)((...values) => {
    setSet((prev) => {
      const copy = new Set(prev);
      for (const value of values) {
        copy.add(value);
      }
      return copy;
    });
  }, []);
  const deleteValues = (0, import_react.useCallback)((...values) => {
    setSet((prev) => {
      const copy = new Set(prev);
      for (const value of values) {
        copy.delete(value);
      }
      return copy;
    });
  }, []);
  const toggle = (0, import_react.useCallback)((value) => {
    setSet((prev) => {
      const copy = new Set(prev);
      if (!copy.has(value)) {
        copy.add(value);
      } else {
        copy.delete(value);
      }
      return copy;
    });
  }, []);
  const clear = (0, import_react.useCallback)(() => {
    setSet(/* @__PURE__ */ new Set());
  }, []);
  const sync = (0, import_react.useCallback)((values) => {
    setSet(new Set(values));
  }, []);
  return (0, import_react.useMemo)(() => {
    return {
      size: set.size,
      has: (value) => set.has(value),
      add,
      delete: deleteValues,
      clear,
      sync,
      toArray: () => Array.from(set),
      toggle
    };
  }, [set, add, deleteValues, clear, sync, toggle]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSet
});
