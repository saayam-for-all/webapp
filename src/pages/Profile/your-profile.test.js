// import { render } from "@testing-library/react";
// import YourProfile from "./YourProfile";
// import { renderWithProviders } from "#utils/test-utils";

// // mock i18n config
// jest.mock("#common/i18n/i18n", () => ({}));

// // react-i18next translation hook
// jest.mock("react-i18next", () => ({
//   useTranslation: () => ({
//     t: (key) => key,
//   }),
// }));

// // Mock AWS Amplify Auth functions
// jest.mock("aws-amplify/auth", () => ({
//   fetchUserAttributes: jest.fn(() => Promise.resolve([])),
//   updateUserAttributes: jest.fn(() => Promise.resolve()),
// }));

// describe("YourProfile", () => {
//   it("renders correctly", () => {
//     const tree = renderWithProviders(<YourProfile />);
//     expect(tree).toMatchSnapshot();
//   });
// });
