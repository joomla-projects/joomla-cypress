const userCommands = () => {
    const doAdministratorLogin = (user, password, useSnapshot = true) => {
        // Aint working either...
        // if (!user) user = this.joomlaconfig.username
        // if (!password) password = this.joomlaconfig.password

        // How does snapshotting work in cypress?
        // if ($useSnapshot && $this->loadSessionSnapshot($user))
        // { return; }

        cy.visit('administrator/index.php')
        cy.get('#mod-login-username').type(user)
        cy.get('#mod-login-password').type(password)
        cy.get('#btn-login-submit').click()
        cy.get('h1.page-title').should('contain', 'Home Dashboard')

        // How does snapshotting work in cypress?
        // if ($useSnapshot) {$this->saveSessionSnapshot($user);}
    }

    Cypress.Commands.add('doAdministratorLogin', doAdministratorLogin)

    const doAdministratorLogout = () => {
        cy.get('.header-item .header-profile > .dropdown-toggle').click()
        cy.get('.header-item .header-profile a.dropdown-item:last-child').click()
        cy.get('#mod-login-username').should('exist')
    }

    Cypress.Commands.add('doAdministratorLogout', doAdministratorLogout)

    const doFrontendLogin = (user, password) => {
        // Aint working either...
        // if (!user) user = this.joomlaconfig.username
        // if (!password) password = this.joomlaconfig.password

        cy.visit('index.php?option=com_users&view=login')
        cy.get('#username').type(user)
        cy.get('#password').type(password)
        cy.get('.com-users-login__form button[type=submit]').click()
        cy.get('.mod-login-logout button[type=submit]').should('exist').should('contain', 'Log out')
    }

    Cypress.Commands.add('doFrontendLogin', doFrontendLogin)

    const doFrontendLogout = () => {
        // Aint working either...
        // if (!user) user = this.joomlaconfig.username
        // if (!password) password = this.joomlaconfig.password

        cy.visit('index.php?option=com_users&view=login')
        cy.get('.com-users-logout__form button[type=submit]').should('contain', 'Log out').click()
    }

    Cypress.Commands.add('doFrontendLogout', doFrontendLogout)

    const createUser = (name, username, password, email, userGroup = 'Super Users') => {
        cy.visit('administrator/index.php?option=com_users')

        cy.get('h1.page-title').should('contain.text', 'Users')

        cy.checkForPhpNoticesOrWarnings()

        cy.intercept('administrator/index.php?option=com_users&view=user').as('useredit')
        cy.clickToolbarButton('New')
        cy.wait('@useredit')

        cy.checkForPhpNoticesOrWarnings()

        cy.contains('button', 'Account Details').click()
        cy.get('#jform_name').clear().type(name)
        cy.get('#jform_username').clear().type(username)
        cy.get('#jform_email').clear().type(email)
        cy.get('#jform_password').clear().type(password)
        cy.get('#jform_password2').clear().type(password)

        if (!userGroup)
        {
            cy.contains('button', 'Assigned User Groups').click()
            cy.contains('#groups label', userGroup).click()
        }

        cy.intercept('administrator/index.php?option=com_users&view=user').as('useredit2')
        cy.clickToolbarButton('save')
        cy.wait('@useredit2')

        cy.get('#system-message-container').contains('User saved').should('exist')
        cy.checkForPhpNoticesOrWarnings()
    }

    Cypress.Commands.add('createUser', createUser)
}

module.exports = {
    userCommands
}
