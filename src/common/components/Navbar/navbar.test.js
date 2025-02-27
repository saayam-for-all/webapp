import { renderWithProviders } from "#utils/test-utils";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders correctly", () => {
    const tree = renderWithProviders(<Navbar />);
    expect(tree).toMatchSnapshot();
  });
});
