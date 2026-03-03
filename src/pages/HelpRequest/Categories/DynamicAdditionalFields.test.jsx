import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DynamicAdditionalFields from "./DynamicAdditionalFields";

// ── Sample metadata matching the wiki schema ─────────────────────────
const sampleMetadata = [
  {
    catId: "1.1",
    fields: [
      {
        fieldId: "1.1.A",
        fieldNameKey: "PREFERRED_MEAL_TYPE",
        fieldType: "list",
        status: "active",
        catId: "1.1",
        listItems: [
          {
            itemId: "1.1.A.1",
            itemValue: "VEGETARIAN",
            itemType: "radiobutton",
          },
          { itemId: "1.1.A.2", itemValue: "VEGAN", itemType: "radiobutton" },
        ],
      },
      {
        fieldId: "1.1.B",
        fieldNameKey: "DIETARY_RESTRICTIONS",
        fieldType: "list",
        status: "active",
        catId: "1.1",
        listItems: [
          {
            itemId: "1.1.B.1",
            itemValue: "DIABETIC_FRIENDLY",
            itemType: "checkbox",
          },
          { itemId: "1.1.B.2", itemValue: "NUT_FREE", itemType: "checkbox" },
        ],
      },
      {
        fieldId: "1.1.C",
        fieldNameKey: "HOUSEHOLD_SIZE",
        fieldType: "int",
        status: "active",
        catId: "1.1",
        listItems: [],
      },
      {
        fieldId: "1.1.D",
        fieldNameKey: "INACTIVE_FIELD",
        fieldType: "textbox",
        status: "inactive",
        catId: "1.1",
        listItems: [],
      },
    ],
  },
  {
    catId: "3.7",
    fields: [
      {
        fieldId: "3.7.B",
        fieldNameKey: "ESTIMATED_MOVING_DATE",
        fieldType: "date&time",
        status: "active",
        catId: "3.7",
        listItems: [],
      },
      {
        fieldId: "3.7.D",
        fieldNameKey: "NEED_FOR_VEHICLE",
        fieldType: "checkbox",
        status: "active",
        catId: "3.7",
        listItems: [],
      },
    ],
  },
  {
    catId: "1.2",
    fields: [
      {
        fieldId: "1.2.A",
        fieldNameKey: "GROCERY_LIST",
        fieldType: "textbox",
        status: "active",
        catId: "1.2",
        listItems: [],
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.setItem("metadata", JSON.stringify(sampleMetadata));
});

afterEach(() => {
  localStorage.clear();
});

// ── Tests ─────────────────────────────────────────────────────────────

describe("DynamicAdditionalFields", () => {
  it("renders nothing when no metadata exists for the catId", () => {
    const onChange = jest.fn();
    const { container } = render(
      <DynamicAdditionalFields catId="99.99" onChange={onChange} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when catId is null", () => {
    const onChange = jest.fn();
    const { container } = render(
      <DynamicAdditionalFields catId={null} onChange={onChange} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when localStorage has no metadata key", () => {
    localStorage.removeItem("metadata");
    const onChange = jest.fn();
    const { container } = render(
      <DynamicAdditionalFields catId="1.1" onChange={onChange} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders radio button list fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    expect(screen.getByText("Preferred Meal Type")).toBeInTheDocument();
    expect(screen.getByTestId("radio-1.1.A.1")).toBeInTheDocument();
    expect(screen.getByTestId("radio-1.1.A.2")).toBeInTheDocument();
    expect(screen.getByText("Vegetarian")).toBeInTheDocument();
    expect(screen.getByText("Vegan")).toBeInTheDocument();
  });

  it("renders checkbox list fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    expect(screen.getByText("Dietary Restrictions")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-1.1.B.1")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-1.1.B.2")).toBeInTheDocument();
  });

  it("renders integer fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    expect(screen.getByText("Household Size")).toBeInTheDocument();
    expect(screen.getByTestId("field-1.1.C")).toBeInTheDocument();
    expect(screen.getByTestId("field-1.1.C")).toHaveAttribute("type", "number");
  });

  it("skips inactive fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    expect(screen.queryByText("Inactive Field")).not.toBeInTheDocument();
  });

  it("renders textbox fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.2" onChange={onChange} />);
    expect(screen.getByText("Grocery List")).toBeInTheDocument();
    expect(screen.getByTestId("field-1.2.A")).toHaveAttribute("type", "text");
  });

  it("renders date & time fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.7" onChange={onChange} />);
    expect(screen.getByText("Estimated Moving Date")).toBeInTheDocument();
    expect(screen.getByTestId("field-3.7.B-date")).toHaveAttribute(
      "type",
      "date",
    );
    expect(screen.getByTestId("field-3.7.B-time")).toHaveAttribute(
      "type",
      "time",
    );
  });

  it("renders standalone checkbox fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.7" onChange={onChange} />);
    expect(screen.getByText("Need For Vehicle")).toBeInTheDocument();
    expect(screen.getByTestId("field-3.7.D")).toHaveAttribute(
      "type",
      "checkbox",
    );
  });

  it("calls onChange with correct values when radio button is selected", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);

    fireEvent.click(screen.getByTestId("radio-1.1.A.1"));

    // onChange should have been called with the selected value
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["1.1.A"]).toBe("VEGETARIAN");
  });

  it("calls onChange with correct values when checkbox is toggled", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);

    fireEvent.click(screen.getByTestId("checkbox-1.1.B.1"));

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["1.1.B"]).toContain("DIABETIC_FRIENDLY");
  });

  it("calls onChange with correct values when number input is changed", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);

    fireEvent.change(screen.getByTestId("field-1.1.C"), {
      target: { value: "4" },
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["1.1.C"]).toBe("4");
  });

  it("renders the wrapper container with correct test id", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    expect(screen.getByTestId("dynamic-additional-fields")).toBeInTheDocument();
  });
});
