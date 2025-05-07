// src/useSet.ts
import { useCallback, useMemo, useState } from "react";
function useSet(iterable) {
  const [set, setSet] = useState(() => new Set(iterable));
  const add = useCallback((...values) => {
    setSet((prev) => {
      const copy = new Set(prev);
      for (const value of values) {
        copy.add(value);
      }
      return copy;
    });
  }, []);
  const deleteValues = useCallback((...values) => {
    setSet((prev) => {
      const copy = new Set(prev);
      for (const value of values) {
        copy.delete(value);
      }
      return copy;
    });
  }, []);
  const toggle = useCallback((value) => {
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
  const clear = useCallback(() => {
    setSet(/* @__PURE__ */ new Set());
  }, []);
  const sync = useCallback((values) => {
    setSet(new Set(values));
  }, []);
  return useMemo(() => {
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
export {
  useSet
};
