const path = require("path")
const express = require('express')
const router = express.Router()
const passport = require("passport")
const auth = require("../../middleware/auth.js")
const accountManager = require("../../../services/account.js")

// login and authenticate with passport
router.post("/login", auth.redirectOnAuthSuccess, passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
  failureFlash: true
}))

// register new user
router.post("/register", auth.redirectOnAuthSuccess, async function(req, res) {
  if (await accountManager.registerUser(req)) {
    res.redirect("/login")
  }
  else {
    res.redirect("/register")
  }
});

// logout and destroy current session
router.delete("/logout", function(req, res) {
  req.logOut();
  res.redirect("/login");
})

module.exports = router
