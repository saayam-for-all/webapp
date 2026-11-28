import "@testing-library/jest-dom";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { useState } from "react";
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

describe("Skills parent category selection indicators (#1989)", () => {
  afterEach(cleanup);

  it("marks multiple main categories when their skills are selected", () => {
    renderSkills(["javascript", "cooking"]);

    expect(item("TECHNOLOGY")).toHaveTextContent("✓");
    expect(item("COOKING")).toHaveTextContent("✓");

    expect(mobileItem("TECHNOLOGY").parentElement).toHaveTextContent("✓");
    expect(mobileItem("COOKING").parentElement).toHaveTextContent("✓");
  });

  it("does not mark a parent category without selected descendants", () => {
    renderSkills(["cooking"]);

    expect(item("TECHNOLOGY")).not.toHaveTextContent("✓");
    expect(item("COOKING")).toHaveTextContent("✓");
  });

  it("keeps the parent marked while another descendant remains selected", () => {
    renderSkills(["javascript", "python"]);

    expect(item("TECHNOLOGY")).toHaveTextContent("✓");
    expect(mobileItem("TECHNOLOGY").parentElement).toHaveTextContent("✓");
  });
});

describe("Skills multi-category interaction (#1989)", () => {
  afterEach(cleanup);

  it("preserves indicators after selecting skills from different categories", () => {
    const TestWrapper = () => {
      const [selectedSkills, setSelectedSkills] = useState([]);

      return (
        <Skills
          selectedSkills={selectedSkills}
          setSelectedSkills={setSelectedSkills}
          categories={categories}
        />
      );
    };

    render(<TestWrapper />);

    // Select a nested skill from Technology.
    fireEvent.mouseEnter(item("TECHNOLOGY"));
    fireEvent.click(item("DESIGN"));

    expect(item("TECHNOLOGY")).toHaveTextContent("✓");

    // Select a skill from another main category.
    fireEvent.click(item("COOKING"));

    // Both main categories must retain their indicators.
    expect(item("TECHNOLOGY")).toHaveTextContent("✓");
    expect(item("COOKING")).toHaveTextContent("✓");

    expect(mobileItem("TECHNOLOGY").parentElement).toHaveTextContent("✓");
    expect(mobileItem("COOKING").parentElement).toHaveTextContent("✓");
  });
});

describe("Volunteer wizard GenAI selected skills (#2041)", () => {
  afterEach(cleanup);

  const renderWizardSkills = (selectedSkills = []) => {
    const setSelectedSkills = jest.fn();

    render(
      <Skills
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
        categories={categories}
        enableSkillSuggestions
        suggestionSession={null}
        setSuggestionSession={jest.fn()}
      />,
    );

    return { setSelectedSkills };
  };

  it("shows the description field in the volunteer wizard", () => {
    renderWizardSkills();

    expect(screen.getByLabelText("Description")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Suggest Skills",
      }),
    ).toBeInTheDocument();
  });

  it("displays instructional text above the description field", () => {
    renderWizardSkills();

    const helper = screen.getByText(
      /Please describe your skills in description box/,
    );

    const description = screen.getByLabelText("Description");

    expect(
      helper.compareDocumentPosition(description) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("does not show GenAI suggestions in the profile picker", () => {
    renderSkills();

    expect(screen.queryByLabelText("Description")).not.toBeInTheDocument();
  });

  it("shows all selected skills inside one container", () => {
    renderWizardSkills(["python", "cooking", "design"]);

    expect(screen.getAllByTestId("selected-skills-container")).toHaveLength(1);
  });

  it("displays full category hierarchy", () => {
    renderWizardSkills(["python"]);

    expect(screen.getByTestId("selected-skills-container")).toHaveTextContent(
      "TECHNOLOGY > PROGRAMMING > PYTHON",
    );
  });

  it("sorts selected skills alphabetically", () => {
    renderWizardSkills(["python", "design", "cooking", "javascript"]);

    const container = screen.getByTestId("selected-skills-container");

    const labels = Array.from(container.querySelectorAll("span")).map(
      (element) => element.textContent,
    );

    expect(labels).toEqual([
      "COOKING",
      "TECHNOLOGY > DESIGN",
      "TECHNOLOGY > PROGRAMMING > JAVASCRIPT",
      "TECHNOLOGY > PROGRAMMING > PYTHON",
    ]);
  });

  it("displays duplicate skills only once", () => {
    renderWizardSkills(["python", "python", "cooking"]);

    const container = screen.getByTestId("selected-skills-container");

    expect(container.querySelectorAll("button")).toHaveLength(2);
  });

  it("removes an individual skill without removing others", () => {
    const { setSelectedSkills } = renderWizardSkills(["python", "cooking"]);

    fireEvent.click(
      screen.getByRole("button", {
        name: "common:REMOVE_SKILL: TECHNOLOGY > PROGRAMMING > PYTHON",
      }),
    );

    expect(setSelectedSkills).toHaveBeenCalledWith(["cooking"]);
  });

  it("preserves manual skill selection in the GenAI wizard", () => {
    const { setSelectedSkills } = renderWizardSkills(["python"]);

    fireEvent.click(item("COOKING"));

    expect(setSelectedSkills).toHaveBeenCalledWith(["python", "cooking"]);
  });

  it("preserves parent category selection indicators", () => {
    renderWizardSkills(["python", "cooking"]);

    expect(item("TECHNOLOGY")).toHaveTextContent("✓");
    expect(item("COOKING")).toHaveTextContent("✓");
  });
});
