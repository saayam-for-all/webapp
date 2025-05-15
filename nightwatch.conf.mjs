import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default {
  src_folders: ['test', 'nightwatch/examples'],
  page_objects_path: ['nightwatch/page-objects'],
  custom_commands_path: ['nightwatch/custom-commands'],
  custom_assertions_path: ['nightwatch/custom-assertions'],

  plugins: [require('nightwatch-axe-verbose')],
  globals_path: '',

  webdriver: {},

  test_workers: {
    enabled: true
  },

  test_settings: {
    default: {
      disable_error_log: false,
      launch_url: 'http://localhost',
      screenshots: {
        enabled: false,
        path: 'screens',
        on_failure: true
      },
      desiredCapabilities: {
        browserName: 'chrome'
      },
      webdriver: {
        start_process: true,
        server_path: '/usr/bin/chromedriver'  // ✅ Ajustado a Docker estándar
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: []
          }
        }
      },
      webdriver: {
        start_process: true,
        server_path: '/usr/bin/geckodriver',  // ✅ Ajustado a Docker estándar
        cli_args: []
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          w3c: true,
          args: []
        }
      },
      webdriver: {
        start_process: true,
        server_path: '/usr/bin/chromedriver',  // ✅ Ajustado a Docker estándar
        cli_args: []
      }
    }
  },

  usage_analytics: {
    enabled: true,
    log_path: './logs/analytics',
    client_id: 'a48eaa29-d1f1-4187-919e-d995cc7e2cf0'
  }
};
