const path = require("path");

function process(sourceText, sourcePath, options) {
  return {
    code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
  };
}

module.exports = { process };
