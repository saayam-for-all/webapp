const httpServer = require('http-server');

describe('Nightwatch Inspector Tests', function() {
  let server;

  before(browser => {
    server = httpServer.createServer({
      root: 'src'
    });

    server.listen(4000, function() {
      console.log('Server running at http://localhost:4000/');
    });

    browser.url('http://localhost:4000/panel/index.html');
  });

  it('should display Nightwatch Inspector header', function(browser) {
    browser.expect.element('.heading').text.to.equal('Nightwatch Inspector');
  });

  it('should display Selector History table', function(browser) {
    browser.expect.element('#selectorTable').to.be.present;
  });

  it('should display Try Nightwatch Commands section', function(browser) {
    browser.expect.element('#nightwatchCommand').to.be.present;
    browser.expect.element('#tryNightwatchCommand').to.be.present;
    browser.expect.element('#commandResult').to.be.present;
  });

  it('should display Commands History textarea', function(browser) {
    browser.expect.element('#commandTable').to.be.present;
  });

  it('Verify Explore Mode', function() {
    // Verify that the Explore Mode checkbox is unchecked by default
    browser.expect.element('#exploreMode').to.not.be.selected;

    // Click on the Explore Mode checkbox and verify that it is now checked
    browser.click('#exploreMode');
    browser.expect.element('#exploreMode').to.be.selected;

    // Click on the Explore Mode checkbox again and verify that it is now unchecked
    browser.click('#exploreMode');
    browser.expect.element('#exploreMode').to.not.be.selected;
  });

  after(browser => {
    server.close();
    browser.end();
  });
});
