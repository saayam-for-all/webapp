import "@testing-library/jest-dom";
import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import EmergencyContact from "./EmergencyContact";
import { getEmergencyContactInfo } from "../../services/requestServices";

jest.mock("../../services/requestServices", () => ({
  getEmergencyContactInfo: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        POLICE: "Police",
        FIRE: "Fire",
        AMBULANCE: "Ambulance",
        SUICIDE_PREVENTION: "Crisis Helpline",
        CATEGORY_SAFETY: "Safety & Security",
        CATEGORY_MEDICAL: "Medical & Helplines",
        BACK_TO_DASHBOARD: "Back to Dashboard",
        EMERGENCY_CONTACTS: "Emergency Contacts",
      };
      return translations[key] || key;
    },
  }),
}));

describe("EmergencyContact - Issue #1959", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn((success) =>
        success({
          coords: { latitude: 50.0379, longitude: 8.5622 },
        }),
      ),
    };
  });

  it("shows detecting location indicator while loading and does not render numbers", () => {
    getEmergencyContactInfo.mockReturnValue(new Promise(() => {}));

    render(<EmergencyContact />);

    expect(screen.getByText("Detecting your location...")).toBeInTheDocument();
    expect(
      screen.queryByTestId("emergency-contacts-list"),
    ).not.toBeInTheDocument();
  });

  it("renders European numbers and area without null state when API succeeds", async () => {
    getEmergencyContactInfo.mockResolvedValue({
      services: {
        police: {
          dial_number: "110",
          display_number: "110",
          is_fallback: false,
        },
        fire: { dial_number: "112", display_number: "112", is_fallback: false },
        ambulance: {
          dial_number: "112",
          display_number: "112",
          is_fallback: false,
        },
        suicide_helpline: {
          dial_number: "112",
          display_number: "112",
          is_fallback: true,
        },
      },
      country: "AT",
      resolved_location: { city: "Wien", state: null, country: "AT" },
    });

    render(<EmergencyContact />);

    await waitFor(() => {
      expect(
        screen.getByText(/Area Detected: Wien \(AT\)/),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/null/i)).not.toBeInTheDocument();

    const list = screen.getByTestId("emergency-contacts-list");
    expect(within(list).queryByText(/911/)).not.toBeInTheDocument();
    expect(within(list).getByText(/Police — 110/)).toBeInTheDocument();
    expect(within(list).getAllByText(/112/).length).toBeGreaterThan(0);
    expect(
      within(list).getByText(/general emergency number/),
    ).toBeInTheDocument();
  });

  it("shows error state with Retry button when the API fails", async () => {
    getEmergencyContactInfo.mockRejectedValue(new Error("Network error"));

    render(<EmergencyContact />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "We couldn't load emergency numbers for your location",
        ),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(
      screen.queryByTestId("emergency-contacts-list"),
    ).not.toBeInTheDocument();

    // Verify retry calls fetch again
    getEmergencyContactInfo.mockResolvedValueOnce({
      services: {
        police: { dial_number: "112", display_number: "112" },
      },
      country: "IT",
    });
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => {
      const list = screen.getByTestId("emergency-contacts-list");
      expect(within(list).getByText(/Police — 112/)).toBeInTheDocument();
    });
  });

  it("labels location as estimated when geolocation permission is denied", async () => {
    global.navigator.geolocation.getCurrentPosition = jest.fn((_, error) =>
      error(new Error("User denied Geolocation")),
    );

    getEmergencyContactInfo.mockResolvedValue({
      services: {
        police: { dial_number: "100", display_number: "100" },
      },
      country: "IN",
      resolved_location: {
        city: "Bengaluru",
        state: "Karnataka",
        country: "IN",
      },
    });

    render(<EmergencyContact />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Location estimated from your internet connection: Bengaluru, Karnataka \(IN\)/,
        ),
      ).toBeInTheDocument();
    });

    const list = screen.getByTestId("emergency-contacts-list");
    expect(within(list).getByText(/Police — 100/)).toBeInTheDocument();
  });
});
