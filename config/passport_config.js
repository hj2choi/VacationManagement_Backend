const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require("passport")
const auth = require("../services/auth.js")

function initialize() {
  passport.use(new LocalStrategy({ usernameField: 'name' }, auth.authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, auth.getUserById(id))
  })
}

module.exports = initialize
