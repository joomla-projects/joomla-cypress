/**
 * To run tests on your own installation, copy this file as 'cypress.config.mjs'.
 * Then, review and adjust the configuration values to suit your setup.
 */
import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    // As from Joomla System Tests
    sitename: 'Joomla CMS Test',
    name: 'jane doe',
    email: 'admin@example.com',
    username: 'ci-admin',
    password: 'joomla-17082005',
    db_type: 'MySQLi',
    db_host: 'localhost',
    db_port: '',
    db_name: 'test_joomla',
    db_user: 'joomla',
    db_password: 'joomla',
    db_prefix: 'jos_',
    smtp_host: 'localhost',
    smtp_port: '1025',
    cmsPath: '.',
    // Added for joomla-cypress tests
    instance: 52, // Joomla major and minor version number
    installationPath: 'C:/laragon/www/joomla52' // Joomla installation path
  },
  e2e: {
    baseUrl: 'http://localhost:9500',
    supportFile: false,
    // Just in case we are coming from a failed installation test, start with the Joomla installation
    specPattern: ['tests/e2e/joomla.cy.js', 'tests/e2e/*.cy.js'],
    screenshotsFolder: 'tests/screenshots',
    fixturesFolder: 'tests/fixtures',
    // Use Firefox as Joomla default and to prevent useless macOS Electron font warnings
    // (Cypress 13.16.0 added 'defaultBrowser' option)
    defaultBrowser: 'firefox',
    setupNodeEvents(on, config) {
      // For example, in a German environment, force the use of Firefox with British English.
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "firefox") {
          launchOptions.preferences["intl.accept_languages"] = "en-GB";
        }
        return launchOptions;
      });
      return config;
    },
  },
});
