module.exports = {
  input: ["src/**/*.{js,jsx}"],
  output: "./i18n-extracted/",
  options: {
    lngs: ["en"],
    defaultLng: "en",
    defaultNs: "common",
    ns: ["common", "auth", "categories", "availability"],
    nsSeparator: ":",
    keySeparator: false, // treat dotted keys as literal
    sort: true,
    removeUnusedKeys: false,
    resource: {
      loadPath: "src/common/i18n/locales/{{lng}}/{{ns}}.json",
      savePath: "src/common/i18n/locales/{{lng}}/{{ns}}.json",
    },
  },
  transform: function customTransform(file, enc, done) {
    const content = file.contents.toString("utf8");
    this.parser.parseFuncFromString(content, {
      list: ["t", "i18next.t"],
      nsSeparator: ":",
      keySeparator: false,
    });
    done();
  },
};
