import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// --- mocks (Jest hoists these to the top automatically) --------------
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => jest.fn(), // stub out navigation
  };
});

jest.mock("../../assets/imagesOfHowWeOperate/ima1.jpeg", () => "ima1");
jest.mock("../../assets/imagesOfHowWeOperate/ima2.jpeg", () => "ima2");
jest.mock("../../assets/imagesOfHowWeOperate/ima3.jpeg", () => "ima3");
jest.mock("../../assets/imagesOfHowWeOperate/step1.png", () => "s1");
jest.mock("../../assets/imagesOfHowWeOperate/step2.png", () => "s2");
jest.mock("../../assets/imagesOfHowWeOperate/step3.png", () => "s3");
jest.mock("../../assets/imagesOfHowWeOperate/step4.png", () => "s4");
jest.mock("../../assets/imagesOfHowWeOperate/step5.png", () => "s5");
// ---------------------------------------------------------------------

import HowWeOperate from "./HowWeOperate";

describe("HowWeOperate", () => {
  it("renders correctly", () => {
    const tree = render(
      <MemoryRouter>
        <HowWeOperate />
      </MemoryRouter>,
    );
    expect(tree).toMatchSnapshot();
  });
});
