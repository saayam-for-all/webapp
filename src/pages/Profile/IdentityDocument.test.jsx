import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import IdentityDocument from "./IdentityDocument";
import React from "react";

// Mock URL.createObjectURL since it's not implemented in JSDOM
window.URL.createObjectURL = jest.fn(() => "mock-url");

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => `mockTranslate(${key})`,
    i18n: { language: "en" },
  }),
}));

describe("IdentityDocument Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const setHasUnsavedChanges = jest.fn();
    render(<IdentityDocument setHasUnsavedChanges={setHasUnsavedChanges} />);
    expect(screen.getByText("mockTranslate(CHOOSE_FILE)")).toBeInTheDocument();
  });

  it("handles custom upload button click and redirects to file input", () => {
    const setHasUnsavedChanges = jest.fn();
    const { container } = render(<IdentityDocument setHasUnsavedChanges={setHasUnsavedChanges} />);
    
    const chooseButton = screen.getByText("mockTranslate(CHOOSE_FILE)");
    expect(chooseButton).toBeInTheDocument();
    
    // Find the hidden input
    const fileInput = container.querySelector('input[type="file"]');
    const clickSpy = jest.spyOn(fileInput, "click").mockImplementation(() => {});
    
    fireEvent.click(chooseButton);
    expect(clickSpy).toHaveBeenCalled();
  });

  it("handles file selection and validation", () => {
    const setHasUnsavedChanges = jest.fn();
    const { container } = render(<IdentityDocument setHasUnsavedChanges={setHasUnsavedChanges} />);
    
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["test file content"], "identity_doc.png", { type: "image/png" });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByText("identity_doc.png")).toBeInTheDocument();
    expect(setHasUnsavedChanges).toHaveBeenCalledWith(true);
  });

  it("handles file selection validation errors", () => {
    const setHasUnsavedChanges = jest.fn();
    const { container } = render(<IdentityDocument setHasUnsavedChanges={setHasUnsavedChanges} />);
    
    const fileInput = container.querySelector('input[type="file"]');

    // Size error
    const largeFile = new File(["a".repeat(6 * 1024 * 1024)], "large.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    expect(screen.getByText("mockTranslate(FILE_SIZE_ERROR)")).toBeInTheDocument();

    // Type error
    const invalidFile = new File(["dummy"], "dummy.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    expect(screen.getByText("mockTranslate(FILE_TYPE_REQUIREMENT)")).toBeInTheDocument();
  });
});
