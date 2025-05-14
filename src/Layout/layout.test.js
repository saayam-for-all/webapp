import { render } from "@testing-library/react";
import Layout from "./Layout";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  Suspense: ({ children }) => <mock-suspense>{children}</mock-suspense>,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useMatches: () => [{ pathname: "/", params: {} }],
}));

// Mock all the custom components because they have their own snapshot tests
jest.mock("#components/Loader/MainLoader");
jest.mock("#components/Navbar/Navbar");
jest.mock("#components/Footer/Footer");
jest.mock("#components/LeftAds/LeftAds");
jest.mock("#components/RightAds/RightAds");
jest.mock("#components/NavigationGuard/NavigationGuard");

describe("Layout", () => {
  it("renders correctly", () => {
    const tree = render(<Layout />);
    expect(tree).toMatchSnapshot();
  });
});
