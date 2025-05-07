const assert = require('assert');
const mockery = require('mockery');
const nock = require('nock');

describe('test getAllAvailableOptions', function() {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    nock.cleanAll();
    nock.restore();
  });

  test('when firefox version returned correctly', async () => {
    nock('https://api.github.com')
      .get('/repos/mozilla-mobile/fenix/releases/latest')
      .reply(200, {
        'tag_name': 'v105.2.0'
      });

    const {getLatestVersion} = require('../../../../src/commands/android/utils/common');
    const version = await getLatestVersion('firefox');

    assert.strictEqual(version, '105.2.0');
  });

  test('when firefox version not found (error)', async () => {
    nock('https://api.github.com')
      .get('/repos/mozilla-mobile/fenix/releases/latest')
      .reply(502);

    const {getLatestVersion} = require('../../../../src/commands/android/utils/common');
    const version = await getLatestVersion('firefox');

    assert.strictEqual(version, '105.1.0');
  });

  test('when asked for chrome version', async () => {
    const {getLatestVersion} = require('../../../../src/commands/android/utils/common');
    const version = await getLatestVersion('chrome');

    assert.strictEqual(version, '91');
  });
});