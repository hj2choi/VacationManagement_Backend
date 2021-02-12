const accountManager = require("./account")
const dateManager = require("./date")

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
    console.log(username)
    console.log(userjson)

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
      console.log(vacation_list)
      console.log(accountManager.getAllUsers())
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
      console.log("getAllVacations(): user doesn't exist")
      return []
    }
    return vacation_list.filter(vacation => vacation.username == user.username)
  }

  getAllVacations() {
    return vacation_list
  }


}

module.exports = new VacationManager()
