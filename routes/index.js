const express = require('express')
const router = express.Router()

// index route
router.get('/', (req, res) => {
  res.render('index')
})

// login route
router.get('/login', (req, res) => {
  res.render('login')
})

// register route
router.get('/register', (req, res) => {
  res.render('register')
})

module.exports = router
