const path = require("path")
const express = require('express')
const router = express.Router()
const passport = require("passport")
const auth = require("../../middleware/auth.js")
const accountManager = require("../../../services/account.js")

router.get("/all", async function(req, res) {
  res.json(await accountManager.getAllUsers())
})

// get all users currently on vacation
router.get("/all/on_vacation", async function(req, res) {
  res.json(await accountManager.getUsersCurrentlyOnVacation())
})

// get account by id
router.get("/:account_id", async function(req, res) {
  res.json(await accountManager.getUserById(req.params.account_id))
})

// get account by name
router.get("/name/:account_name", async function(req, res) {
  res.json(await accountManager.getUserByName(req.params.account_name))
})


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
    res.redirect("/register/?error="+"username already exists")
  }
});

// logout and destroy current session
router.delete("/logout", function(req, res) {
  req.logOut()
  res.redirect("/login")
})

module.exports = router
