import { renderWithProviders } from "#utils/test-utils";
import {
  MOCK_STATE_LOGGED_IN,
  MOCK_STATE_LOGGED_OUT,
} from "#utils/test-utils.jsx";
import { axe,toHaveNoViolations } from "jest-axe";
import Navbar from "./Navbar";

jest.mock("../../../redux/features/authentication/authActions", () => ({
  logout: jest.fn(),
}));

describe("Navbar", () => {
  expect.extend(toHaveNoViolations)
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
  it('checks accesibility',async () =>{
    const {container} = renderWithProviders(<Navbar />, {
      preloadedState: MOCK_STATE_LOGGED_OUT,
    })
    expect(await axe(container)).toHaveNoViolations()
  })
});
