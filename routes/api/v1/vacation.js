const path = require("path")
const express = require('express')
const router = express.Router()
const passport = require("passport")
const auth = require("../../middleware/auth.js")
const vacationManager = require("../../../services/vacation.js")

// get vacation by id
router.get("/:vacation_id", async function(req, res) {
  res.json(await vacationManager.getVacationById(req.params.vacation_id))
})

// get all vacations by user
router.get("/user/:account_id", async function(req, res) {
  res.json(await vacationManager.getAllVacations(req.params.account_id))
})

// add new vacation
router.post("/new", auth.redirectOnAuthFail, async function(req, res) {
  if (await vacationManager.applyVacation(req.user, req)) {
    res.redirect("/vacation")
  } else {
    res.redirect("/dashboard")
  }
});

// delete vacation with ID
router.delete("/cancel", auth.redirectOnAuthFail, async function(req, res) {
  if (await vacationManager.cancelVacation(req.user, req)) {
    res.redirect("/vacation")
  } else {
    res.redirect("/vacation")
  }
});

module.exports = router
