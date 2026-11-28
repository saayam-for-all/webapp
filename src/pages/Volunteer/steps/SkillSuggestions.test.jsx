import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { useState } from "react";
import PropTypes from "prop-types";
import SkillSuggestions from "./SkillSuggestions";
import { predictCategories } from "../../../services/requestServices";

jest.mock("../../../services/requestServices", () => ({
  predictCategories: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => {
      const value = options?.defaultValue ?? key;
      return value.replace("{{skills}}", options?.skills ?? "");
    },
    i18n: { language: "en" },
  }),
}));

const categories = [
  {
    catId: "4",
    catName: "EDUCATION",
    subCategories: [
      {
        catId: "4.3",
        catName: "TUTORING",
        subCategories: [{ catId: "4.3.1", catName: "MATH" }],
      },
    ],
  },
  {
    catId: "3.3.5",
    catName: "GARDEN",
  },
  {
    catId: "general",
    catName: "GENERAL_CATEGORY",
  },
];

const math = {
  category_number: "4.3.1",
  category_name: "MATH",
};

const garden = {
  category_number: "3.3.5",
  category_name: "GARDEN",
};

const Harness = ({ initialSkills = [] }) => {
  const [selectedSkills, setSelectedSkills] = useState(initialSkills);

  const [session, setSession] = useState(null);

  return (
    <>
      <SkillSuggestions
        categories={categories}
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
        session={session}
        setSession={setSession}
      />

      <div data-testid="selected">{JSON.stringify(selectedSkills)}</div>
    </>
  );
};

Harness.propTypes = {
  initialSkills: PropTypes.arrayOf(PropTypes.string),
};

const suggest = (description = "I teach math") => {
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: description },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Suggest Skills",
    }),
  );
};

describe("GenAI volunteer skill suggestions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("disables suggestions for empty descriptions", () => {
    render(<Harness />);

    expect(
      screen.getByRole("button", {
        name: "Suggest Skills",
      }),
    ).toBeDisabled();
  });

  it("disables suggestions for whitespace-only descriptions", () => {
    render(<Harness />);

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "   " },
    });

    expect(
      screen.getByRole("button", {
        name: "Suggest Skills",
      }),
    ).toBeDisabled();
  });

  it("enforces the 500-character input limit", () => {
    render(<Harness />);

    expect(screen.getByLabelText("Description")).toHaveAttribute(
      "maxlength",
      "500",
    );
  });

  it("shows the loading state while awaiting the API", async () => {
    let resolveRequest;

    predictCategories.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    render(<Harness />);
    suggest();

    expect(
      screen.getByRole("button", {
        name: "Finding skills...",
      }),
    ).toBeDisabled();

    expect(screen.getByRole("status")).toHaveTextContent("Finding skills");

    resolveRequest({ categories: [math] });

    await screen.findByRole("dialog");
  });

  it("sends the correct initial API payload", async () => {
    predictCategories.mockResolvedValue({
      categories: [math],
    });

    render(<Harness />);
    suggest();

    await screen.findByRole("dialog");

    expect(predictCategories).toHaveBeenCalledWith({
      description: "I teach math",
      mode: "volunteer_skills",
    });
  });

  it("allows selecting multiple suggested skills", async () => {
    predictCategories.mockResolvedValue({
      categories: [math, garden],
    });

    render(<Harness />);
    suggest();

    const dialog = await screen.findByRole("dialog");

    within(dialog)
      .getAllByRole("checkbox")
      .forEach((checkbox) => fireEvent.click(checkbox));

    fireEvent.click(
      within(dialog).getByRole("button", {
        name: "Select",
      }),
    );

    expect(screen.getByTestId("selected")).toHaveTextContent(
      '["4.3.1","3.3.5"]',
    );
  });

  it("preserves existing skills without duplicates", async () => {
    predictCategories.mockResolvedValue({
      categories: [math, math, garden],
    });

    render(<Harness initialSkills={["4.3.1"]} />);
    suggest();

    const dialog = await screen.findByRole("dialog");
    const checkboxes = within(dialog).getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[0]).toBeEnabled();

    fireEvent.click(checkboxes[1]);

    fireEvent.click(
      within(dialog).getByRole("button", {
        name: "Select",
      }),
    );

    expect(screen.getByTestId("selected")).toHaveTextContent(
      '["4.3.1","3.3.5"]',
    );
  });

  it("forwards the latest session on repeated requests", async () => {
    const session = {
      entries: [{ text: "I teach math", skills: [math] }],
    };

    predictCategories
      .mockResolvedValueOnce({
        categories: [math],
        session,
      })
      .mockResolvedValueOnce({
        categories: [math, garden],
      });

    render(<Harness />);
    suggest();

    await screen.findByRole("dialog");

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    suggest("I can help with gardening");

    await waitFor(() => {
      expect(predictCategories).toHaveBeenNthCalledWith(2, {
        description: "I can help with gardening",
        mode: "volunteer_skills",
        session,
      });
    });

    await screen.findByRole("dialog");
  });

  it("suggests General when no skills match", async () => {
    predictCategories.mockResolvedValue({
      categories: [],
    });

    render(<Harness />);
    suggest("Something unknown");

    const dialog = await screen.findByRole("dialog");

    expect(dialog).toHaveTextContent("We couldn't find a match");

    fireEvent.click(
      within(dialog).getByRole("checkbox", {
        name: "GENERAL_CATEGORY",
      }),
    );

    fireEvent.click(
      within(dialog).getByRole("button", {
        name: "Select",
      }),
    );

    expect(screen.getByTestId("selected")).toHaveTextContent('["general"]');
  });

  it("displays unmatched skills", async () => {
    predictCategories.mockResolvedValue({
      categories: [math],
      unmatched_skills: ["sports"],
    });

    render(<Harness />);
    suggest();

    expect(await screen.findByRole("dialog")).toHaveTextContent(
      "We couldn't match sports.",
    );
  });

  it("falls back to the manual picker on API failure", async () => {
    predictCategories.mockRejectedValue({
      response: { status: 502 },
    });

    render(<Harness />);
    suggest();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please use the skills picker",
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Suggest Skills",
      }),
    ).toBeEnabled();
  });

  it("does not add skills when the popup is cancelled", async () => {
    predictCategories.mockResolvedValue({
      categories: [math],
    });

    render(<Harness />);
    suggest();

    const dialog = await screen.findByRole("dialog");

    fireEvent.click(within(dialog).getByRole("checkbox"));

    fireEvent.click(
      within(dialog).getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(screen.getByTestId("selected")).toHaveTextContent("[]");
  });
});

