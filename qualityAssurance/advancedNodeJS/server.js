"use strict"
require("dotenv").config()

const morgan = require("morgan")
const express = require("express")
const fccTesting = require("./freeCodeCamp/fcctesting.js")
const path = require("path")
const passport = require("passport")
const session = require("express-session")
const routes = require("./routes")
const auth = require("./auth")
const myDB = require("./connection")

const app = express()

app.use(morgan("dev"))

fccTesting(app) //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  })
)

app.set("views", path.join(__dirname, "views/pug"))
app.set("view engine", "pug")

app.use(passport.initialize())
app.use(passport.session())

myDB(async (client) => {
  const ddb = await client.db("myFirstDatabase").collection("people")
  routes(app, ddb)
  auth(app, ddb)
}).catch((e) => {
  app.route("/").get((req, res) => {
    return res.status(403).render("pug", { title: e, message: "Unable to login" })
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
