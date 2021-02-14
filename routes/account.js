const express = require('express')
const router = express.Router()
const auth = require("./middleware/auth.js")
const config = require("../config/config")
const accountManager = require("../services/account.js")

// @TODO what is this messy code. Refactor it.
router.get("/:account_id", async function(req, res) {
  try {
    const user = await accountManager.getUserById(req.params.account_id)
    if (!user) {
      res.redirect("/")
    } else {
      loggedin_username = null
      if (req.user) {
        res.render("accounts/profile",{
          messages: {error: req.query.error},
          yearly_vacation_days: config.YEARLY_VACATION_DAYS,
          username: req.user.name,
          _username: user.name,
          _userid: user.id,
          _useremail: user.email,
          remaining_vacation: user.remaining_vacation
        })
      } else {
        res.render("accounts/profile",{
          messages: {error: req.query.error},
          yearly_vacation_days: config.YEARLY_VACATION_DAYS,
          _username: user.name,
          _userid: user.id,
          _useremail: user.email,
          remaining_vacation: user.remaining_vacation
        })
      }
    }
  } catch (e) {
    console.log(e)
    res.redirect("/")
  }

})

module.exports = router
