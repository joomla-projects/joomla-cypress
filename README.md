# Joomla Cypress

<!-- prettier-ignore-start -->
[![version][version-badge]][package]
<!-- prettier-ignore-end -->

This is a support package that helps in writing end-to-end tests for the [Joomla CMS](https://joomla.org) and its extensions with the frontend testing tool [Cypress](/https://www.cypress.io/).
The Joomla default branch and all active development [branches](https://github.com/joomla/joomla-cms/branches) are supported.

Instructions for testing the package are provided and documented in the
[cypress](https://github.com/joomla-projects/joomla-cypress/cypress) sub-folder.
The test suite also shows the use of the Cypress custom commands.

## Installation

`joomla-cypress` is distributed with [npm](https://npmjs.com/) and works with the latest version of Cypress.
It should be installed as one of your project's `devDependencies`:
```
npm install --save-dev @testing-library/joomla-cypress
```

## Usage

To import and load the additional Cypress custom commands you will typically extend the `cypress/support/index.js` file:
```
// Add attachFile() command, which is used in installExtensionFromFileUpload()
import 'cypress-file-upload';

// Register Joomla Cypress custom commands from npm module 'joomla-cypress'
import { registerCommands } from "joomla-cypress";
registerCommands();
```

## Cypress Custom Commands for Joomla

The Cypress API is extended with [custom commands](https://docs.cypress.io/api/cypress-api/custom-commands).
As Cypress custom commands, all `joomla-cypress` extended commands return an `Cypress.Chainable`.

The target Joomla installation requires the language `en-GB` for the used Joomla administrator user.

All added commands use Cypress logging, with messages formatted in bold type at the beginning and
double hyphens at the end.
These log messages can be observed when running the Cypress GUI.
This consistent logging format helps to easily identify the steps and
status of the custom commands during test execution. For example:

**Install an extension from file upload**<br />
...<br />
--Install an extension from file upload--

The Cypress custom commands for Joomla are grouped into the following categories:
* User Commands
* Joomla Commands
* Extensions Commands
* Support Commands
* Common Commands

:point_right: If you would like to see the complete list of custom commands as overview,
on GitHub you can use the TOC button at the top right of the README.

### User Commands

#### `doAdministratorLogin`

The command `doAdministratorLogin` initiates the administrator login process for the backend.
It performs the administrator login with the specified login information or with the Cypress environment variables.
The user must be a member of the 'Manager', 'Administrator' or 'Super Users' group to be able to log in to the backend.

By default, a [Cypress session](https://docs.cypress.io/api/commands/session) is used
to cache and restore session data for this user's backend login across Cypress test specs.
This speeds up the entire test suite.

See also [doAdministratorLogout](#doadministratorlogout) and [doFrontendLogin](#dofrontendlogin).

##### Usage

```javascript
cy.doAdministratorLogin(user, password, useSnapshot)
```

##### Arguments

- **`user`** *(string, optional, default: `Cypress.env('username')`)*: The username for logging in.
- **`password`** *(string, optional, default: `Cypress.env('password')`)*: The password for logging in.
- **`useSnapshot`** *(boolean, optional, default: `true`)*:
  Boolean flag to determine if this users backend login session should be cached across specs.

##### Example

```javascript
// Admin login without saving the session
cy.doAdministratorLogin("admin-user", "admin-user-password", false);
```

---

#### `doAdministratorLogout`

The command `doAdministratorLogout` initiates user logout process from the backend.
All session data (both backend and frontend, for all users) is being cleaned up.
A user must be logged into the backend.

See also [doAdministratorLogin](#doadministratorlogin).

##### Usage

```javascript
cy.doAdministratorLogout()
```

##### Example

```javascript
// Do explicit logout to start with new login
cy.doAdministratorLogout();
// Check login action log
cy.doAdministratorLogin("admin-user", "admin-user-password")
  .visit('/administrator/index.php?option=com_actionlogs&view=actionlogs')
  .contains('User admin-user logged in to admin');
```

---

#### `doFrontendLogin`

The command `doFrontendLogin` initiates a user login to the frontend.
It performs the user login with the specified login information or with the Cypress environment variables.
The user must belong to a user group that has the necessary permissions to access the frontend.

By default, [Cypress session](https://docs.cypress.io/api/commands/session) is used
to cache and restore session data for this users frontend login across Cypress test specs.
This speeds up the entire test suite.

See also [doFrontendLogout](#dofrontendlogout) and [doAdministratorLogin](#doadministratorlogin).

##### Usage

```javascript
cy.doFrontendLogin(user, password, useSnapshot)
```

##### Arguments

- **`user`** *(string, optional, default: `Cypress.env('username')`)*: The user name for logging in.
- **`password`** *(string, optional, default: `Cypress.env('password')`)*: The password for logging in.
- **`useSnapshot`** *(boolean, optional, default: `true`)*:
  Boolean flag to determine if this users frontend login session should be cached across specs.

##### Example

```javascript
// Checks the welcome message with the user's name
cy.doFrontendLogin()
  .visit("/")
  .contains(`Hi ${Cypress.env('name')}`).should('be.visible');
```

---

#### `doFrontendLogout`

The command `doFrontendLogout` initiates frontend logout process.
All session data (both backend and frontend, for all users) is being cleaned up.
A user must be logged into the frontend.

See also [doFrontendLogin](#dofrontendlogin).

##### Usage

```javascript
cy.doFrontendLogin()
```

##### Example

```javascript
// Can log in and out with the default credentials
cy.doFrontendLogin(null, null, false)
  .doFrontendLogout();
```

---

#### `createUser`

The command `createUser` creates a new user entry in Joomla.
If the user name already exists, the creation will fail.
The user entry is activated after creation.

##### Usage

```javascript
cy.createUser(name, username, password, email, userGroup)
```

##### Arguments

- **`name`** *(string)*: The full name of the user.
- **`username`** *(string)*: The name the user will log in as.
- **`password`** *(string)*: The user's password.
- **`email`** *(string)*: The user's email address.
- **`userGroup`** *(string, optional, default: 'Super Users')*: The user group that is assigned to the new user entry.

##### Example

```javascript
cy.doAdministratorLogin()
  .createUser("Alice in Wonderland", "alice", "CheshireSmile", "alice@in.wonderland");
```

---

### Joomla Commands

#### `installJoomla`

After Joomla download, the command `installJoomla` runs all 'Joomla Installer' steps
to install a Joomla instance on a web server.
The installed language pack 'en-GB' is English (United Kingdom).
After the command, the 'Joomla Installer' screen remains open in the session.

:warning: The `/installation` folder is not deleted after the installation.
This allows multiple runs of the command `installJoomla`.
For production sites the `/installation` folder needs to be deleted after installation.

See also [installJoomlaMultilingualSite](#installjoomlamultilingualsite).

##### Usage

```javascript
cy.installJoomla(config)
```

##### Arguments

- **`config`** *(object)*: Configuration object containing sitename, name, username, password, email,
  db_type, db_host, db_port, db_user, db_password, db_name and db_prefix.

:point_right: The use of `db_port` for a non-standard database port currently (August 2024) only works for MariaDB and MySQL.

##### Example

```javascript
const config = {
     sitename: "Sample Joomla Site",
         name: "Joomla Administrator",
     username: "admin",
     password: "admin-password",
        email: "sampleuser@example.com",
      db_type: "MySQLi",
      db_host: "localhost",
      db_port: "3316"
      db_user: "joomla",
  db_password: "joomla-db-user-password",
      db_name: "sample_joomla",
    db_prefix: "sjs_"
}
cy.installJoomla(config);
```

---

#### `installJoomlaMultilingualSite`

The command `installJoomlaMultilingualSite` first runs the [installJoomla](#installjoomla) command
and continues the 'Joomla Installer' with installation of additional languages.

The `/installation` folder is deleted after the installation.
It is verified that the URL path '/installation' receives an error 404 – Not Found.
This command can only run once.

See also [installJoomla](#installjoomla).

##### Usage

```javascript
cy.installJoomlaMultilingualSite(config, languages)
```

##### Arguments

- **`config`** *(object)*: Configuration object containing sitename, name, username, password, email,
  db_type, db_host, db_port, db_user, db_password, db_name and db_prefix.
- **`languages`** *(string[], optional, default: ["French"])*: Array of additional languages to be installed.

:point_right: The use of `db_port` for a non-standard database port currently (August 2024) only works for MariaDB and MySQL.

##### Example

```javascript
const config = {
     sitename: "Sample Joomla Site",
         name: "Joomla Administrator",
     username: "admin",
     password: "admin-password",
        email: "sampleuser@example.com",
      db_type: "MySQLi",
      db_host: "localhost",
      db_port: "3316",
      db_user: "joomla",
  db_password: "joomla-db-user-password",
      db_name: "sample_joomla",
    db_prefix: "sjs_"
}
const languages = ["German", "Japanese", "Spanish", "Ukrainian"];
cy.installJoomlaMultilingualSite(config, languages);
```

---

<img src="https://raw.githubusercontent.com/joomla-projects/joomla-cypress/main/images/cancelTour.png" alt="'Welcome to Joomla!' guided tour overlay window" align="right" width="300" />

#### `cancelTour`

With Joomla 5.1 the 'Welcome to Joomla!' guided tour starts automatically the very first time an user logs in to the Administrator backend. As this overlay window (see screenshot) blocks interaction with the underlying content, it must be closed. The overlay of the guided tour is closed with the `cancelTour` command.

In Joomla 5.1 the overlay window is closed with the cancel `X`-button. Since Joomla 5.2 there is an additional button `Hide Forever`. This is preferably used.

A Joomla administrator must be logged in for this. This command can only be executed once after a Joomla installation and only from version 5.1 upwards.

##### Usage

```javascript
cy.cancelTour()
```

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.cancelTour();
```

---

#### `disableStatistics`

To remove the system message container 'Enable Joomla Statistics?' from the backend home dashboard
the command `disableStatistics` deactivates the plugin 'System - Joomla! Statistics'.
This command can be executed multiple times without causing issues.
The Joomla administrator must be logged in to do this.

##### Usage

```javascript
cy.disableStatistics()
```

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.disableStatistics();
```

---

#### `setErrorReportingToDevelopment`

The command `setErrorReportingToDevelopment` sets 'Error Reporting' on the 'Server' tab in the Joomla 'Global Configuration'
to 'Maximum'.
This command can be executed multiple times without causing issues.
The Joomla administrator must be logged in to do this.

See also [checkForPhpNoticesOrWarnings](#checkforphpnoticesorwarnings).

##### Usage

```javascript
cy.setErrorReportingToDevelopment()
```

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.setErrorReportingToDevelopment();
```

---

### Extensions Commands

#### `installExtensionFromFolder`

The command `installExtensionFromFolder` installs an extension in Joomla from a folder on the server.
It navigates to the Joomla extension installer page, selects 'Install from Folder',
fills in the path to the folder and completes the installation.
The Joomla administrator must be logged in to do this.

##### Usage

```javascript
cy.installExtensionFromFolder(path, type)
```

##### Arguments

- **`path`** *(string, required)*: The path to the folder containing the extension.
- **`type`** *(string, optional, default: 'Extension')*: The type of the extension.

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.installExtensionFromFolder("/joomla-module/src"); // as mounted in docker image
```

---

#### `installExtensionFromUrl`

The command `installExtensionFromUrl` installs an extension in Joomla from the given URL.
It navigates to the Joomla extension installer page, selects 'Install from URL',
fills in URL and completes the installation.
The Joomla administrator must be logged in to do this.

##### Usage

```javascript
cy.installExtensionFromUrl(url, type)
```

##### Arguments

- **`url`** *(string, required)*: The URL where the extension can be downloaded.
- **`type`** *(string, optional, default: 'Extension')*: The type of the extension.

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.installExtensionFromUrl("https://server.org/download/joomla-module.zip");
```

---

#### `installExtensionFromFileUpload`

The command `installExtensionFromFileUpload` installs an extension in Joomla from the specified package file
in the Cypress Test Runner (web browser) environment.
It navigates to the Joomla extension installer page, selects 'Upload Package File',
fills the path to the file and completes the installation.
The Joomla administrator must be logged in to do this.
It is based on the custom command `attachFile` from the `cypress-file-upload` module.

##### Usage

```javascript
cy.installExtensionFromFileUpload(file, type)
```

##### Arguments

- **`file`** *(string, required)*: The path to the package file.
- **`type`** *(string, optional, default: 'Extension')*: The type of the extension.

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.installExtensionFromFileUpload("manual-examples.zip");
```

---

#### `uninstallExtension`

The command `uninstallExtension` removed an installed extension from Joomla.
It ensures that there are no warning messages after deletion and
checks afterwards that the extension no longer exists.
The Joomla administrator must be logged in to do this.

##### Usage

```javascript
cy.uninstallExtension(extensionName)
```

##### Arguments

- **`extensionName`** *(string)*: The name of the extension.

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.uninstallExtension("Joomla module tutorial");
```

---

#### `installLanguage`

The command `installLanguage` installs a language pack in Joomla.
The Joomla administrator must be logged in to do this.
If the language pack is already installed, a reinstall is executed.

##### Usage

```javascript
cy.installLanguage(languageName)
```

##### Arguments

- **`languageName`** *(string)*: Language name or language tag.

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
// Install German for Switzerland with language tag
cy.installLanguage("de-CH");
// or install with language name
// cy.installLanguage("German, Switzerland");
```

---

#### `enablePlugin`

The command `enablePlugin` activates a Joomla plugin so that is becomes operational.
If the specified plugin is already activated, the command will fail.
The Joomla administrator must be logged in to do this.

##### Usage

```javascript
cy.enablePlugin(pluginName)
```

##### Arguments

- **`pluginName`** *(string)*: The plugin name.

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.enablePlugin("Authentication - LDAP");
```

---

#### `setModulePosition`

The command `setModulePosition` sets a module display position within a Joomla template.
The Joomla administrator must be logged in to do this.

##### Usage

```javascript
cy.setModulePosition(module, position)
```

##### Arguments

- **`module`** *(string)*: The module name.
- **`position`** *(string, optional, default: 'position-7')*: The display position.

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.setModulePosition("module-name", "sidebar-right");
```

---

#### `publishModule`

The command `publishModule` makes the module active and visible on the Joomla website.
It navigates to the Joomla modules list, selects the module and sets the status to Published. 
It does not matter whether the module has already been published,
as the module found is initially set to the status Unpublished.
The Joomla administrator must be logged in to do this.

##### Usage

```javascript
cy.publishModule(module)
```

##### Arguments

- **`module`** *(string)*: The module name.

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.publishModule("Breadcrumbs");
```

---

#### `displayModuleOnAllPages`

The command `displayModuleOnAllPages` sets the menu assignment for the specified module for all pages in Joomla.
The Joomla administrator must be logged in to do this.

##### Usage

```javascript
cy.displayModuleOnAllPages(module)
```

##### Arguments

- **`module`** *(string)*: The module name.

##### Example

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.displayModuleOnAllPages("Login Form");
```

---

### Support Commands

#### `clickToolbarButton`

The command `clickToolbarButton` clicks on a Joomla backend button by using an internal mapping table.
For example the button 'Enable' is mapped to click on CSS selector `#toolbar-publish button'.
For the button 'transition' it is possible to give an additional subselector string.

##### Usage

```javascript
cy.clickToolbarButton(button, subselector)
```

##### Arguments

- **`button`** *(string)*: Name of the button to be clicked (case insensitive).
- **`subselector`** *(string, optional, default: null)*: Optional subselector for more specific targeting within the button.

##### Example

```javascript
cy.clickToolbarButton('Save & Close');
```

---

#### `checkForPhpNoticesOrWarnings`

The command `checkForPhpNoticesOrWarnings` checks for PHP notices and warnings in the HTML page source.
It looks for keywords such as 'Deprecated' in bold followed by a colon.
If such a styled keyword is found, the Cypress test fails with the PHP problem message.
Looking for:
* **Warning**:
* **Deprecated**:
* **Notice**:
* **Strict standards**:

To make the PHP notes and warnings visible,
the command [setErrorReportingToDevelopment](#seterrorreportingrodevelopment)
needs to be executed once beforehand.

:point_right: This command could be used in Cypress `afterEach()` to run after each test block.

See also [setErrorReportingToDevelopment](#seterrorreportingtodevelopment).

##### Usage

```javascript
cy.checkForPhpNoticesOrWarnings()
```

##### Example

```javascript
cy.checkForPhpNoticesOrWarnings();
```

---

#### `checkForSystemMessage`

The command `checkForSystemMessage` checks that a Joomla system message exists,
is visible and contains a specific text.

##### Usage

```javascript
cy.checkForSystemMessage(contain)
```

##### Arguments

- **`contain`** *(string)*: The substring that must be included in the system message.

##### Example

This command is used, for example, in the command [installExtensionFromFolder](#installextensionfromfolder)
to check if the installation of the extension was successful
by checking if there is a system message containing "was successful".

```javascript
cy.checkForSystemMessage('was successful');
```

---

#### `searchForItem`

The command `searchForItem` searches for a specific name in a Joomla list and
clicks on the checkbox at the beginning of the corresponding list entry.
As a prerequisite, the list must be open.
The search field is used to avoid paging.
The list entry being searched for is selected as the result.

##### Usage

```javascript
cy.searchForItem(name)
```

##### Arguments

- **`name`** *(string, optional, default: null)*: Name of the item to search for.

##### Example

This command is used, for example, in the [enablePlugin](#enableplugin) command
to select the plugin to be enabled.

```javascript
cy.doAdministratorLogin("admin-user", "admin-user-password");
cy.visit('/administrator/index.php?option=com_plugins');
cy.searchForItem(pluginName);
```

---

#### `setFilter`

The command `setFilter` sets a filter on the list view in Joomla.

##### Usage

```javascript
cy.setFilter(name, value)
```

##### Arguments

- **`name`** *(string)*: Name of the filter to set.
- **`value`** *(string)*: Value to set for the filter.

##### Example

In the following example, the list of user entries is filtered to "State: Activated":

```javascript
// Using 'username' and 'password' from Cypress.env()
cy.doAdministratorLogin()
  // Open user list
  .visit('/administrator/index.php?option=com_users')
  // Only enabled user entries
  .setFilter('state', 'Enabled');
```

---

#### `checkAllResults`

Joomla list views are page by page.
The command `checkAllResults` displays all list entries in one page by marking 'All' entries in the Joomla list view.
As a prerequisite, the list must be open.

##### Usage

```javascript
cy.checkAllResults()
```

##### Example

```javascript
// Show all extensions in one single page:
cy.doAdministratorLogin
  .visit('/administrator/index.php?option=com_installer&view=manage')
  .checkAllResults();
```

---

#### `createMenuItem`

The command `createMenuItem` creates a new menu item in Joomla.

The Language parameter is only used if the Joomla website is set up multingual.
This means that at least one additional language must be installed and the
"System - Language Filter" plugin must be activated.
Otherwise, the language selection is ignored.
For the `language` parameter the language name (e.g. "Japanese (Japan)") or the language tag (e.g. "ja-JP") can be used.
Default is "All".

##### Usage

```javascript
cy.createMenuItem(menuTitle, menuCategory, menuItem, menu, language)
```

##### Arguments

- **`menuTitle`** *(string)*: The title of the new menu item.
- **`menuCategory`** *(string)*: The category of the menu item.
- **`menuItem`** *(string)*: The type of the menu item.
- **`menu`** *(string, optional, default: 'Main Menu')*: The menu where the item will be created.
- **`language`** *(string, optional, default: 'All')*: The language for the menu item.

##### Example

The following code creates a menu entry 'Spotlight Story' for featured articles as a Japanese menu entry,
for the Japanese language and in the Japanese menu.
```javascript
// Create Japanese menu item 'Spotlight Stories'
cy.doAdministratorLogin("admin-user", "admin-user-password");
  .createMenuItem('スポットライト・ストーリー', 'Articles', 'Featured Articles', 'Menu 日本語', 'ja-JP');
```

---

#### `createCategory`

The command `createCategory`creates a new category in Joomla with the specified title.
Categories can be created to organise:
* Content articles – extension 'com_content',
* News feeds – extension 'com_newsfeeds',
* Banners – extension 'com_banners' or
* Contacts – extension 'com_contact'.

If the category with the specified title and extension already exists, the command will fail.

##### Usage

```javascript
cy.createCategory(title, extension)
```

##### Arguments

- **`title`** *(string)*: The title of the new category.
- **`extension`** *(string, optional, default: 'com_content')*: The content type of the category.

##### Example

```javascript
// Create Monday banners category
cy.doAdministratorLogin()
  .createCategory("Monday Banners", "com_banners");
```

---

#### `selectOptionInFancySelect`

The command `selectOptionInFancySelect` selects an option from a fancy select field in Joomla.

##### Usage

```javascript
cy.selectOptionInFancySelect(selectId, option)
```

##### Arguments

- **`selectId`** *(string)*: The CSS ID of the fancy select field.
- **`option`** *(string)*: The option to be selected from the fancy select field.

##### Example

<!-- muhme, 20 July 2024: untested as no use case was found -->
```javascript
cy.selectOptionInFancySelect("#jform_countries", "Germany");
```

---

#### `toggleSwitch`

The command `toggleSwitch` toggles a switch field in Joomla identified by fieldName to the specified value name.

##### Usage

```javascript
cy.toggleSwitch(fieldName, valueName)
```

##### Arguments

- **`fieldName`** *(string)*: The name of the switch field to toggle.
- **`valueName`** *(string)*: The value to toggle the switch field to.

##### Example

<!-- muhme, 20 July 2024: untested as no use case was found -->
```javascript
cy.toggleSwitch("Published", "Yes");
```

---

### Common Commands

#### `iframe`

The command `iframe` works with iframe elements.
It waits for the iframe to be fully loaded and resolves with the iframe's body content,
allowing to interact with elements inside the iframe seamlessly.

##### Usage

```javascript
cy.get('iframe').iframe()
```

##### Example

```javascript
cy.get('iframe').iframe().then($body => {
  // You can now interact with the iframe's body as a Cypress element
  cy.wrap($body).find('selector-within-iframe').click();
});
```

---

## Usage Examples from the Field
You can see the practical use in various projects:
* [joomla-cms](https://github.com/joomla/joomla-cms//blob/HEAD/tests/System) see folder `tests/System` –
   The Joomla System Tests, using e.g.
  `cy.installJoomla`, `cy.doFrontendLogin` or `cy.clickToolbarButton`
* [manual-examples](https://github.com/joomla/manual-examples) see folder `tests` - Testing the Joomla module
  tutorial sample from the development manual, using e.g. `cy.doAdministratorLogin`, `cy.setModulePosition` or
  `cy.installExtensionFromFileUpload` 
* [quote_joomla](https://github.com/muhme/quote_joomla/tree/main/test) – Installation of a Joomla module, using e.g. 
  `cy.installJoomlaMultilingualSite`, `cy.installExtensionFromFolder` or `cy.publishModule` 

<!-- prettier-ignore-start -->
[version-badge]: https://img.shields.io/npm/v/joomla-cypress
[package]: https://www.npmjs.com/package/joomla-cypress
<!-- prettier-ignore-end -->
