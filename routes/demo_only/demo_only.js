const express = require('express')
const router = express.Router()
const accountManager = require("../../services/account")
const vacationManager = require("../../services/vacation")
const dateManager = require("../../services/date")
const config = require("../../config/config")

// backdoor route
router.get('/backdoor', async (req, res) => {
  res.render('demo_only/backdoor', {
    servertimemillis: dateManager.getAdjustedTimeMillis(),
    accounts: await accountManager.getAllUsers(),
    vacations: await vacationManager.getAllVacations("BACKDOOR")
  })
})

// increment server time by day
router.put('/increment_servertime', async (req, res) => {
  dateManager.incrementDay()

  vacationManager.clearAndUpdateAllVacation()

  const firstdayofyear = new Date()
  firstdayofyear.setMonth(0)
  firstdayofyear.setDate(1)
  firstdayofyear.setTime(firstdayofyear.getTime() - firstdayofyear.getTimezoneOffset() * 60000)
  if (dateManager.todayISOString() === firstdayofyear.toISOString().split("T")[0]) {
    await accountManager.resetAllUserRemainingVacation()
  }

  res.redirect("/demo_only/backdoor")
})

// reset server time date offset
router.put('/reset_dateoffset', async (req, res) => {
  dateManager.resetDayOffset()
  res.redirect("/demo_only/backdoor")
})

// reset user's remaining vacation value
router.put('/reset_user_remainingvacation', async (req, res) => {
  await accountManager.resetAllUserRemainingVacation()
  res.redirect("/demo_only/backdoor")
})

module.exports = router
