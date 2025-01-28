import React from "react";
import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import YourProfile from "../../../src/pages/Profile/YourProfile";

test("Check containers class", () => {
  global.fetch = jest.fn(() => Promise.reject(null));

  render(<YourProfile />);

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
