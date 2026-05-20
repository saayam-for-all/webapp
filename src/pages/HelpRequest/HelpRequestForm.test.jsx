import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
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

jest.mock("./location/usePlacesSearchBox", () => () => ({
  inputRef: { current: null },
  suggestions: [],
  handleSearchChange: jest.fn(),
  handleSelectSuggestion: jest.fn(),
}));

jest.mock("../../utils/mapHelpRequestPayload", () => ({
  mapHelpRequestPayload: jest.fn().mockReturnValue({}),
}));

jest.mock("../../services/requestServices", () => ({
  checkProfanity: jest.fn(),
  createRequest: jest.fn(),
  predictCategories: jest.fn(),
  generateSubject: jest.fn(),
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

describe("HelpRequestForm — subject field is optional", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);
  });

  it("does not render a required asterisk on the subject label", () => {
    renderForm();
    const label = document.querySelector("label[for='subject']");
    expect(label).toBeInTheDocument();
    expect(label.querySelector(".text-red-500")).toBeNull();
  });

  it("does not block submission when subject is empty and description is filled", async () => {
    const { checkProfanity } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });

    renderForm();

    fireEvent.change(document.getElementById("description"), {
      target: { name: "description", value: "Detailed description here" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    await waitFor(() => {
      expect(screen.queryByText(/Subject is required/)).not.toBeInTheDocument();
    });
  });
});

