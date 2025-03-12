/**
 * extensions.cy.js – Cypress test suite for ../src/extensions.js custom commands
 */

import { registerCommands } from '../support/registerCommands';
// Add attachFile() Cypress custom command, which is used in installExtensionFromFileUpload()
import 'cypress-file-upload';
import { config, caughtJavaScriptExceptions } from '../support/setup';

registerCommands();

beforeEach(() => {
  caughtJavaScriptExceptions();
  cy.doAdministratorLogin(config.username, config.password, false);
});

// cypress/fixtures contains folder and packed as ZIP
const modHelloWorld = 'mod_hello_world';

describe("Test the Cypress custom commands from 'extensions.js' file", () => {
  it('installExtensionFromFolder()', () => {
    // Install the extension using 'CYPRESS_SERVER_UPLOAD_FOLDER' environment variable
    let serverUploadFolder = Cypress.env('SERVER_UPLOAD_FOLDER');
    if (!serverUploadFolder) {
      // Fallback to using the fixtures folder
      serverUploadFolder = `${Cypress.config('fixturesFolder')}/${modHelloWorld}`;
    }
    cy.log(`Using upload folder: ${serverUploadFolder}`);
    // Install the extension using absolute path
    cy.installExtensionFromFolder(serverUploadFolder);
    // Deleting the module, which confirms it was installed
    cy.visit('administrator/index.php?option=com_installer&view=manage');
    cy.searchForItem(modHelloWorld);
    cy.get('#cb0').click();
    if (config.instance > 44) {
      // Click on 'Actions' first to dropdown-toggle show
      cy.clickToolbarButton('action');
    }
    cy.contains('Uninstall').click();
    if (config.instance > 44) {
      // Confirm
      cy.contains('Yes').click();
    }
    cy.checkForSystemMessage('Uninstalling the module was successful.');
  });

  it('installExtensionFromFileUpload()', () => {
    // File is taken by attachFile() from 'cypress/fixtures' folder
    cy.installExtensionFromFileUpload(`${modHelloWorld}.zip`);
    // Deleting the module, which confirms it was installed
    cy.visit('administrator/index.php?option=com_installer&view=manage');
    cy.searchForItem(modHelloWorld);
    cy.get('#cb0').click();
    if (config.instance > 44) {
      // Click on 'Actions' first to dropdown-toggle show
      cy.clickToolbarButton('action');
    }
    cy.contains('Uninstall').click();
    if (config.instance > 44) {
      // Confirm
      cy.contains('Yes').click();
    }
    cy.checkForSystemMessage('Uninstalling the module was successful.');
  });

  it('installExtensionFromUrl()', () => {
    cy.installExtensionFromUrl('https://downloads.joomla.org/language-packs/translations-joomla5/downloads/joomla5-afrikaans/5-0-2-1/af-za_joomla_lang_full_5-0-2v1-zip?format=zip');
    cy.checkForSystemMessage('Installation of the package was successful.');
  });

  it('uninstallExtension()', () => {
    cy.installExtensionFromUrl('https://downloads.joomla.org/language-packs/translations-joomla5/downloads/joomla5-afrikaans/5-0-2-1/af-za_joomla_lang_full_5-0-2v1-zip?format=zip');
    cy.uninstallExtension('Afrikaans (af-ZA) Taalpakket');
    // includes the verification for 'was successful' message and searching extension and checking for 'No Matching Results'
  });

  /*
   * For development branches with not yet released Joomla versions there are no
   * language packages available and installation will fail with 'Unable to detect manifest file.'.
   * Testing this spec can be prevented with 'export CYPRESS_SKIP_INSTALL_LANGUAGES=1'.
   */
  if (!Cypress.env('SKIP_INSTALL_LANGUAGES')) {
    it('installLanguage()', () => {
      // Grüezi mitenand id Schwiiz
      cy.installLanguage('de-CH');
      cy.checkForSystemMessage('Installation of the language pack was successful.');
    });
  }

  it('enablePlugin()', () => {
    const pluginName = 'Authentication - LDAP';
    // Enabling only works once, so just in case we disable first
    cy.visit('/administrator/index.php?option=com_plugins');
    cy.searchForItem(pluginName);
    cy.get('#cb0').click();
    cy.get('#toolbar-unpublish button').click();
    cy.enablePlugin(pluginName);
    cy.checkForSystemMessage('Plugin enabled.');
  });

  it('setModulePosition()', () => {
    cy.setModulePosition('Login Form', 'sidebar-right');
    cy.checkForSystemMessage('Module saved.');
    cy.get('span.badge.bg-info').should('contain.text', 'sidebar-right');
  });

  it('publishModule()', () => {
    cy.publishModule('Login Form');
    cy.checkForSystemMessage('Module published.');
    // Check for icon-publish
    cy.get('a.js-grid-item-action.tbody-icon.active')
      .should('have.attr', 'data-item-id', 'cb0')
      .within(() => {
        cy.get('span.icon-publish').should('exist');
      });
  });

  it('displayModuleOnAllPages()', () => {
    cy.displayModuleOnAllPages('Breadcrumbs');
    cy.checkForSystemMessage('Module saved.');
    // Verify the 6th <td> ('Pages' column) contains the text 'All'
    cy.get('tr[data-draggable-group="breadcrumbs"] td').eq(5).should('contain.text', 'All');
  });
});
