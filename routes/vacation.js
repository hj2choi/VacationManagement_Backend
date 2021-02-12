const express = require('express')
const router = express.Router()
const auth = require("./middleware/auth.js")

// all vacation route
router.get('/', auth.redirectOnAuthFail, (req, res) => {
  res.render('vacations/index', {username: req.user.name})
})

// apply for vacation route
router.get('/apply', auth.redirectOnAuthFail, (req, res) => {
  res.render('vacations/apply', {username: req.user.name})
})


module.exports = router
