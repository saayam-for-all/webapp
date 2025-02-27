import { render } from "@testing-library/react";
import Layout from "./Layout";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  Suspense: ({ children }) => <mock-suspense>{children}</mock-suspense>,
}));

// TODO: put these in a mock folder?

// Mock all the custom components because they have their own snapshot tests
jest.mock("../common/components/Loader/MainLoader", () => () => (
  <mock-main-loader />
));
jest.mock("../common/components/Navbar/Navbar", () => () => <mock-navbar />);
jest.mock("../common/components/Footer/Footer", () => () => <mock-footer />);
jest.mock("../common/components/LeftAds/LeftAds", () => () => (
  <mock-left-ads />
));
jest.mock("../common/components/RightAds/RightAds", () => () => (
  <mock-right-ads />
));

describe("Layout", () => {
  it("renders correctly", () => {
    const tree = render(<Layout />);
    expect(tree).toMatchSnapshot();
  });
});
