const path = require("path")
const express = require('express')
const router = express.Router()
const passport = require("passport")
const auth = require("../../middleware/auth.js")
const vacationManager = require("../../../services/vacation.js")

// add new vacation
router.post("/new", auth.redirectOnAuthFail, async function(req, res) {
  console.log("api/v1/vacation/new")
  console.log(req.body)
  if (vacationManager.applyVacation(req.user, req)) {
    res.redirect("/vacation")
  } else {
    res.redirect("/dashboard")
  }
});

module.exports = router
