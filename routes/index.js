const express = require('express')
const router = express.Router()
const accountManager = require("../services/account.js")
const auth = require("./middleware/auth.js")
const config = require("../config/config")

// index route
router.get('/', auth.redirectOnAuthSuccess, async (req, res) => {
  res.render('index', {
    on_vacation_users: await accountManager.getUsersCurrentlyOnVacation()
  })
})

// dashboard route
router.get("/dashboard", auth.redirectOnAuthFail, async (req, res) => {
  res.render("accounts/dashboard",
  {messages: {error: req.query.error},
    yearly_vacation_days: config.YEARLY_VACATION_DAYS,
    username: req.user.name,
    userid: req.user.id,
    useremail: req.user.email,
    remaining_vacation: req.user.remaining_vacation,
    on_vacation_users: await accountManager.getUsersCurrentlyOnVacation()
  })
})

// login route
router.get('/login', auth.redirectOnAuthSuccess, (req, res) => {
  res.render('accounts/login')
})

// register route
router.get('/register', auth.redirectOnAuthSuccess, (req, res) => {
  res.render('accounts/register', {messages: {error: req.query.error}})
})

module.exports = router
