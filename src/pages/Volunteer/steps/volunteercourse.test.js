import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import VolunteerCourse from "./VolunteerCourse";

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "blob:mock-preview-url");
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }),
  );

  global.Dropbox = { choose: jest.fn() };
  global.gapi = { load: jest.fn((_, cb) => cb()) };
  global.google = {
    picker: {
      PickerBuilder: jest.fn(() => ({
        addView: jest.fn().mockReturnThis(),
        setOAuthToken: jest.fn().mockReturnThis(),
        setDeveloperKey: jest.fn().mockReturnThis(),
        setCallback: jest.fn().mockReturnThis(),
        build: jest.fn(() => ({
          setVisible: jest.fn(),
        })),
      })),
      ViewId: { DOCS: "DOCS" },
      Action: { PICKED: "PICKED" },
    },
  };
});

afterEach(() => jest.clearAllMocks());

describe("VolunteerCourse Component", () => {
  const mockSetSelectedFile = jest.fn();

  const renderComponent = (selectedFile = null) =>
    render(
      <VolunteerCourse
        selectedFile={selectedFile}
        setSelectedFile={mockSetSelectedFile}
      />,
    );

  // simple DOM selector for file input
  const getFileInput = () => document.querySelector('input[type="file"]');

  it("renders component with initial elements", () => {
    renderComponent();
    expect(screen.getByText("Upload Government ID")).toBeInTheDocument();
    expect(screen.getByText("Select Source")).toBeInTheDocument();
    expect(getFileInput()).toBeInTheDocument();
    expect(screen.getByText("Upload")).toBeDisabled();
  });

  it("shows error when selected file exceeds 2MB", async () => {
    const largeFile = new File(["a".repeat(3 * 1024 * 1024)], "big.jpg", {
      type: "image/jpeg",
    });

    // re-render with selectedFile directly
    renderComponent(largeFile);

    const input = getFileInput();
    fireEvent.change(input, { target: { files: [largeFile] } });

    await waitFor(() =>
      expect(
        screen.getByText(/file size should not exceed 2mb/i),
      ).toBeInTheDocument(),
    );
  });

  it("shows error when selected file type is invalid", async () => {
    const badFile = new File(["foo"], "file.txt", { type: "text/plain" });
    renderComponent(badFile);

    const input = getFileInput();
    fireEvent.change(input, { target: { files: [badFile] } });

    await waitFor(() =>
      expect(
        screen.getByText(/only jpeg, jpg, and pdf files are allowed/i),
      ).toBeInTheDocument(),
    );
  });

  it("renders file preview when valid file selected", async () => {
    const valid = new File(["ok"], "photo.jpg", { type: "image/jpeg" });
    renderComponent(valid);

    const input = getFileInput();
    fireEvent.change(input, { target: { files: [valid] } });

    await waitFor(() =>
      expect(screen.getByText(/file: photo.jpg/i)).toBeInTheDocument(),
    );
  });

  it("handles successful upload", async () => {
    const valid = new File(["ok"], "photo.jpg", { type: "image/jpeg" });
    renderComponent(valid);

    const input = getFileInput();
    fireEvent.change(input, { target: { files: [valid] } });

    const uploadBtn = screen.getByText("Upload");
    fireEvent.click(uploadBtn);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("handles failed upload", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "File upload failed" }),
    });

    const valid = new File(["ok"], "photo.jpg", { type: "image/jpeg" });
    renderComponent(valid);

    const input = getFileInput();
    fireEvent.change(input, { target: { files: [valid] } });

    const uploadBtn = screen.getByText("Upload");
    fireEvent.click(uploadBtn);

    await waitFor(() =>
      expect(screen.getByText(/file upload failed/i)).toBeInTheDocument(),
    );
  });

  it("removes file when Remove button clicked", async () => {
    const valid = new File(["ok"], "photo.jpg", { type: "image/jpeg" });
    renderComponent(valid);

    const input = getFileInput();
    fireEvent.change(input, { target: { files: [valid] } });

    await waitFor(() =>
      expect(screen.getByText(/file: photo.jpg/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText("Remove"));
    expect(screen.queryByText(/file: photo.jpg/i)).not.toBeInTheDocument();
  });

  it("loads Google Drive picker when Drive is selected", async () => {
    renderComponent();

    const select = screen.getByLabelText("Select Source");
    fireEvent.change(select, { target: { value: "drive" } });

    await waitFor(() => expect(global.gapi.load).toHaveBeenCalled());
  });

  it("calls Dropbox chooser when Dropbox is selected", async () => {
    renderComponent();

    const select = screen.getByLabelText("Select Source");
    fireEvent.change(select, { target: { value: "dropbox" } });

    await waitFor(() => expect(global.Dropbox.choose).toHaveBeenCalled());
  });
});
