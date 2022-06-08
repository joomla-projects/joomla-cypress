const joomlaCommands = () => {
  const installJoomla = (config) => {
      cy.log(`**Install Joomla**`)
      // Load installation page and check for language dropdown
      cy.visit('installation/index.php')
      cy.get('#jform_language').should('be.visible')

      // Select en-GB as installation language
      cy.get('#jform_language').select('English (United Kingdom)')
      cy.get('#jform_language-lbl').should('contain', 'Select Language')

      // Fill Sitename
      cy.get('#jform_site_name').type(config.sitename)
      cy.get('#step1').click()

      // Fill Admin credentials
      cy.get('#jform_admin_user').type(config.name)
      cy.get('#jform_admin_username').type(config.username)
      cy.get('#jform_admin_password').type(config.password)
      cy.get('#jform_admin_email').type(config.email)
      cy.get('#step2').click()

      // Fill database configuration
      cy.get('#jform_db_type').select(config.db_type)
      cy.get('#jform_db_host').clear().type(config.db_host)
      cy.get('#jform_db_user').type(config.db_user)
      if (config.db_password)
          cy.get('#jform_db_pass').type(config.db_password)
      cy.get('#jform_db_name').clear().type(config.db_name)
      cy.get('#jform_db_prefix').clear().type(config.db_prefix)
      cy.intercept('index.php?task=installation.*').as('ajax_requests')
      cy.get('#setupButton').click()
      cy.wait('@ajax_requests')
      cy.wait('@ajax_requests')
      cy.wait('@ajax_requests')
      cy.wait('@ajax_requests')
      cy.wait('@ajax_requests')
      cy.wait('@ajax_requests')
      cy.wait('@ajax_requests')
      cy.get('#installCongrat').should('be.visible')
  }

  Cypress.Commands.add('installJoomla', installJoomla)

  const disableStatistics = () => {
    cy.log(`**Disable Statistics**`)
    cy.get('.js-pstats-btn-allow-never').click()
    cy.wait(1)
  }

  Cypress.Commands.add('disableStatistics', disableStatistics)

  const setErrorReportingToDevelopment = () => {
    cy.visit('administrator/index.php?option=com_config')
    cy.contains('.page-title', 'Global Configuration').scrollIntoView()
    cy.get("div[role='tablist'] button[aria-controls='page-server']").click()
    cy.get('#jform_error_reporting').select('Maximum')
    cy.clickToolbarButton('save')
    cy.contains('.page-title', 'Global Configuration')
    cy.contains('#system-message-container', 'Configuration saved.')
  }

  Cypress.Commands.add('setErrorReportingToDevelopment', setErrorReportingToDevelopment)
}

module.exports = {
    joomlaCommands
}
