//import { render } from "@testing-library/react";
//import Donate from "./Donate";

//describe("Donate", () => {
//  it("renders correctly", () => {
//   const tree = render(<Donate />);
//   expect(tree).toMatchSnapshot();
//  });
//});

import { render } from "@testing-library/react";
import Donation from "./Donate";
import { BrowserRouter } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => `mockTranslate(${key})`,
  }),
}));

describe("Donation Component", () => {
  it("matches the snapshot", () => {
    const { asFragment } = render(
      <BrowserRouter>
        <Donation />
      </BrowserRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
