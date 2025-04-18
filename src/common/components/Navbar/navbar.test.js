import { renderWithProviders } from "#utils/test-utils";
import {
  MOCK_STATE_LOGGED_IN,
  MOCK_STATE_LOGGED_OUT,
} from "#utils/test-utils.jsx";
import Navbar from "./Navbar";

beforeAll(() => {
  if (!global.crypto) global.crypto = {};
  global.crypto.randomUUID = () => "mock-uuid";
});

jest.mock("../../../redux/features/authentication/authActions", () => ({
  logout: jest.fn(),
}));

describe("Navbar", () => {
  it("renders correctly when user is logged in", () => {
    const tree = renderWithProviders(<Navbar />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when user is logged out", () => {
    const tree = renderWithProviders(<Navbar />, {
      preloadedState: MOCK_STATE_LOGGED_OUT,
    });
    expect(tree).toMatchSnapshot();
  });
});
