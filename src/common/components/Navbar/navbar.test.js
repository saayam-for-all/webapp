import { renderWithProviders } from "#utils/test-utils";
import Navbar from "./Navbar";

// TODO: mock user

jest.mock("../../../redux/features/authentication/authActions", () => ({
  logout: jest.fn(),
}));

describe("Navbar", () => {
  it("renders correctly", () => {
    const tree = renderWithProviders(<Navbar />);
    expect(tree).toMatchSnapshot();
  });
});
