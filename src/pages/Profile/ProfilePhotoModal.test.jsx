/* eslint-env browser, jest */
/* eslint-disable react/display-name, react/prop-types */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Profile from "./Profile";
import {
  deleteProfileImage,
  fetchProfileImage,
  uploadProfileImage,
} from "../../services/volunteerServices";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key,
  }),
}));

jest.mock("../../services/volunteerServices", () => ({
  uploadProfileImage: jest.fn(),
  deleteProfileImage: jest.fn(),
  fetchProfileImage: jest.fn(),
}));

jest.mock("./Sidebar", () => {
  return function SidebarMock({ profilePhoto, openModal }) {
    return (
      <button type="button" onClick={openModal}>
        <img src={profilePhoto} alt="Open profile photo" />
      </button>
    );
  };
});

jest.mock("./YourProfile", () => () => <div>Your Profile</div>);
jest.mock("./PersonalInformation", () => () => <div>Personal Information</div>);
jest.mock("./IdentityDocument", () => () => <div>Identity Document</div>);
jest.mock("./ChangePassword", () => () => <div>Change Password</div>);
jest.mock("./OrganizationDetails", () => () => <div>Organization Details</div>);
jest.mock("./Skills", () => () => <div>Skills</div>);
jest.mock("./Availability", () => () => <div>Availability</div>);
jest.mock("./Preferences", () => () => <div>Preferences</div>);
jest.mock("./SignOff", () => () => <div>Sign Off</div>);

jest.mock("react-router-dom", () => ({
  useLocation: () => ({ state: null }),
}));

const originalLocation = window.location;

