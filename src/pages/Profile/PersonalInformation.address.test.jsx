/* eslint-env node */
import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import PersonalInformation from "./PersonalInformation";
import en from "../../common/i18n/locales/en/profile.json";
import fr from "../../common/i18n/locales/fr/profile.json";
import es from "../../common/i18n/locales/es/profile.json";

jest.unmock("react-i18next");
jest.unmock("react-router-dom");

let mockUser;
jest.mock("react-redux", () => ({
  useSelector: (selector) => selector({ auth: { user: mockUser } }),
}));
jest.mock("../../common/components/PhoneNumberInputWithCountry", () => ({
  __esModule: true,
  default: () => null,
}));

const saved = {
  dateOfBirth: null,
  gender: "",
  streetAddress: "123 Main Street",
  streetAddress2: "",
  city: "Tempe",
  state: "AZ",
  country: "US",
  zipCode: "85281",
  secondaryEmail: "",
  secondaryPhone: "",
  secondaryPhoneCountryCode: "US",
};
const result = {
  address: {
    house_number: "123",
    road: "Main Street",
    city: "Tempe",
    state: "Arizona",
    country_code: "us",
  },
};
let onUnsaved;
let eventListener;

const mount = async (language = "en", info = saved) => {
  if (info) localStorage.setItem("personalInfo", JSON.stringify(info));
  const i18n = createInstance();
  await i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng: "en",
    defaultNS: "profile",
    resources: {
      en: { profile: en },
      fr: { profile: fr },
      es: { profile: es },
    },
    interpolation: { escapeValue: false },
  });
  const view = render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter
        initialEntries={[{ pathname: "/profile", state: { edit: true } }]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <PersonalInformation setHasUnsavedChanges={onUnsaved} />
      </MemoryRouter>
    </I18nextProvider>,
  );
  await act(async () => {});
  if (info)
    await waitFor(() =>
      expect(
        screen.getByRole("textbox", { name: /City|Ville|Ciudad/i }),
      ).toHaveValue(info.city),
    );
  return view;
};
const save = () =>
  fireEvent.click(
    screen.getByRole("button", { name: /^(Save|Enregistrer|Guardar)$/ }),
  );
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("addressFlag", "false");
  mockUser = { zoneinfo: "US" };
  onUnsaved = jest.fn();
  eventListener = jest.fn();
  window.addEventListener("personal-info-updated", eventListener);
  process.env.VITE_ADDRESS_VERIFICATION_URL = `https://geocoder.example.test/${expect.getState().currentTestName}`;
  global.fetch = jest
    .fn()
    .mockResolvedValue({ ok: true, json: async () => [result] });
});
afterEach(() => {
  delete global.fetch;
  delete process.env.VITE_ADDRESS_VERIFICATION_URL;
  window.removeEventListener("personal-info-updated", eventListener);
});

