const bcrypt = require("bcrypt")
const config = require("../config/config")
const Account = require("../models/account")
const Vacation = require("../models/vacation")
const dateManager = require("./date")

class AccountManager {
  constructor() {
  }

  async registerUser(req) {
    try {
      if (await this.getUserByName(req.body.name)) {
        console.log("registerUser(): username already exists")
        return false
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10); // await: causes async function execution to pause until a Promise is settled.
      const account = new Account({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        remaining_vacation: config.YEARLY_VACATION_DAYS
      })
      const newAccount = await account.save()
      //console.log(newAccount)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async authenticateUser(name, password, done) {
    try {
      var user = await Account.findOne({name:name}).exec()//users.find(user => user.name === name)
      if (user == null) {
        return done(null, false, { message: 'No user with that name' })
      }

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      console.log(e)
      return done("error") // Don't pass exact error message for security concern.
    }
  }

  async getUserById(id) {
    try {
      return await Account.findById(id).exec()
    } catch {
      return null
    }
  }

  async getUserByName(name) {
    try {
      return await Account.findOne({name:name}).exec()
    }
    catch {
      return null
    }
  }

  async decrementRemainingVacation(userid, days) {
    try {
      if (await Account.findOneAndUpdate({_id: userid, remaining_vacation: {$gte: days} }, {$inc: {remaining_vacation: -days}})) {
        return true
      }
      return false
    } catch {
      return false
    }

  }

  async incrementRemainingVacation(userid, days) {
    try {
      await Account.findOneAndUpdate({_id: userid}, {$inc: {remaining_vacation: days}})
      return true
    } catch {
      return false
    }
  }

  async getAllUsers() {
    try {
      return await Account.find({}).exec()
    } catch {
      return []
    }
  }

  async getUsersCurrentlyOnVacation() {
    try {
      const today_vacations = await Vacation.find({startdate: {
                                                $gte: dateManager.getEndOfYesterday(),
                                                $lte: dateManager.getEndOfToday()
                                              }
                                            }).select("account").exec()
      var query_ids = []
      for (var i = 0; i < today_vacations.length; ++i) {
        query_ids.push(today_vacations[i].account)
      }
      return await Account.find({"_id": { $in: query_ids}}).select("name")
    } catch (e) {
      console.log(e)
      return []
    }
  }

  // Batch processing
  async resetAllUserRemainingVacation() {
    try {
      await Account.updateMany({}, {remaining_vacation: config.YEARLY_VACATION_DAYS})
    } catch {
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
