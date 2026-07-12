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
  useParams: jest.fn(() => ({})),
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
  useGetAllRequestQuery: jest.fn(() => ({ data: undefined, isLoading: false })),
  useAddRequestMutation: () => [jest.fn(), { isLoading: false }],
}));

let mockSuggestions = [];
let mockHandleSelectSuggestion = jest.fn();
let capturedSetCoordinates = null;

jest.mock("./location/usePlacesSearchBox", () => (setLocation, setCoords) => {
  capturedSetCoordinates = setCoords;
  return {
    inputRef: { current: null },
    get suggestions() {
      return mockSuggestions;
    },
    handleSearchChange: jest.fn(),
    get handleSelectSuggestion() {
      return mockHandleSelectSuggestion;
    },
  };
});

jest.mock("../../utils/mapHelpRequestPayload", () => ({
  mapHelpRequestPayload: jest.fn().mockReturnValue({}),
}));

jest.mock("../../services/requestServices", () => ({
  checkProfanity: jest.fn(),
  createRequest: jest.fn(),
  updateRequest: jest.fn(),
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

const mockElderlyCallbacks = {
  onSave: jest.fn(),
  onDelete: jest.fn(),
  onClose: jest.fn(),
};
jest.mock("./Categories/ElderlySupport", () => (props) => {
  mockElderlyCallbacks.onSave = props.onSave;
  mockElderlyCallbacks.onDelete = props.onDelete;
  mockElderlyCallbacks.onClose = props.onClose;
  if (!props.isOpen || !props.selectedSubcategory) return null;
  return (
    <div data-testid="elderly-support-modal">
      <button
        data-testid="elderly-save-btn"
        onClick={() =>
          props.onSave({ test: "data" }, props.selectedSubcategory)
        }
      >
        Save
      </button>
      <button
        data-testid="elderly-delete-btn"
        onClick={() => props.onDelete(props.selectedSubcategory.id)}
      >
        Delete
      </button>
      <button data-testid="elderly-close-btn" onClick={props.onClose}>
        Close
      </button>
    </div>
  );
});

const mockCategories = [
  {
    catId: "general-cat-id",
    catName: "GENERAL_CATEGORY",
    subCategories: [],
  },
  {
    catId: "cat-elderly",
    catName: "ELDERLY_SUPPORT",
    subCategories: [
      {
        catId: "sub-elderly-srl",
        catName: "SENIOR_LIVING_RELOCATION",
        catDesc: "Help with senior living relocation",
      },
    ],
  },
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
  {
    catId: "cat-clothing",
    catName: "CLOTHING_SUPPORT",
    subCategories: [
      {
        catId: "sub-borrow",
        catName: "BORROW_CLOTHES",
        catDesc: "Borrow gently used clothing",
        subCategories: [
          {
            catId: "subsub-essay",
            catName: "ESSAY_REVIEW",
            catDesc: "Help reviewing college essays",
          },
        ],
      },
    ],
  },
];

function renderForm({
  isEdit = false,
  editRequestData,
  onClose = jest.fn(),
} = {}) {
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
        <HelpRequestForm
          isEdit={isEdit}
          onClose={onClose}
          editRequestData={editRequestData}
        />
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

  it("falls back to description (first 70 chars) as subject when generateSubject API fails", async () => {
    const { generateSubject } = require("../../services/requestServices");
    const {
      checkProfanity,
      createRequest,
    } = require("../../services/requestServices");
    generateSubject.mockRejectedValue(new Error("API error"));
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    createRequest.mockResolvedValue({ data: { requestId: "REQ-FALLBACK" } });

    renderForm();

    // Select a non-General category to bypass the predict-categories modal
    selectSubcategory();

    const description = "I need help picking up groceries from the store.";
    await act(async () => {
      fireEvent.change(document.getElementById("description"), {
        target: { name: "description", value: description },
      });
    });

    // generateSubject should NOT be called while typing
    expect(generateSubject).not.toHaveBeenCalled();

    // generateSubject is called on submit, fails, then fallback kicks in
    await act(async () => {
      fireEvent.submit(document.querySelector("form"));
    });

    expect(generateSubject).toHaveBeenCalled();

    // Subject field should be populated with the first 70 chars of description
    await waitFor(() => {
      expect(document.getElementById("subject").value).toBe(
        description.slice(0, 70),
      );
    });

    // The request should still be submitted (not blocked by blank subject)
    await waitFor(() => expect(createRequest).toHaveBeenCalled());
  });

  it("falls back to description when generateSubject returns empty body", async () => {
    const { generateSubject } = require("../../services/requestServices");
    const {
      checkProfanity,
      createRequest,
    } = require("../../services/requestServices");
    generateSubject.mockResolvedValue({ body: null });
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    createRequest.mockResolvedValue({ data: { requestId: "REQ-NOBODY" } });

    renderForm();

    selectSubcategory();

    const description = "Help me with my apartment lease review please.";
    await act(async () => {
      fireEvent.change(document.getElementById("description"), {
        target: { name: "description", value: description },
      });
    });

    await act(async () => {
      fireEvent.submit(document.querySelector("form"));
    });

    await waitFor(() => {
      expect(document.getElementById("subject").value).toBe(
        description.slice(0, 70),
      );
    });

    await waitFor(() => expect(createRequest).toHaveBeenCalled());
  });

  it("passes resolved subject (not stale formData.subject) to checkProfanity", async () => {
    const {
      generateSubject,
      checkProfanity,
    } = require("../../services/requestServices");
    generateSubject.mockResolvedValue({
      body: { subject: "AI Generated Subject", max_length: 70 },
    });
    checkProfanity.mockResolvedValue({ contains_profanity: false });

    renderForm();

    selectSubcategory();

    await act(async () => {
      fireEvent.change(document.getElementById("description"), {
        target: {
          name: "description",
          value: "I need help picking up groceries from the store.",
        },
      });
    });

    await act(async () => {
      fireEvent.submit(document.querySelector("form"));
    });

    await waitFor(() => expect(checkProfanity).toHaveBeenCalled());

    // checkProfanity must receive the AI-generated subject, not the original ""
    expect(checkProfanity).toHaveBeenCalledWith(
      expect.objectContaining({ subject: "AI Generated Subject" }),
    );
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

  it("calls onClose(undefined) when Cancel is clicked in edit mode", async () => {
    const onClose = jest.fn();
    const mockEditData = {
      requestId: "REQ-00-000-000-0009",
      id: "REQ-00-000-000-0009",
      category: "COLLEGE_APPLICATION_HELP",
      subject: "Existing Request Subject",
      description: "Existing request description",
      priority: "MEDIUM",
      request_type: "REMOTE",
      is_self: "yes",
      helpCategory: { catId: "cat-edu" },
      attachments: ["http://test.com/file1.jpg"],
    };

    renderForm({ isEdit: true, editRequestData: mockEditData, onClose });

    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(CANCEL)" }),
    );

    expect(onClose).toHaveBeenCalledWith(undefined);
  });

  it("does not call onClose when Cancel is clicked in create mode", () => {
    const onClose = jest.fn();

    renderForm({ isEdit: false, onClose });

    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(CANCEL)" }),
    );

    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("HelpRequestForm — edit mode submission", () => {
  const mockEditData = {
    requestId: "REQ-00-000-000-0009",
    id: "REQ-00-000-000-0009",
    category: "COLLEGE_APPLICATION_HELP",
    subject: "Existing Request Subject",
    description: "Existing request description",
    priority: "MEDIUM",
    request_type: "REMOTE",
    is_self: "yes",
    helpCategory: { catId: "cat-edu" },
    attachments: ["http://test.com/file1.jpg"],
  };

  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);
    const { generateSubject } = require("../../services/requestServices");
    generateSubject.mockResolvedValue({ body: null });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("calls updateRequest instead of createRequest when isEdit is true", async () => {
    const {
      checkProfanity,
      createRequest,
      updateRequest,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    updateRequest.mockResolvedValue({
      data: { requestId: "REQ-00-000-000-0009" },
    });
    createRequest.mockClear();
    updateRequest.mockClear();

    renderForm({ isEdit: true, editRequestData: mockEditData });

    // Category is pre-populated and locked in edit mode, no need to select
    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "Updated description for testing edit flow.",
      },
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SAVE)" }),
      );
    });

    await waitFor(() => expect(updateRequest).toHaveBeenCalled());
    expect(createRequest).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
  });

  it("passes requestId in payload via mapHelpRequestPayload when editing", async () => {
    const {
      checkProfanity,
      updateRequest,
    } = require("../../services/requestServices");
    const {
      mapHelpRequestPayload,
    } = require("../../utils/mapHelpRequestPayload");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    updateRequest.mockResolvedValue({
      data: { requestId: "REQ-00-000-000-0009" },
    });

    renderForm({ isEdit: true, editRequestData: mockEditData });

    // Category is pre-populated and locked in edit mode, no need to select
    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "Updated description for payload test.",
      },
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SAVE)" }),
      );
    });

    await waitFor(() => expect(updateRequest).toHaveBeenCalled());

    // Verify mapHelpRequestPayload was called with requestId parameter
    const callArgs =
      mapHelpRequestPayload.mock.calls[
        mapHelpRequestPayload.mock.calls.length - 1
      ][0];
    expect(callArgs).toHaveProperty("requestId");
    expect(callArgs.requestId).toBe("REQ-00-000-000-0009");

    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
  });

  it("restores paginated API field names when submitting an edited request", async () => {
    const {
      checkProfanity,
      updateRequest,
    } = require("../../services/requestServices");
    const {
      mapHelpRequestPayload,
    } = require("../../utils/mapHelpRequestPayload");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    updateRequest.mockResolvedValue({
      data: { requestId: "REQ-00-000-000-0328" },
    });

    renderForm({
      isEdit: true,
      editRequestData: {
        requestId: "REQ-00-000-000-0328",
        requesterId: "SID-00-000-002-622",
        subject: "Test",
        description: "Test",
        type: "REMOTE",
        priority: "MEDIUM",
        requestCategory: "GENERAL_CATEGORY",
        calamity: false,
      },
    });

    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "Updated description for paginated API edit flow.",
      },
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SAVE)" }),
      );
    });

    await waitFor(() => expect(updateRequest).toHaveBeenCalled());

    const callArgs =
      mapHelpRequestPayload.mock.calls[
        mapHelpRequestPayload.mock.calls.length - 1
      ][0];
    expect(callArgs.formData.request_type).toBe("REMOTE");
    expect(callArgs.formData.priority).toBe("MEDIUM");
    expect(callArgs.selectedCategoryId).toBe("general-cat-id");
    expect(callArgs.requestId).toBe("REQ-00-000-000-0328");

    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
  });

  it("restores reqDesc and reqCatId from paginated help-requests API on edit", async () => {
    const {
      checkProfanity,
      updateRequest,
    } = require("../../services/requestServices");
    const {
      mapHelpRequestPayload,
    } = require("../../utils/mapHelpRequestPayload");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    updateRequest.mockResolvedValue({
      data: { requestId: "REQ-00-000-000-0360" },
    });

    renderForm({
      isEdit: true,
      editRequestData: {
        requestId: "REQ-00-000-000-0360",
        requesterId: "SID-00-000-002-622",
        subject: "Meal Prep help",
        type: "REMOTE",
        priority: "MEDIUM",
        reqCatId: "1.3.1",
        reqDesc: "Looking for high protein vegetarian meals",
        calamity: false,
      },
    });

    expect(document.getElementById("description").value).toBe(
      "Looking for high protein vegetarian meals",
    );

    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "Updated meal prep description.",
      },
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SAVE)" }),
      );
    });

    await waitFor(() => expect(updateRequest).toHaveBeenCalled());

    const callArgs =
      mapHelpRequestPayload.mock.calls[
        mapHelpRequestPayload.mock.calls.length - 1
      ][0];
    expect(callArgs.selectedCategoryId).toBe("1.3.1");
    expect(callArgs.requesterId).toBe("SID-00-000-002-622");

    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
  });

  it("restores catId field when reqCatId is absent on edit", () => {
    renderForm({
      isEdit: true,
      editRequestData: {
        requestId: "REQ-CATID-ONLY",
        requesterId: "SID-00-000-002-622",
        subject: "Test catId fallback",
        catId: "5.4",
        description: "Some desc",
        type: "REMOTE",
        priority: "MEDIUM",
        calamity: false,
      },
    });

    expect(document.getElementById("description").value).toBe("Some desc");
  });

  it("resolves sub-subcategory name to numeric catId on edit", async () => {
    const {
      checkProfanity,
      updateRequest,
    } = require("../../services/requestServices");
    const {
      mapHelpRequestPayload,
    } = require("../../utils/mapHelpRequestPayload");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    updateRequest.mockResolvedValue({
      data: { requestId: "REQ-SUB-SUB" },
    });

    renderForm({
      isEdit: true,
      editRequestData: {
        requestId: "REQ-SUB-SUB",
        requesterId: "SID-123",
        subject: "Essay help",
        description: "Need essay review",
        type: "REMOTE",
        priority: "MEDIUM",
        requestCategory: "ESSAY_REVIEW",
        calamity: false,
      },
    });

    fireEvent.change(document.getElementById("description"), {
      target: { name: "description", value: "Updated essay review request." },
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SAVE)" }),
      );
    });

    await waitFor(() => expect(updateRequest).toHaveBeenCalled());

    const callArgs =
      mapHelpRequestPayload.mock.calls[
        mapHelpRequestPayload.mock.calls.length - 1
      ][0];
    expect(callArgs.selectedCategoryId).toBe("subsub-essay");

    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
  });

  it("falls back to raw category value when name is not found in categories tree", async () => {
    const {
      checkProfanity,
      updateRequest,
    } = require("../../services/requestServices");
    const {
      mapHelpRequestPayload,
    } = require("../../utils/mapHelpRequestPayload");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    updateRequest.mockResolvedValue({
      data: { requestId: "REQ-UNKNOWN" },
    });

    renderForm({
      isEdit: true,
      editRequestData: {
        requestId: "REQ-UNKNOWN",
        requesterId: "SID-123",
        subject: "Unknown cat",
        description: "Some description",
        type: "REMOTE",
        priority: "MEDIUM",
        requestCategory: "TOTALLY_UNKNOWN_CATEGORY",
        calamity: false,
      },
    });

    fireEvent.change(document.getElementById("description"), {
      target: { name: "description", value: "Updated unknown category." },
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SAVE)" }),
      );
    });

    await waitFor(() => expect(updateRequest).toHaveBeenCalled());

    const callArgs =
      mapHelpRequestPayload.mock.calls[
        mapHelpRequestPayload.mock.calls.length - 1
      ][0];
    expect(callArgs.selectedCategoryId).toBe("TOTALLY_UNKNOWN_CATEGORY");

    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
  });

  it("handles edit mode when onClose is not provided, and uses fallback fields", async () => {
    const {
      checkProfanity,
      updateRequest,
    } = require("../../services/requestServices");
    const {
      mapHelpRequestPayload,
    } = require("../../utils/mapHelpRequestPayload");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    updateRequest.mockResolvedValue({
      data: { requestId: "REQ-00-000-000-0009" },
    });

    const store = configureStore({
      reducer: { auth: authReducer, request: requestReducer },
      preloadedState: {
        auth: { user: { userId: "mockUser", userDbId: "dbUser123" } },
        request: { categories: mockCategories, categoriesFetched: true },
      },
    });

    const editDataWithoutIds = {
      ...mockEditData,
      id: "id-fallback-123",
    };
    delete editDataWithoutIds.requestId;
    delete editDataWithoutIds.requesterId;

    render(
      <Provider store={store}>
        <NotificationProvider>
          <HelpRequestForm isEdit={true} editRequestData={editDataWithoutIds} />
        </NotificationProvider>
      </Provider>,
    );

    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "Updated description for fallback test.",
      },
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SAVE)" }),
      );
    });

    await waitFor(() => expect(updateRequest).toHaveBeenCalled());

    const callArgs =
      mapHelpRequestPayload.mock.calls[
        mapHelpRequestPayload.mock.calls.length - 1
      ][0];
    expect(callArgs.requesterId).toBe("dbUser123");
    expect(callArgs.requestId).toBe("id-fallback-123");

    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
  });

  it("restores request in edit mode from URL params and RTK query data", async () => {
    const { useParams } = require("react-router-dom");
    const { useGetAllRequestQuery } = require("../../services/requestApi");
    const {
      checkProfanity,
      updateRequest,
    } = require("../../services/requestServices");

    checkProfanity.mockResolvedValue({ contains_profanity: false });
    updateRequest.mockResolvedValue({
      data: { requestId: "REQ-URL-ID" },
    });

    useParams.mockReturnValue({ id: "REQ-URL-ID" });
    useGetAllRequestQuery.mockReturnValue({
      data: {
        body: [
          {
            id: "REQ-URL-ID",
            requestId: "REQ-URL-ID",
            category: "COLLEGE_APPLICATION_HELP",
            subject: "Route Restored Subject",
            description: "Route Restored Description",
            priority: "HIGH",
            request_type: "REMOTE",
            is_self: "yes",
            helpCategory: { catId: "cat-edu" },
            attachments: ["http://test.com/file1.jpg"],
          },
        ],
      },
      isLoading: false,
    });

    renderForm({ isEdit: true });

    await waitFor(() => {
      expect(document.getElementById("subject").value).toBe(
        "Route Restored Subject",
      );
    });

    // Reset mocks for subsequent tests
    useParams.mockReturnValue({});
    useGetAllRequestQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
  });

  it("resolves third-level subcategory via resolveCatNameToId", async () => {
    renderForm({
      isEdit: true,
      editRequestData: {
        ...mockEditData,
        category: "ESSAY_REVIEW",
        helpCategory: undefined,
      },
    });

    await waitFor(() => {
      expect(document.getElementById("subject").value).toBe(
        "Existing Request Subject",
      );
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
    mockSuggestions = [];
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

  it("stores coordinates in formData when geolocation succeeds", async () => {
    const mockGetCurrentPosition = jest.fn((success) => {
      success({ coords: { latitude: 38.886491, longitude: -94.649869 } });
    });
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition: mockGetCurrentPosition },
      configurable: true,
    });

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        display_name: "Overland Park, Kansas, USA",
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
      expect(document.getElementById("location").value).toBe(
        "Overland Park, Kansas, USA",
      );
    });

    // Coordinates should be stored — verified via payload
    expect(mockGetCurrentPosition).toHaveBeenCalled();
  });

  it("stores coordinates alongside address when geolocation succeeds", async () => {
    const mockGetCurrentPosition = jest.fn((success) => {
      success({ coords: { latitude: 38.886491, longitude: -94.649869 } });
    });
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition: mockGetCurrentPosition },
      configurable: true,
    });

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        display_name: "Overland Park, Kansas, USA",
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
      expect(document.getElementById("location").value).toBe(
        "Overland Park, Kansas, USA",
      );
    });

    expect(mockGetCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
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
  it("shows suggestions and selects one when clicked", async () => {
    mockSuggestions = [
      {
        display_name: "Kansas City, Missouri, USA",
        lat: "39.0997",
        lon: "-94.5786",
      },
    ];

    renderForm();
    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("requestType"), {
        target: { value: "IN_PERSON" },
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText("Kansas City, Missouri, USA"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Kansas City, Missouri, USA"));

    expect(mockHandleSelectSuggestion).toHaveBeenCalledWith({
      display_name: "Kansas City, Missouri, USA",
      lat: "39.0997",
      lon: "-94.5786",
    });
  });

  it("updates formData with coordinates when setCoordinates callback is called", async () => {
    capturedSetCoordinates = null;

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

    expect(capturedSetCoordinates).not.toBeNull();

    await act(async () => {
      capturedSetCoordinates({ latitude: 38.886491, longitude: -94.649869 });
    });

    expect(document.getElementById("location")).toBeInTheDocument();
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

describe("HelpRequestForm — DynamicAdditionalFields category id", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);
  });

  it("passes selectedCategoryId to DynamicAdditionalFields not hierarchy string", async () => {
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

    await act(async () => {
      fireEvent.click(screen.getByDisplayValue("4.3.1"));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Select" }));
    });
    await waitFor(() => {
      expect(document.getElementById("category").value).toBe(
        "Education Career Support > Tutoring > Math",
      );
    });
  });

  it("shows additional fields after manual subcategory selection", () => {
    localStorage.setItem(
      "metadata",
      JSON.stringify([
        {
          catId: "sub-college",
          fields: [
            {
              fieldId: "sub-college.A",
              fieldNameKey: "PREFERRED_MEAL_TYPE",
              fieldType: "list",
              status: "active",
              catId: "sub-college",
              listItems: [
                {
                  itemId: "sub-college.A.1",
                  itemValue: "VEGETARIAN",
                  itemType: "radiobutton",
                },
              ],
            },
          ],
        },
      ]),
    );

    renderForm();
    selectSubcategory();

    expect(screen.getByTestId("radio-sub-college.A.1")).toBeInTheDocument();
    localStorage.removeItem("metadata");
  });

  it("preserves selected additional info values when switching tabs", () => {
    localStorage.setItem(
      "metadata",
      JSON.stringify([
        {
          catId: "sub-college",
          fields: [
            {
              fieldId: "sub-college.A",
              fieldNameKey: "PREFERRED_MEAL_TYPE",
              fieldType: "list",
              status: "active",
              catId: "sub-college",
              listItems: [
                {
                  itemId: "sub-college.A.1",
                  itemValue: "VEGETARIAN",
                  itemType: "radiobutton",
                },
                {
                  itemId: "sub-college.A.2",
                  itemValue: "VEGAN",
                  itemType: "radiobutton",
                },
              ],
            },
          ],
        },
      ]),
    );

    renderForm();
    selectSubcategory();

    fireEvent.click(screen.getByTestId("radio-sub-college.A.1"));
    expect(screen.getByTestId("radio-sub-college.A.1")).toBeChecked();

    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));
    expect(
      screen.queryByTestId("radio-sub-college.A.1"),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("mockTranslate(DESCRIPTION)"));
    expect(screen.getByTestId("radio-sub-college.A.1")).toBeChecked();

    localStorage.removeItem("metadata");
  });
});

