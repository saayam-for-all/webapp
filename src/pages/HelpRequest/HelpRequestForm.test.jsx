import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import HelpRequestForm from "./HelpRequestForm";
import authReducer from "#redux/features/authentication/authSlice";
import requestReducer from "../../redux/features/help_request/requestSlice";
import { NotificationProvider } from "../../context/NotificationContext";

/**
 * Stable t mock — the same jest.fn instance is returned on every useTranslation()
 * call. This prevents the infinite render loop that occurs when t is listed as a
 * useEffect dependency and a new arrow-function is created on every render.
 */
jest.mock("react-i18next", () => {
  const t = jest.fn((text) => `mockTranslate(${text})`);
  return {
    useTranslation: () => ({
      t,
      i18n: { language: "en", changeLanguage: jest.fn() },
    }),
  };
});
// Grab the stable t reference so individual tests can change its implementation
const mockT = jest.requireMock("react-i18next").useTranslation().t;

// Component imports useNavigate from "react-router" and useParams from "react-router-dom"
jest.mock("react-router", () => ({ useNavigate: () => jest.fn() }));
jest.mock("react-router-dom", () => ({
  useParams: () => ({}),
  Link: ({ children }) => children,
  NavLink: ({ children }) => children,
}));

jest.mock("@react-google-maps/api", () => ({
  StandaloneSearchBox: ({ children }) => <div>{children}</div>,
  useJsApiLoader: () => ({ isLoaded: false }),
}));

jest.mock("./location/usePlacesSearchBox", () => () => ({
  inputRef: { current: null },
  isLoaded: false,
  handleOnPlacesChanged: jest.fn(),
}));

