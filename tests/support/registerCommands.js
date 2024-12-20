/**
 * Custom implementation of registerCommands() for joomla-cypress testing.
 * This version is based on joomla-cypress/src/index.js but directly
 * imports the source files to ensure they are used in the test suite.
 */

const { joomlaCommands } = require('../../src/joomla');
const { extensionsCommands } = require('../../src/extensions');
const { supportCommands } = require('../../src/support');
const { userCommands } = require('../../src/user');
const { commonCommands } = require('../../src/common');

const registerCommands = () => {
  joomlaCommands();
  extensionsCommands();
  supportCommands();
  userCommands();
  commonCommands();
};

module.exports = { registerCommands };
