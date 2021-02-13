const path = require("path")
const express = require('express')
const router = express.Router()
const passport = require("passport")
const auth = require("../../middleware/auth.js")
const vacationManager = require("../../../services/vacation.js")

// add new vacation
router.post("/new", auth.redirectOnAuthFail, async function(req, res) {
  if (vacationManager.applyVacation(req.user, req)) {
    res.redirect("/vacation")
  } else {
    res.redirect("/dashboard")
  }
});

// delete vacation with ID
router.delete("/cancel", auth.redirectOnAuthFail, async function(req, res) {
  if (vacationManager.cancelVacation(req.user, req)) {
    res.redirect("/vacation")
  } else {
    res.redirect("/vacation")
  }
});

module.exports = router
