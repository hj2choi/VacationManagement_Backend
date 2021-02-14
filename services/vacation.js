const accountManager = require("./account")
const dateManager = require("./date")
const config = require("../config/config")
const Account = require("../models/account")
const Vacation = require("../models/vacation")

class VacationManager {
  constructor() {
  }

  _toDateISOString(dateobj) {
    return dateobj.toISOString().split("T")[0]
  }

  async applyVacation(user, req) {
    //@TODO: remove this large unpretty try-catch block, and handle it from controller or something.
    try {
      var mode = req.body.mode
      var startdate = req.body.startdate
      var startdatemillis = (new Date(req.body.startdate)).getTime()
      var days = req.body.days
      var comment = req.body.comment
      var username = user.name
      var userid = user.id

      // check if user exists
      if (!user) {
        console.log("applyVacation(): user doesn't exist")
        return false
      }

      // check for start date.
      if (startdatemillis - dateManager.getAdjustedTimeMillis() < 0 &&
          req.body.startdate !== dateManager.todayISOString()) {
        console.log("applyVacation(): invalid vacation start date")
        return false;
      }

      // check for vacation mode and adjust days accordingly
      if (mode === "quarter") {
        days = 0.25
      } else if (mode === "half") {
        days = 0.5
      } else if (mode === "full") {
        days = Math.floor(days)
      } else {
        console.log("applyVacation(): invalid vacation mode")
        return false
      }

      // check for overlapping dates. @TODO optimize this routine
      var existing_vacations = await this.getAllVacations(userid)
      for (var i = 0; i < existing_vacations.length; ++i) {
        var existingdate_obj = new Date(existing_vacations[i].startdate)//new Date(Date.parse(existing_vacations[i].startdate))
        for (var j = 0; j < Math.ceil(existing_vacations[i].days); ++j) {
          var startdate_obj = new Date(Date.parse(startdate))
          for (var k = 0; k < Math.ceil(days); ++k) {
            //console.log(toisostring(startdate_obj)+" vs "+toisostring(existingdate_obj))
            if (this._toDateISOString(startdate_obj) === this._toDateISOString(existingdate_obj)) {
              console.log("applyVacation(): overlapping vacation dates")
              return false;
            }
            startdate_obj.setDate(startdate_obj.getDate()+1)
          }
          existingdate_obj.setDate(existingdate_obj.getDate()+1)
        }
      }

      // after validating every single fields, update user information and add new vacation to database.
      if (await accountManager.decrementRemainingVacation(userid, days)) {
        const vacation = new Vacation({
          account: userid,
          mode: mode,
          startdate: new Date(startdate),
          days: days,
          comment: comment
        })
        const newVacation = await vacation.save()
        return true
      }
      console.log("applyVacation(): not enough remaining vacation dates")
      return false
    } catch {
      return false
    }
  }

  async cancelVacation(user, req) {
    //@TODO: remove this large unpretty try-catch block, and handle it from controller or something.
    try {
      var id = req.body.id
      var username = user.name
      var userid = user.id

      // check if user exists
      if (!user) {
        console.log("applyVacation(): user doesn't exist")
        return false
      }

      // remove vacation with requested id
      const vacation = await this.getVacationById(id)
      if (!vacation) {
        console.log("cancelVacation(): cannot find requested vacation")
        return false
      }

      // authentication check
      if (vacation.account.toString() !== userid) {
        console.log("cancelVacation(): authentication failed")
        return false
      }

      // cannot remove vacation that's already started
      if (this._toDateISOString(vacation.startdate) === dateManager.todayISOString()) {
        console.log("cancelVacation(): cannot cancel vacation that's already started")
        return false
      }

      await accountManager.incrementRemainingVacation(userid, vacation.days)
      await Vacation.findByIdAndDelete(vacation.id).exec()
      return true

    } catch (e) {
      console.log(e)
      return false
    }
  }

  async getVacationById(id) {
    try {
      return await Vacation.findById(id).exec()
    } catch {
      return null
    }
  }

  async getAllVacations(userid) {
    try {
      //!!!!! BACKDOOR
      if (config.ENABLE_DEMO_ROUTES && userid === "BACKDOOR") {
        return await Vacation.find({}).exec()
      }

      const account = await Account.findById(userid).exec()
      return await Vacation.find({account: account.id}).exec()
    } catch {
      return []
    }
  }

  // Batch processing
  async clearAndUpdateAllVacation() {
    await Vacation.deleteMany({ startdate: {$lt: dateManager.getAdjustedCurrentTime()},
                                days: {$lte: 1}
                              }).exec()

    await Vacation.updateMany({ startdate: {$eq: dateManager.yesterdayISOString()},
                                days: {$gt: 1}
                              },
                              [{$set: {startdate: {$add: ["$startdate", 86400000]}, days: {$add: ["$days", -1]}}
                              }]).exec()
  }

}

module.exports = new VacationManager()
