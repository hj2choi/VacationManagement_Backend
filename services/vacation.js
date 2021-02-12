const accountManager = require("./account")

vacation_list = [] // {username: String, mode:{"half","quarter","full"}, startDate:Datetime, days:Number, comment:String}

class VacationManager {
  constructor() {
  }

  applyVacation(user, mode, startDate = Date.Now(), days = 1, comment = "") {
    // check if user exists
    if (!user) {
      console.log("applyVacation(): user doesn't exist")
      return false
    }

    username = user.username
    userjson = accountManager.getUserByName(username)

    // check for start date.
    if (Date.Now() - startDate < 0) {
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
        usename: username,
        mode: mode,
        startDate: startDate,
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
