const joomlaCommands = () => {

  // Install Joomla via the user interface
  const installJoomla = (config) => {
    cy.log('**Install Joomla**')
    cy.log('Config: ' + config)

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

    if (config.db_password) {
      cy.get('#jform_db_pass').type(config.db_password)
    }

    cy.get('#jform_db_name').clear().type(config.db_name)
    cy.get('#jform_db_prefix').clear().type(config.db_prefix)
    cy.intercept('index.php?task=installation.create*').as('ajax_create')
    cy.intercept('index.php?task=installation.populate1*').as('ajax_populate1')
    cy.intercept('index.php?task=installation.populate2*').as('ajax_populate2')
    cy.intercept('index.php?task=installation.populate3*').as('ajax_populate3')
    cy.intercept('index.php?view=remove&layout=default').as('finished')
    cy.get('#setupButton').click()
    cy.wait(['@ajax_create', '@ajax_populate1', '@ajax_populate2', '@ajax_populate3', '@finished'], {timeout: 120000})
    cy.get('#installCongrat').should('be.visible')

    cy.log('--Install Joomla--')
  }

  Cypress.Commands.add('installJoomla', installJoomla)


  // Disable Statistics
  const disableStatistics = () => {
    cy.log('**Disable Statistics**')


    cy.intercept('index.php?option=com_ajax&group=system&plugin=sendNever&format=raw').as('stopping_stats')
    cy.get('.js-pstats-btn-allow-never').click()
    cy.wait('@stopping_stats')

    cy.log('--Disable Statistics--')
  }

  Cypress.Commands.add('disableStatistics', disableStatistics)


  // Set Errorreporting to dev mode
  const setErrorReportingToDevelopment = () => {
    cy.log('**Set error reporting to dev mode**')

    cy.visit('administrator/index.php?option=com_config')

    cy.contains('.page-title', 'Global Configuration').scrollIntoView()
    cy.get("div[role='tablist'] button[aria-controls='page-server']").click()
    cy.get('#jform_error_reporting').select('Maximum')

    cy.intercept('index.php?option=com_config*').as('config_save')
    cy.clickToolbarButton('save')
    cy.wait('@config_save')
    cy.contains('.page-title', 'Global Configuration').should('exist')
    cy.contains('#system-message-container', 'Configuration saved.').should('exist')

    cy.log('--Set error reporting to dev mode--')
  }

  Cypress.Commands.add('setErrorReportingToDevelopment', setErrorReportingToDevelopment)


  // Install Joomla as a multi language site
  const installJoomlaMultilingualSite = (config, languages = []) => {
    cy.log('**Install Joomla as a multi language site**')

    if (!languages.length)
    {
        // If no language is passed French will be installed by default
        languages = ['French']
    }

    cy.installJoomla(config)

    cy.get('#installAddFeatures').click()
    cy.contains('Install Language packages', 'h3').should('exist')

    languages.forEach((language) => {
        cy.contains(language, 'label').click()
    })

    cy.get('#installLanguagesButton').click()

    cy.get('#installCongrat').should('be.visible')

    cy.log('Joomla is now installed')

    cy.log('--Install Joomla as a multi language site--')
  }

  Cypress.Commands.add('installJoomlaMultilingualSite', installJoomlaMultilingualSite)
}

module.exports = {
    joomlaCommands
}
