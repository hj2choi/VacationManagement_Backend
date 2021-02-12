const express = require('express')
const router = express.Router()
const auth = require("./middleware/auth.js")

// index route
router.get('/', auth.redirectOnAuthSuccess, (req, res) => {
  res.render('index')
})

// dashboard route
router.get('/dashboard', auth.redirectOnAuthFail, (req, res) => {
  res.render('dashboard', {username: req.user.name})
})

// login route
router.get('/login', auth.redirectOnAuthSuccess, (req, res) => {
  res.render('login')
})

// register route
router.get('/register', auth.redirectOnAuthSuccess, (req, res) => {
  res.render('register')
})

module.exports = router