const makeFile = (name, type, size = 1000) => {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

const renderProfile = () => {
  const store = configureStore({
    reducer: {
      auth: () => ({
        user: { userDbId: "SID-123", userId: "user-1", groups: ["Volunteers"] },
      }),
    },
  });

  return render(
    <Provider store={store}>
      <Profile />
    </Provider>,
  );
};

const openPhotoModal = async () => {
  renderProfile();
  fireEvent.click(screen.getByRole("button", { name: /open profile photo/i }));
  return screen.findByText("PROFILE_PHOTO");
};

const chooseFile = (file) => {
  fireEvent.change(screen.getByLabelText("UPLOAD"), {
    target: { files: [file] },
  });
};

describe("Profile photo modal", () => {
  beforeAll(() => {
    window.URL.createObjectURL = jest.fn(() => "blob:profile-photo");
    window.URL.revokeObjectURL = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    fetchProfileImage.mockResolvedValue(null);
    uploadProfileImage.mockResolvedValue(undefined);
    deleteProfileImage.mockResolvedValue(undefined);
    window.confirm = jest.fn(() => true);
    window.FileReader = jest.fn().mockImplementation(function () {
      this.readAsDataURL = jest.fn((file) => {
        setTimeout(() => {
          this.result = `data:${file.type};base64,preview`;
          this.onload?.({ target: this });
          this.onloadend?.({ target: this });
        }, 0);
      });
      this.onload = null;
      this.onloadend = null;
      this.onerror = null;
    });
  });

  afterAll(() => {
    delete window.URL.createObjectURL;
    delete window.URL.revokeObjectURL;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("disables Save by default", async () => {
    await openPhotoModal();

    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("enables Save after a valid JPG is selected", async () => {
    await openPhotoModal();

    chooseFile(makeFile("photo.jpg", "image/jpeg"));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /save/i })).toBeEnabled(),
    );
    expect(
      screen.getByText("PROFILE_PHOTO_UPLOAD_SUCCESS"),
    ).toBeInTheDocument();
  });

  it("enables Save after a valid PNG is selected", async () => {
    await openPhotoModal();

    chooseFile(makeFile("photo.png", "image/png"));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /save/i })).toBeEnabled(),
    );
  });

  it("rejects unsupported file types and keeps Save disabled", async () => {
    await openPhotoModal();

    chooseFile(makeFile("photo.gif", "image/gif"));

    expect(screen.getByText("PROFILE_PHOTO_ERROR_FORMAT")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("rejects files larger than 5 MB and keeps Save disabled", async () => {
    await openPhotoModal();

    chooseFile(makeFile("photo.jpg", "image/jpeg", 5_000_001));

    expect(screen.getByText("PROFILE_PHOTO_ERROR_SIZE")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("clears validation errors after a valid image is selected", async () => {
    await openPhotoModal();

    chooseFile(makeFile("photo.webp", "image/webp"));
    expect(screen.getByText("PROFILE_PHOTO_ERROR_FORMAT")).toBeInTheDocument();

    chooseFile(makeFile("photo.jpg", "image/jpeg"));

    await waitFor(() =>
      expect(
        screen.queryByText("PROFILE_PHOTO_ERROR_FORMAT"),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("button", { name: /save/i })).toBeEnabled();
  });

  it("shows a spinner while saving and prevents duplicate submissions", async () => {
    let resolveUpload;
    uploadProfileImage.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpload = resolve;
        }),
    );
    await openPhotoModal();
    chooseFile(makeFile("photo.jpg", "image/jpeg"));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /save/i })).toBeEnabled(),
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);
    fireEvent.click(saveButton);

    expect(uploadProfileImage).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status", { name: "SAVING" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();

    resolveUpload();
    await waitFor(() =>
      expect(screen.queryByText("PROFILE_PHOTO")).not.toBeInTheDocument(),
    );
  });

  it("saves a valid upload and closes the modal", async () => {
    fetchProfileImage
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(new Blob(["binary"], { type: "image/jpeg" }));
    await openPhotoModal();
    const file = makeFile("photo.jpg", "image/jpeg");
    chooseFile(file);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /save/i })).toBeEnabled(),
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(uploadProfileImage).toHaveBeenCalledWith("SID-123", file),
    );
    await waitFor(() =>
      expect(screen.queryByText("PROFILE_PHOTO")).not.toBeInTheDocument(),
    );
  });

  it("preserves the pending upload after a failure and allows retry", async () => {
    uploadProfileImage
      .mockRejectedValueOnce(new Error("Upload failed"))
      .mockResolvedValueOnce(undefined);
    await openPhotoModal();
    chooseFile(makeFile("photo.jpg", "image/jpeg"));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /save/i })).toBeEnabled(),
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText("Upload failed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(uploadProfileImage).toHaveBeenCalledTimes(2));
  });

  it("stages deletion before save and cancels without calling delete", async () => {
    fetchProfileImage.mockResolvedValue(
      new Blob(["binary"], { type: "image/png" }),
    );
    await openPhotoModal();

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(deleteProfileImage).not.toHaveBeenCalled();
    expect(
      screen.getByText("PROFILE_PHOTO_DELETE_PENDING"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(deleteProfileImage).not.toHaveBeenCalled();
  });

  it("persists staged deletion on Save", async () => {
    fetchProfileImage.mockResolvedValue(
      new Blob(["binary"], { type: "image/png" }),
    );
    await openPhotoModal();
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(deleteProfileImage).toHaveBeenCalledWith("SID-123"),
    );
    await waitFor(() =>
      expect(screen.queryByText("PROFILE_PHOTO")).not.toBeInTheDocument(),
    );
  });

  it("replaces an existing photo with a new valid upload", async () => {
    fetchProfileImage.mockResolvedValue(
      new Blob(["binary"], { type: "image/png" }),
    );
    await openPhotoModal();
    const file = makeFile("replacement.png", "image/png");
    chooseFile(file);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /save/i })).toBeEnabled(),
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(uploadProfileImage).toHaveBeenCalledWith("SID-123", file),
    );
    expect(deleteProfileImage).not.toHaveBeenCalled();
  });

  it("redirects to login on 401 without showing a generic upload error", async () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "" },
    });
    uploadProfileImage.mockRejectedValueOnce({ response: { status: 401 } });
    await openPhotoModal();
    chooseFile(makeFile("photo.jpg", "image/jpeg"));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /save/i })).toBeEnabled(),
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(window.location.href).toBe("/login"));
    expect(
      screen.queryByText("PROFILE_PHOTO_ERROR_UPLOAD"),
    ).not.toBeInTheDocument();
  });
});
