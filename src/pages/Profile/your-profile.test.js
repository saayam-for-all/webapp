// import { render } from "@testing-library/react";
// import YourProfile from "./YourProfile";
// import { MOCK_STATE_LOGGED_IN, renderWithProviders } from "#utils/test-utils";

// // TODO: mock CallModal after adding tests for CallModal

// describe("YourProfile", () => {
//   it("renders correctly", () => {
//     const tree = renderWithProviders(<YourProfile />);
//     expect(tree).toMatchSnapshot();
//   });
// });
import { render } from "@testing-library/react";
import YourProfile from "./YourProfile";
import { renderWithProviders } from "#utils/test-utils";

// Mock i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// mock aws-amplify/auth if you suspect issues from there too
jest.mock("aws-amplify/auth", () => ({
  fetchUserAttributes: jest.fn(() => Promise.resolve([])),
  updateUserAttributes: jest.fn(() => Promise.resolve()),
}));

// mock CallModal if it causes issues
jest.mock("./CallModal", () => () => <div>Mocked CallModal</div>);

describe("YourProfile", () => {
  it("renders correctly", () => {
    const tree = renderWithProviders(<YourProfile />);
    expect(tree).toMatchSnapshot();
  });
});
