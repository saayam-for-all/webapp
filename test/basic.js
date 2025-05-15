module.exports = {
  'test simple de ejemplo': function (browser) {
    browser
      .url('https://example.com')
      .waitForElementVisible('body', 1000)
      .assert.titleContains('Example Domain')
      .end();
  }
};
