const bcrypt = require("bcrypt")
const config = require("../config/config")
const Account = require("../models/account")

const users = []

class AccountManager {
  constructor() {
  }

  async registerUser(req) {
    if (this.getUserByName(req.body.name)) {
      console.log("registerUser(): username already exists")
      return false
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // await: causes async function execution to pause until a Promise is settled.
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        remaining_vacation: config.YEARLY_VACATION_DAYS
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

  getUserByName(name) {
    return users.find(user => user.name === name)
  }

  decrementRemainingVacation(user, days) {
    if (user.remaining_vacation < days) {
      return false
    }
    else {
      user.remaining_vacation -= days
      return true
    }
  }

  incrementRemainingVacation(user, days) {
    user.remaining_vacation += days
    return true
  }

  getAllUsers() {
    return users
  }

  // Batch processing
  resetAllUserRemainingVacation() {
    for (var i = 0; i < users.length; ++i) {
      users[i].remaining_vacation = config.YEARLY_VACATION_DAYS
    }
  }

  //@TODO: MVC의 Model 파트에서 res object를 직접 처리하는건 좋은 디자인이 아닙니다.
  //       auth_middleware.js 등 파일을 새로 만들거나 controller로 옮기는 등, 다른 방법을 찾아야함.
  //middleware for checking if user is logged in
  /*redirectOnAuthFail(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
  //middleware for checking if user isn't logged in yet
  redirectOnAuthSuccess(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }*/
}

module.exports = new AccountManager()
