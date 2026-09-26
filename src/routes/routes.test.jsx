/* eslint-env node */
import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";

/**
 * ba#41 TC_NOTIF_HR_008: a signed-out visitor who types /notifications directly
 * must not be served the notification list.
 *
 * The route table is what decides that, but importing routes.jsx pulls in every
 * page component (and their font/CSS side-effect imports), which jest is not
 * configured to transform. So this parses the module instead and inspects the
 * route objects it declares. ProtectedRoute's own behaviour - redirecting when
 * there is no user - is covered by ProtectedRoute.test.jsx.
 */

const source = fs.readFileSync(path.join(__dirname, "routes.jsx"), "utf8");

const ast = parse(source, {
  sourceType: "module",
  plugins: ["jsx"],
});

const routesArray = (() => {
  for (const node of ast.program.body) {
    const decl =
      node.type === "VariableDeclaration"
        ? node
        : node.type === "ExportNamedDeclaration" && node.declaration
          ? node.declaration
          : null;
    if (!decl) continue;
    for (const d of decl.declarations ?? []) {
      if (d.id.name === "routes" && d.init?.type === "ArrayExpression") {
        return d.init;
      }
    }
  }
  throw new Error("could not find the routes array in routes.jsx");
})();

/** Reads the string value of `key` on an object-expression route node. */
const propValue = (objectNode, key) => {
  const prop = objectNode.properties.find(
    (p) => p.type === "ObjectProperty" && p.key.name === key,
  );
  return prop?.value?.type === "StringLiteral" ? prop.value.value : undefined;
};

const hasChildren = (objectNode) =>
  objectNode.properties.some(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.name === "children" &&
      p.value.type === "ArrayExpression",
  );

const childrenOf = (objectNode) =>
  objectNode.properties.find(
    (p) => p.type === "ObjectProperty" && p.key.name === "children",
  ).value.elements;

const topLevelRoutes = routesArray.elements.filter(
  (el) => el.type === "ObjectExpression",
);

const protectedBranch = topLevelRoutes.find(
  (el) => propValue(el, "path") === undefined && hasChildren(el),
);

describe("route table", () => {
  it("declares a protected branch with children", () => {
    expect(protectedBranch).toBeDefined();
  });

  it("does not expose /notifications as a public route", () => {
    const publicPaths = topLevelRoutes.map((el) => propValue(el, "path"));

    expect(publicPaths).not.toContain("notifications");
  });

  it("serves /notifications from inside the protected branch", () => {
    const protectedPaths = childrenOf(protectedBranch)
      .filter((el) => el.type === "ObjectExpression")
      .map((el) => propValue(el, "path"));

    expect(protectedPaths).toContain("notifications");
  });

  it("keeps notifications alongside the other signed-in pages", () => {
    const protectedPaths = childrenOf(protectedBranch)
      .filter((el) => el.type === "ObjectExpression")
      .map((el) => propValue(el, "path"));

    expect(protectedPaths).toEqual(
      expect.arrayContaining(["dashboard", "notifications", "profile"]),
    );
  });
});
