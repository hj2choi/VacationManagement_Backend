const config = require("./config/config.json")
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")
const flash = require("express-flash")
const session = require("express-session")
const passport = require("passport")

const initializePassport = require("./config/passport_config")
initializePassport();

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout") // hook up express layouts, every single file will be put inside the layout file ex) beggining HTML, ending HTML, header, footer, etc
app.use(expressLayouts)
app.use(express.static("public")) // public folder, can be accessed from outside: ex) image file directories
app.use(bodyParser.urlencoded({ extended: false })) // parse url_encoded POST data to req.body
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {_expires: config.SESSION_TIMEOUT_MILLIS} // session timeout in ms
}))
app.use(passport.initialize())
app.use(passport.session())

const indexRouter = require("./routes/index")
const api_accountRouter = require("./routes/api/v"+config.API_VERSION+"/account")
app.use("/", indexRouter)
app.use("/api/v"+config.API_VERSION, api_accountRouter)

app.listen(process.env.PORT || config.DEV_PORT)
