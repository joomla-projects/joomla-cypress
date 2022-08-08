const extensionsCommands = () => {

  // Installs a Extension in Joomla that is located in a folder inside the server
  const installExtensionFromFolder = (path, type = 'Extension') => {
    cy.log('**Install an extension from folder**')
    cy.log('Path: ' + path)
    cy.log('Type: ' + type)

    cy.visit('/administrator/index.php?option=com_installer')

    cy.contains('Install from Folder').click()

    cy.get('#install_directory').fill(path)
    cy.get('#installbutton_directory').click()

    cy.get('#system-message-container').contains('was successful').should('be.visible')

    cy.log('--Install an extension from folder--')
  }

  Cypress.Commands.add('installExtensionFromFolder', installExtensionFromFolder)


  // Installs a Extension in Joomla that is located in a url
  const installExtensionFromUrl = (url, type = 'Extension') => {
    cy.log('**Install an extension from Url**')
    cy.log('Url: ' + url)
    cy.log('Type: ' + type)

    cy.visit('/administrator/index.php?option=com_installer')

    cy.contains('Install from URL').click()

    cy.get('#install_url').fill(url)
    cy.get('#installbutton_url').click()

    cy.get('#system-message-container').contains('was successful').should('be.visible')

    cy.log('--Install an extension from Url--')
  }

  Cypress.Commands.add('installExtensionFromUrl', installExtensionFromUrl)


  // Installs a Extension in Joomla using the file upload option
  const installExtensionFromFileUpload = (file, type = 'Extension') =>
  {
    cy.log('**Install an extension from file upload**')
    cy.log('File: ' + file)
    cy.log('Type: ' + type)

    cy.visit('/administrator/index.php?option=com_installer')

    cy.contains('Upload Package File').click()

    document.getElementById('legacy-uploader').classList.remove('hidden')

    cy.get('#install_package').attachFile(file)

    cy.get('#system-message-container').contains('was successful').should('be.visible')

    cy.log('--Install an extension from file upload--')
  }

  Cypress.Commands.add('installExtensionFromFileUpload', installExtensionFromFileUpload)


  // Uninstall Extension based on a name
  const uninstallExtension = (extensionName) =>
  {
    cy.log('**Uninstall an extension**')
    cy.log('Extension Name: ' + extensionName)

    cy.visit('/administrator/index.php?option=com_installer&view=manage')

    cy.searchForItem(extensionName)

    cy.get('#system-message-container .alert').should('not.exist')

    cy.get('#cb0').click()
    cy.clickToolbarButton('delete')
    cy.get('#system-message-container').contains('was successful')

    // Check for warnings during install
    cy.get('joomla-alert[@type="warning"]').should('not.be.visible')

    cy.searchForItem(extensionName)
    cy.get('#system-message-container .alert').contains(' No Matching Results ').should('exist')

    cy.log('--Uninstall an extension--')
  }

  Cypress.Commands.add('uninstallExtension', uninstallExtension)


  // Function to install a language through the interface
  const installLanguage = (languageName) =>
  {
    cy.log('**Install a language**')
    cy.log('Language Name: ' + languageName)

    cy.visit('/administrator/index.php?option=com_installer&view=manage')

    // TODO: Do we need this?
    cy.checkForPhpNoticesOrWarnings()

    cy.searchForItem(languageName)

    cy.get('#system-message-container .alert').should('not.exist')

    cy.get('tr.row0 input').click()
    cy.get('#system-message-container').contains('was successful').should('be.visible')

    cy.log('--Install a language--')
  }

  Cypress.Commands.add('installLanguage', installLanguage)


  // Function to Enable a Plugin
  const enablePlugin = (pluginName) =>
  {
    cy.log('**Enable Plugin**')
    cy.log('Plugin Name: ' + pluginName)

    cy.visit('/administrator/index.php?option=com_plugins')

    // TODO: Do we need this?
    cy.checkForPhpNoticesOrWarnings()

    cy.searchForItem(pluginName)

    cy.get('#system-message-container .alert').should('not.exist')

    cy.get('#cb0').click()
    // cy.get('#toolbar-publish button').click()
    cy.clickToolbarButton('publish')
    cy.get('#system-message-container').contains('enabeld').should('be.visible')

    cy.log('--Enable Plugin--')
  }

  Cypress.Commands.add('enablePlugin', enablePlugin)


  // Publishes a module on frontend in given position
  const setModulePosition = (module, position = 'position-7') =>
  {
    cy.log('**Set module position**')
    cy.log('Module: ' + module)
    cy.log('Position: ' + position)

    cy.visit('administrator/index.php?option=com_modules')

    cy.searchForItem(module)

    cy.get('#system-message-container .alert').should('not.exist')

    cy.get('tr.row0 .has-context a').click()

    // TODO: herausfinden wie ich das mit dem select mache
    // $this->selectOptionInChosen('Position', $position);

    // cy.get('#toolbar-dropdown-save-group .button-save').click()
    cy.clickToolbarButton('save & close')
    cy.get('#system-message-container').contains('saved').should('be.visible')

    cy.log('--Set module position--')
  }

  Cypress.Commands.add('setModulePosition', setModulePosition)


  // Publishes modules
  const publishModule = (module) =>
  {
    cy.log('**Publish all modules**')
    cy.log('Module: ' + module)

    cy.visit('administrator/index.php?option=com_modules')

    cy.searchForItem(module)

    cy.get('#system-message-container .alert').should('not.exist')

    cy.checkAllResults()

    // Make sure modules are unpublished, if we don't do this we don't get a publish message
    cy.clickToolbarButton('unpublish')

    cy.clickToolbarButton('publish')

    cy.get('#system-message-container').contains('published').should('be.visible')

    cy.log('--Publish all modules--')
  }

  Cypress.Commands.add('publishModule', publishModule)


  // Changes the module Menu assignment to be shown on all the pages of the website
  const displayModuleOnAllPages = (module) =>
  {
    cy.log('**Display module on all pages**')
    cy.log('Module: ' + module)

    cy.visit('administrator/index.php?option=com_modules')

    cy.searchForItem(module)

    cy.get('#system-message-container .alert').should('not.exist')

    cy.get('tr.row0 .has-context a').click()

    cy.get('div[role="tablist"] button[aria-controls="assignment"]').click()

    cy.get('#jform_assignment').select(0)

    cy.clickToolbarButton('save & close')
    cy.get('#system-message-container').contains('saved').should('be.visible')

    cy.log('--Display module on all pages--')
  }

  Cypress.Commands.add('displayModuleOnAllPages', displayModuleOnAllPages)
}

module.exports = {
  extensionsCommands
}
