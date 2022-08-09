const registerCommands = () => {
  const { joomlaCommands } = require('joomla-cypress/src/joomla')
  const { extensionsCommands } = require('joomla-cypress/src/extensions')
  const { supportCommands } = require('joomla-cypress/src/support')
  const { userCommands } = require('joomla-cypress/src/user')
  const { commonCommands } = require('joomla-cypress/src/common')

  joomlaCommands()
  extensionsCommands()
  supportCommands()
  userCommands()
  commonCommands()
}

module.exports = {
  registerCommands
}