jest.mock("../../services/requestApi", () => ({
  useGetAllRequestQuery: () => ({ data: undefined, isLoading: false }),
  useAddRequestMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock("../../services/requestServices", () => ({
  checkProfanity: jest.fn(),
  createRequest: jest.fn(),
  predictCategories: jest.fn(),
  getCategories: jest.fn(),
  uploadRequestFile: jest.fn(),
}));

jest.mock("../../services/audioServices", () => ({
  blobToBase64: jest.fn(),
  speechDetectV2: jest.fn(),
}));

jest.mock("../../common/components/VoiceRecordingComponent", () => () => (
  <div data-testid="voice-recorder" />
));

jest.mock("../../common/components/Loading/Loading.jsx", () => () => (
  <span data-testid="loading-spinner" />
));

const mockCategories = [
  {
    catId: "cat-edu",
    catName: "EDUCATION_CAREER_SUPPORT",
    subCategories: [
      {
        catId: "sub-college",
        catName: "COLLEGE_APPLICATION_HELP",
        catDesc: "Help with college applications",
      },
    ],
  },
];

function renderForm({ isEdit = false } = {}) {
  const store = configureStore({
    reducer: { auth: authReducer, request: requestReducer },
    preloadedState: {
      auth: { user: { userId: "mockUser", userDbId: "dbUser123" } },
      request: { categories: mockCategories, categoriesFetched: true },
    },
  });
  render(
    <Provider store={store}>
      <NotificationProvider>
        <HelpRequestForm isEdit={isEdit} onClose={jest.fn()} />
      </NotificationProvider>
    </Provider>,
  );
}

/** Open dropdown, hover parent category, click subcategory → returns the input element */
function selectSubcategory() {
  const categoryInput = document.getElementById("category");
  fireEvent.focus(categoryInput);

  const categoryRow = screen
    .getAllByText(
      /mockTranslate\(categories:REQUEST_CATEGORIES\.EDUCATION_CAREER_SUPPORT\.LABEL/,
    )
    .find((el) => el.closest(".cursor-pointer"));
  fireEvent.mouseEnter(categoryRow.closest(".cursor-pointer"));

  const subcategoryRow = screen.getByText(
    /mockTranslate\(categories:REQUEST_CATEGORIES\.EDUCATION_CAREER_SUPPORT\.SUBCATEGORIES\.COLLEGE_APPLICATION_HELP\.LABEL/,
  );
  fireEvent.click(subcategoryRow);

  return categoryInput;
}

describe("HelpRequestForm — category dropdown display (issue #1223)", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);
  });

  it("shows Category → Subcategory in input after selecting a subcategory (new translation key path)", () => {
    renderForm();
    const categoryInput = selectSubcategory();
    expect(categoryInput.value).toContain("\u2192");
  });

  it("shows Category → Subcategory using fallback translation key when new subcategory key has no translation", () => {
    // Return null for new subcategory label key (defaultValue: null) to trigger old-key fallback
    mockT.mockImplementation((text, options) => {
      if (text.includes(".SUBCATEGORIES.") && options?.defaultValue === null) {
        return null;
      }
      return `mockTranslate(${text})`;
    });
    renderForm();
    const categoryInput = selectSubcategory();
    expect(categoryInput.value).toContain("\u2192");
  });

  it("uses old-key fallback for parent label when new parent key returns the raw key name", () => {
    // Returning the key name itself (=== newCatKey) for the new parent key makes the
    // parentNewResult !== newCatKey condition false → triggers the else branch of parentLabel
    mockT.mockImplementation((text, options) => {
      if (
        text ===
          "categories:REQUEST_CATEGORIES.EDUCATION_CAREER_SUPPORT.LABEL" &&
        options?.defaultValue === null
      ) {
        return "EDUCATION_CAREER_SUPPORT"; // equals newCatKey → else branch
      }
      return `mockTranslate(${text})`;
    });
    renderForm();
    const categoryInput = selectSubcategory();
    expect(categoryInput.value).toContain("\u2192");
  });
});

describe("HelpRequestForm — form submission loader", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);
  });

  /** Fill subject + description so validation passes, then click submit */
  function fillAndSubmit() {
    fireEvent.change(document.getElementById("subject"), {
      target: { name: "subject", value: "I need help" },
    });
    fireEvent.change(document.getElementById("description"), {
      target: { name: "description", value: "Detailed description here" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );
  }

  it("shows loading spinner and disables button while submitting", async () => {
    const { checkProfanity } = require("../../services/requestServices");
    let resolveProfanity;
    checkProfanity.mockReturnValue(
      new Promise((resolve) => {
        resolveProfanity = resolve;
      }),
    );

    renderForm();
    fillAndSubmit();

    const btn = await screen.findByRole("button", {
      name: /mockTranslate\(SUBMITTING\)/,
    });
    expect(btn).toBeDisabled();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    await require("@testing-library/react").act(async () => {
      resolveProfanity({ contains_profanity: false });
    });
  });

  it("falls back to plain submitting text when translation is missing", async () => {
    const { checkProfanity } = require("../../services/requestServices");
    let resolveProfanity;
    mockT.mockImplementation((text) =>
      text === "SUBMITTING" ? "" : `mockTranslate(${text})`,
    );
    checkProfanity.mockReturnValue(
      new Promise((resolve) => {
        resolveProfanity = resolve;
      }),
    );

    renderForm();
    fillAndSubmit();

    expect(
      await screen.findByRole("button", { name: /Submitting\.\.\./ }),
    ).toBeDisabled();

    await require("@testing-library/react").act(async () => {
      resolveProfanity({ contains_profanity: false });
    });
  });

  it("re-enables submit button after a submission error", async () => {
    const { checkProfanity } = require("../../services/requestServices");
    let rejectProfanity;
    checkProfanity.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectProfanity = reject;
      }),
    );

    renderForm();
    fillAndSubmit();

    // While awaiting — button is disabled
    expect(
      await screen.findByRole("button", {
        name: /mockTranslate\(SUBMITTING\)/,
      }),
    ).toBeDisabled();

    // Reject the promise → catch block runs, then finally resets isSubmitting
    await require("@testing-library/react").act(async () => {
      rejectProfanity(new Error("network failure"));
    });

    // Button should revert to its normal enabled state
    expect(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    ).toBeEnabled();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });

  it("shows SAVE label on submit button in edit mode", () => {
    renderForm({ isEdit: true });
    expect(
      screen.getByRole("button", { name: "mockTranslate(SAVE)" }),
    ).toBeEnabled();
  });
});
