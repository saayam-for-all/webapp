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

function renderForm() {
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
        <HelpRequestForm />
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
});
