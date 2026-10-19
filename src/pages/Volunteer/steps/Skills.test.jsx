import "@testing-library/jest-dom";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import Skills from "./Skills";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => options?.defaultValue ?? key,
    i18n: { language: "en" },
  }),
}));

const categories = [
  {
    catId: "technology",
    catName: "TECHNOLOGY",
    subCategories: [
      {
        catId: "programming",
        catName: "PROGRAMMING",
        subCategories: [
          { catId: "javascript", catName: "JAVASCRIPT" },
          { catId: "python", catName: "PYTHON" },
        ],
      },
      { catId: "design", catName: "DESIGN" },
    ],
  },
  {
    catId: "cooking",
    catName: "COOKING",
  },
];

const renderSkills = (initialSelected = []) => {
  const setSelectedSkills = jest.fn();

  render(
    <Skills
      selectedSkills={initialSelected}
      setSelectedSkills={setSelectedSkills}
      categories={categories}
    />,
  );

  return { setSelectedSkills };
};

// Select the desktop focusable element, avoiding duplicate mobile labels.
const item = (name) => {
  const matches = screen.getAllByText(name);

  const label = matches.find(
    (element) =>
      element.closest(".hidden.md\\:block") && element.closest("[tabindex]"),
  );

  const fallback = matches.find((element) => element.closest("[tabindex]"));

  return (label ?? fallback)?.closest("[tabindex]");
};

// Find a label rendered in the mobile navigation.
const mobileItem = (name) =>
  screen.getAllByText(name).find((element) => element.closest(".md\\:hidden"));

describe("Skills keyboard navigation", () => {
  afterEach(cleanup);

  it("moves down and up between categories", () => {
    renderSkills();

    const cooking = item("COOKING");
    const technology = item("TECHNOLOGY");

    expect(cooking).toHaveFocus();

    fireEvent.keyDown(cooking, { key: "ArrowDown" });
    expect(technology).toHaveFocus();

    fireEvent.keyDown(technology, { key: "ArrowUp" });
    expect(cooking).toHaveFocus();
  });

  it("wraps to the last category when moving up from the first", () => {
    renderSkills();

    fireEvent.keyDown(item("COOKING"), { key: "ArrowUp" });

    expect(item("TECHNOLOGY")).toHaveFocus();
  });

  it("enters the subcategory column with ArrowRight", () => {
    renderSkills();

    fireEvent.keyDown(item("COOKING"), { key: "ArrowDown" });
    fireEvent.keyDown(item("TECHNOLOGY"), { key: "ArrowRight" });

    expect(item("PROGRAMMING")).toHaveFocus();
  });

  it("moves between subcategories and returns with ArrowLeft", () => {
    renderSkills();

    fireEvent.keyDown(item("COOKING"), { key: "ArrowDown" });
    fireEvent.keyDown(item("TECHNOLOGY"), { key: "ArrowRight" });
    fireEvent.keyDown(item("PROGRAMMING"), { key: "ArrowDown" });

    expect(item("DESIGN")).toHaveFocus();

    fireEvent.keyDown(item("DESIGN"), { key: "ArrowLeft" });

    expect(item("TECHNOLOGY")).toHaveFocus();
  });

  it("enters the third column and navigates sub-subcategories", () => {
    renderSkills();

    fireEvent.keyDown(item("COOKING"), { key: "ArrowDown" });
    fireEvent.keyDown(item("TECHNOLOGY"), { key: "ArrowRight" });
    fireEvent.keyDown(item("PROGRAMMING"), { key: "ArrowRight" });

    expect(item("JAVASCRIPT")).toHaveFocus();

    fireEvent.keyDown(item("JAVASCRIPT"), { key: "ArrowDown" });
    expect(item("PYTHON")).toHaveFocus();

    fireEvent.keyDown(item("PYTHON"), { key: "ArrowLeft" });
    expect(item("PROGRAMMING")).toHaveFocus();
  });

  it("selects a leaf category with Enter", () => {
    const { setSelectedSkills } = renderSkills();

    fireEvent.keyDown(item("COOKING"), { key: "Enter" });

    expect(setSelectedSkills).toHaveBeenCalledWith(["cooking"]);
  });

  it("deselects an already-selected leaf category with Space", () => {
    const { setSelectedSkills } = renderSkills(["cooking"]);

    fireEvent.keyDown(item("COOKING"), { key: " " });

    expect(setSelectedSkills).toHaveBeenCalledWith([]);
  });

  it("selects a third-level skill with Enter", () => {
    const { setSelectedSkills } = renderSkills();

    fireEvent.keyDown(item("COOKING"), { key: "ArrowDown" });
    fireEvent.keyDown(item("TECHNOLOGY"), { key: "ArrowRight" });
    fireEvent.keyDown(item("PROGRAMMING"), { key: "ArrowRight" });
    fireEvent.keyDown(item("JAVASCRIPT"), { key: "Enter" });

    expect(setSelectedSkills).toHaveBeenCalledWith(["javascript"]);
  });
});

