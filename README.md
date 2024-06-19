# Joomla Cypress
This is a support package that helps in writing end-to-end tests for the [Joomla CMS](https://joomla.org) and its extensions with the frontend testing tool [Cypress](/https://www.cypress.io/).

Joomla versions 4 and 5, as well as all active Joomla development branches, are supported.

## Cypress Custom Commands for Joomla

The Cypress API is extended with [custom commands](https://docs.cypress.io/api/cypress-api/custom-commands).
The Cypress custom commands for Joomla are grouped into the following categories:
* Common
* Extensions
* Joomla
* Support
* User

All custom commands are list following, if you like to see the overall list you can use READMEs top right TOC button.

### Common Commands

#### iframe

**Command**

Command to interact with iframes in Cypress, ensuring they are fully loaded before proceeding with assertions or actions.

```
Cypress.Commands.add('iframe', {prevSubject: 'element'}, $iframes => new Cypress.Promise(resolve => {...}));
```

**Function**

Function to check if an iframe is fully loaded and then resolve with its body content for Cypress commands.

```
const isIframeLoaded = $iframe => {...};
```

**Variables**

- `$iframe`: \
Represents the iframe element being processed. \
Used to manage the iframe's loading state and retrieve its content once loaded.

### Extensions Commands

#### installExtensionFromFolder

**Command**

Installs a Joomla extension from a folder

```
Cypress.Commands.add('installExtensionFromFolder', installExtensionFromFolder);
```

**Function**

Installs an extension in Joomla that is located in a folder inside the server.
```
const installExtensionFromFolder = (path, type = 'Extension') => {...};
```

**Variables**

- `path`: \
 The path to the folder where the extension is located.
- `type`: \
 The type of extension (default is 'Extension').

---

#### installExtensionFromUrl

**Command**

Installs a Joomla extension from a URL
```
Cypress.Commands.add('installExtensionFromUrl', installExtensionFromUrl);
```

**Function**

Installs an extension in Joomla that is located at a URL.
```
const installExtensionFromUrl = (url, type = 'Extension') => {...};
```

**Variables**

- `url`: \
 The URL where the extension is located.
- `type`: \
 The type of extension (default is 'Extension').
 
---

#### installExtensionFromFileUpload

**Command**

```
Cypress.Commands.add('installExtensionFromFileUpload', installExtensionFromFileUpload);
```

**Function**

```
const installExtensionFromFileUpload = (file, type = 'Extension') => {...};
```
**Variables**

- `file`: \
 The file to be uploaded.
- `type`: \
 The type of extension (default is 'Extension').
 
---

#### uninstallExtension

**Command**

```
Cypress.Commands.add('uninstallExtension', uninstallExtension);
```
**Function**

```
const uninstallExtension = (extensionName) => {...};
```
**Variables**

- `extensionName`: \
 The name of the extension to be uninstalled.
 
---

#### installLanguage

**Command**

```
Cypress.Commands.add('installLanguage', installLanguage);
```
**Function**

```
const installLanguage = (languageName) => {...};
```
**Variables**

- `languageName`: \
 The name of the language to be installed.
 
---

#### enablePlugin

**Command**

```
Cypress.Commands.add('enablePlugin', enablePlugin);
```
**Function**

```
const enablePlugin = (pluginName) => {...};
```
**Variables**

- `pluginName`: \
 The name of the plugin to be enabled.

---

#### setModulePosition

**Command**

```
Cypress.Commands.add('setModulePosition', setModulePosition);
```
**Function**

```
const setModulePosition = (module, position = 'position-7') => {...};
```
**Variables**

- `module`: \
 The name of the module to be positioned.
- `position`: \
 The position where the module should be placed (default is 'position-7').

---

#### publishModule

**Command**

```
Cypress.Commands.add('publishModule', publishModule);
```
**Function**

```
const publishModule = (module) => {...};
```
**Variables**

- `module`: \
 The name of the module to be published.
 
---

#### displayModuleOnAllPages

**Command**

```
Cypress.Commands.add('displayModuleOnAllPages', displayModuleOnAllPages);
```
**Function**

```
const displayModuleOnAllPages = (module) => {...};
```
**Variables**

- `module`: \
 The name of the module to be displayed on all pages.

---

### Joomla Commands

#### installJoomla

**Command**

Installs Joomla via the user interface.

```
Cypress.Commands.add('installJoomla', installJoomla);
```
**Function**

Installs Joomla via the user interface.

```
const installJoomla = (config) => {...};
```

**Variables**

- `config`: \
 Configuration object containing sitename, name, username, password, email, db_type, db_host, db_user, db_password, db_name, db_prefix.

---

#### cancelTour

**Command**

Cancel a guided tour.

```
Cypress.Commands.add('cancelTour', cancelTour);
```

**Function**

Cancels a tour in the Joomla interface.

```
const cancelTour = () => {...};
```

**Variables**

None used.

---

#### disableStatistics

**Command**

Disable statistics.

```
Cypress.Commands.add('disableStatistics', disableStatistics);
```

**Function**

Disables statistics in the Joomla interface.

```
const disableStatistics = () => {...};
```

**Variables**

None used.

---

#### setErrorReportingToDevelopment

**Command**

Sets error reporting to development mode.

```
Cypress.Commands.add('setErrorReportingToDevelopment', setErrorReportingToDevelopment);
```

**Function**

Sets error reporting to development mode in the Joomla configuration.

```
const setErrorReportingToDevelopment = () => {...};
```

**Variables**

None used.

---

#### installJoomlaMultilingualSite

**Command**

Installs Joomla as a multi-language site.

```
Cypress.Commands.add('installJoomlaMultilingualSite', installJoomlaMultilingualSite);
```

**Function**

Installs Joomla as a multi-language site using provided configurations and languages.

```
const installJoomlaMultilingualSite = (config, languages = []) => {...};
```

**Variables**

- `config`: \
Configuration object containing sitename, name, username, password, email, db_type, db_host, db_user, db_password, db_name, db_prefix.
- `languages`: \
Array of languages to be installed (default is an empty array).

### Support Commands

#### clickToolbarButton

**Command**

Clicks on a button in the toolbar.

```
Cypress.Commands.add('clickToolbarButton', clickToolbarButton);
```

**Function**

Clicks on a button in the Joomla toolbar based on the button name and optional subselector.

```
const clickToolbarButton = (button, subselector = null) => {...};
```

**Variables**

- `button`: \
 Name of the button to be clicked.
- `subselector`: \
 Optional subselector for more specific targeting within the button (default is null).

---

#### checkForPhpNoticesOrWarnings

**Command**

Checks for PHP notices and warnings in the current page.

```
Cypress.Commands.add('checkForPhpNoticesOrWarnings', checkForPhpNoticesOrWarnings);
```

**Function**

Checks the HTML source of the current page for PHP notices and warnings.

```
const checkForPhpNoticesOrWarnings = () => {...};
```

**Variables**

None used.

---

#### checkForSystemMessage

**Command**

Checks for a system message containing specific text.

```
Cypress.Commands.add('checkForSystemMessage', checkForSystemMessage);
```

**Function**

Checks if a system message containing specified text is visible.

```
const checkForSystemMessage = (contain) => {...};
```

**Variables**

- `contain`: \
 Text content to check within the system message.
 
---

#### searchForItem

**Command**

Searches for an item using the Joomla interface.

```
Cypress.Commands.add('searchForItem', searchForItem);
```

**Function**

Initiates a search for an item within Joomla based on the provided name.

```
const searchForItem = (name = null) => {...};
```

**Variables**

- `name`: \
 Optional name of the item to search for (default is null).
 
---

#### setFilter

**Command**

Sets a filter on the list view in Joomla.

```
Cypress.Commands.add('setFilter', setFilter);
```

**Function**

Sets a filter on the Joomla list view based on the provided filter name and value.

```
const setFilter = (name, value) => {...};
```

**Variables**

- `name`: \
 Name of the filter to set.
- `value`: \
 Value to set for the filter.
 
---

#### checkAllResults

**Command**

Checks all results in the Joomla list view.

```
Cypress.Commands.add('checkAllResults', checkAllResults);
```

**Function**

Selects all results by checking the 'check all' checkbox in the Joomla list view.

```
const checkAllResults = () => {...};
```

**Variables**

None used.

---

#### createMenuItem

**Command**

Creates a new menu item in Joomla.

```
Cypress.Commands.add('createMenuItem', createMenuItem);
```

**Function**

Creates a new menu item in Joomla with specified parameters.

```
const createMenuItem = (menuTitle, menuCategory, menuItem, menu = 'Main Menu', language = 'All') => {...};
```

**Variables**

- `menuTitle`: \
 Title of the new menu item.
- `menuCategory`: \
 Category of the menu item.
- `menuItem`: \
 Type of the menu item.
- `menu`: \
 Menu where the item will be created (default is 'Main Menu').
- `language`: \
 Language for the menu item (default is 'All').

---

#### createCategory

**Command**

Creates a new category in Joomla.

```
Cypress.Commands.add('createCategory', createCategory);
```

**Function**

Creates a new category in Joomla with specified title and extension.

```
const createCategory = (title, extension = 'com_content') => {...};
```

**Variables**

- `title`: \
 Title of the new category.
- `extension`: \
 Extension associated with the category (default is 'com_content').

---

#### selectOptionInFancySelect

**Command**

Selects an option from a fancy select field in Joomla.

```
Cypress.Commands.add('selectOptionInFancySelect', selectOptionInFancySelect);
```

**Function**

Selects an option from a fancy select field identified by selectId.

```
const selectOptionInFancySelect = (selectId, option) => {...};
```

**Variables**

- `selectId`: \
 ID of the fancy select field.
- `option`: \
 Option to be selected from the fancy select field.
 
---

#### toggleSwitch

**Command**

Toggles a switch field in Joomla.

```
Cypress.Commands.add('toggleSwitch', toggleSwitch);
```

**Function**

Toggles a switch field identified by fieldName to the specified valueName.

```
const toggleSwitch = (fieldName, valueName) => {...};
```

**Variables**

- `fieldName`: \
 Name of the switch field to toggle.
- `valueName`: \
 Value to toggle the switch field to.

---

### User Commands

#### doAdministratorLogin

**Command**

Initiates administrator login process.

```
Cypress.Commands.add('doAdministratorLogin', doAdministratorLogin);
```

**Function**

Performs administrator login with provided credentials or defaults to environment 
variables.

```
const doAdministratorLogin = (user, password, useSnapshot = true) => {...};
```

**Variables**

- `user`: \
Username for login. Defaults to Cypress environment variable if not provided.
- `password`: \
Password for login. Defaults to Cypress environment variable if not provided.
- `useSnapshot`: \
Boolean flag to determine if the session should be cached across specs (default is true).

---

#### doAdministratorLogout

**Command**

Initiates administrator logout process.

```
Cypress.Commands.add('doAdministratorLogout', doAdministratorLogout);
```

**Function**

Logs out from the Joomla administrator interface.

```
const doAdministratorLogout = () => {...};
```

**Variables**

None used.

---

#### doFrontendLogin

**Command**

Initiates frontend login process.

```
Cypress.Commands.add('doFrontendLogin', doFrontendLogin);
```

**Function**

Logs into the Joomla frontend using provided credentials or environment variables.

```
const doFrontendLogin = (user, password, useSnapshot = true) => {...};
```

**Variables**

- `user`: \
Username for login. Defaults to Cypress environment variable if not provided.
- `password`: \
Password for login. Defaults to Cypress environment variable if not provided.
- `useSnapshot`: \
Boolean flag to determine if the session should be cached across specs (default is true).

---

#### doFrontendLogout

**Command**

Initiates frontend logout process.

```
Cypress.Commands.add('doFrontendLogout', doFrontendLogout);
```

**Function**

Logs out from the Joomla frontend.

```
const doFrontendLogout = () => {...};
```

**Variables**

None used.

---

#### createUser

**Command**

Creates a new user in the Joomla administrator interface.

```
Cypress.Commands.add('createUser', createUser);
```

**Function**

Creates a new user with specified details.

```
const createUser = (name, username, password, email, userGroup = 'Super Users') => {...};
```

**Variables**

- `name`: \
Name of the user.
- `username`: \
Username for the new user.
- `password`: \
Password for the new user.
- `email`: \
Email address for the new user.
- `userGroup`: \
User group to assign the new user (default is 'Super Users').

---

## Usage Samples
You can see the usage by sample:
* [joomla-cms](https://github.com/joomla/joomla-cms/tree/5.0-dev/tests/System) – The Joomla System Tests, using e.g.
  `cy.installJoomla`, `cy.doFrontendLogin()` or `cy.clickToolbarButton`
* [manual-examples](https://github.com/joomla/manual-examples) - Testing the Joomla module tutorial sample
  from the development manual, using e.g. `cy.doAdministratorLogin`, `cy.setModulePosition`, `cy.installExtensionFromFileUpload` or 
* [quote_joomla](https://github.com/muhme/quote_joomla/test) – Installation of a Joomla module, using e.g. 
  `cy.installJoomlaMultilingualSite`, `cy.installExtensionFromFolder` or `cy.publishModule` 
