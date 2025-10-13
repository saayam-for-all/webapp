import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Availability from "./Availability";

// Mock rsuite TimePicker since it depends on browser APIs and CSS
jest.mock("rsuite", () => ({
  TimePicker: ({ onChange, onOk, className }) => (
    <input
      data-testid="time-picker"
      className={className}
      type="time"
      onChange={(e) => {
        onChange && onChange(e.target.value);
        onOk && onOk(e.target.value);
      }}
    />
  ),
}));

fdescribe("Availability Component", () => {
  let mockSetAvailabilitySlots;
  let mockSetNotification;
  let defaultSlots;

  beforeEach(() => {
    mockSetAvailabilitySlots = jest.fn();
    mockSetNotification = jest.fn();
    defaultSlots = [
      { id: 1, day: "Everyday", startTime: "00:00", endTime: "00:00" },
    ];
  });

  it("renders heading and initial elements correctly", () => {
    render(
      <Availability
        availabilitySlots={defaultSlots}
        tobeNotified={false}
        setAvailabilitySlots={mockSetAvailabilitySlots}
        setNotification={mockSetNotification}
      />,
    );

    expect(
      screen.getByText(
        "Please Provide Your Available Time Slots for Volunteering",
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getAllByTestId("time-picker")).toHaveLength(2);
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("calls setNotification when checkbox toggled", () => {
    render(
      <Availability
        availabilitySlots={defaultSlots}
        tobeNotified={false}
        setAvailabilitySlots={mockSetAvailabilitySlots}
        setNotification={mockSetNotification}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockSetNotification).toHaveBeenCalledTimes(1);
  });

  it("adds a new slot when Add button clicked", () => {
    render(
      <Availability
        availabilitySlots={defaultSlots}
        tobeNotified={false}
        setAvailabilitySlots={mockSetAvailabilitySlots}
        setNotification={mockSetNotification}
      />,
    );

    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    expect(mockSetAvailabilitySlots).toHaveBeenCalledWith([
      ...defaultSlots,
      {
        id: defaultSlots[defaultSlots.length - 1].id + 1,
        day: "Everyday",
        startTime: "00:00",
        endTime: "00:00",
      },
    ]);
  });

  it("removes a slot when remove button clicked (if more than 1)", () => {
    const multiSlots = [
      ...defaultSlots,
      { id: 2, day: "Monday", startTime: "00:00", endTime: "00:00" },
    ];

    render(
      <Availability
        availabilitySlots={multiSlots}
        tobeNotified={false}
        setAvailabilitySlots={mockSetAvailabilitySlots}
        setNotification={mockSetNotification}
      />,
    );

    const removeButtons = screen.getAllByRole("button").filter((btn) => {
      return btn.querySelector("svg path[fill='#F44336']");
    });

    // Click first remove button
    fireEvent.click(removeButtons[0]);

    expect(mockSetAvailabilitySlots).toHaveBeenCalled();
    const newList = mockSetAvailabilitySlots.mock.calls[0][0];
    expect(newList.length).toBe(1);
  });

  it("updates a slot when day is changed", () => {
    render(
      <Availability
        availabilitySlots={defaultSlots}
        tobeNotified={false}
        setAvailabilitySlots={mockSetAvailabilitySlots}
        setNotification={mockSetNotification}
      />,
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Monday" } });

    expect(mockSetAvailabilitySlots).toHaveBeenCalledWith([
      { id: 1, day: "Monday", startTime: "00:00", endTime: "00:00" },
    ]);
  });

  it("updates startTime and endTime via mocked TimePicker", () => {
    render(
      <Availability
        availabilitySlots={defaultSlots}
        tobeNotified={false}
        setAvailabilitySlots={mockSetAvailabilitySlots}
        setNotification={mockSetNotification}
      />,
    );

    const timePickers = screen.getAllByTestId("time-picker");
    fireEvent.change(timePickers[0], { target: { value: "10:00" } });
    fireEvent.change(timePickers[1], { target: { value: "18:30" } });

    expect(mockSetAvailabilitySlots).toHaveBeenCalled();
  });
});
