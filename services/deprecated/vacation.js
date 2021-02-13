const accountManager = require("./account")
const dateManager = require("./date")
const config = require("../config/config")

var vacation_list = [] // {username: String, mode:{"half","quarter","full"}, startDate:Datetime, days:Number, comment:String}

class VacationManager {
  constructor() {
  }

  applyVacation(user, req) {
    var mode = req.body.mode
    var startdate = req.body.startdate
    var startdatemillis = (new Date(req.body.startdate)).getTime()
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
    var toisostring = (date) => date.toISOString().split("T")[0]
    var existing_dates = this.getAllVacations(user)
    for (var i = 0; i < existing_dates.length; ++i) {
      var existingdate_obj = new Date(Date.parse(existing_dates[i].startdate))
      for (var j = 0; j < Math.ceil(existing_dates[i].days); ++j) {
        var startdate_obj = new Date(Date.parse(startdate))
        for (var k = 0; k < Math.ceil(days); ++k) {
          //console.log(toisostring(startdate_obj)+" vs "+toisostring(existingdate_obj))
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

  cancelVacation(user, req) {
    var id = req.body.id
    var username = user.name
    var userjson = accountManager.getUserByName(username)

    // check if user exists
    if (!user) {
      console.log("applyVacation(): user doesn't exist")
      return false
    }




    // remove vacation with requested id
    const index = vacation_list.findIndex((vacation) => vacation.id === id)
    if (index > -1) {
      // authentication check, with ADMIN BACKDOOR
      if (vacation_list[index].username !== username && user.name !== config.ADMIN_USERNAME) {
        console.log("cancelVacation(): authentication failed")
        return false
      }

      // cannot remove vacation that's already started
      if (vacation_list[index].startdate === dateManager.todayISOString()) {
        console.log("cancelVacation(): cannot cancel vacation that's already started")
        return false
      }

      accountManager.incrementRemainingVacation(userjson, vacation_list[index].days)
      vacation_list.splice(index, 1)
      return true
    }
    return false
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
    if (user.name === config.ADMIN_USERNAME) {
      return vacation_list
    }
    return vacation_list.filter(vacation => vacation.username == user.name)
  }

  // Batch processing
  clearAndUpdateAllVacation() {
    vacation_list = vacation_list.filter(vacation =>
                    (dateManager.getAdjustedCurrentTime() < new Date(vacation.startdate))
                    || (1 < vacation.days))

    for (var i = 0; i < vacation_list.length; ++i) {
      if (dateManager.yesterdayISOString() === vacation_list[i].startdate && vacation_list[i].days > 1) {
        var newdateobj = new Date(Date.parse(vacation_list[i].startdate))
        newdateobj.setDate(newdateobj.getDate() + 1)
        vacation_list[i].startdate = newdateobj.toISOString().split("T")[0]
        vacation_list[i].days -= 1
      }
    }
  }

}

module.exports = new VacationManager()
