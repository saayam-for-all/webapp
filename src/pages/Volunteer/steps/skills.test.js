import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Skills from "./Skills";
import {
  renderWithProviders,
  MOCK_STATE_LOGGED_IN,
} from "#utils/test-utils.jsx";

describe("Skills Component", () => {
  const mockSetCheckedCategories = jest.fn();

  const mockCategoriesData = {
    categories: [
      {
        category: "Programming",
        subCategories: [
          { category: "Frontend", subCategories: ["React", "Angular"] },
          { category: "Backend", subCategories: ["Node", "ASP.NET"] },
        ],
      },
      {
        category: "Design",
        subCategories: ["Figma", "Photoshop"],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders header and top-level categories", () => {
    renderWithProviders(
      <Skills
        checkedCategories={{}}
        setCheckedCategories={mockSetCheckedCategories}
        categoriesData={mockCategoriesData}
      />,
      { preloadedState: MOCK_STATE_LOGGED_IN },
    );

    expect(
      screen.getByText("Select Your Skills For Volunteer Assignments"),
    ).toBeInTheDocument();

    expect(screen.getByText("Programming")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  it("calls setCheckedCategories when a checkbox is toggled", async () => {
    renderWithProviders(
      <Skills
        checkedCategories={{}}
        setCheckedCategories={mockSetCheckedCategories}
        categoriesData={mockCategoriesData}
      />,
      { preloadedState: MOCK_STATE_LOGGED_IN },
    );

    const programmingCheckbox = screen.getByLabelText("Programming");
    fireEvent.click(programmingCheckbox);

    await waitFor(() => {
      expect(mockSetCheckedCategories).toHaveBeenCalledTimes(1);
    });
  });

  it("renders subcategories when parent is checked", () => {
    const checked = {
      Programming: { checked: true },
    };

    renderWithProviders(
      <Skills
        checkedCategories={checked}
        setCheckedCategories={mockSetCheckedCategories}
        categoriesData={mockCategoriesData}
      />,
      { preloadedState: MOCK_STATE_LOGGED_IN },
    );

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("does not render subcategories when parent is unchecked", () => {
    renderWithProviders(
      <Skills
        checkedCategories={{}}
        setCheckedCategories={mockSetCheckedCategories}
        categoriesData={mockCategoriesData}
      />,
      { preloadedState: MOCK_STATE_LOGGED_IN },
    );

    expect(screen.queryByText("Frontend")).not.toBeInTheDocument();
    expect(screen.queryByText("Backend")).not.toBeInTheDocument();
  });

  it("handles deep nested checkbox toggle correctly", async () => {
    const checked = {
      Programming: {
        checked: true,
        Frontend: { checked: true, React: { checked: true } },
      },
    };

    renderWithProviders(
      <Skills
        checkedCategories={checked}
        setCheckedCategories={mockSetCheckedCategories}
        categoriesData={mockCategoriesData}
      />,
      { preloadedState: MOCK_STATE_LOGGED_IN },
    );

    const reactCheckbox = screen.getByLabelText("React");
    expect(reactCheckbox).toBeChecked();

    fireEvent.click(reactCheckbox);

    await waitFor(() =>
      expect(mockSetCheckedCategories).toHaveBeenCalledTimes(1),
    );
  });
});
