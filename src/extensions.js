const extensionsCommands = () => {

    /**
     * Installs a Extension in Joomla that is located in a folder inside the server
     *
     * @param   String  $path  Path for the Extension
     * @param   string  $type  Type of Extension
     *
     * {@internal doAdminLogin() before}
     *
     * @return    void
     *
     * @since    3.0.0
     * @throws Exception
     */
    public function installExtensionFromFolder($path, $type = 'Extension')
    {
        $this->amOnPage('/administrator/index.php?option=com_installer');
        $this->waitForText('Extensions: Install', '30', ['css' => 'H1']);
        $this->click(['link' => 'Install from Folder']);
        $this->debug('I enter the Path');
        $this->fillField(['id' => 'install_directory'], $path);
        $this->click(['id' => 'installbutton_directory']);
        $this->waitForText('was successful', $this->config['timeout'], ['id' => 'system-message-container']);
        $this->debug("$type successfully installed from $path");
    }

    /**
     * Installs a Extension in Joomla that is located in a url
     *
     * @param   String  $url   Url address to the .zip file
     * @param   string  $type  Type of Extension
     *
     * {@internal doAdminLogin() before}
     *
     * @return    void
     *
     * @since    3.0.0
     * @throws Exception
     */
    public function installExtensionFromUrl($url, $type = 'Extension')
    {
        $this->amOnPage('/administrator/index.php?option=com_installer');
        $this->waitForText('Extensions: Install', '30', ['css' => 'H1']);
        $this->wait(1);
        $this->waitForElementNotVisible(['xpath' => '//joomla-core-loader']);
        $this->click(['link' => 'Install from URL']);
        $this->debug('I enter the url');
        $this->fillField(['id' => 'install_url'], $url);
        $this->click(['id' => 'installbutton_url']);
        $this->waitForText('was successful', '30', ['id' => 'system-message-container']);

        if ($type == 'Extension')
        {
            $this->debug('Extension successfully installed from ' . $url);
        }

        if ($type == 'Plugin')
        {
            $this->debug('Installing plugin was successful.' . $url);
        }

        if ($type == 'Package')
        {
            $this->debug('Installation of the package was successful.' . $url);
        }
    }

    /**
     * Installs a Extension in Joomla using the file upload option
     *
     * @param   string  $file  Path to the file in the _data folder
     * @param   string  $type  Type of Extension
     *
     * {@internal doAdminLogin() before}
     *
     * @return    void
     * @throws Exception
     */
    public function installExtensionFromFileUpload($file, $type = 'Extension')
    {
        $this->amOnPage('/administrator/index.php?option=com_installer');
        $this->waitForText('Extensions: Install', '30', array('css' => 'H1'));
        $this->click(array('link' => 'Upload Package File'));

        $this->debug('I make sure legacy uploader is visible');
        $this->executeJS('document.getElementById("legacy-uploader").style.display="block";');

        $this->debug('I enter the file input');
        $this->attachFile(array('id' => 'install_package'), $file);

        $this->waitForText('was successful', '30', array('id' => 'system-message-container'));

        if ($type == 'Extension')
        {
            $this->debug('Extension successfully installed.');
        }

        if ($type == 'Plugin')
        {
            $this->debug('Installing plugin was successful.');
        }

        if ($type == 'Package')
        {
            $this->debug('Installation of the package was successful.');
        }
    }

    /**
     * Function to Enable a Plugin
     *
     * @param   String  $pluginName  Name of the Plugin
     *
     * @return  void
     *
     * @since   3.0.0
     * @throws Exception
     */
    public function enablePlugin($pluginName)
    {
        $this->amOnPage('/administrator/index.php?option=com_plugins');
        $this->debug('I check for Notices and Warnings');
        $this->checkForPhpNoticesOrWarnings();
        $this->searchForItem($pluginName);
        $this->waitForElement($this->searchResultPluginName($pluginName), 30);
        $this->checkExistenceOf($pluginName);
        $this->click(['xpath' => "//input[@id='cb0']"]);
        $this->click(['xpath' => "//div[@id='toolbar-publish']/button"]);
        $this->waitForText(' enabled', $this->config['timeout'], ['id' => 'system-message-container']);
    }


    /**
     * Uninstall Extension based on a name
     *
     * @param   string  $extensionName  Is important to use a specific
     *
     * @return  void
     *
     * @since   3.0.0
     * @throws Exception
     */
    public function uninstallExtension($extensionName)
    {
        $this->amOnPage('/administrator/index.php?option=com_installer&view=manage');
        $this->waitForText('Extensions: Manage', '30', ['css' => 'H1']);
        $this->searchForItem($extensionName);
        $this->waitForElement(['id' => 'manageList'], '30');
        $this->click(['xpath' => "//input[@id='cb0']"]);
        $this->click(['xpath' => "//joomla-toolbar-button[@id='toolbar-delete']/button"]);
        $this->acceptPopup();
        $this->waitForText('was successful', '30', ['id' => 'system-message-container']);
        $this->see('was successful', ['id' => 'system-message-container']);
        $this->debug('I check for warnings during the uninstall process');
        $this->dontSeeElement(['xpath' => "//joomla-alert[@type='warning']"]);
        $this->searchForItem($extensionName);
        $this->waitForText(
            'No Matching Results',
            $this->config['timeout'],
            ['class' => 'alert-info']
    );
        $this->see('No Matching Results', ['class' => 'alert-info']);
        $this->debug('Extension successfully uninstalled');
    }



    /**
     * Function to install a language through the interface
     *
     * @param   string  $languageName  Name of the language you want to install
     *
     * @return void
     * @throws Exception
     */
    public function installLanguage($languageName)
    {
        $this->amOnPage('administrator/index.php?option=com_installer&view=languages');
        $this->debug('I check for Notices and Warnings');
        $this->checkForPhpNoticesOrWarnings();
        $this->debug('Refreshing languages');
        $this->click(['xpath' => "//div[@id='toolbar-refresh']/button"]);
        $this->waitForElement(['id' => 'j-main-container'], 30);
        $this->searchForItem($languageName);
        $this->waitForElement($this->searchResultLanguageName($languageName), 30);
        $this->click(['id' => "cb0"]);
        $this->click(['xpath' => "//div[@id='toolbar-upload']/button"]);
        $this->waitForText('was successful.', $this->config['timeout'], ['id' => 'system-message-container']);
        $this->see('No Matching Results', ['class' => 'alert-no-items']);
        $this->debug($languageName . ' successfully installed');
    }


    /**
     * Publishes a module on frontend in given position
     *
     * @param   string  $module    The full name of the module
     * @param   string  $position  The template position of a module. Right position by default
     *
     * @return void
     * @throws Exception
     */
    public function setModulePosition($module, $position = 'position-7')
    {
        $this->amOnPage('administrator/index.php?option=com_modules');
        $this->searchForItem($module);
        $this->click(['link' => $module]);
        $this->waitForText("Modules: $module", 30, ['css' => 'h1.page-title']);
        $this->click(['link' => 'Module']);
        $this->waitForElement(['id' => 'general'], 30);
        $this->selectOptionInChosen('Position', $position);
        $this->click(['xpath' => "//div[@id='save-group-children-apply']/button"]);
        $this->waitForText('Module saved', 30, ['id' => 'system-message-container']);
    }

    /**
     * Publishes a module on all frontend pages
     *
     * @param   string  $module  The full name of the module
     *
     * @return  void
     *
     * @since   3.0.0
     * @throws Exception
     */
    public function publishModule($module)
    {
        $this->amOnPage('administrator/index.php?option=com_modules');
        $this->searchForItem($module);
        $this->checkAllResults();
        $this->click(['xpath' => "//div[@id='toolbar-publish']/button"]);
        $this->waitForText(' published.', 30, ['id' => 'system-message-container']);
    }

    /**
     * Changes the module Menu assignment to be shown on all the pages of the website
     *
     * @param   string  $module  The full name of the module
     *
     * @return  void
     *
     * @since   3.0.0
     * @throws Exception
     */
    public function displayModuleOnAllPages($module)
    {
        $this->amOnPage('administrator/index.php?option=com_modules');
        $this->searchForItem($module);
        $this->click(['link' => $module]);
        $this->waitForElement(['link' => 'Menu Assignment'], 30);
        $this->click(['link' => 'Menu Assignment']);
        $this->waitForElement(['id' => 'jform_menus-lbl'], 30);
        $this->click(['id' => 'jform_assignment_chzn']);
        $this->click(['xpath' => "//li[@data-option-array-index='0']"]);
        $this->click(['xpath' => "//div[@id='save-group-children-apply']/button"]);
        $this->waitForText('Module saved', 30, ['id' => 'system-message-container']);
    }
}

module.exports = {
    extensionsCommands
}