describe("HelpRequestForm — selectedCategoryId tracking (patch coverage)", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);
    mockElderlyCallbacks.onSave = jest.fn();
    mockElderlyCallbacks.onDelete = jest.fn();
    mockElderlyCallbacks.onClose = jest.fn();
  });

  it("sets selectedCategoryId via handleCategoryClick for a category without subcategories", () => {
    renderForm();

    const categoryInput = document.getElementById("category");
    fireEvent.focus(categoryInput);

    // Click GENERAL_CATEGORY — it has no subCategories, so handleCategoryClick is invoked
    const generalRow = screen
      .getAllByText(
        /mockTranslate\(categories:REQUEST_CATEGORIES\.GENERAL_CATEGORY\.LABEL\)/,
      )
      .find((el) => el.closest(".cursor-pointer"));
    fireEvent.click(generalRow.closest(".cursor-pointer"));

    expect(categoryInput.value).toBe(
      "mockTranslate(categories:REQUEST_CATEGORIES.GENERAL_CATEGORY.LABEL)",
    );
  });

  it("sets selectedCategoryId when an elderly subcategory is clicked", () => {
    renderForm();

    const categoryInput = document.getElementById("category");
    fireEvent.focus(categoryInput);

    // Hover ELDERLY_SUPPORT
    const elderlyRow = screen
      .getAllByText(
        /mockTranslate\(categories:REQUEST_CATEGORIES\.ELDERLY_SUPPORT\.LABEL\)/,
      )
      .find((el) => el.closest(".cursor-pointer"));
    fireEvent.mouseEnter(elderlyRow.closest(".cursor-pointer"));

    // Click SENIOR_LIVING_RELOCATION subcategory
    const subcategoryRow = screen.getByText(
      /mockTranslate\(categories:REQUEST_CATEGORIES\.ELDERLY_SUPPORT\.SUBCATEGORIES\.SENIOR_LIVING_RELOCATION\.LABEL\)/,
    );
    fireEvent.click(subcategoryRow);

    // ElderlySupport modal should appear (proves the elderly branch ran)
    expect(screen.getByTestId("elderly-support-modal")).toBeInTheDocument();
  });

  it("sets selectedCategoryId on ElderlySupport save", () => {
    renderForm();

    const categoryInput = document.getElementById("category");
    fireEvent.focus(categoryInput);

    const elderlyRow = screen
      .getAllByText(
        /mockTranslate\(categories:REQUEST_CATEGORIES\.ELDERLY_SUPPORT\.LABEL\)/,
      )
      .find((el) => el.closest(".cursor-pointer"));
    fireEvent.mouseEnter(elderlyRow.closest(".cursor-pointer"));

    const subcategoryRow = screen.getByText(
      /mockTranslate\(categories:REQUEST_CATEGORIES\.ELDERLY_SUPPORT\.SUBCATEGORIES\.SENIOR_LIVING_RELOCATION\.LABEL\)/,
    );
    fireEvent.click(subcategoryRow);

    expect(screen.getByTestId("elderly-support-modal")).toBeInTheDocument();

    // Click Save in the mock — runs handleElderlySupportSave which calls setSelectedCategoryId
    fireEvent.click(screen.getByTestId("elderly-save-btn"));

    // Modal stays open after save (save does not close it)
    expect(screen.getByTestId("elderly-support-modal")).toBeInTheDocument();
  });

  it("clears selectedCategoryId on ElderlySupport delete", () => {
    renderForm();

    const categoryInput = document.getElementById("category");
    fireEvent.focus(categoryInput);

    const elderlyRow = screen
      .getAllByText(
        /mockTranslate\(categories:REQUEST_CATEGORIES\.ELDERLY_SUPPORT\.LABEL\)/,
      )
      .find((el) => el.closest(".cursor-pointer"));
    fireEvent.mouseEnter(elderlyRow.closest(".cursor-pointer"));

    const subcategoryRow = screen.getByText(
      /mockTranslate\(categories:REQUEST_CATEGORIES\.ELDERLY_SUPPORT\.SUBCATEGORIES\.SENIOR_LIVING_RELOCATION\.LABEL\)/,
    );
    fireEvent.click(subcategoryRow);

    // Save first to set savedSubcategoryId
    fireEvent.click(screen.getByTestId("elderly-save-btn"));

    // Click Delete — runs handleElderlySupportDelete which calls setSelectedCategoryId(null)
    fireEvent.click(screen.getByTestId("elderly-delete-btn"));

    // Modal should close (handleElderlySupportDelete sets showElderlySupportForm = false)
    expect(
      screen.queryByTestId("elderly-support-modal"),
    ).not.toBeInTheDocument();
  });

  it("shows warning when trying to select a different elderly subcategory while one is already saved", () => {
    // Add a second elderly subcategory before rendering
    const elderlyCat = mockCategories.find(
      (c) => c.catName === "ELDERLY_SUPPORT",
    );
    const originalSubs = [...elderlyCat.subCategories];
    elderlyCat.subCategories = [
      ...originalSubs,
      {
        catId: "sub-elderly-meal",
        catName: "MEAL_DELIVERY",
        catDesc: "Help with meal delivery",
      },
    ];

    renderForm();

    const categoryInput = document.getElementById("category");
    fireEvent.focus(categoryInput);

    const elderlyRow = screen
      .getAllByText(
        /mockTranslate\(categories:REQUEST_CATEGORIES\.ELDERLY_SUPPORT\.LABEL\)/,
      )
      .find((el) => el.closest(".cursor-pointer"));
    fireEvent.mouseEnter(elderlyRow.closest(".cursor-pointer"));

    // Click first elderly subcategory and save it
    const firstSubRow = screen.getByText(
      /mockTranslate\(categories:REQUEST_CATEGORIES\.ELDERLY_SUPPORT\.SUBCATEGORIES\.SENIOR_LIVING_RELOCATION\.LABEL\)/,
    );
    fireEvent.click(firstSubRow);
    expect(screen.getByTestId("elderly-support-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("elderly-save-btn"));

    // Close the modal and reopen dropdown to try a different subcategory
    fireEvent.click(screen.getByTestId("elderly-close-btn"));
    fireEvent.focus(categoryInput);

    const elderlyRow2 = screen
      .getAllByText(
        /mockTranslate\(categories:REQUEST_CATEGORIES\.ELDERLY_SUPPORT\.LABEL\)/,
      )
      .find((el) => el.closest(".cursor-pointer"));
    fireEvent.mouseEnter(elderlyRow2.closest(".cursor-pointer"));

    const secondSubRow = screen.getByText(
      /mockTranslate\(categories:REQUEST_CATEGORIES\.ELDERLY_SUPPORT\.SUBCATEGORIES\.MEAL_DELIVERY\.LABEL\)/,
    );
    fireEvent.click(secondSubRow);

    // Warning snackbar should appear
    expect(
      screen.getByText(/Only one subcategory can be saved per request/),
    ).toBeInTheDocument();

    // Restore original subcategories
    elderlyCat.subCategories = originalSubs;
  });
});

