bcrypt = require("bcrypt")

users = []

class AuthService {
  constructor() {
  }

  async registerUser(req) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // await: causes async function execution to pause until a Promise is settled.
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        remaining_vacation: 15
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async authenticateUser(name, password, done) {
    var user = users.find(user => user.name === name)
    if (user == null) {
      return done(null, false, { message: 'No user with that name' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done("error") // Don't pass exact error message for security concern.
    }
  }

  getUserById(id) {
    return users.find(user => user.id === id)
  }

  redirectOnAuthFail(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }

  redirectOnAuthSuccess(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
}

module.exports = new AuthService()
