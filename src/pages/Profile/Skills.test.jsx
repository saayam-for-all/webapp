import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Skills from "./Skills";
import {
  fetchUserSkills,
  updateUserSkills,
} from "../../services/volunteerServices";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => {
      if (typeof options === "string") return options;
      return options?.defaultValue || key;
    },
    i18n: { language: "en" },
  }),
}));

jest.mock("../../services/volunteerServices", () => ({
  fetchUserSkills: jest.fn(),
  updateUserSkills: jest.fn(),
}));

jest.mock("../Volunteer/steps/Skills", () => {
  return function VolunteerSkillsMock({ selectedSkills, setSelectedSkills }) {
    return (
      <div data-testid="volunteer-skills">
        <span>Selected count: {selectedSkills.length}</span>
        <button type="button" onClick={() => setSelectedSkills([])}>
          Clear skills
        </button>
        <button type="button" onClick={() => setSelectedSkills([4.2])}>
          Select numeric skill
        </button>
      </div>
    );
  };
});

const categories = [
  {
    catId: "0.0.0.0.0",
    catName: "GENERAL_CATEGORY",
    subCategories: [],
  },
  {
    catId: "4",
    catName: "EDUCATION",
    subCategories: [
      {
        catId: "4.2",
        catName: "TUTORING",
        subCategories: [],
      },
      {
        catId: "4.3",
        catName: "LANGUAGE",
        subCategories: [
          {
            catId: "4.3.1",
            catName: "SPANISH",
          },
        ],
      },
    ],
  },
];

const renderSkills = ({
  requestCategories = categories,
  setHasUnsavedChanges = jest.fn(),
} = {}) => {
  const store = configureStore({
    reducer: {
      auth: () => ({ user: { userDbId: "SID-123" } }),
      request: () => ({ categories: requestCategories }),
    },
  });

  return render(
    <Provider store={store}>
      <Skills setHasUnsavedChanges={setHasUnsavedChanges} />
    </Provider>,
  );
};

describe("Profile Skills", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchUserSkills.mockResolvedValue({ data: { skills: [] } });
    updateUserSkills.mockResolvedValue({ success: true });
  });

  it("shows the General fallback warning before save when no skills are selected", async () => {
    renderSkills();

    await waitFor(() =>
      expect(fetchUserSkills).toHaveBeenCalledWith("SID-123"),
    );
    fireEvent.click(screen.getByText("EDIT"));

    expect(
      screen.getByText(
        "At least one skill is required. If no skill is selected, General will be saved by default.",
      ),
    ).toBeInTheDocument();
  });

  it("saves General category as the fallback when no skills are selected", async () => {
    renderSkills();

    await waitFor(() =>
      expect(fetchUserSkills).toHaveBeenCalledWith("SID-123"),
    );
    fireEvent.click(screen.getByText("EDIT"));
    fireEvent.click(screen.getByText("SAVE"));

    await waitFor(() =>
      expect(updateUserSkills).toHaveBeenCalledWith("SID-123", ["0.0.0.0.0"]),
    );
  });

  it("saves selected skill IDs as strings and hides the fallback warning", async () => {
    renderSkills();

    await waitFor(() =>
      expect(fetchUserSkills).toHaveBeenCalledWith("SID-123"),
    );
    fireEvent.click(screen.getByText("EDIT"));
    fireEvent.click(screen.getByText("Select numeric skill"));

    expect(
      screen.queryByText(
        "At least one skill is required. If no skill is selected, General will be saved by default.",
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("SAVE"));

    await waitFor(() =>
      expect(updateUserSkills).toHaveBeenCalledWith("SID-123", ["4.2"]),
    );
  });

  it("renders saved skill labels from category hierarchy", async () => {
    fetchUserSkills.mockResolvedValue({
      data: { skills: ["0.0.0.0.0", "4.2", "4.3.1", "unknown"] },
    });

    renderSkills();

    expect(await screen.findByText("• GENERAL_CATEGORY")).toBeInTheDocument();
    expect(screen.getByText("• TUTORING")).toBeInTheDocument();
    expect(screen.getByText("• SPANISH")).toBeInTheDocument();
    expect(screen.getByText("• unknown")).toBeInTheDocument();
  });

  it("shows load and save errors when API calls fail", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    fetchUserSkills.mockRejectedValueOnce(new Error("load failed"));

    renderSkills();

    expect(
      await screen.findByText(
        "Failed to load skills. Please refresh the page and try again.",
      ),
    ).toBeInTheDocument();

    fetchUserSkills.mockResolvedValueOnce({ data: { skills: ["4.2"] } });
    updateUserSkills.mockRejectedValueOnce(new Error("save failed"));
    renderSkills();

    await waitFor(() => expect(fetchUserSkills).toHaveBeenCalledTimes(2));
    fireEvent.click(screen.getAllByText("EDIT")[1]);
    fireEvent.click(screen.getByText("SAVE"));

    expect(
      await screen.findByText("Failed to save skills. Please try again."),
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it("shows save error when empty skills have no General fallback category", async () => {
    renderSkills({ requestCategories: categories.slice(1) });

    await waitFor(() =>
      expect(fetchUserSkills).toHaveBeenCalledWith("SID-123"),
    );
    fireEvent.click(screen.getByText("EDIT"));
    fireEvent.click(screen.getByText("SAVE"));

    expect(
      await screen.findByText("Failed to save skills. Please try again."),
    ).toBeInTheDocument();
    expect(updateUserSkills).not.toHaveBeenCalled();
  });

  it("cancels editing and clears unsaved changes", async () => {
    const setHasUnsavedChanges = jest.fn();
    fetchUserSkills.mockResolvedValue({ data: { skills: ["4.2"] } });

    renderSkills({ setHasUnsavedChanges });

    await screen.findByText("• TUTORING");
    fireEvent.click(screen.getByText("EDIT"));
    fireEvent.click(screen.getByText("Clear skills"));
    fireEvent.click(screen.getByText("CANCEL"));

    expect(screen.getByText("• TUTORING")).toBeInTheDocument();
    expect(setHasUnsavedChanges).toHaveBeenLastCalledWith(false);
  });
});