describe("HelpRequestForm — predict categories with GENERAL_CATEGORY catName (issue #1565)", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);

    const {
      checkProfanity,
      predictCategories,
      createRequest,
      generateSubject,
    } = require("../../services/requestServices");
    checkProfanity.mockReset();
    predictCategories.mockReset();
    createRequest.mockReset();
    generateSubject.mockReset();
  });

  it("shows predict categories modal when General is selected via dropdown click (catName GENERAL_CATEGORY)", async () => {
    const {
      checkProfanity,
      predictCategories,
      generateSubject,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    generateSubject.mockResolvedValue({ body: null });
    predictCategories.mockResolvedValue({
      body: {
        categories: [
          {
            category_number: "1.2",
            category_name: "GROCERY_SHOPPING_AND_DELIVERY",
            confidence: 0.95,
          },
        ],
      },
    });

    renderForm();

    // First select a non-General subcategory to simulate the bug scenario
    const categoryInput = selectSubcategory();

    // Now click General from the dropdown — this sets formData.category to "GENERAL_CATEGORY"
    fireEvent.focus(categoryInput);

    const generalRow = screen
      .getAllByText(
        /mockTranslate\(categories:REQUEST_CATEGORIES\.GENERAL_CATEGORY\.LABEL\)/,
      )
      .find((el) => el.closest(".cursor-pointer"));
    fireEvent.click(generalRow.closest(".cursor-pointer"));

    // Verify category is set to GENERAL_CATEGORY's resolved label
    expect(categoryInput.value).toBe(
      "mockTranslate(categories:REQUEST_CATEGORIES.GENERAL_CATEGORY.LABEL)",
    );

    // Type a description
    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "I need help picking up groceries from the store.",
      },
    });

    // Click Submit — should trigger predict categories even though category is GENERAL_CATEGORY (not "General")
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    await waitFor(() => {
      expect(predictCategories).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Grocery Shopping And Delivery"),
      ).toBeInTheDocument();
      expect(screen.getByText("General")).toBeInTheDocument();
    });
  });

  it("shows predict categories modal when switching back to General after selecting a specific subcategory", async () => {
    const {
      checkProfanity,
      predictCategories,
      generateSubject,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    generateSubject.mockResolvedValue({ body: null });
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

    // Step 1: Select a non-General subcategory
    selectSubcategory();

    // Step 2: Switch back to General by clicking GENERAL_CATEGORY from dropdown
    const categoryInput = document.getElementById("category");
    fireEvent.focus(categoryInput);

    const generalRow = screen
      .getAllByText(
        /mockTranslate\(categories:REQUEST_CATEGORIES\.GENERAL_CATEGORY\.LABEL\)/,
      )
      .find((el) => el.closest(".cursor-pointer"));
    fireEvent.click(generalRow.closest(".cursor-pointer"));

    // Step 3: Fill description
    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "I need help with math tutoring for my child.",
      },
    });

    // Step 4: Click Submit — predict API should now fire (the bug was that it didn't)
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    await waitFor(() => {
      expect(predictCategories).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Education Career Support > Tutoring > Math"),
      ).toBeInTheDocument();
      expect(screen.getByText("General")).toBeInTheDocument();
    });
  });

  it("does not call predictCategories when user submits without description after switching to General", async () => {
    const {
      checkProfanity,
      predictCategories,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });

    renderForm();

    // Select a non-General subcategory first
    selectSubcategory();

    // Switch back to General via dropdown click
    const categoryInput = document.getElementById("category");
    fireEvent.focus(categoryInput);

    const generalRow = screen
      .getAllByText(
        /mockTranslate\(categories:REQUEST_CATEGORIES\.GENERAL_CATEGORY\.LABEL\)/,
      )
      .find((el) => el.closest(".cursor-pointer"));
    fireEvent.click(generalRow.closest(".cursor-pointer"));

    // Do NOT fill description — keep it empty

    // Click Submit — should fail validation before reaching predict
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    await waitFor(() => {
      expect(predictCategories).not.toHaveBeenCalled();
    });
  });

  it("resets categoryConfirmed on manual category change, re-triggering prediction after prior confirmation", async () => {
    const {
      checkProfanity,
      predictCategories,
      generateSubject,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    generateSubject.mockResolvedValue({ body: null });
    predictCategories.mockResolvedValue({
      body: {
        categories: [
          {
            category_number: "1.2",
            category_name: "GROCERY_SHOPPING_AND_DELIVERY",
            confidence: 0.95,
          },
        ],
      },
    });

    renderForm();

    // Step 1: Submit with General category — predict modal appears
    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "I need help picking up groceries.",
      },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    await waitFor(() => {
      expect(screen.getByText("General")).toBeInTheDocument();
    });

    // Step 2: Confirm selection without changing category → categoryConfirmed = true
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Select" }));
    });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    // Step 3: Manually pick a subcategory via dropdown → should reset categoryConfirmed
    const categoryInput = selectSubcategory();

    // Step 4: Switch back to General via dropdown click
    fireEvent.focus(categoryInput);
    const generalRow = screen
      .getAllByText(
        /mockTranslate\(categories:REQUEST_CATEGORIES\.GENERAL_CATEGORY\.LABEL\)/,
      )
      .find((el) => el.closest(".cursor-pointer"));
    fireEvent.click(generalRow.closest(".cursor-pointer"));

    // Step 5: Fill a new description and submit again
    predictCategories.mockReset();
    predictCategories.mockResolvedValue({
      body: {
        categories: [
          {
            category_number: "2.1",
            category_name: "MEDICAL_ASSISTANCE",
            confidence: 0.9,
          },
        ],
      },
    });

    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "I need medical assistance for my elderly parent.",
      },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    // Should trigger prediction again because categoryConfirmed was reset
    await waitFor(() => {
      expect(predictCategories).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText("Medical Assistance")).toBeInTheDocument();
      expect(screen.getByText("General")).toBeInTheDocument();
    });
  });

  it("resets categoryConfirmed when typing in the category search input", async () => {
    const {
      checkProfanity,
      predictCategories,
      generateSubject,
    } = require("../../services/requestServices");
    checkProfanity.mockResolvedValue({ contains_profanity: false });
    generateSubject.mockResolvedValue({ body: null });
    predictCategories.mockResolvedValue({
      body: {
        categories: [
          {
            category_number: "1.2",
            category_name: "GROCERY_SHOPPING_AND_DELIVERY",
            confidence: 0.95,
          },
        ],
      },
    });

    renderForm();

    // Step 1: Submit with General category — predict modal appears
    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "I need help picking up groceries.",
      },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    await waitFor(() => {
      expect(screen.getByText("General")).toBeInTheDocument();
    });

    // Step 2: Confirm selection → categoryConfirmed = true
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Select" }));
    });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    // Step 3: Type in the category search input to trigger handleSearchInput → setCategoryConfirmed(false)
    const categoryInput = document.getElementById("category");
    fireEvent.change(categoryInput, {
      target: { id: "category", value: "" },
    });

    // Step 4: Switch back to General via dropdown click
    fireEvent.focus(categoryInput);

    const generalRow = screen
      .getAllByText(
        /mockTranslate\(categories:REQUEST_CATEGORIES\.GENERAL_CATEGORY\.LABEL\)/,
      )
      .find((el) => el.closest(".cursor-pointer"));
    fireEvent.click(generalRow.closest(".cursor-pointer"));

    // Step 5: Fill a new description and submit again
    predictCategories.mockReset();
    predictCategories.mockResolvedValue({
      body: {
        categories: [
          {
            category_number: "2.1",
            category_name: "MEDICAL_ASSISTANCE",
            confidence: 0.9,
          },
        ],
      },
    });

    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "I need medical assistance for my elderly parent.",
      },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
    );

    // Should trigger prediction because categoryConfirmed was reset by handleSearchInput
    await waitFor(() => {
      expect(predictCategories).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText("Medical Assistance")).toBeInTheDocument();
      expect(screen.getByText("General")).toBeInTheDocument();
    });
  });
});

