import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Navbar from "../../../src/common/components/Navbar/Navbar";

const mockStore = configureStore([]);

describe("Navigation Guard", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: { user: null },
    });

    // Mock window.confirm
    window.confirm = jest.fn();
  });

  test("shows confirmation when navigating with unsaved changes", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>,
    );

    // Simulate unsaved changes
    window.dispatchEvent(
      new CustomEvent("unsaved-changes", {
        detail: { hasUnsavedChanges: true },
      }),
    );

    // Click a navigation link
    const donateLink = screen.getByText("Donate");
    fireEvent.click(donateLink);

    // Verify confirmation was shown
    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining("unsaved changes"),
    );
  });
});
