const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require("passport")
const accountManager = require("../services/account.js")

function initialize() {
  passport.use(new LocalStrategy({ usernameField: 'name' }, accountManager.authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    return done(null, await accountManager.getUserById(id))
  })
}

module.exports = initialize
