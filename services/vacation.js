const accountManager = require("./account")
const dateManager = require("./date")
const config = require("../config/config")

const vacation_list = [] // {username: String, mode:{"half","quarter","full"}, startDate:Datetime, days:Number, comment:String}

class VacationManager {
  constructor() {
  }

  applyVacation(user, req) {
    var mode = req.body.mode
    var startdate = req.body.startdate
    var startdatemillis = (new Date(req.body.startdate)).getMilliseconds()
    var days = req.body.days
    var comment = req.body.comment
    var username = user.name
    var userjson = accountManager.getUserByName(username)

    // check if user exists
    if (!user) {
      console.log("applyVacation(): user doesn't exist")
      return false
    }

    // check for start date.
    if (dateManager.getTimeMillis() - startdatemillis < 0 &&
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
    var toisostring = (date) => date.toISOString().split("T")[0]
    var existing_dates = this.getAllVacations(user)
    for (var i = 0; i < existing_dates.length; ++i) {
      var existingdate_obj = new Date(Date.parse(existing_dates[i].startdate))
      for (var j = 0; j < Math.ceil(existing_dates[i].days); ++j) {
        var startdate_obj = new Date(Date.parse(startdate))
        for (var k = 0; k < Math.ceil(days); ++k) {
          console.log(toisostring(startdate_obj)+" vs "+toisostring(existingdate_obj))
          if (toisostring(startdate_obj) === toisostring(existingdate_obj)) {
            console.log("applyVacation(): overlapping vacation dates")
            return false;
          }
          startdate_obj.setDate(startdate_obj.getDate()+1)
        }
        existingdate_obj.setDate(existingdate_obj.getDate()+1)
      }
    }

    // after validating every single fields, update user information and add new vacation to database.
    if (accountManager.decrementRemainingVacation(userjson, days)) {
      vacation_list.push({
        id: Date.now().toString(),
        username: username,
        mode: mode,
        startdate: startdate,
        days: days,
        comment: comment
      })
      return true
    }
    console.log("applyVacation(): not enough remaining vacation dates")
    return false
  }

  cancelVacation(user, vacation_id) {

  }

  getVacationById(id) {
    return vacation_list.find(vacation => vacation.id === id)
  }

  getAllVacations(user) {
    // check if user exists
    if (!user) {
      return []
    }
    //!!!!! ADMIN BACKDOOR
    if (user.name == config.ADMIN_USERNAME) {
      return vacation_list
    }
    return vacation_list.filter(vacation => vacation.username == user.name)
  }

}

module.exports = new VacationManager()
