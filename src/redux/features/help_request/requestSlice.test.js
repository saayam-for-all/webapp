import requestReducer, {
  selectCategories,
  selectCategoriesFetched,
} from "./requestSlice";
import { loadCategories } from "./requestActions";

describe("requestSlice", () => {
  test("should return the initial state", () => {
    const initialState = {
      categories: [],
      categoriesFetched: false,
    };

    const state = requestReducer(undefined, {
      type: "unknown",
    });

    expect(state).toEqual(initialState);
  });
  test("should store categories when payload is an array", () => {
    const categories = ["Food", "Healthcare"];

    const action = loadCategories(categories);

    const state = requestReducer(undefined, action);

    expect(state.categories).toEqual(categories);
    expect(state.categoriesFetched).toBe(true);
  });
  test("should use an empty array when payload is null", () => {
    const action = loadCategories(null);

    const state = requestReducer(undefined, action);

    expect(state.categories).toEqual([]);
    expect(state.categoriesFetched).toBe(true);
  });
  test("should select categoriesFetched from Redux state", () => {
    const state = {
      request: {
        categories: ["Food", "Healthcare"],
        categoriesFetched: true,
      },
    };

    const result = selectCategoriesFetched(state);

    expect(result).toBe(true);
  });
  test("should select categories from Redux state", () => {
    const categories = ["Food", "Healthcare"];

    const state = {
      request: {
        categories,
        categoriesFetched: true,
      },
    };

    const result = selectCategories(state);

    expect(result).toEqual(categories);
  });
});
