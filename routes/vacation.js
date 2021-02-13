const express = require('express')
const router = express.Router()
const auth = require("./middleware/auth.js")
const my_date = require("../services/date.js")
const vacationManager = require("../services/vacation.js")
const config = require("../config/config")

// index route
router.get('/', auth.redirectOnAuthFail, (req, res) => {
  res.redirect("/vacation/manage")
})

// manage vacations route
router.get('/manage', auth.redirectOnAuthFail, async (req, res) => {
  res.render('vacations/manage', {
    todayISOString: my_date.todayISOString(),
    vacations: await vacationManager.getAllVacations(req.user.id)
  })
})

// apply for vacation route
router.get('/apply', auth.redirectOnAuthFail, (req, res) => {
  res.render('vacations/apply', {
    todayISOString: my_date.todayISOString(),
    remaining_vacation: req.user.remaining_vacation
  })
})


module.exports = router