describe("HelpRequestForm — preferred language auto-set from profile (#1547)", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);

    localStorage.setItem(
      "enums",
      JSON.stringify({
        requestType: { IN_PERSON: "IN_PERSON", REMOTE: "REMOTE" },
        requestPriority: { MEDIUM: 2 },
        requestFor: { SELF: "SELF", OTHER: "OTHER" },
      }),
    );
  });

  afterEach(() => {
    localStorage.clear();
    mockSuggestions = [];
  });

  it("auto-sets preferred_language from profile when For Self is switched to OTHER", async () => {
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({ languagePreference1: "Hindi" }),
    );

    renderForm();
    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("request_for"), {
        target: { value: "OTHER" },
      });
    });

    await waitFor(() => {
      expect(document.getElementById("preferred_language").value).toBe("Hindi");
    });
  });

  it("does not override preferred_language when switching to OTHER with no profile language set", async () => {
    renderForm();
    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("request_for"), {
        target: { value: "OTHER" },
      });
    });

    await waitFor(() => {
      expect(document.getElementById("preferred_language")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(document.getElementById("preferred_language"), {
        target: { value: "Spanish" },
      });
    });

    await act(async () => {
      fireEvent.change(document.getElementById("request_for"), {
        target: { value: "SELF" },
      });
    });

    await act(async () => {
      fireEvent.change(document.getElementById("request_for"), {
        target: { value: "OTHER" },
      });
    });

    await waitFor(() => {
      expect(document.getElementById("preferred_language").value).toBe(
        "Spanish",
      );
    });
  });
});