it("uses ISO country/state codes and saves only after verification succeeds", async () => {
  await mount();
  save();
  await screen.findByRole("button", { name: "Edit" });
  const url = new URL(fetch.mock.calls[0][0]);
  expect(url.searchParams.get("state")).toBe("Arizona");
  expect(url.searchParams.get("countrycodes")).toBe("us");
  expect(JSON.parse(localStorage.getItem("personalInfo"))).toEqual(saved);
  expect(localStorage.getItem("addressFlag")).toBe("true");
  expect(eventListener).toHaveBeenCalledTimes(1);
  expect(onUnsaved).toHaveBeenLastCalledWith(false);
});
it("preserves saved data, address flag, and dirty state when the city does not match", async () => {
  await mount();
  fireEvent.change(screen.getByRole("textbox", { name: /City/ }), {
    target: { value: "Phoenix" },
  });
  save();
  expect(await screen.findByRole("alert")).toHaveTextContent(
    en.ADDRESS_MISMATCH,
  );
  expect(JSON.parse(localStorage.getItem("personalInfo"))).toEqual(saved);
  expect(localStorage.getItem("addressFlag")).toBe("false");
  expect(eventListener).not.toHaveBeenCalled();
  expect(onUnsaved).toHaveBeenLastCalledWith(true);
});
it("locks editing and prevents duplicate saves during a pending check", async () => {
  let resolve;
  fetch.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  await mount();
  save();
  expect(screen.getByRole("status")).toHaveTextContent(en.VERIFYING_ADDRESS);
  expect(screen.getByRole("textbox", { name: /City/ })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: en.VERIFYING_ADDRESS }));
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(eventListener).not.toHaveBeenCalled();
  await act(async () => resolve({ ok: true, json: async () => [result] }));
  expect(screen.getByRole("button", { name: "Edit" })).toBeEnabled();
});
it.each(["offline", "not configured"])(
  "shows retryable service error for %s and does not save",
  async (failure) => {
    if (failure === "offline") fetch.mockRejectedValue(new Error("offline"));
    else delete process.env.VITE_ADDRESS_VERIFICATION_URL;
    await mount();
    save();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      en.ADDRESS_VERIFICATION_UNAVAILABLE,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
    expect(eventListener).not.toHaveBeenCalled();
  },
);
it("clears stale verification feedback on edit and allows retry", async () => {
  fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
  await mount();
  save();
  await screen.findByRole("alert");
  fireEvent.change(screen.getByRole("textbox", { name: /City/ }), {
    target: { value: "Tempe " },
  });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  save();
  await screen.findByRole("button", { name: "Edit" });
  expect(fetch).toHaveBeenCalledTimes(2);
});
it("does not make a request for an empty city", async () => {
  await mount();
  fireEvent.change(screen.getByRole("textbox", { name: /City/ }), {
    target: { value: "" },
  });
  save();
  expect(screen.getByText(en.CITY_REQUIRED)).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
it("does not flag unsaved form entries as a saved address", async () => {
  await mount("en", null);
  fireEvent.change(screen.getByRole("textbox", { name: /City/ }), {
    target: { value: "Tempe" },
  });
  expect(localStorage.getItem("addressFlag")).toBe("false");
  expect(localStorage.getItem("personalInfo")).toBeNull();
});
it("does not save or emit events after leaving the page", async () => {
  let resolve;
  fetch.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const view = await mount();
  save();
  const signal = fetch.mock.calls[0][1].signal;
  view.unmount();
  expect(signal.aborted).toBe(true);
  await act(async () => resolve({ ok: true, json: async () => [result] }));
  expect(eventListener).not.toHaveBeenCalled();
  expect(localStorage.getItem("addressFlag")).toBe("false");
});
it("preserves international city names and alphanumeric postal codes", async () => {
  mockUser = { zoneinfo: "CA" };
  fetch.mockResolvedValue({
    ok: true,
    json: async () => [
      {
        address: {
          house_number: "12",
          road: "Rue de l’Église",
          city: "Montréal",
          state: "Québec",
          "ISO3166-2-lvl4": "CA-QC",
          country_code: "ca",
        },
      },
    ],
  });
  await mount("en", {
    ...saved,
    streetAddress: "12 Rue de l'Église",
    city: "Montréal",
    state: "QC",
    country: "CA",
    zipCode: "H2Y 1C6",
  });
  save();
  await screen.findByRole("button", { name: "Edit" });
  expect(JSON.parse(localStorage.getItem("personalInfo")).zipCode).toBe(
    "H2Y 1C6",
  );
});
it("restores a saved ISO address without an authenticated country value", async () => {
  mockUser = {};
  await mount();
  save();
  await screen.findByRole("button", { name: "Edit" });
});
it("accepts a legacy address stored with country/state names", async () => {
  await mount("en", { ...saved, country: "United States", state: "Arizona" });
  save();
  await screen.findByRole("button", { name: "Edit" });
  expect(JSON.parse(localStorage.getItem("personalInfo")).state).toBe("AZ");
});
it.each([
  ["fr", fr],
  ["es", es],
  ["hi", en],
])(
  "resolves verification messages in the profile namespace (%s)",
  async (lang, messages) => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await mount(lang);
    save();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      messages.ADDRESS_MISMATCH,
    );
  },
);

it("restores legacy names consistently after cancelling an edit", async () => {
  await mount("en", { ...saved, country: "United States", state: "Arizona" });
  fireEvent.change(screen.getByRole("textbox", { name: /City/ }), {
    target: { value: "Phoenix" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.getByText("Arizona")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Edit" }));
  save();
  await screen.findByRole("button", { name: "Edit" });
  expect(JSON.parse(localStorage.getItem("personalInfo")).city).toBe("Tempe");
});
it("rejects a state code outside the selected country without requesting verification", async () => {
  await mount("en", { ...saved, state: "XX" });
  save();
  expect(fetch).not.toHaveBeenCalled();
  expect(localStorage.getItem("addressFlag")).toBe("false");
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
});