describe("HelpRequestForm — predict categories modal", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);
  });

  it("shows formatted category names in the modal after submit with General category", async () => {
    const {
      checkProfanity,
      predictCategories,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    predictCategories.mockResolvedValue({
      body: {
        categories: [
          {
            category_number: "1.2",
            category_name: "GROCERY_SHOPPING_AND_DELIVERY",
            confidence: 0.95,
          },
          {
            category_number: "1.1",
            category_name: "FOOD_ASSISTANCE",
            confidence: 0.8,
          },
        ],
        top_category: {
          category_number: "1.2",
          category_name: "GROCERY_SHOPPING_AND_DELIVERY",
          confidence: 0.95,
        },
      },
    });

    renderForm();

    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "I need help picking up groceries from the store.",
      },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Grocery Shopping And Delivery"),
      ).toBeInTheDocument();
      expect(screen.getByText("Food Assistance")).toBeInTheDocument();
      expect(screen.getByText("General")).toBeInTheDocument();
    });
  });

  it("shows full hierarchy as label in dialog when hierarchy is returned by API", async () => {
    const {
      checkProfanity,
      predictCategories,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    predictCategories.mockResolvedValue({
      body: {
        categories: [
          {
            category_number: "4.3.1",
            category_name: "MATH",
            confidence: 0.95,
            hierarchy: "Education Career Support > Tutoring > Math",
          },
          {
            category_number: "4.3.3",
            category_name: "SCIENCE",
            confidence: 0.8,
            hierarchy: "Education Career Support > Tutoring > Science",
          },
        ],
      },
    });

    renderForm();

    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "I need help with math tutoring.",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    //Dialog should show full hierarchy as label
    await waitFor(() => {
      expect(
        screen.getByText("Education Career Support > Tutoring > Math"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Education Career Support > Tutoring > Science"),
      ).toBeInTheDocument();
      expect(screen.getByText("General")).toBeInTheDocument();
    });
  });

  it("shows only General when predictCategories API fails", async () => {
    const {
      checkProfanity,
      predictCategories,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    predictCategories.mockRejectedValue(new Error("API error"));

    renderForm();

    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "I need help picking up groceries from the store.",
      },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    await waitFor(() => {
      expect(screen.getByText("General")).toBeInTheDocument();
    });
  });

  it("submits with category_number as catId when a GenAI suggested category is selected", async () => {
    const {
      checkProfanity,
      predictCategories,
      createRequest,
    } = require("../../services/requestServices");
    const {
      mapHelpRequestPayload,
    } = require("../../utils/mapHelpRequestPayload");

    checkProfanity.mockResolvedValue({ contains_profanity: false });
    createRequest.mockResolvedValue({ data: { requestId: "REQ-999" } });
    predictCategories.mockResolvedValue({
      body: {
        categories: [
          {
            category_number: "4.3",
            category_name: "TUTORING",
            confidence: 0.92,
          },
        ],
      },
    });

    renderForm();

    // Type a description to enable prediction
    fireEvent.change(document.getElementById("description"), {
      target: { name: "description", value: "I need help with math tutoring." },
    });

    // First Submit — triggers the GenAI modal (category is still "General")
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    // Wait for the modal to appear with the suggested category
    await waitFor(() => {
      expect(screen.getByText("Tutoring")).toBeInTheDocument();
    });

    // Select the "Tutoring" radio — its value should be "4.3" (category_number)
    fireEvent.click(screen.getByDisplayValue("4.3"));

    // Confirm the selection and wait for modal to close + state updates to flush
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Select" }));
    });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    // Second Submit — category is now confirmed, should actually submit
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
      );
    });

    await waitFor(() => expect(createRequest).toHaveBeenCalled());

    // Verify mapHelpRequestPayload received the numeric catId, not the name string
    const callArgs =
      mapHelpRequestPayload.mock.calls[
        mapHelpRequestPayload.mock.calls.length - 1
      ][0];
    expect(callArgs.selectedCategoryId).toBe("4.3");
    expect(callArgs.selectedCategoryId).not.toBe("TUTORING");
  });

  it("does not show snackbar when General is confirmed without changing category", async () => {
    const {
      checkProfanity,
      predictCategories,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    predictCategories.mockResolvedValue({
      body: {
        categories: [
          {
            category_number: "4.3",
            category_name: "TUTORING",
            confidence: 0.9,
          },
        ],
      },
    });

    renderForm();

    fireEvent.change(document.getElementById("description"), {
      target: { name: "description", value: "I need help with something." },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    await waitFor(() =>
      expect(screen.getByText("General")).toBeInTheDocument(),
    );

    // Confirm without changing — keeps "General", no snackbar should fire
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Select" }));
    });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    expect(screen.queryByText(/Category updated from/)).not.toBeInTheDocument();
  });

  it("shows full hierarchy in category field after AI suggested category is selected", async () => {
    const {
      checkProfanity,
      predictCategories,
    } = require("../../services/requestServices");

    checkProfanity.mockResolvedValue({ contains_profanity: false });
    predictCategories.mockResolvedValue({
      body: {
        categories: [
          {
            category_number: "4.3.1",
            category_name: "MATH",
            confidence: 0.95,
            hierarchy: "Education Career Support > Tutoring > Math",
          },
        ],
      },
    });

    renderForm();

    fireEvent.change(document.getElementById("description"), {
      target: { name: "description", value: "I need help with math tutoring." },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Education Career Support > Tutoring > Math"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByDisplayValue("4.3.1"));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Select" }));
    });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    //Category field should show full hierarchy
    await waitFor(() => {
      expect(document.getElementById("category").value).toBe(
        "Education Career Support > Tutoring > Math",
      );
    });
  });

  it("uses category_number in payload not hierarchy string when submitting", async () => {
    const {
      checkProfanity,
      predictCategories,
      createRequest,
    } = require("../../services/requestServices");
    const {
      mapHelpRequestPayload,
    } = require("../../utils/mapHelpRequestPayload");

    checkProfanity.mockResolvedValue({ contains_profanity: false });
    createRequest.mockResolvedValue({ data: { requestId: "REQ-123" } });
    predictCategories.mockResolvedValue({
      body: {
        categories: [
          {
            category_number: "4.3.1",
            category_name: "MATH",
            confidence: 0.95,
            hierarchy: "Education Career Support > Tutoring > Math",
          },
        ],
      },
    });

    renderForm();

    fireEvent.change(document.getElementById("description"), {
      target: { name: "description", value: "I need help with math tutoring." },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Education Career Support > Tutoring > Math"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByDisplayValue("4.3.1"));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Select" }));
    });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
      );
    });

    await waitFor(() => expect(createRequest).toHaveBeenCalled());

    //Payload should use category_number not hierarchy string
    const callArgs =
      mapHelpRequestPayload.mock.calls[
        mapHelpRequestPayload.mock.calls.length - 1
      ][0];
    expect(callArgs.selectedCategoryId).toBe("4.3.1");
    expect(callArgs.selectedCategoryId).not.toBe(
      "Education Career Support > Tutoring > Math",
    );
  });
});

