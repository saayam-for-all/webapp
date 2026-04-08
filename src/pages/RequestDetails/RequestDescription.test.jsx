import React from "react";
import { screen } from "@testing-library/react";
import {
  renderWithProviders,
  MOCK_STATE_LOGGED_IN,
} from "../../../utils/test-utils";
import RequestDescription from "./RequestDescription";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => {
      const map = {
        "enums:requestStatus.MATCHING_VOLUNTEER": "Matching Volunteer",
        "enums:requestPriority.LOW": "Low",
        EDIT: "Edit",
      };
      return map[key] || options?.defaultValue || key;
    },
  }),
}));

describe("RequestDescription", () => {
  const requestData = {
    creationDate: "2024-12-06",
    category: "ERRANDS_EVENTS_TRANSPORTATION",
    status: "MATCHING_VOLUNTEER",
    priority: "LOW",
    description: "Need someone to pick up my dry cleaning",
  };

  it("renders sentence-cased status and priority with mapped colors", () => {
    renderWithProviders(
      <RequestDescription requestData={requestData} setIsEditing={jest.fn()} />,
      { preloadedState: MOCK_STATE_LOGGED_IN },
    );

    const statusBadge = screen.getByTestId("status-badge");
    const priorityIcon = screen.getByTestId("priority-icon");
    const priorityLabel = screen.getByTestId("priority-label");

    expect(statusBadge.textContent).toContain("Matching Volunteer");
    expect(statusBadge.className).toContain("bg-yellow-100");
    expect(statusBadge.className).toContain("text-yellow-800");

    expect(priorityIcon.getAttribute("class")).toContain("text-green-600");
    expect(priorityLabel.textContent).toContain("Low");
    expect(priorityLabel.className).toContain("text-green-600");
  });
});
