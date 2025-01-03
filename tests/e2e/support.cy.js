/**
 * support.cy.js – Cypress test suite for ../src/support.js custom commands
 */

import { registerCommands } from '../support/registerCommands';
import { config, caughtJavaScriptExceptions } from '../support/setup';

registerCommands();

beforeEach(() => {
  caughtJavaScriptExceptions();
  cy.doAdministratorLogin(config.username, config.password, false);
});

describe("Test the Cypress custom commands from 'support.js' file", () => {
  it('clickToolbarButton()', () => {
    cy.visit('/administrator/index.php?option=com_banners&view=banners');
    cy.clickToolbarButton('new');
    cy.clickToolbarButton('cancel');
    cy.visit('/administrator/index.php?option=com_content&task=article.add');
    cy.get('#jform_title').clear().type('Test article versions');
    cy.clickToolbarButton('Save');
    cy.clickToolbarButton('Versions');
    cy.get('.joomla-dialog-header').should('contain.text', 'Versions');
  });

  it('checkForPhpNoticesOrWarnings()', () => {
    // Set site offline with custom message containing faked PHP warning
    cy.visit('/administrator/index.php?option=com_config');
    cy.contains('.page-title', 'Global Configuration').scrollIntoView();
    cy.get("div[role='tablist'] button[aria-controls='page-site']").click();
    cy.toggleSwitch('Site Offline', 'Yes');
    // Needs to be saved and reload to have 'Offline Message' field available
    cy.intercept('index.php?option=com_config*').as('config_save');
    cy.clickToolbarButton('save');
    cy.wait('@config_save');
    cy.contains('.page-title', 'Global Configuration').should('exist');
    cy.checkForSystemMessage('Configuration saved.');
    // Now we can type our fake PHP warning
    cy.get('#jform_offline_message')
      .clear()
      .type('<b>Warning</b>: Test PHP Warning<br />');
    cy.intercept('index.php?option=com_config*').as('config_save');
    cy.clickToolbarButton('save');
    cy.wait('@config_save');
    cy.contains('.page-title', 'Global Configuration').should('exist');
    cy.checkForSystemMessage('Configuration saved.');
    // Test custom command fails
    cy.visit('/', { failOnStatusCode: false });
    let didFail = false;
    cy.on('fail', (error) => {
      didFail = true;
      expect(error.message).to.include('Unwanted PHP Warning');
      // Return false to prevent Cypress from failing the test
      return false;
    });
    cy.checkForPhpNoticesOrWarnings().then(() => {
      // If the command did not fail, explicitly fail the test
      if (!didFail) {
        throw new Error('Expected PHP warning, but none were found');
      }
    });
  });

  it('Set site online again', () => {
    cy.visit('/administrator/index.php?option=com_config');
    cy.contains('.page-title', 'Global Configuration').scrollIntoView();
    cy.get("div[role='tablist'] button[aria-controls='page-site']").click();
    cy.toggleSwitch('Site Offline', 'No');
    cy.intercept('index.php?option=com_config*').as('config_save');
    cy.clickToolbarButton('save');
    cy.wait('@config_save');
    cy.contains('.page-title', 'Global Configuration').should('exist');
    cy.checkForSystemMessage('Configuration saved.');
  });

  it('checkForSystemMessage()', () => {
    cy.visit('/administrator/index.php?option=com_config');
    cy.clickToolbarButton('save');
    cy.checkForSystemMessage('Configuration saved.');
  });

  it('searchForItem()', () => {
    const plugin = 'Authentication - LDAP';
    cy.visit('/administrator/index.php?option=com_plugins');
    cy.searchForItem(plugin);
    cy.get('tr.row0').should('contain.text', plugin);
  });

  it('setFilter()', () => {
    cy.visit('/administrator/index.php?option=com_plugins');
    cy.setFilter('enabled', 'Enabled');
    cy.get('#pluginList tr[class^="row"]').each(($row) => {
      cy.wrap($row).find('td a.active').should('exist');
    });
  });

  it('checkAllResults()', () => {
    // User Actions Log
    cy.visit('/administrator/index.php?option=com_actionlogs&view=actionlogs');
    cy.checkAllResults();
    cy.clickToolbarButton('delete');
    if (config.instance > 44) {
      cy.contains('Yes').click();
    }
    cy.checkForSystemMessage('logs deleted.');
  });

  it('createMenuItem()', () => {
    const menuTitle = `test menu title ${Date.now()}`;
    cy.createMenuItem(menuTitle, 'Articles', 'Featured Articles');
    // Delete the menu entry, which also confirms is was created
    cy.visit('/administrator/index.php?option=com_menus&view=items');
    cy.searchForItem(menuTitle);
    cy.get('#cb0').click();
    cy.clickToolbarButton('action');
    cy.contains('Trash').click();
    cy.setFilter('published', 'Trashed');
    cy.searchForItem(menuTitle);
    cy.get('#cb0').click();
    cy.clickToolbarButton('delete');
    if (config.instance > 44) {
      cy.contains('Yes').click();
    }
    cy.checkForSystemMessage('Menu item deleted.');
  });

  it('createCategory()', () => {
    const category = `test category title ${Date.now()}`;
    cy.createCategory(category, 'com_content');
    // Delete the category, which also confirms is was created
    cy.visit('/administrator/index.php?option=com_categories&view=categories&extension=com_content');
    cy.searchForItem(category);
    cy.get('#cb0').click();
    cy.clickToolbarButton('action');
    cy.contains('Trash').click();
    cy.setFilter('published', 'Trashed');
    cy.searchForItem(category);
    cy.get('#cb0').click();
    cy.clickToolbarButton('delete');
    if (config.instance > 44) {
      cy.contains('Yes').click();
    }
    cy.checkForSystemMessage('Category deleted.');
  });

  it('selectOptionInFancySelect()', () => {
    cy.visit('/administrator/index.php?option=com_config');
    cy.get('button[role="tab"]:contains(Logging)').click();
    cy.selectOptionInFancySelect('#jform_log_priorities', 'Debug');
    cy.clickToolbarButton('save & close');
    // Delete 'Debug' again
    cy.visit('/administrator/index.php?option=com_config');
    cy.get('button[role="tab"]:contains(Logging)').click();
    cy.get('.choices__item')
      .filter('[data-value="debug"]')
      .find('button')
      .click();
    cy.clickToolbarButton('save & close');
  });

  it('toggleSwitch()', () => {
    cy.visit('/administrator/index.php?option=com_config');
    cy.get('button[role="tab"]:contains(Logging)').click();
    cy.toggleSwitch('Log Almost Everything', 'Yes');
    cy.clickToolbarButton('save & close');
    cy.visit('/administrator/index.php?option=com_config');
    cy.get('input#jform_log_everything1').should('be.checked');
    // Switch back
    cy.toggleSwitch('Log Almost Everything', 'No');
    cy.clickToolbarButton('save & close');
  });
});
