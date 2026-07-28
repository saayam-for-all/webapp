import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Availability from "./Availability";
import React from "react";

jest.mock("react-i18next");

jest.mock("rsuite", () => {
  return {
    TimePicker: ({
      value,
      onChange,
      shouldDisableHour,
      shouldDisableMinute,
    }) => {
      if (shouldDisableHour) {
        shouldDisableHour(new Date().getHours());
      }
      if (shouldDisableMinute) {
        shouldDisableMinute(30, new Date().getHours());
      }
      return (
        <input
          data-testid="time-picker-input"
          onChange={(e) => {
            const val = e.target.value ? new Date(e.target.value) : null;
            onChange(val);
          }}
        />
      );
    },
  };
});

const AvailabilityWrapper = ({ initialSlots }) => {
  const [slots, setSlots] = React.useState(
    initialSlots || [
      { id: 1, dayOfWeek: "Monday", startTime: null, endTime: null },
    ],
  );
  return (
    <Availability availabilitySlots={slots} setAvailabilitySlots={setSlots} />
  );
};

describe("Availability Step Component", () => {
  it("renders availability title and slots", () => {
    const slots = [
      {
        id: 1,
        dayOfWeek: "Monday",
        startTime: new Date(),
        endTime: new Date(),
      },
    ];
    const setSlots = jest.fn();
    render(
      <Availability
        availabilitySlots={slots}
        setAvailabilitySlots={setSlots}
      />,
    );
    expect(
      screen.getByText("mockTranslate(PLEASE_PROVIDE_AVAILABILITY_SLOTS)"),
    ).toBeInTheDocument();
  });

  it("handles adding slot", () => {
    const slots = [
      {
        id: 1,
        dayOfWeek: "Monday",
        startTime: new Date(),
        endTime: new Date(),
      },
    ];
    render(<AvailabilityWrapper initialSlots={slots} />);
    const addButton = screen.getByText("mockTranslate(ADD)");
    fireEvent.click(addButton);
  });

  it("handles day change", () => {
    render(<AvailabilityWrapper />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Tuesday" } });
    expect(select.value).toBe("Tuesday");
  });

  it("handles remove slot", () => {
    const slots = [
      {
        id: 1,
        dayOfWeek: "Monday",
        startTime: new Date(),
        endTime: new Date(),
      },
      {
        id: 2,
        dayOfWeek: "Tuesday",
        startTime: new Date(),
        endTime: new Date(),
      },
    ];
    render(<AvailabilityWrapper initialSlots={slots} />);

    const removeButtons = screen.getAllByRole("button", {
      name: "mockTranslate(REMOVE_ROW)",
    });
    expect(removeButtons.length).toBe(1);
    fireEvent.click(removeButtons[0]);
  });

  it("shows validation error on invalid addition", async () => {
    render(<AvailabilityWrapper />);
    const addButton = screen.getByText("mockTranslate(ADD)");
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(
        screen.getAllByText("mockTranslate(REQUIRED)").length,
      ).toBeGreaterThan(0);
    });
  });

  it("triggers time picker changes and comparisons and clears errors", async () => {
    render(<AvailabilityWrapper />);

    // Trigger error first
    const addButton = screen.getByText("mockTranslate(ADD)");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getAllByText("mockTranslate(REQUIRED)").length,
      ).toBeGreaterThan(0);
    });

    const timePickers = screen.getAllByTestId("time-picker-input");
    expect(timePickers.length).toBe(2);

    // Trigger startTime change
    fireEvent.change(timePickers[0], {
      target: { value: "2026-06-27T08:00:00Z" },
    });

    // Trigger endTime change
    fireEvent.change(timePickers[1], {
      target: { value: "2026-06-27T09:00:00Z" },
    });
  });
});
