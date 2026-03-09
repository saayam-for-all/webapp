import fs from "fs";
import path from "path";

const localesDir = path.resolve("src/common/i18n/locales");
const sourceLocale = "en";
const categoriesFilename = "categories.json";

function readJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    return null;
  }
}

function writeJson(filePath, data) {
  const json = JSON.stringify(data, null, 2) + "\n";
  fs.writeFileSync(filePath, json, "utf8");
}

function deepMergeStructure(source, target) {
  if (source === null || typeof source !== "object") return target;
  if (target === null || typeof target !== "object")
    target = Array.isArray(source) ? [] : {};

  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];
    if (srcVal && typeof srcVal === "object" && !Array.isArray(srcVal)) {
      target[key] = deepMergeStructure(srcVal, tgtVal ?? {});
    } else {
      if (tgtVal === undefined || tgtVal === null || tgtVal === "") {
        target[key] = srcVal; // fallback to English if missing
      } else {
        target[key] = tgtVal; // preserve existing translation
      }
    }
  }
  return target;
}

function main() {
  const sourcePath = path.join(localesDir, sourceLocale, categoriesFilename);
  const sourceJson = readJson(sourcePath);
  if (!sourceJson) {
    console.error(`Could not read source categories at ${sourcePath}`);
    process.exit(1);
  }

  const localeDirs = fs
    .readdirSync(localesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let changed = 0;
  for (const locale of localeDirs) {
    const filePath = path.join(localesDir, locale, categoriesFilename);
    if (!fs.existsSync(filePath)) {
      // create file with English content as baseline for missing locales
      writeJson(filePath, sourceJson);
      console.log(`[created] ${locale}/${categoriesFilename}`);
      changed += 1;
      continue;
    }

    const targetJson = readJson(filePath) ?? {};
    const merged = deepMergeStructure(sourceJson, targetJson);
    const before = JSON.stringify(targetJson);
    const after = JSON.stringify(merged);
    if (before !== after) {
      writeJson(filePath, merged);
      console.log(`[updated] ${locale}/${categoriesFilename}`);
      changed += 1;
    }
  }

  console.log(`Done. Locales updated: ${changed}`);
}

main();
