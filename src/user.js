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
}

module.exports = {
    userCommands
}
