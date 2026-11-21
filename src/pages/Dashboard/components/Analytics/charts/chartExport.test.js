import { toCsv, downloadCsv, downloadPng } from "./chartExport";

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

describe("downloadPng", () => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  let click;
  let toBlobResult;
  let imageShouldFail;
  const OriginalImage = globalThis.Image;

  const makeSvg = ({ rect = { width: 300, height: 200 }, attrs = {} } = {}) => {
    const svg = document.createElementNS(SVG_NS, "svg");
    Object.entries(attrs).forEach(([k, v]) => svg.setAttribute(k, v));
    const bar = document.createElementNS(SVG_NS, "rect");
    bar.setAttribute("class", "bar");
    svg.appendChild(bar);
    svg.getBoundingClientRect = () => rect;
    return svg;
  };

  beforeEach(() => {
    click = jest.fn();
    toBlobResult = new Blob(["png"], { type: "image/png" });
    imageShouldFail = false;
    globalThis.URL.createObjectURL = jest.fn(() => "blob:png");
    globalThis.URL.revokeObjectURL = jest.fn();
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(click);
    jest
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue({ scale: jest.fn(), drawImage: jest.fn() });
    jest
      .spyOn(HTMLCanvasElement.prototype, "toBlob")
      .mockImplementation((cb) => cb(toBlobResult));
    // jsdom never loads images, so fire onload/onerror as soon as src is set.
    globalThis.Image = class {
      set src(value) {
        this.loadedSrc = value;
        setTimeout(() => (imageShouldFail ? this.onerror() : this.onload()), 0);
      }
    };
  });

  afterEach(() => {
    globalThis.Image = OriginalImage;
    jest.restoreAllMocks();
  });

  it("rejects when the chart has no size", async () => {
    const svg = makeSvg({ rect: { width: 0, height: 0 } });
    await expect(downloadPng(svg, "empty")).rejects.toThrow(
      "Chart has no size",
    );
    expect(click).not.toHaveBeenCalled();
  });

  it("downloads a named .png, drawing a legend row for multi-series charts", async () => {
    const appendSpy = jest.spyOn(Element.prototype, "appendChild");
    const svg = makeSvg();

    await downloadPng(svg, "growth-trend", {
      legend: [
        { value: "Total", type: "line", color: "#3b82f6" },
        { value: "Profit", type: "rect", color: "#059669" },
      ],
    });

    expect(click).toHaveBeenCalledTimes(1);
    expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(toBlobResult);
    const labels = appendSpy.mock.calls
      .map(([node]) => node)
      .filter((node) => node.tagName === "text")
      .map((node) => node.textContent);
    expect(labels).toEqual(["Total", "Profit"]);
  });

  it("falls back to the width/height attributes when layout reports zero", async () => {
    const svg = makeSvg({
      rect: { width: 0, height: 0 },
      attrs: { width: "320", height: "180" },
    });
    await expect(downloadPng(svg, "sized")).resolves.toBeUndefined();
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("rejects when the canvas cannot produce a blob", async () => {
    toBlobResult = null;
    await expect(downloadPng(makeSvg(), "chart")).rejects.toThrow(
      "Could not rasterise chart",
    );
    expect(click).not.toHaveBeenCalled();
  });

  it("rejects when the chart image fails to load", async () => {
    imageShouldFail = true;
    await expect(downloadPng(makeSvg(), "chart")).rejects.toThrow(
      "Could not load chart image",
    );
  });
});