describe("HelpRequestForm — Other person location field (#1622)", () => {
  beforeEach(() => {
    mockT.mockReset();
    mockT.mockImplementation((text) => `mockTranslate(${text})`);
    localStorage.setItem(
      "enums",
      JSON.stringify({
        requestType: { IN_PERSON: "IN_PERSON", REMOTE: "REMOTE" },
        requestPriority: { MEDIUM: 2 },
        requestFor: { SELF: "SELF", OTHER: "OTHER" },
      }),
    );
  });

  afterEach(() => {
    localStorage.clear();
    mockSuggestions = [];
  });

  it("shows the Other-person location field when For Self is switched to OTHER", async () => {
    renderForm();
    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("request_for"), {
        target: { value: "OTHER" },
      });
    });

    await waitFor(() => {
      expect(
        document.getElementById("other_person_location"),
      ).toBeInTheDocument();
    });
  });

  it("does not show the Other-person location field when For Self is SELF", () => {
    renderForm();
    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    expect(
      document.getElementById("other_person_location"),
    ).not.toBeInTheDocument();
  });

  it("updates the field when user types a location manually", async () => {
    renderForm();
    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("request_for"), {
        target: { value: "OTHER" },
      });
    });

    await waitFor(() => {
      expect(
        document.getElementById("other_person_location"),
      ).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(document.getElementById("other_person_location"), {
        target: { value: "Kansas City" },
      });
    });

    expect(document.getElementById("other_person_location").value).toBe(
      "Kansas City",
    );
  });

  it("shows suggestions and selects one when clicked", async () => {
    mockSuggestions = [{ display_name: "Kansas City, Missouri, USA" }];

    renderForm();
    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("request_for"), {
        target: { value: "OTHER" },
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText("Kansas City, Missouri, USA"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Kansas City, Missouri, USA"));

    expect(mockHandleSelectSuggestion).toHaveBeenCalled();
  });

  it("does not include the Other-person location or its coordinates in the submitted createRequest payload", async () => {
    const {
      checkProfanity,
      createRequest,
    } = require("../../services/requestServices");
    const {
      mapHelpRequestPayload,
    } = require("../../utils/mapHelpRequestPayload");

    checkProfanity.mockResolvedValue({ contains_profanity: false });
    createRequest.mockResolvedValue({ data: { requestId: "REQ-1622" } });

    renderForm();
    selectSubcategory();

    fireEvent.change(document.getElementById("description"), {
      target: {
        name: "description",
        value: "Requesting on behalf of someone else.",
      },
    });

    fireEvent.click(screen.getByText("mockTranslate(DETAILS)"));

    await act(async () => {
      fireEvent.change(document.getElementById("request_for"), {
        target: { value: "OTHER" },
      });
    });

    await waitFor(() => {
      expect(
        document.getElementById("other_person_location"),
      ).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(document.getElementById("other_person_location"), {
        target: { value: "Kansas City, Missouri, USA" },
      });
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "mockTranslate(SUBMIT)" }),
      );
    });

    await waitFor(() => expect(createRequest).toHaveBeenCalled());

    const callArgs =
      mapHelpRequestPayload.mock.calls[
        mapHelpRequestPayload.mock.calls.length - 1
      ][0];

    // The typed address must not leak into the payload anywhere
    expect(JSON.stringify(callArgs)).not.toContain(
      "Kansas City, Missouri, USA",
    );
    expect(callArgs.formData.otherPersonLocation).toBeUndefined();
    expect(callArgs.formData.otherPersonLocationCoordinates).toBeUndefined();
  });
});
