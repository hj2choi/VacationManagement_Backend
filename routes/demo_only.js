const express = require('express')
const router = express.Router()
const accountManager = require("../services/account")
const vacationManager = require("../services/vacation")
const dateManager = require("../services/date")
const config = require("../config/config")

// backdoor route
router.get('/backdoor', (req, res) => {
  res.render('demo_only/backdoor', {
    servertimemillis: dateManager.getAdjustedTimeMillis(),
    accounts: accountManager.getAllUsers(),
    vacations: vacationManager.getAllVacations({name: config.ADMIN_USERNAME})
  })
})

// increment server time by day
router.put('/increment_servertime', (req, res) => {
  dateManager.incrementDay()
  vacationManager.clearAndUpdateAllVacation()
  res.redirect("/demo_only/backdoor")
})

module.exports = router
