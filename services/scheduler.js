const CronJob = require("cron").CronJob
const config = require("../config/config")
const accountManager = require("./account")
const vacationManager = require("./vacation")
const dateManager = require("./date")


function initScheduler() {
  var vacation_update = new CronJob("0 0 0 * * *", function () {
    console.log("DAILY SCHEDULED PROCESS: clearAndUpdateAllVacation()")
    vacationManager.clearAndUpdateAllVacation()
  }, null, true, config.TIMEZONE_LOCALE)

  var user_remainingvacation_reset = new CronJob("0 0 1 1 *", function () {
    console.log("YEARLY SCHEDULED PROCESS: resetAllUserRemainingVacation()")
    accountManager.resetAllUserRemainingVacation()
  }, null, true, config.TIMEZONE_LOCALE)
  
  vacationManager.clearAndUpdateAllVacation()
}

module.exports = initScheduler
