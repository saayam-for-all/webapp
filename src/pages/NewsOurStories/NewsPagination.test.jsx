import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NewsPagination from "./NewsPagination";

const t = (key, options) =>
  ({
    PAGINATION_LABEL: "News pagination",
    PAGINATION_PREVIOUS: "Previous",
    PAGINATION_NEXT: "Next",
    PAGINATION_PAGE: `Page ${options?.page}`,
  })[key] || key;

describe("NewsPagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 3,
    onPageChange: jest.fn(),
    t,
    isRtl: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([0, 1])("hides controls for %i pages", (totalPages) => {
    render(<NewsPagination {...defaultProps} totalPages={totalPages} />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  test("renders numbered pages and marks the active page", () => {
    render(<NewsPagination {...defaultProps} />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Page 3" })).toBeInTheDocument();
  });

  test("disables Previous on the first page", () => {
    render(<NewsPagination {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  test("disables Next on the last page", () => {
    render(<NewsPagination {...defaultProps} currentPage={3} />);

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  test("handles numbered page navigation", () => {
    render(<NewsPagination {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Page 3" }));

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  test("handles Previous and Next navigation", () => {
    render(<NewsPagination {...defaultProps} currentPage={2} />);

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  test("reverses navigation arrows for RTL languages", () => {
    render(<NewsPagination {...defaultProps} isRtl />);

    expect(screen.getByRole("button", { name: "Previous" })).toHaveTextContent(
      "›",
    );

    expect(screen.getByRole("button", { name: "Next" })).toHaveTextContent("‹");
  });
});
