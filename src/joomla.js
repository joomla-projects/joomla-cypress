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

  const disableStatistics = (config) => {
    cy.log(`**Disable Statistics**`)
    cy.get('.js-pstats-btn-allow-never').click()
    cy.wait(1)
  }

  Cypress.Commands.add('disableStatistics', disableStatistics)

  const setErrorReportingToDevelopment = (config) => {
    cy.visit('administrator/index.php?option=com_config')
    cy.contains('.page-title', 'Global Configuration').scrollIntoView()
    cy.get("div[role='tablist'] button[aria-controls='page-server']").click()
    cy.get('#jform_error_reporting').select('Maximum')
    cy.clickToolbarButton('save')
    cy.contains('.page-title', 'Global Configuration')
    cy.contains('#system-message-container', 'Configuration saved.')
  }

  Cypress.Commands.add('setErrorReportingToDevelopment', setErrorReportingToDevelopment)

    /**
     * Installs Joomla with Multilingual Feature active
     *
     * @param   array  $languages  Array containing the language names to be installed
     *
     * @return  void
     *
     * @since   3.0.0
     * @throws Exception
     * @example : $this->installJoomlaMultilingualSite(['Spanish', 'French']);
     *
     */
    public function installJoomlaMultilingualSite($languages = array())
    {
        if (!$languages)
        {
            // If no language is passed French will be installed by default
            $languages[] = 'French';
        }

        $this->installJoomla();

        $this->debug('I go to Install Languages page');
        $this->click(['id' => 'instLangs']);
        $this->waitForText('Install Language packages', $this->config['timeout'], ['xpath' => '//h3']);

        foreach ($languages as $language)
        {
            $this->debug('I mark the checkbox of the language: ' . $language);
            $this->click(['xpath' => "//label[contains(text()[normalize-space()], '$language')]"]);
        }

        $this->click(['link' => 'Next']);
        $this->waitForText('Multilingual', $this->config['timeout'], ['xpath' => '//h3']);
        $this->selectOptionInRadioField('Activate the multilingual feature', 'Yes');
        $this->waitForElementVisible(['id' => 'jform_activatePluginLanguageCode-lbl']);
        $this->selectOptionInRadioField('Install localised content', 'Yes');
        $this->selectOptionInRadioField('Enable the language code plugin', 'Yes');
        $this->click(['link' => 'Next']);

        $this->waitForText('Congratulations! Joomla! is now installed.', $this->config['timeout'], ['xpath' => '//h2']);

        if ($this->haveVisible('#removeInstallationFolder'))
        {
            $this->debug('Removing Installation Folder');
            $this->click(['xpath' => "//input[@value='Remove \"installation\" folder']"]);

            // Wait until the installation folder is gone and the "customize installation" box has been removed
            $this->waitForElementNotVisible(['id' => 'installAddFeatures']);
        }

        $this->debug('Joomla is now installed');
        $this->see('Congratulations! Joomla! is now installed.', ['xpath' => '//h2']);
    }
}

module.exports = {
    joomlaCommands
}
