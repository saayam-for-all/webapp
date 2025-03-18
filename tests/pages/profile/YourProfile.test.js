import React from "react";
import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import YourProfile from "../../../src/pages/Profile/YourProfile";
import rootReducer from "../../../src/redux/rootReducer";

// Mock i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
    }),
  );
});

test("Check containers class", () => {
  const store = configureStore({ reducer: rootReducer });

  render(
    <Provider store={store}>
      <YourProfile />
    </Provider>,
  );

  const containerOne = screen.getByTestId("container-test-1");
  const containerTwo = screen.getByTestId("container-test-2");
  const containerThree = screen.getByTestId("container-test-3");
  const containerFour = screen.getByTestId("container-test-4");
  const containerFive = screen.getByTestId("container-test-5");
  const containerSix = screen.getByTestId("container-test-6");

  expect(containerOne).toHaveClass(
    "flex flex-col border p-6 rounded-lg w-full",
  );
  expect(containerTwo).toHaveClass("grid grid-cols-2 gap-4 mb-6");
  expect(containerThree).toHaveClass("grid grid-cols-1 gap-4 mb-6");
  expect(containerFour).toHaveClass("grid grid-cols-1 gap-4 mb-6");
  expect(containerFive).toHaveClass("grid grid-cols-1 gap-4 mb-6");
  expect(containerSix).toHaveClass("flex justify-center mt-6");
});