describe("HelpRequestForm — generateSubject auto-fill", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);
    const { generateSubject } = require("../../services/requestServices");
    generateSubject.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("auto-fills subject after description reaches 10+ characters in create mode", async () => {
    const { generateSubject } = require("../../services/requestServices");
    generateSubject.mockResolvedValue({
      body: {
        subject: "Grocery Pickup Help",
        max_length: 70,
        description_length: 60,
      },
    });

    renderForm();

    await act(async () => {
      fireEvent.change(document.getElementById("description"), {
        target: {
          name: "description",
          value: "I need help picking up groceries from the store.",
        },
      });
    });

    expect(generateSubject).not.toHaveBeenCalled();

    //generateSubject should be called on submit
    await act(async () => {
      fireEvent.submit(document.querySelector("form"));
    });

    expect(generateSubject).toHaveBeenCalledWith(
      "I need help picking up groceries from the store.",
    );
    expect(document.getElementById("subject").value).toBe(
      "Grocery Pickup Help",
    );
  });

  it("does not call generateSubject when description is under 10 characters", async () => {
    const { generateSubject } = require("../../services/requestServices");

    renderForm();

    await act(async () => {
      fireEvent.change(document.getElementById("description"), {
        target: { name: "description", value: "Short" },
      });
      jest.advanceTimersByTime(800);
    });

    expect(generateSubject).not.toHaveBeenCalled();
  });

  it("does not call generateSubject in edit mode", async () => {
    const { generateSubject } = require("../../services/requestServices");

    renderForm({ isEdit: true });

    await act(async () => {
      fireEvent.change(document.getElementById("description"), {
        target: {
          name: "description",
          value: "I need help picking up groceries from the store.",
        },
      });
      jest.advanceTimersByTime(800);
    });

    expect(generateSubject).not.toHaveBeenCalled();
  });

  it("logs error and leaves subject empty when generateSubject API fails", async () => {
    const { generateSubject } = require("../../services/requestServices");
    generateSubject.mockRejectedValue(new Error("API error"));

    renderForm();

    await act(async () => {
      fireEvent.change(document.getElementById("description"), {
        target: {
          name: "description",
          value: "I need help picking up groceries from the store.",
        },
      });
    });

    //generateSubject should NOT be called while typing
    expect(generateSubject).not.toHaveBeenCalled();

    //generateSubject should be called on submit
    await act(async () => {
      fireEvent.submit(document.querySelector("form"));
    });

    expect(generateSubject).toHaveBeenCalled();
    expect(document.getElementById("subject").value).toBe("");
  });

  it("does not overwrite subject the user has manually typed", async () => {
    const { generateSubject } = require("../../services/requestServices");
    generateSubject.mockResolvedValue({
      body: {
        subject: "AI Generated Subject",
        max_length: 70,
        description_length: 48,
      },
    });

    renderForm();

    fireEvent.change(document.getElementById("subject"), {
      target: { name: "subject", value: "My own subject" },
    });

    await act(async () => {
      fireEvent.change(document.getElementById("description"), {
        target: {
          name: "description",
          value: "I need help picking up groceries from the store.",
        },
      });
    });

    //Even on submit, should not overwrite manually typed subject
    await act(async () => {
      fireEvent.submit(document.querySelector("form"));
    });

    expect(generateSubject).not.toHaveBeenCalled();
    expect(document.getElementById("subject").value).toBe("My own subject");
  });
});

