const userCommands = () => {

  // Do administrator login
  const doAdministratorLogin = (user, password, useSnapshot = true) => {
    cy.log('**Do administrator login**')
    cy.log('User: ' + user)
    cy.log('Password: ' + password)

    cy.visit('administrator/index.php')
    cy.get('#mod-login-username').type(user)
    cy.get('#mod-login-password').type(password)
    cy.get('#btn-login-submit').click()
    cy.get('h1.page-title').should('contain', 'Home Dashboard')

    cy.log('--Do administrator login--')
  }

  Cypress.Commands.add('doAdministratorLogin', doAdministratorLogin)


  // Do administrator logout
  const doAdministratorLogout = () => {
    cy.log('**Do administrator logout**')

    cy.get('.header-item .header-profile > .dropdown-toggle').click()
    cy.get('.header-item .header-profile a.dropdown-item:last-child').click()
    cy.get('#mod-login-username').should('exist')

    cy.log('--Do administrator logout--')
  }

  Cypress.Commands.add('doAdministratorLogout', doAdministratorLogout)


  // Do frontend login
  const doFrontendLogin = (user, password) => {
    cy.log('**Do frontend login**')
    cy.log('User: ' + user)
    cy.log('Password: ' + password)

    cy.visit('index.php?option=com_users&view=login')
    cy.get('#username').type(user)
    cy.get('#password').type(password)
    cy.get('.com-users-login__form button[type=submit]').click()
    cy.get('.mod-login-logout button[type=submit]').should('exist').should('contain', 'Log out')

    cy.log('--Do frontend login--')
  }

  Cypress.Commands.add('doFrontendLogin', doFrontendLogin)


  // Do frontend logout
  const doFrontendLogout = () => {
    cy.log('**Do frontend logout**')

    cy.visit('index.php?option=com_users&view=login')
    cy.get('.com-users-logout__form button[type=submit]').should('contain', 'Log out').click()

    cy.log('--Do frontend logout--')
  }

  Cypress.Commands.add('doFrontendLogout', doFrontendLogout)


  // Create a user
  const createUser = (name, username, password, email, userGroup = 'Super Users') => {
    cy.log('**Create a user**')
    cy.log('Name: ' + name)
    cy.log('Username: ' + username)
    cy.log('Password: ' + password)
    cy.log('Email: ' + email)
    cy.log('Usergroup: ' + userGroup)

    cy.visit('administrator/index.php?option=com_users')

    cy.get('h1.page-title').should('contain.text', 'Users')

    cy.clickToolbarButton('New')
    cy.contains('button', 'Account Details').click()
    cy.get('#jform_name').clear().type(name)
    cy.get('#jform_username').clear().type(username)
    cy.get('#jform_email').clear().type(email)
    cy.get('#jform_password').clear().type(password)
    cy.get('#jform_password2').clear().type(password)

    cy.contains('button', 'Assigned User Groups').click()
    cy.contains('#groups label', userGroup).click()
    cy.clickToolbarButton('save & close')

    cy.get('#system-message-container').contains('User saved').should('exist')
    cy.log('--Create a user--')
  }

  Cypress.Commands.add('createUser', createUser)
}

module.exports = {
  userCommands
}
