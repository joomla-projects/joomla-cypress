/**
 * setup.js - Common setup for joomla-cypress tests
 */

export const config = {
  // As from Joomla System Tests
  sitename: Cypress.expose('sitename'),
  name: Cypress.expose('name'),
  username: Cypress.expose('username'),
  password: Cypress.expose('password'),
  email: Cypress.expose('email'),
  db_type: Cypress.expose('db_type'),
  db_host: Cypress.expose('db_host'),
  db_port: Cypress.expose('db_port'),
  db_user: Cypress.expose('db_user'),
  db_password: Cypress.expose('db_password'),
  db_name: Cypress.expose('db_name'),
  db_prefix: Cypress.expose('db_prefix'),
  // Added for joomla-cypress tests
  instance: Cypress.expose('instance'), // major and minor, e.g. 52
  installationPath: Cypress.expose('installationPath'), // Joomla instance path
};

export const caughtJavaScriptExceptions = () => {
  /*
   * Catch Joomla JavaScript exceptions; otherwise, Cypress will fail.
   * Use console.log to view these exceptions, e.g. with JBT scripts/check.
   */
  Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(`ERROR uncaught:exception err :${err}`); // eslint-disable-line no-console
    console.log(`ERROR uncaught:exception runnable :${runnable}`); // eslint-disable-line no-console
    return false;
  });
};

/*
 * Delete Joomla configuration.php to force new installation.
 * Delete the file as Node.js one-liner to work on Windows and Unix-based systems.
 * Try out the variants one after the other and simply ignore errors.
 */
export const deleteJoomlaConfigurationFile = () => {
  // Running 'npx cypress run' OR
  cy.exec(
    `node -e "require('fs').unlink('${config.installationPath}/configuration.php', (err) => {});"`,
    { failOnNonZeroExit: false },
  );

  // Running with JBT in jbt-cypress container OR
  cy.exec(
    `node -e "require('fs').unlink('/jbt/joomla-${config.instance}/configuration.php', (err) => {});"`,
    { failOnNonZeroExit: false },
  );

  // Or running JBT with Cypress GUI local from installation/joomla-cypress folder
  cy.exec(
    `node -e "require('fs').unlink('../../joomla-${config.instance}/configuration.php', (err) => {});"`,
    { failOnNonZeroExit: false },
  );
};
