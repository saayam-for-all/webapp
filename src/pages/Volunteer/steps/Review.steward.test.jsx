import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Review from "./Review";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("Review steward perspective", () => {
  test("does not display steward controls in normal volunteer flow", () => {
    render(<Review />);

    expect(screen.queryByText("Applicant:")).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Promote" }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Reject" }),
    ).not.toBeInTheDocument();

    expect(screen.queryByText("Send Message")).not.toBeInTheDocument();
  });

  test("displays applicant information and steward controls", () => {
    const applicant = {
      name: "Jane Cooper",
      phone: "+1 (225) 555-0118",
    };

    render(<Review isStewardReview={true} applicant={applicant} />);

    expect(screen.getByRole("link", { name: "Jane Cooper" })).toHaveAttribute(
      "href",
      "/applicant-profile",
    );

    expect(screen.getByRole("button", { name: "Promote" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Send Message" })).toHaveAttribute(
      "href",
      "https://wa.me/12255550118",
    );
  });

  test("disables Send Message when phone number is unavailable", () => {
    render(
      <Review isStewardReview={true} applicant={{ name: "Jane Cooper" }} />,
    );

    expect(screen.getByRole("button", { name: "Send Message" })).toBeDisabled();
  });

  test("uses first and last name when full name is unavailable", () => {
    render(
      <Review
        isStewardReview={true}
        applicant={{
          firstName: "Jane",
          lastName: "Cooper",
          phone: "+12255550118",
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Jane Cooper" }),
    ).toBeInTheDocument();
  });
});
