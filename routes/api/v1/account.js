const path = require("path")
const express = require('express')
const router = express.Router()
const passport = require("passport")
const auth = require("../../../services/auth.js")

// login and authenticate with passport
router.post("/login", auth.redirectOnAuthSuccess, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))

// register new user
router.post("/register", auth.redirectOnAuthSuccess, async function(req, res) {
  if (await auth.registerUser(req)) {
    res.redirect("/")
  }
  else {
    res.redirect("/register")
  }
});

// logout and destroy current session
/*app.delete("/logout", function(req, res) {
  req.logOut();
  res.redirect("/login");
})*/

module.exports = router
