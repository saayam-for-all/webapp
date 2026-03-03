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
        fieldId: "3.7.A",
        fieldNameKey: "TYPE_OF_ASSISTANCE_NEEDED",
        fieldType: "list",
        status: "active",
        catId: "3.7",
        listItems: [
          {
            itemId: "3.7.A.1",
            itemValue: "PACKING_UNPACKING",
            itemType: "checkbox",
          },
        ],
      },
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
  {
    catId: "5.4",
    fields: [
      {
        fieldId: "5.4.B",
        fieldNameKey: "REMINDER_TIMES",
        fieldType: "time",
        status: "active",
        catId: "5.4",
        listItems: [],
      },
    ],
  },
  {
    catId: "3.6",
    fields: [
      {
        fieldId: "3.6.D",
        fieldNameKey: "MONTHLY_RENT",
        fieldType: "currency",
        status: "active",
        catId: "3.6",
        listItems: [],
      },
      {
        fieldId: "3.6.J",
        fieldNameKey: "PREFERRED_AGE",
        fieldType: "list",
        status: "active",
        catId: "3.6",
        listItems: [
          { itemId: "3.6.J.1", itemValue: "MIN_AGE", itemType: "integer" },
          { itemId: "3.6.J.2", itemValue: "MAX_AGE", itemType: "integer" },
        ],
      },
    ],
  },
  {
    catId: "3.5",
    fields: [
      {
        fieldId: "3.5.C",
        fieldNameKey: "MONTHLY_RENT_BUDGET_RANGE",
        fieldType: "list",
        status: "active",
        catId: "3.5",
        listItems: [
          {
            itemId: "3.5.C.1",
            itemValue: "MINIMUM_BUDGET",
            itemType: "currency",
          },
          {
            itemId: "3.5.C.2",
            itemValue: "MAXIMUM_BUDGET",
            itemType: "currency",
          },
        ],
      },
    ],
  },
  {
    catId: "6.2",
    fields: [
      {
        fieldId: "6.2.A",
        fieldNameKey: "ADDITIONAL_INFORMATION",
        fieldType: "list",
        status: "active",
        catId: "6.2",
        listItems: [
          { itemId: "6.2.A.1", itemValue: "APP_NAME", itemType: "textbox" },
          {
            itemId: "6.2.A.2",
            itemValue: "TYPE_OF_DEVICE",
            itemType: "textbox",
          },
        ],
      },
    ],
  },
  {
    catId: "6.1",
    fields: [
      {
        fieldId: "6.1.B",
        fieldNameKey: "PREFERRED_MOVE_OUT_DATE",
        fieldType: "list",
        status: "active",
        catId: "6.1",
        listItems: [
          {
            itemId: "6.1.B.1",
            itemValue: "PRIMARY_SLOT",
            itemType: "date&time",
          },
          {
            itemId: "6.1.B.2",
            itemValue: "ALTERNATE_SLOT",
            itemType: "date&time",
          },
        ],
      },
    ],
  },
  {
    catId: "3.5.F",
    fields: [
      {
        fieldId: "3.5.F.1",
        fieldNameKey: "NUMBER_OF_PEOPLE",
        fieldType: "integer",
        status: "active",
        catId: "3.5.F",
        listItems: [],
      },
    ],
  },
  {
    catId: "empty-list",
    fields: [
      {
        fieldId: "el.A",
        fieldNameKey: "EMPTY_LIST",
        fieldType: "list",
        status: "active",
        catId: "empty-list",
        listItems: [],
      },
    ],
  },
  {
    catId: "mixed-list",
    fields: [
      {
        fieldId: "ml.A",
        fieldNameKey: "MIXED_ITEMS",
        fieldType: "list",
        status: "active",
        catId: "mixed-list",
        listItems: [
          { itemId: "ml.A.1", itemValue: "OPTION_A", itemType: "radiobutton" },
          { itemId: "ml.A.2", itemValue: "DETAIL", itemType: "textbox" },
        ],
      },
    ],
  },
  {
    catId: "unknown-type",
    fields: [
      {
        fieldId: "ut.A",
        fieldNameKey: "UNKNOWN",
        fieldType: "unknownType",
        status: "active",
        catId: "unknown-type",
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
  // ── Empty / null scenarios ──────────────────────────────────────────

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

  it("renders nothing when localStorage metadata is invalid JSON", () => {
    localStorage.setItem("metadata", "not-valid-json");
    const onChange = jest.fn();
    const { container } = render(
      <DynamicAdditionalFields catId="1.1" onChange={onChange} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when localStorage metadata is not an array", () => {
    localStorage.setItem("metadata", JSON.stringify({ catId: "1.1" }));
    const onChange = jest.fn();
    const { container } = render(
      <DynamicAdditionalFields catId="1.1" onChange={onChange} />,
    );
    expect(container.innerHTML).toBe("");
  });

  // ── Radio button list fields ────────────────────────────────────────

  it("renders radio button list fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    expect(screen.getByText("Preferred Meal Type")).toBeInTheDocument();
    expect(screen.getByTestId("radio-1.1.A.1")).toBeInTheDocument();
    expect(screen.getByTestId("radio-1.1.A.2")).toBeInTheDocument();
    expect(screen.getByText("Vegetarian")).toBeInTheDocument();
    expect(screen.getByText("Vegan")).toBeInTheDocument();
  });

  it("calls onChange with correct values when radio button is selected", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    fireEvent.click(screen.getByTestId("radio-1.1.A.1"));
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["1.1.A"]).toBe("VEGETARIAN");
  });

  // ── Checkbox list fields ────────────────────────────────────────────

  it("renders checkbox list fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    expect(screen.getByText("Dietary Restrictions")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-1.1.B.1")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-1.1.B.2")).toBeInTheDocument();
  });

  it("calls onChange with correct values when checkbox is toggled on", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    fireEvent.click(screen.getByTestId("checkbox-1.1.B.1"));
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["1.1.B"]).toContain("DIABETIC_FRIENDLY");
  });

  it("calls onChange correctly when checkbox is toggled off", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    // Toggle on
    fireEvent.click(screen.getByTestId("checkbox-1.1.B.1"));
    // Toggle off
    fireEvent.click(screen.getByTestId("checkbox-1.1.B.1"));
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["1.1.B"]).not.toContain("DIABETIC_FRIENDLY");
  });

  // ── Integer / int fields ────────────────────────────────────────────

  it("renders int fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    expect(screen.getByText("Household Size")).toBeInTheDocument();
    expect(screen.getByTestId("field-1.1.C")).toHaveAttribute("type", "number");
  });

  it("renders integer fields (alternate keyword)", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.5.F" onChange={onChange} />);
    expect(screen.getByText("Number Of People")).toBeInTheDocument();
    expect(screen.getByTestId("field-3.5.F.1")).toHaveAttribute(
      "type",
      "number",
    );
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

  // ── Inactive field filtering ────────────────────────────────────────

  it("skips inactive fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    expect(screen.queryByText("Inactive Field")).not.toBeInTheDocument();
  });

  // ── Textbox fields ──────────────────────────────────────────────────

  it("renders textbox fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.2" onChange={onChange} />);
    expect(screen.getByText("Grocery List")).toBeInTheDocument();
    expect(screen.getByTestId("field-1.2.A")).toHaveAttribute("type", "text");
  });

  it("calls onChange when textbox value changes", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.2" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("field-1.2.A"), {
      target: { value: "apples" },
    });
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["1.2.A"]).toBe("apples");
  });

  // ── Date & time fields ──────────────────────────────────────────────

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

  it("calls onChange when date field changes", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.7" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("field-3.7.B-date"), {
      target: { value: "2026-03-15" },
    });
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["3.7.B_date"]).toBe("2026-03-15");
  });

  it("calls onChange when time field changes", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.7" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("field-3.7.B-time"), {
      target: { value: "14:30" },
    });
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["3.7.B_time"]).toBe("14:30");
  });

  // ── Standalone checkbox fields ──────────────────────────────────────

  it("renders standalone checkbox fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.7" onChange={onChange} />);
    expect(screen.getByText("Need For Vehicle")).toBeInTheDocument();
    expect(screen.getByTestId("field-3.7.D")).toHaveAttribute(
      "type",
      "checkbox",
    );
  });

  it("calls onChange when standalone checkbox is toggled", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.7" onChange={onChange} />);
    fireEvent.click(screen.getByTestId("field-3.7.D"));
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["3.7.D"]).toBe(true);
  });

  // ── Time-only field ─────────────────────────────────────────────────

  it("renders time-only fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="5.4" onChange={onChange} />);
    expect(screen.getByText("Reminder Times")).toBeInTheDocument();
    expect(screen.getByTestId("field-5.4.B")).toHaveAttribute("type", "time");
  });

  it("calls onChange when time-only field changes", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="5.4" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("field-5.4.B"), {
      target: { value: "09:00" },
    });
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["5.4.B"]).toBe("09:00");
  });

  // ── Currency field ──────────────────────────────────────────────────

  it("renders currency fields", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.6" onChange={onChange} />);
    expect(screen.getByText("Monthly Rent")).toBeInTheDocument();
    expect(screen.getByTestId("field-3.6.D")).toHaveAttribute("type", "number");
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("calls onChange when currency field changes", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.6" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("field-3.6.D"), {
      target: { value: "1500" },
    });
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["3.6.D"]).toBe("1500");
  });

  // ── List items with integer itemType ────────────────────────────────

  it("renders list items with integer itemType", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.6" onChange={onChange} />);
    expect(screen.getByText("Preferred Age")).toBeInTheDocument();
    expect(screen.getByTestId("int-3.6.J.1")).toHaveAttribute("type", "number");
    expect(screen.getByTestId("int-3.6.J.2")).toHaveAttribute("type", "number");
  });

  it("calls onChange when integer list item changes", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.6" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("int-3.6.J.1"), {
      target: { value: "18" },
    });
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["3.6.J"]["3.6.J.1"]).toBe("18");
  });

  // ── List items with currency itemType ───────────────────────────────

  it("renders list items with currency itemType", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.5" onChange={onChange} />);
    expect(screen.getByText("Monthly Rent Budget Range")).toBeInTheDocument();
    expect(screen.getByTestId("currency-3.5.C.1")).toHaveAttribute(
      "type",
      "number",
    );
    expect(screen.getByTestId("currency-3.5.C.2")).toHaveAttribute(
      "type",
      "number",
    );
  });

  it("calls onChange when currency list item changes", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="3.5" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("currency-3.5.C.1"), {
      target: { value: "500" },
    });
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["3.5.C"]["3.5.C.1"]).toBe("500");
  });

  // ── List items with textbox itemType ────────────────────────────────

  it("renders list items with textbox itemType", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="6.2" onChange={onChange} />);
    // Both the h3 heading and the field label say "Additional Information"
    expect(
      screen.getAllByText("Additional Information").length,
    ).toBeGreaterThanOrEqual(2);
    expect(screen.getByTestId("text-6.2.A.1")).toHaveAttribute("type", "text");
    expect(screen.getByTestId("text-6.2.A.2")).toHaveAttribute("type", "text");
  });

  it("calls onChange when textbox list item changes", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="6.2" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("text-6.2.A.1"), {
      target: { value: "WhatsApp" },
    });
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["6.2.A"]["6.2.A.1"]).toBe("WhatsApp");
  });

  // ── List items with date&time itemType ──────────────────────────────

  it("renders list items with date&time itemType", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="6.1" onChange={onChange} />);
    expect(screen.getByText("Preferred Move Out Date")).toBeInTheDocument();
    expect(screen.getByTestId("date-6.1.B.1")).toHaveAttribute("type", "date");
    expect(screen.getByTestId("time-6.1.B.1")).toHaveAttribute("type", "time");
  });

  it("calls onChange when date&time list item date changes", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="6.1" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("date-6.1.B.1"), {
      target: { value: "2026-04-01" },
    });
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["6.1.B"]["6.1.B.1_date"]).toBe("2026-04-01");
  });

  it("calls onChange when date&time list item time changes", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="6.1" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("time-6.1.B.1"), {
      target: { value: "10:00" },
    });
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall["6.1.B"]["6.1.B.1_time"]).toBe("10:00");
  });

  // ── Empty list field ────────────────────────────────────────────────

  it("renders nothing for a list field with no listItems", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="empty-list" onChange={onChange} />);
    expect(screen.queryByText("Empty List")).not.toBeInTheDocument();
  });

  // ── Mixed list items (space-y-2 layout) ─────────────────────────────

  it("renders mixed list items with space-y-2 layout", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="mixed-list" onChange={onChange} />);
    expect(screen.getByText("Mixed Items")).toBeInTheDocument();
    expect(screen.getByTestId("radio-ml.A.1")).toBeInTheDocument();
    expect(screen.getByTestId("text-ml.A.2")).toBeInTheDocument();
  });

  // ── Unknown field type ──────────────────────────────────────────────

  it("renders the wrapper but skips unknown field types", () => {
    const onChange = jest.fn();
    render(
      <DynamicAdditionalFields catId="unknown-type" onChange={onChange} />,
    );
    expect(screen.getByTestId("dynamic-additional-fields")).toBeInTheDocument();
    expect(screen.queryByText("Unknown")).not.toBeInTheDocument();
  });

  // ── initialValues prop ──────────────────────────────────────────────

  it("uses initialValues when provided", () => {
    const onChange = jest.fn();
    render(
      <DynamicAdditionalFields
        catId="1.1"
        onChange={onChange}
        initialValues={{ "1.1.A": "VEGAN" }}
      />,
    );
    expect(screen.getByTestId("radio-1.1.A.2")).toBeChecked();
  });

  // ── Sub-sub-category fallback ────────────────────────────────────────

  it("falls back to parent catId when sub-sub-category has no metadata", () => {
    const onChange = jest.fn();
    // catId "1.1.1" doesn't exist in metadata, but "1.1" does
    render(<DynamicAdditionalFields catId="1.1.1" onChange={onChange} />);
    // Should display the parent "1.1" fields
    expect(screen.getByText("Preferred Meal Type")).toBeInTheDocument();
    expect(screen.getByText("Dietary Restrictions")).toBeInTheDocument();
    expect(screen.getByText("Household Size")).toBeInTheDocument();
  });

  // ── Wrapper ─────────────────────────────────────────────────────────

  it("renders the wrapper container with correct test id", () => {
    const onChange = jest.fn();
    render(<DynamicAdditionalFields catId="1.1" onChange={onChange} />);
    expect(screen.getByTestId("dynamic-additional-fields")).toBeInTheDocument();
  });
});
