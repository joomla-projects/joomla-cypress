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
      case "enable":
        cy.get("#toolbar-publish button").click()
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
      case "versions":
        cy.get("#toolbar-versions").click()
        break
    }

    cy.log('--Click on a toolbar button--')
  }

  Cypress.Commands.add('clickToolbarButton', clickToolbarButton)

  /**
   * Check for PHP notices and warnings in the HTML page source.
   * This command looks for keywords such as 'Deprecated' in bold followed by a colon.
   * If such a styled keyword is found, the test fails with the PHP problem message.
   *
   * Looking for:
   * - <b>Warning</b>:
   * - <b>Deprecated</b>:
   * - <b>Notice</b>:
   * - <b>Strict standards</b>:
   *
   * @memberof Cypress.Commands
   * @method checkForPhpNoticesOrWarnings
   * @returns {void} - It does not return any value, but it is chainable with other Cypress commands.
   */
  Cypress.Commands.add('checkForPhpNoticesOrWarnings', () => {
    cy.log('**Check for PHP notices and warnings**')

    cy.document().then((doc) => {
      const pageSource = doc.documentElement.innerHTML
      // Search for PHP problem keywords in bold style with colon and collect the found keyword and the message
      const regex = /<b>(Warning|Deprecated|Notice|Strict standards)<\/b>:(.*?)(<br|$)/
      const match = regex.exec(pageSource)
      if (match) {
        // Directly fail with the reason, the keyword found and report the PHP problem message, e.g.
        // Error: Unwanted PHP Warning: "Attempt to read property \"id\" on null in <b>/joomla-cms/components/com_newsfeeds/src/View/Category/HtmlView.php</b> on line <b>92</b>"
        throw new Error(`Unwanted PHP ${match?.[1]}: ${JSON.stringify(match?.[2])}`)
      }
    })

    cy.log('--Check for PHP notices and warnings--')
  })

  /**
   * @memberof cy
   * @method checkForSystemMessage
   * @param {string} contain - what we are looking for, e.g. 'published'
   * @returns Chainable
   */
  const checkForSystemMessage = (contain) => {
    cy.log('**Check for system message**')
    cy.log('Contain: ' + contain)

    // cy.get('#system-message-container').contains(contain).should('be.visible')
    //   Cypress has the obscure error "assert expected <noscript> to be visible".
    //   Maybe as the message is dynamically loaded?
    //   Workarounds are:
    //      cy.get('#system-message-container').contains(contain)
    //      cy.get('#system-message-container').should('contain.text', contain).and('be.visible')
    //   However, if we also access the '.alert-message' class, it works:
    cy.get('#system-message-container .alert-message').contains(contain).should('be.visible')

    cy.log('--Check for system message--')
  }

  Cypress.Commands.add('checkForSystemMessage', checkForSystemMessage)

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
   * Custom Cypress command to create a menu item in Joomla.
   *
   * @memberof Cypress.Commands
   * @method createMenuItem
   * @param {string} menuTitle – The title of the menu item to be created.
   * @param {string} menuCategory – The category of the menu item.
   * @param {string} menuItem – The used menu item type (e.g. 'Articles').
   * @param {string} [menu='Main Menu'] – The used menu item destination (e.g. 'Featured Articles').
   * @param {string} [language='All'] - Menu item language as name (e.g. 'Czech (Čeština)') or tag (e.g. 'cs-CZ').
   *
   * The 'language' parameter is only used for multilingual websites where the language selection is visible.
   * 
   * @returns {void} - It does not return any value, but it is chainable with other Cypress commands.
   */
   Cypress.Commands.add('createMenuItem', (menuTitle, menuCategory, menuItem, menu = 'Main Menu', language = 'All') => {
    cy.log('**Create a menu item**')
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

    // Open iFrame to select menu item type
    cy.get('body').then(($body) => {
      if ($body.find('.controls > .input-group > .btn.btn-primary').length > 0) {
        // Do it in Joomla 4
        cy.get('.controls > .input-group > .btn.btn-primary').eq(0).click()
      } else {
        // Do it in Joomla >= 5 with click the 'Menu Item Type'
        cy.get('button[data-button-action="select"]').each(($btn) => {
          const dataModalConfig = $btn.attr('data-modal-config')
          if (dataModalConfig && dataModalConfig.includes('Menu Item Type')) {
            cy.wrap($btn).click()
          }
        })
      }
    })

    cy.get('iframe').iframe().find('button').contains(menuCategory).click()
    cy.get('iframe').iframe().find('.accordion-body a').contains(menuItem).click()

    cy.get('#jform_title').click()
    cy.get('#jform_title').type(menuTitle)

    // The language is only configured for multilingual websites where the language selection is visible.
    cy.get('#jform_language').then(($select) => {
      if ($select.is(':visible')) {
        cy.get('#jform_language').select(language);
      }
    })

    cy.clickToolbarButton('save & close')
    cy.checkForSystemMessage('saved')

    cy.log('--Create a menu item--')
  })


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
    cy.checkForSystemMessage('saved')

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
    cy.log(`**Select option** ${option} in fancy select ${selectId}`)
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
    cy.log(`**Toggle switch** ${fieldName} to ${valueName}`)
    cy.get('label:visible')
      .contains(fieldName)
      .parents('.control-group')
      .find('.switcher label')
      .contains(valueName)
      .invoke('attr', 'for')
      .then(id => {
        cy.window().then(win => {
          win.document.getElementById(id).checked = true
        })
      })
  }

  Cypress.Commands.add('toggleSwitch', toggleSwitch)
}

module.exports = {
  supportCommands
}
