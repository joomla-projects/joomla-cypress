/**
 * joomla.cy.js – Cypress test suite for ../src/joomla.js custom commands
 */

import { registerCommands } from '../support/registerCommands';
import { config, deleteJoomlaConfigurationFile, caughtJavaScriptExceptions } from '../support/setup';

registerCommands();

beforeEach(() => {
  caughtJavaScriptExceptions();
});

describe("Test the Cypress custom commands from 'joomla.js' file", () => {
  it('installJoomla()', () => {
    deleteJoomlaConfigurationFile(config);
    cy.installJoomla(config);
    // Frontend and backend available?
    cy.visit('/');
    cy.doAdministratorLogin(config.username, config.password, false);
  });

  if (config.instance >= 51) {
    it('cancelTour()', () => {
      const startButton = '.shepherd-button-primary'; // Guided Tour 'Start' button

      deleteJoomlaConfigurationFile(config);
      cy.installJoomla(config);
      cy.doAdministratorLogin(config.username, config.password, false);
      cy.get(startButton).should('exist');
      cy.cancelTour();
      cy.get(startButton).should('not.exist');
    });
  }

  it('disableStatistics()', () => {
    deleteJoomlaConfigurationFile(config);
    cy.installJoomla(config);
    cy.doAdministratorLogin(config.username, config.password, false);
    if (config.instance >= 51) {
      cy.cancelTour();
    }
    cy.visit('/administrator');
    cy.contains('p', 'Enable Joomla Statistics?').should('be.visible');
    cy.disableStatistics();
    cy.visit('/administrator');
    cy.contains('p', 'Enable Joomla Statistics?').should('not.exist');
  });

  it('setErrorReportingToDevelopment()', () => {
    cy.doAdministratorLogin(config.username, config.password, false);
    cy.setErrorReportingToDevelopment();
    cy.checkForSystemMessage('Configuration saved.');
    cy.get('select#jform_error_reporting').should('have.value', 'maximum');
  });

  /*
   * For development branches with not yet released Joomla versions there are no
   * language packages available and installation will fail with 'Unable to detect manifest file.'.
   * Testing this spec can be prevented with 'export CYPRESS_SKIP_INSTALL_LANGUAGES=1'.
   */
  if (!Cypress.env('SKIP_INSTALL_LANGUAGES')) {
    /*
     * This must be the final Joomla installation test, as it deletes the installation folder.
     * The Joomla installation folder must be restored before the next test run.
     * (Alternatively, we could save and restore the installation directory with Node.js scripting).
     */
    it('installJoomlaMultilingualSite()', () => {
      deleteJoomlaConfigurationFile(config);
      cy.installJoomlaMultilingualSite(config);
      // Frontend and backend available?
      cy.visit('/');
      cy.doAdministratorLogin(config.username, config.password, false);
      // Cancel tour is needed to have next tests running
      if (config.instance >= 51) {
        cy.cancelTour();
      }
      // Disable statistics is needed to have next tests running
      cy.disableStatistics();
    });
  }
});
