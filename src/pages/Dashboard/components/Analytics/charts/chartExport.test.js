import { toCsv, downloadCsv } from "./chartExport";

const COLUMNS = [
  { key: "month", label: "Month" },
  { key: "total", label: "Total Organizations" },
];

describe("toCsv", () => {
  it("writes a header row followed by one row per record", () => {
    const csv = toCsv(COLUMNS, [
      { month: "Jul '24", total: 78 },
      { month: "Aug '24", total: 91 },
    ]);
    expect(csv).toBe("Month,Total Organizations\nJul '24,78\nAug '24,91");
  });

  it("quotes cells containing commas, quotes or newlines", () => {
    const csv = toCsv(COLUMNS, [
      { month: "Jul, 24", total: 'say "hi"' },
      { month: "line\nbreak", total: 1 },
    ]);
    expect(csv).toBe(
      'Month,Total Organizations\n"Jul, 24","say ""hi"""\n"line\nbreak",1',
    );
  });

  it("renders missing values as empty cells rather than 'undefined'", () => {
    expect(toCsv(COLUMNS, [{ month: "Jul '24" }])).toBe(
      "Month,Total Organizations\nJul '24,",
    );
    expect(toCsv(COLUMNS, [{ month: null, total: 0 }])).toBe(
      "Month,Total Organizations\n,0",
    );
  });

  it("emits a header-only file when there are no rows", () => {
    expect(toCsv(COLUMNS, [])).toBe("Month,Total Organizations");
  });
});

describe("downloadCsv", () => {
  let click;

  beforeEach(() => {
    click = jest.fn();
    globalThis.URL.createObjectURL = jest.fn(() => "blob:csv");
    globalThis.URL.revokeObjectURL = jest.fn();
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(click);
  });

  afterEach(() => jest.restoreAllMocks());

  it("hands the browser a named .csv file and cleans up the object URL", () => {
    jest.useFakeTimers();
    downloadCsv("growth-trend", COLUMNS, [{ month: "Jul '24", total: 78 }]);

    expect(click).toHaveBeenCalledTimes(1);
    expect(globalThis.URL.createObjectURL).toHaveBeenCalledTimes(1);
    // The link is removed immediately; the URL is revoked on the next tick.
    expect(document.querySelector("a[download]")).toBeNull();

    jest.runAllTimers();
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith("blob:csv");
    jest.useRealTimers();
  });
});
