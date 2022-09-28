const supportCommands = () => {

  // Clicks on a button in the toolbar
  const clickToolbarButton = (button, subselector = null) => {
    cy.log('**Click on a toolbar button**')
    cy.log('Button: ' + button)
    cy.log('Subselector: ' + subselector)

    switch (button.toLowerCase())
    {
      case "new":
        cy.get("#toolbar-new").click()
        break
      case "publish":
        cy.get("#status-group-children-publish").click()
        break
      case "unpublish":
        cy.get("#status-group-children-unpublish").click()
        break
      case "archive":
        cy.get("#status-group-children-archive").click();
        break
      case "check-in":
        cy.get("#status-group-children-checkin").click()
        break
      case "batch":
        cy.get("#status-group-children-batch").click()
        break
      case "rebuild":
        cy.get('#toolbar-refresh button').click()
        break
      case "trash":
        cy.get("#status-group-children-trash").click()
        break
      case "save":
        cy.get("#toolbar-apply").click()
        break
      case "save & close":
        cy.get(".button-save").contains('Save & Close').click()
        break
      case "save & new":
        cy.get("#save-group-children-save-new").click()
        break
      case "cancel":
        cy.get("#toolbar-cancel").click()
        break
      case "options":
        cy.get("#toolbar-options").click()
        break
      case "empty trash":
      case "delete":
        cy.get("#toolbar-delete").click()
        break
      case "feature":
        cy.get("#status-group-children-featured").click()
        break
      case "unfeature":
        cy.get("#status-group-children-unfeatured").click()
        break
      case "action":
        cy.get("#toolbar-status-group").click()
        break
      case "transition":
        cy.get(".button-transition.transition-" + subselector).click()
        break
    }

    cy.log('--Click on a toolbar button--')
  }

  Cypress.Commands.add('clickToolbarButton', clickToolbarButton)


  // Check for notices and warnings
  const checkForPhpNoticesOrWarnings = () => {
    cy.log('**Check for PHP notices and warnings**')

    // cy.contains('Notice:').should('not.exists')
    // cy.contains('<b>Notice</b>:').should('not.exists')
    // cy.contains('Warning:').should('not.exists')
    // cy.contains('<b>Warning</b>:').should('not.exists')
    // cy.contains('Strict standards:').should('not.exists')
    // cy.contains('<b>Strict standards</b>:').should('not.exists')
    // cy.contains('The requested page can\'t be found').should('not.exists')

    cy.log('--Check for PHP notices and warnings--')
  }

  Cypress.Commands.add('checkForPhpNoticesOrWarnings', checkForPhpNoticesOrWarnings)

  // Search for an item
  // TODO: deletes search field doesn't make sense to me in this context; RD)
  const searchForItem = (name = null) => {
    cy.log('**Search for an item**')
    cy.log('Name: ' + name)

    if (name)
    {
      cy.log("Searching for " + name)
      cy.get('#filter_search').clear().type(name)
      cy.intercept('index.php*').as('list_page')
      cy.get('.filter-search-bar__button').click()
      cy.wait('@list_page')

      cy.log('--Search for an item--')

      return
    }

    cy.get('.js-stools-btn-clear').click()

    cy.log('--Search for an item--')
  }

  Cypress.Commands.add('searchForItem', searchForItem)

  // set filter on list view
  const setFilter = (name, value) => {
    cy.log('**Set Filter "' + name + '" to "' + value + '"**')

    cy.get('#adminForm .js-stools-container-filters').then($container => {
      if ($container.is(':not(:visible)')) {
        cy.get('button.js-stools-btn-filter').click()
      }
    })

    cy.intercept('index.php*').as('filter_' + name + '_' + value)
    cy.get('#filter_' + name).should('exist').select(value)
    cy.wait('@filter_' + name + '_' + value)

    cy.log('--Set Filter "' + name + '" to "' + value + '"--')
  }

  Cypress.Commands.add('setFilter', setFilter)

  // Check all filtered results
  const checkAllResults = () => {
    cy.log("**Check all results**")

    cy.get('thead input[name=\'checkall-toggle\']').click()

    cy.log("--Check all results--")
  }

  Cypress.Commands.add('checkAllResults', checkAllResults)

  // Create a menu item
  const createMenuItem = (menuTitle, menuCategory, menuItem, menu = 'Main Menu', language = 'All') => {
    cy.log('**Create a menu item**');
    cy.log('Menu title: ' + menuTitle)
    cy.log('Menu category: ' + menuCategory)
    cy.log('Menu Item: ' + menuItem)
    cy.log('Menu: ' + menu)
    cy.log('Language: ' + language)

    // Make sure the menu exists
    cy.visit('administrator/index.php?option=com_menus&view=menus')
    cy.searchForItem(menu)
    cy.get('#system-message-container .alert').should('not.exist')

    // Go to the menu
    cy.get('#menuList a[href*="menutype"]:first').click()
    cy.clickToolbarButton('new')

    // Select a type for the new menu item
    cy.get('.controls > .input-group > .btn').click();
    cy.get('#menuTypeModal').should('be.visible')

    cy.get('iframe').iframe().find('button').contains(menuCategory).click()
    cy.get('iframe').iframe().find('.accordion-body a').contains(menuItem).click()

    cy.get('#jform_title').click();
    cy.get('#jform_title').type(menuTitle);

    // TODO: Language settings

    cy.clickToolbarButton('save & close')
    cy.get('#system-message-container .alert-message').contains('saved').should('be.visible')

    cy.log('--Create a menu item--');
  }

  Cypress.Commands.add('createMenuItem', createMenuItem)


  // Create a category
  const createCategory = (title, extension = 'com_content') =>
  {
    cy.log('**Create a category**')
    cy.log('Title:' + title)
    cy.log('Extension: ' + extension)

    extension = '&extension=' + extension;

    cy.visit('administrator/index.php?option=com_categories' + extension)

    cy.clickToolbarButton('New')
    cy.get('#jform_title').clear().type(title)

    cy.clickToolbarButton('save & close')
    cy.get('#system-message-container .alert-message').contains('saved').should('be.visible')

    cy.log('--Create a category--')
  }

  Cypress.Commands.add('createCategory', createCategory)
}

module.exports = {
    supportCommands
}
