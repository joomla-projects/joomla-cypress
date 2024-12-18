/**
 * common.cy.js – Cypress test suite for ../src/common.js custom commands
 */

import { registerCommands } from './support/registerCommands';
import { config, caughtJavaScriptExceptions } from './support/setup';

registerCommands();

beforeEach(() => {
  caughtJavaScriptExceptions();
  cy.doAdministratorLogin(config.username, config.password, false);
});

describe("Test the Cypress custom commands from 'common.js' file", () => {
  /*
   * Stupid waits are inserted as a work-around for the error:
   * 'Expected to find element: `#jform_title`, but never found it.'.
   * These delays allow enough time for the iframe content to fully load,
   * Increased from one to two second for slow Intel N95 miniPC.
   * This approach works consistently across headless, noVNC, and GUI modes.
   *
   * If you have a more reliable solution, you are very welcome to improve this implementation.
   */
  it('isIframeLoaded()', () => {
    // Visit admin's Home Dashboard
    cy.visit('/administrator/index.php?option=com_cpanel');
    // Click 'Add module to the dashboard'
    cy.get('button.cpanel-add-module').click();
    // Now working with the iFrame
    cy.wait(2000);
    cy.get('iframe').iframe().then(($body) => {
      cy.wrap($body).within(() => {
        cy.contains('Frontend Link').click();
      });
    });
    // Open following iFrame
    cy.wait(2000);
    cy.get('iframe').iframe().then(($body) => {
      cy.wrap($body).within(() => {
        cy.get('#jform_title').clear().type('test module');
        if (config.instance > 44) {
          // Button 'Save & Close' inside iFrame
          cy.clickToolbarButton('save & close');
        }
      });
    });
    if (config.instance <= 44) {
      // Button 'Save & Close' inside iFrame
      cy.clickToolbarButton('save & close');
    }
    // Delete the module from the Home Dashboard again
    // On slow machines (e.g. Intel N95 miniPC) we need to wait that the module is on the page.
    cy.wait(2000);
    cy.visit('/administrator/index.php?option=com_cpanel');
    // Find the <h3> with the text "test module"
    cy.contains('h3', 'test module').should('be.visible').then(($h3) => {
      // Traverse to the parent container and find the dropdown button
      cy.wrap($h3)
        .closest('.card-header')
        .within(() => {
          // Click the dropdown button
          cy.get('button[data-bs-toggle="dropdown"]').click();
        });
      // Now find the dropdown menu that is directly related to this button
      cy.wrap($h3)
        .closest('.card-header')
        .find('.dropdown-menu')
        .should('be.visible')
        .within(() => {
          // Click on the "Unpublish" button
          cy.contains('button', 'Unpublish').click();
        });
    });
  });
});
