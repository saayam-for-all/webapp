/**
 * Export helpers for analytics chart cards.
 *
 * Kept out of ChartContainer so the DOM/serialisation work is testable on its
 * own and the container stays a presentational component.
 */

const escapeCell = (value) => {
  const text = value == null ? "" : String(value);
  // Quote whenever the cell could otherwise break the row apart.
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** Builds CSV text from `[{ key, label }]` columns and row objects. */
export const toCsv = (columns, rows) => {
  const header = columns.map((c) => escapeCell(c.label)).join(",");
  const body = rows.map((row) =>
    columns.map((c) => escapeCell(row[c.key])).join(","),
  );
  return [header, ...body].join("\n");
};

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke on the next tick so the click has already been handled.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const downloadCsv = (filename, columns, rows) => {
  const blob = new Blob([toCsv(columns, rows)], {
    type: "text/csv;charset=utf-8;",
  });
  triggerDownload(blob, `${filename}.csv`);
};

// Presentation properties that must survive serialisation. Recharts sets most
// of these as attributes, but any text styled with utility classes (the donut's
// centre label, for one) only carries them as computed styles.
const INLINE_STYLE_PROPS = [
  "fill",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-opacity",
  "stroke-dasharray",
  "stroke-linecap",
  "font-family",
  "font-size",
  "font-weight",
  "text-anchor",
  "dominant-baseline",
  "opacity",
];

/**
 * Copies computed presentation styles onto each node as inline styles, so the
 * detached clone renders identically once the page's stylesheets are gone.
 */
const inlineStyles = (source, clone) => {
  const computed = window.getComputedStyle(source);
  const declarations = INLINE_STYLE_PROPS.map(
    (prop) => `${prop}:${computed.getPropertyValue(prop)}`,
  ).join(";");
  clone.setAttribute("style", declarations);
  clone.removeAttribute("class");

  const sourceChildren = source.children;
  const cloneChildren = clone.children;
  for (let i = 0; i < sourceChildren.length; i += 1) {
    inlineStyles(sourceChildren[i], cloneChildren[i]);
  }
};

const SVG_NS = "http://www.w3.org/2000/svg";
const LEGEND_FONT_SIZE = 12;
const LEGEND_ROW_HEIGHT = 28;
const LEGEND_SWATCH = 10;
const LEGEND_GAP = 20;
// Rough advance width for the label font — good enough to centre a single row.
const LEGEND_CHAR_WIDTH = 6.4;

const legendItemWidth = (item) =>
  LEGEND_SWATCH + 6 + item.value.length * LEGEND_CHAR_WIDTH;

/**
 * Draws the series legend into the cloned SVG.
 *
 * The on-screen legend is HTML rendered beside the chart, so without this a
 * multi-series export would lose every series label.
 */
const appendLegend = (clone, legend, width, top) => {
  const widths = legend.map(legendItemWidth);
  const total =
    widths.reduce((sum, w) => sum + w, 0) + LEGEND_GAP * (legend.length - 1);
  let x = Math.max(0, (width - total) / 2);
  const y = top + LEGEND_ROW_HEIGHT / 2;

  legend.forEach((item, index) => {
    const swatch = document.createElementNS(SVG_NS, "rect");
    swatch.setAttribute("x", x);
    swatch.setAttribute("y", y - LEGEND_SWATCH / 2);
    swatch.setAttribute("width", LEGEND_SWATCH);
    swatch.setAttribute("height", item.type === "line" ? 3 : LEGEND_SWATCH);
    swatch.setAttribute("rx", 2);
    swatch.setAttribute("fill", item.color);
    if (item.type === "line") {
      swatch.setAttribute("y", y - 1.5);
    }
    clone.appendChild(swatch);

    const label = document.createElementNS(SVG_NS, "text");
    label.setAttribute("x", x + LEGEND_SWATCH + 6);
    label.setAttribute("y", y);
    label.setAttribute("dominant-baseline", "middle");
    label.setAttribute("font-size", LEGEND_FONT_SIZE);
    label.setAttribute("font-family", "Inter, system-ui, sans-serif");
    label.setAttribute("fill", "#4b5563");
    label.textContent = item.value;
    clone.appendChild(label);

    x += widths[index] + LEGEND_GAP;
  });
};

/**
 * Rasterises an SVG chart to a PNG at 2x for a crisp download.
 * Pass `legend` for multi-series charts whose legend lives outside the SVG.
 * Resolves once the file has been handed to the browser.
 */
export const downloadPng = (svg, filename, { scale = 2, legend } = {}) => {
  const rect = svg.getBoundingClientRect();
  const width = Math.ceil(rect.width) || Number(svg.getAttribute("width")) || 0;
  const chartHeight =
    Math.ceil(rect.height) || Number(svg.getAttribute("height")) || 0;
  if (!width || !chartHeight) {
    return Promise.reject(new Error("Chart has no size"));
  }

  const hasLegend = Array.isArray(legend) && legend.length > 0;
  const height = chartHeight + (hasLegend ? LEGEND_ROW_HEIGHT : 0);

  const clone = svg.cloneNode(true);
  inlineStyles(svg, clone);
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("width", width);
  clone.setAttribute("height", height);
  clone.setAttribute("viewBox", `0 0 ${width} ${height}`);

  // A painted background — a transparent PNG reads as broken on most surfaces.
  const bg = document.createElementNS(SVG_NS, "rect");
  bg.setAttribute("width", width);
  bg.setAttribute("height", height);
  bg.setAttribute("fill", "#ffffff");
  clone.insertBefore(bg, clone.firstChild);

  if (hasLegend) appendLegend(clone, legend, width, chartHeight);

  const source = new XMLSerializer().serializeToString(clone);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      ctx.drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Could not rasterise chart"));
          return;
        }
        triggerDownload(blob, `${filename}.png`);
        resolve();
      }, "image/png");
    };
    image.onerror = () => reject(new Error("Could not load chart image"));
    image.src = url;
  });
};