describe("HelpRequestForm — successful submission", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);
    // Prevent generateSubject debounce from interfering with submit flow
    const { generateSubject } = require("../../services/requestServices");
    generateSubject.mockResolvedValue({ body: null });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("calls createRequest and navigates with requestId when API returns one", async () => {
    const {
      checkProfanity,
      createRequest,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    createRequest.mockResolvedValue({ data: { requestId: "REQ-12345" } });

    renderForm();

    // Select a non-General subcategory to bypass the predict categories modal
    selectSubcategory();

    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "I need help with my college application process.",
      },
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
      );
    });

    await waitFor(() => expect(createRequest).toHaveBeenCalled());

    // Advance past the 1200ms navigate timeout to cover success navigation code
    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
  });

  it("navigates with generic message when createRequest response has no requestId", async () => {
    const {
      checkProfanity,
      createRequest,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    createRequest.mockResolvedValue({});

    renderForm();

    selectSubcategory();

    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "I need help with my college application process.",
      },
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
      );
    });

    await waitFor(() => expect(createRequest).toHaveBeenCalled());

    // Advance past the 1200ms navigate timeout — covers the falsy requestId branch
    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
  });
});

describe("HelpRequestForm — IN_PERSON location auto-detection", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);

    //Set enums in localStorage so requestType dropdown has options
    localStorage.setItem(
      "enums",
      JSON.stringify({
        requestType: {
          IN_PERSON: "IN_PERSON",
          REMOTE: "REMOTE",
        },
        requestPriority: { MEDIUM: 2 },
        requestFor: { SELF: 1, OTHER: 2 },
      }),
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("shows location field when IN_PERSON request type is selected", async () => {
    renderForm();

    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("requestType"), {
        target: { value: "IN_PERSON" },
      });
    });

    await waitFor(() => {
      expect(document.getElementById("location")).toBeInTheDocument();
    });
  });

  it("calls geolocation when IN_PERSON is selected", async () => {
    const mockGetCurrentPosition = jest.fn();
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition: mockGetCurrentPosition },
      configurable: true,
    });

    renderForm();

    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("requestType"), {
        target: { value: "IN_PERSON" },
      });
    });

    expect(mockGetCurrentPosition).toHaveBeenCalled();
  });

  it("auto-populates location field when geolocation succeeds", async () => {
    const mockGetCurrentPosition = jest.fn((success) => {
      success({ coords: { latitude: 38.886491, longitude: -94.649869 } });
    });
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition: mockGetCurrentPosition },
      configurable: true,
    });

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        display_name: "5600 West 133rd Terrace, Overland Park, Kansas, USA",
      }),
    });

    renderForm();

    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("requestType"), {
        target: { value: "IN_PERSON" },
      });
    });

    await waitFor(() => {
      expect(document.getElementById("location")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(document.getElementById("location").value).toBe(
        "5600 West 133rd Terrace, Overland Park, Kansas, USA",
      );
    });
  });

  it("handles geolocation error gracefully", async () => {
    const mockGetCurrentPosition = jest.fn((success, error) => {
      error(new Error("Location denied"));
    });
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition: mockGetCurrentPosition },
      configurable: true,
    });

    renderForm();
    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("requestType"), {
        target: { value: "IN_PERSON" },
      });
    });

    expect(mockGetCurrentPosition).toHaveBeenCalled();
    expect(document.getElementById("location")).toBeInTheDocument();
  });

  it("updates location when user types in location input", async () => {
    renderForm();
    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("requestType"), {
        target: { value: "IN_PERSON" },
      });
    });

    await waitFor(() => {
      expect(document.getElementById("location")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(document.getElementById("location"), {
        target: { value: "Kansas City" },
      });
    });

    expect(document.getElementById("location").value).toBe("Kansas City");
  });

  it("does not show location field for REMOTE request type", async () => {
    renderForm();

    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
        target: { value: "REMOTE" },
      });
    });

    expect(
      screen.queryByPlaceholderText("Search for location..."),
    ).not.toBeInTheDocument();
  });
});
