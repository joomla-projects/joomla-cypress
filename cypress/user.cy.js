/**
 * user.cy.js – Cypress test suite for ../src/user.js custom commands
 */

import { registerCommands } from './registerCommands';
import { config, caughtJavaScriptExceptions } from './setup';

registerCommands();

beforeEach(() => {
  caughtJavaScriptExceptions();
});

describe("Test the Cypress custom commands from 'user.js' file", () => {
  it('doAdministratorLogin()', () => {
    cy.doAdministratorLogin(config.username, config.password, false);
  });

  it('doAdministratorLogout()', () => {
    cy.doAdministratorLogin(config.username, config.password, false);
    cy.doAdministratorLogout();
  });

  it('doFrontendLogin()', () => {
    cy.doFrontendLogin(config.username, config.password, false);
  });

  it('doFrontendLogout()', () => {
    cy.doFrontendLogin(config.username, config.password, false);
    cy.doFrontendLogout();
  });

  it('createUser()', () => {
    cy.doAdministratorLogin(config.username, config.password, false);
    cy.createUser('joomla-cypress/test name', `test_${Date.now()}`, config.password, `${Date.now()}@test.com`);
  });
});
