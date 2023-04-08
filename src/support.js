const supportCommands = () => {

  /**
   * Clicks on a button in the toolbar
   *
   * @memberof cy
   * @method clickToolbarButton
   * @param {string} button
   * @param {string} subselector
   * @returns Chainable
   */
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


  /**
   * Check for notices and warnings
   *
   * @memberof cy
   * @method checkForPhpNoticesOrWarnings
   * @returns Chainable
   */
  const checkForPhpNoticesOrWarnings = () => {
    cy.log('**Check for PHP notices and warnings**')

    cy.contains('Notice:').should('not.exist')
    cy.contains('<b>Notice</b>:').should('not.exist')
    cy.contains('Warning:').should('not.exist')
    cy.contains('<b>Warning</b>:').should('not.exist')
    cy.contains('Strict standards:').should('not.exist')
    cy.contains('<b>Strict standards</b>:').should('not.exist')
    cy.contains('The requested page can\'t be found').should('not.exist')

    cy.log('--Check for PHP notices and warnings--')
  }

  Cypress.Commands.add('checkForPhpNoticesOrWarnings', checkForPhpNoticesOrWarnings)


  /**
   * Search for an item
   * TODO: deletes search field doesn't make sense to me in this context; RD)
   *
   * @memberof cy
   * @method searchForItem
   * @param {string} name
   * @returns Chainable
   */
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


  /**
   * set filter on list view
   *
   * @memberof cy
   * @method setFilter
   * @param {string} name
   * @param {string} value
   * @returns Chainable
   */
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

  /**
   * Check all filtered results
   *
   * @memberof cy
   * @method checkAllResults
   * @returns Chainable
   */
  const checkAllResults = () => {
    cy.log("**Check all results**")

    cy.get('thead input[name=\'checkall-toggle\']').click()

    cy.log("--Check all results--")
  }

  Cypress.Commands.add('checkAllResults', checkAllResults)

  /**
   * Create a menu item
   *
   * @memberof cy
   * @method createMenuItem
   * @param {string} menuTitle
   * @param {string} menuCategory
   * @param {string} menuItem
   * @param {string} menu
   * @param {string} language
   * @param {string} extension
   * @returns Chainable
   */
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


  /**
   * @memberof cy
   * @method createCategory
   * @param {string} title
   * @param {string} extension
   * @returns Chainable
   */
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


  /**
   * Selects an option in a fancy select field
   *
   * @memberof cy
   * @method selectOptionInFancySelect
   * @param {string} selectId - The name of the field like #jform_countries
   * @param {string} option - The name of the value like 'Germany'
   * @returns Chainable
   */
  const selectOptionInFancySelect = (selectId, option) =>
  {
    cy.get(selectId).parents('joomla-field-fancy-select').find('.choices__inner').click();
    cy.get(selectId).parents('joomla-field-fancy-select').find('.choices__item').contains(option).click();
  }

  Cypress.Commands.add('selectOptionInFancySelect', selectOptionInFancySelect)


  /**
   * Toggles a switch field
   *
   * @memberof cy
   * @method toggleSwitch
   * @param {string} fieldName - The name of the field like 'Published
   * @param {string} valueName - The name of the value like 'Yes'
   * @returns Chainable
   */
  const toggleSwitch = (fieldName, valueName) =>
  {
    cy.get('legend').parents('fieldset').find('label').contains(valueName).then(($label) => {
      cy.window().then((win) => {
        win.document.getElementById($label.attr('for')).checked = true;
      });
    })
  }

  Cypress.Commands.add('toggleSwitch', toggleSwitch)
}

module.exports = {
  supportCommands
}
