module.exports = {
  "Loading Test": function (browser) {
    browser
      .url("http://localhost:5173") // URL local de tu aplicación
      .waitForElementVisible("body", 1000)

      .end();
  },
};
