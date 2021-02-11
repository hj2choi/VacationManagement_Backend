if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout") // hook up express layouts, every single file will be put inside the layout file ex) beggining HTML, ending HTML, header, footer, etc
app.use(expressLayouts)
app.use(express.static("public")) // public folder, can be accessed from outside: ex) image file directories
app.use(bodyParser.urlencoded({ extended: false })) // public folder, can be accessed from outside: ex) image file directories

const indexRouter = require("./routes/index")
app.use("/", indexRouter)

app.listen(process.env.PORT || 3000)