it("does not show General when returned categories cannot be mapped", async () => {
  predictCategories.mockResolvedValueOnce({
    categories: [
      {
        category_number: "99.99",
        category_name: "UNKNOWN_SKILL",
      },
    ],
    unmatched_skills: [],
  });

  render(<Harness />);

  suggest("I can help with a specialized skill");

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Skill suggestions are currently unavailable",
  );

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

describe("Volunteer skill suggestions review feedback (#2041)", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("clears the description without removing selected skills", () => {
    render(<Harness initialSkills={["4.3.1"]} />);

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "I teach math" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Clear description" }));

    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByText("0/500")).toBeInTheDocument();
    expect(screen.getByTestId("selected")).toHaveTextContent('["4.3.1"]');
    expect(
      screen.getByRole("button", { name: "Suggest Skills" }),
    ).toBeDisabled();
  });

  it("allows deselecting an existing skill while preserving unrelated skills", async () => {
    predictCategories.mockResolvedValue({
      categories: [math, garden],
    });

    render(<Harness initialSkills={["4.3.1", "general"]} />);
    suggest();

    const dialog = await screen.findByRole("dialog");
    const checkboxes = within(dialog).getAllByRole("checkbox");

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[0]).toBeEnabled();

    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    fireEvent.click(within(dialog).getByRole("button", { name: "Select" }));

    expect(screen.getByTestId("selected")).toHaveTextContent(
      '["general","3.3.5"]',
    );
  });

  it("preserves existing selections when deselection is cancelled", async () => {
    predictCategories.mockResolvedValue({
      categories: [math, garden],
    });

    render(<Harness initialSkills={["4.3.1"]} />);
    suggest();

    const dialog = await screen.findByRole("dialog");
    const checkboxes = within(dialog).getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));

    expect(screen.getByTestId("selected")).toHaveTextContent('["4.3.1"]');
  });

  it("displays unmatched skills below the suggested skills", async () => {
    predictCategories.mockResolvedValue({
      categories: [math, garden],
      unmatched_skills: ["driving car"],
    });

    render(<Harness />);
    suggest();

    const dialog = await screen.findByRole("dialog");
    const checkboxes = within(dialog).getAllByRole("checkbox");
    const note = within(dialog).getByText("We couldn't match driving car.");

    expect(
      checkboxes[1].compareDocumentPosition(note) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("preserves the API session after clearing the description", async () => {
    const session = {
      entries: [{ text: "I teach math", skills: [math] }],
    };

    predictCategories
      .mockResolvedValueOnce({ categories: [math], session })
      .mockResolvedValueOnce({ categories: [math, garden] });

    render(<Harness />);
    suggest();

    const dialog = await screen.findByRole("dialog");

    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Clear description" }));

    suggest("I can help with gardening");

    await screen.findByRole("dialog");

    expect(predictCategories).toHaveBeenNthCalledWith(2, {
      description: "I can help with gardening",
      mode: "volunteer_skills",
      session,
    });
  });
});
