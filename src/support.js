const supportCommands = () => {
  const clickToolbarButton = (button, subselector = null) => {
    cy.log('**Click ' + button + ' toolbar button**')

    switch (button.toLowerCase())
    {
      case "new":
        cy.get("button.button-new").click()
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
        cy.get("#save-group-children-save").click()
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
  }

  Cypress.Commands.add('clickToolbarButton', clickToolbarButton)

  const checkForPhpNoticesOrWarnings = () => {
    // $this->dontSeeInPageSource('Notice:');
    // $this->dontSeeInPageSource('<b>Notice</b>:');
    // $this->dontSeeInPageSource('Warning:');
    // $this->dontSeeInPageSource('<b>Warning</b>:');
    // $this->dontSeeInPageSource('Strict standards:');
    // $this->dontSeeInPageSource('<b>Strict standards</b>:');
    // $this->dontSeeInPageSource('The requested page can\'t be found');
  }

  Cypress.Commands.add('checkForPhpNoticesOrWarnings', checkForPhpNoticesOrWarnings)

  /**
   * Selects an option in a Joomla Radio Field based on its label
   *
   * @param   string  $label   The text in the <label> with for attribute that links to the radio element
   * @param   string  $option  The text in the <option> to be selected in the chosen radio button
   *
   * @return  void
   *
   * @since   3.0.0
   */
  public function selectOptionInRadioField($label, $option)
  {
    $this->debug("Trying to select the $option from the $label");
    $label = $this->findField(['xpath' => "//label[contains(normalize-space(string(.)), '$label')]"]);
    $radioId = $label->getAttribute('for');

    $this->click("//fieldset[@id='$radioId']/label[contains(normalize-space(string(.)), '$option')]");
  }

  const searchForItem = (name = null) => {
    if (name)
    {
      cy.debug("Searching for " + name)
      cy.get('#filter_search').clear().type(name)
      cy.intercept('get', 'administrator/index.php').as('filterByName')
      cy.get('.filter-search-bar__button').click()
      cy.wait('@filterByName')

      return
    }

    cy.intercept('get', 'administrator/index.php').as('clearFilter')
    cy.get('.js-stools-btn-clear').click()
    cy.wait('@clearFilter')
  }

  Cypress.Commands.add('searchForItem', searchForItem)

  /**
   * Function to Check of the Item Exist in Search Results in Administrator List.
   *
   * note: on long lists of items the item that your are looking for may not appear in the first page. We recommend
   * the usage of searchForItem method before using the current method.
   *
   * @param   String  $name  Name of the Item which we are Searching For
   *
   * @return void
   */
  public function checkExistenceOf($name)
  {
    $this->debug("Verifying if $name exist in search result");
    $this->seeElement(['xpath' => "//form[@id='adminForm']/div/table/tbody"]);
    $this->see($name, ['xpath' => "//form[@id='adminForm']/div/table/tbody"]);
  }

  /**
   * Function to select all the item in the Search results in Administrator List
   *
   * Note: We recommend use of checkAllResults function only after searchForItem to be sure you are selecting only the desired result set
   *
   * @return void
   */
  public function checkAllResults()
  {
    $this->debug("Selecting Checkall button");
    $this->click(['xpath' => "//thead//input[@name='checkall-toggle' or @name='toggle']"]);
  }






  /**
   * Creates a menu item with the Joomla menu manager, only working for menu items without additional required fields
   *
   * @param   string  $menuTitle     The menu item title
   * @param   string  $menuCategory  The category of the menu type (for example Weblinks)
   * @param   string  $menuItem      The menu item type / link text (for example List all Web Link Categories)
   * @param   string  $menu          The menu where the item should be created
   * @param   string  $language      If you are using Multilingual feature, the language for the menu
   *
   * @return  void
   *
   * @since   3.0.0
   * @throws Exception
   */
  public function createMenuItem($menuTitle, $menuCategory, $menuItem, $menu = 'Main Menu', $language = 'All')
  {
    $this->debug("I open the menus page");
    $this->amOnPage('administrator/index.php?option=com_menus&view=menus');
    $this->waitForText('Menus', $this->config['timeout'], ['css' => 'H1']);
    $this->checkForPhpNoticesOrWarnings();

    $this->debug("I click in the menu: $menu");
    $this->click(['link' => $menu]);
    $this->waitForText('Menus: Items', $this->config['timeout'], ['css' => 'H1']);
    $this->checkForPhpNoticesOrWarnings();

    $this->debug("I click new");
    $this->click("New");
    $this->waitForText('Menus: New Item', $this->config['timeout'], ['css' => 'h1']);
    $this->checkForPhpNoticesOrWarnings();
    $this->fillField(['id' => 'jform_title'], $menuTitle);

    $this->debug("Open the menu types iframe");
    $this->click(['link' => "Select"]);
    $this->waitForElement(['id' => 'menuTypeModal'], $this->config['timeout']);
    $this->wait(1);
    $this->switchToIFrame("Menu Item Type");

    $this->debug("Open the menu category: $menuCategory");

    // Open the category
    $this->wait(1);
    $this->waitForElement(['link' => $menuCategory], $this->config['timeout']);
    $this->click(['link' => $menuCategory]);

    $this->debug("Choose the menu item type: $menuItem");
    $this->wait(1);
    $this->waitForElement(['xpath' => "//a[contains(text()[normalize-space()], '$menuItem')]"], $this->config['timeout']);
    $this->click(['xpath' => "//div[@id='collapseTypes']//a[contains(text()[normalize-space()], '$menuItem')]"]);
    $this->debug('I switch back to the main window');
    $this->switchToIFrame();
    $this->debug('I leave time to the iframe to close');
    $this->wait(2);
    $this->selectOptionInChosen('Language', $language);
    $this->waitForText('Menus: New Item', '30', ['css' => 'h1']);
    $this->debug('I save the menu');
    $this->click("Save");

    $this->waitForText('Menu item successfully saved', $this->config['timeout'], ['id' => 'system-message-container']);
  }

  /**
   * Function to filter results in Joomla! Administrator.
   *
   * @param   string  $label  Label of the Filter you want to use.
   * @param   string  $value  Value you want to set in the filters.
   *
   * @return  void
   *
   * @since   3.0.0
   */
  public function setFilter($label, $value)
  {
    $label = strtolower($label);

    $filters = array(
        "select status" 	=> "filter_published",
      "select access"		=> "filter_access",
      "select language" 	=> "filter_language",
      "select tag"		=> "filter_tag",
      "select max levels"	=> "filter_level"
  );

    $this->click(['xpath' => "//button[@data-original-title='Filter the list items.']"]);
    $this->debug('I try to select the filters');

    foreach ($filters as $fieldName => $id)
    {
      if ($fieldName == $label)
      {
        $this->selectOptionInChosenByIdUsingJs($id, $value);
      }
    }

    $this->debug('Applied filters');
  }

  /**
   * Function to Verify the Tabs on a Joomla! screen
   *
   * @param   array  $expectedTabs  Expected Tabs on the Page
   * @param   Mixed  $tabsLocator   Locator for the Tabs in Edit View
   *
   * @return  void
   *
   * @since   3.0.0
   */
  public function verifyAvailableTabs($expectedTabs, $tabsLocator = ['xpath' => "//ul[@id='myTabTabs']/li/a"])
  {
    $actualArrayOfTabs = $this->grabMultiple($tabsLocator);

    $this->debug("Fetch the current list of Tabs in the edit view which is: " . implode(", ", $actualArrayOfTabs));
    $url = $this->grabFromCurrentUrl();
    $this->assertEquals($expectedTabs, $actualArrayOfTabs, "Tab Labels do not match on edit view of" . $url);
    $this->debug('Verify the Tabs');
  }

  /**
   * Create a new category
   *
   * @param   string  $title      Title of the new category
   * @param   string  $extension  Optional extension to use
   *
   * @return  void
   *
   * @since   3.7.5
   * @throws Exception
   */
  public function createCategory($title, $extension = '')
  {
    $this->debug('Category creation in /administrator/');
    $this->doAdministratorLogin();

    if (!empty($extension))
    {
      $extension = '&extension=' . $extension;
    }

    $this->amOnPage('administrator/index.php?option=com_categories' . $extension);

    $this->waitForElement(['class' => 'page-title']);
    $this->checkForPhpNoticesOrWarnings();

    $this->debug('Click new category button');
    $this->click($this->locator->adminToolbarButtonNew);

    $this->waitForElement(['class' => 'page-title']);

    $this->checkForPhpNoticesOrWarnings();
    $this->fillField(['id' => 'jform_title'], $title);

    $this->debug('Click new category apply button');
    $this->click($this->locator->adminToolbarButtonApply);

    $this->debug('see a success message after saving the category');

    $this->waitForText('Category saved', $this->config['timeout'], ['id' => 'system-message-container']);
    $this->checkForPhpNoticesOrWarnings();
  }
}

module.exports = {
    supportCommands
}
