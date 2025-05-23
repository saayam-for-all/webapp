const timestamp = new Date().getTime();
const userDataDir = `/tmp/chrome-profile-${timestamp}`;

module.exports = {

  
  src_folders: ['test', 'nightwatch/examples'],
  page_objects_path: ['nightwatch/page-objects'],
  custom_commands_path: ['nightwatch/custom-commands'],
  custom_assertions_path: ['nightwatch/custom-assertions'],
  
  plugins: ['nightwatch-axe-verbose'],
  
  test_workers: { enabled: true },
  
  test_settings: {
    default: {
      launch_url: 'http://localhost',
      screenshots: { enabled: false, path: 'screens', on_failure: true },
      desiredCapabilities: { browserName: 'chrome' },
      webdriver: {
        start_process: true,
        server_path: '/usr/local/bin/chromedriver'
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        'moz:firefoxOptions': {
          args: ['-headless']
        }
      },
      webdriver: {
        start_process: true,
        server_path: 'node_modules/.bin/geckodriver',
        port: 4444,
        host: 'localhost',
        ssl: false,
        default_path_prefix: '',
        proxy: undefined,
        cli_args: ['-vv']
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          w3c: true,
          args: [
            '--no-sandbox',
            '--headless=new',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            `--user-data-dir=${userDataDir}`
          ]
        }
      },
      webdriver: {
        start_process: true,
        server_path: '/usr/bin/chromedriver',
        port: undefined,
        host: 'localhost',
        ssl: false,
        default_path_prefix: '',
        proxy: undefined,
        cli_args: [
          '--verbose',
          '--log-path=logs/chromedriver.log',
          '-vv'
        ]
      },
      output: true,
      disable_colors: false,
      detailed_output: true,
      live_output: true,
      globals: {
        waitForConditionTimeout: 10000
      }
    }
  },

  usage_analytics: {
    enabled: true,
    log_path: './logs/analytics',
    client_id: 'a48eaa29-d1f1-4187-919e-d995cc7e2cf0'
  }
};
