const { defineConfig } = require('cypress');
const registerCodeCoverageTasks = require('@cypress/grep/src/plugin');

// Environment-specific configuration lives in cypress/config/*.json
// This keeps secrets/URLs out of source-controlled test logic and lets
// the same suite run against qa / staging / prod-like environments.
const environments = {
  qa: require('./cypress/config/qa.json'),
  staging: require('./cypress/config/staging.json'),
};

module.exports = defineConfig({
  projectId: 'cypress-automation-framework',

  // Global defaults - overridden per environment below
  viewportWidth: 1366,
  viewportHeight: 768,
  defaultCommandTimeout: 8000,
  requestTimeout: 10000,
  responseTimeout: 10000,
  pageLoadTimeout: 30000,
  video: true,
  videoCompression: 32,
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },

  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    overwrite: false,
    html: false,
    json: true,
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },

  e2e: {
    // baseUrl is resolved dynamically based on --env environmentName=qa|staging
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    downloadsFolder: 'cypress/downloads',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      registerCodeCoverageTasks(config);

      // Merge the selected environment's config into Cypress config/env
      const envName = config.env.environmentName || 'qa';
      const envConfig = environments[envName];

      if (!envConfig) {
        throw new Error(
          `Unknown environmentName "${envName}". Valid options: ${Object.keys(environments).join(', ')}`
        );
      }

      config.baseUrl = envConfig.baseUrl;
      config.env = { ...config.env, ...envConfig };

      // Custom tasks - useful hooks for logging, seeding, etc.
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
      });

      return config;
    },
  },
});