describe("Skills selection and mobile navigation", () => {
  afterEach(cleanup);

  it("opens a category and its nested subcategory on mobile", () => {
    renderSkills();

    fireEvent.click(mobileItem("TECHNOLOGY"));

    expect(screen.getAllByText("PROGRAMMING").length).toBeGreaterThan(0);
    expect(screen.getAllByText("DESIGN").length).toBeGreaterThan(0);

    fireEvent.click(mobileItem("PROGRAMMING"));

    expect(screen.getAllByText("JAVASCRIPT").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PYTHON").length).toBeGreaterThan(0);
  });

  it("removes an individual selected skill", () => {
    const { setSelectedSkills } = renderSkills(["cooking"]);

    fireEvent.click(screen.getByTitle("common:REMOVE_SKILL"));

    expect(setSelectedSkills).toHaveBeenCalledWith([]);
  });

  it("removes all selected skills in a category", () => {
    const { setSelectedSkills } = renderSkills(["javascript", "python"]);

    fireEvent.click(screen.getByTitle("common:REMOVE_CATEGORY"));

    expect(setSelectedSkills).toHaveBeenCalledWith([]);
  });

  it("returns to the category list using mobile back navigation", () => {
    renderSkills();

    fireEvent.click(mobileItem("TECHNOLOGY"));

    // Find the back control in the mobile subcategory view.
    const backControls = screen.getAllByText("<");
    const mobileBack = backControls.find((element) =>
      element.closest(".md\\:hidden"),
    );

    expect(mobileBack).toBeTruthy();
    fireEvent.click(mobileBack);

    expect(mobileItem("TECHNOLOGY")).toBeTruthy();
    expect(mobileItem("COOKING")).toBeTruthy();
  });

  it("returns from third-level skills to subcategories on mobile", () => {
    renderSkills();

    fireEvent.click(mobileItem("TECHNOLOGY"));
    fireEvent.click(mobileItem("PROGRAMMING"));

    expect(mobileItem("JAVASCRIPT")).toBeTruthy();

    const backControls = screen.getAllByText("<");
    const mobileBack = backControls.find((element) =>
      element.closest(".md\\:hidden"),
    );

    expect(mobileBack).toBeTruthy();
    fireEvent.click(mobileBack);

    expect(mobileItem("PROGRAMMING")).toBeTruthy();
    expect(mobileItem("DESIGN")).toBeTruthy();
  });

  it("selects a third-level skill from the mobile view", () => {
    const { setSelectedSkills } = renderSkills();

    fireEvent.click(mobileItem("TECHNOLOGY"));
    fireEvent.click(mobileItem("PROGRAMMING"));
    fireEvent.click(mobileItem("JAVASCRIPT"));

    expect(setSelectedSkills).toHaveBeenCalledWith(["javascript"]);
  });
});
