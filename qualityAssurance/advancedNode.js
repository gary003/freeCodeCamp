"use strict"
require("dotenv").config()

const morgan = require("morgan")
const express = require("express")
const myDB = require("./connection")
const fccTesting = require("./freeCodeCamp/fcctesting.js")
const path = require("path")
const passport = require("passport")
const session = require("express-session")
const ObjectId = require("mongodb").ObjectId
const LocalStrategy = require("passport-local")

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

  passport.serializeUser((user, done) => {
    return done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    return ddb.findOne({ _id: new ObjectId(id) }, (err, doc) => {
      return done(null, doc)
    })
  })

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await ddb.findOne({ username })

      if (!user) {
        console.log("false user")
        return done(null, false)
      }
      if (password !== user.password) {
        console.log("- pass -")
        return done(null, false)
      }

      return done(null, user)
    })
  )

  app.route("/").get((req, res) => {
    const data = {
      title: "Connected to Database",
      message: "Please login",
      showLogin: true,
      showRegistration: true
    }

    return res.status(200).render("index", data)
  })

  const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    console.log("unOauth")

    return res.status(301).redirect("/")
  }

  app.post("/login", passport.authenticate("local", { failureRedirect: "/" }), (req, res) => {
    return res.status(304).redirect("/profile")
  })

  app.route("/profile").get(ensureAuthenticated, (req, res) => {
    console.log(req.user)
    return res.status(200).render("profile", { username: req.user.username, ...req.user })
  })

  app.route("/logout").get((req, res) => {
    req.logout()
    return res.status(301).redirect("/")
  })

  app.route("/register").post(
    async (req, res, next) => {
      const dbUser = await ddb.findOne({ username: req.body.username }).catch((err) => console.log(err))
      if (!!dbUser) {
        console.log("user already exists")
        return res.status(301).redirect("/")
      }

      const insertionNew = await ddb
        .insertOne({
          username: req.body.username,
          password: req.body.password
        })
        .catch((err) => console.log(err))

      if (!insertionNew.ops[0]) return res.status(301).redirect("/")

      return next(null, insertionNew.ops[0])
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res, next) => {
      return res.status(301).redirect("/profile")
    }
  )

  app.use((req, res, next) => {
    return res.status(404).type("text").send("Not Found")
  })
}).catch((e) => {
  app.route("/").get((req, res) => {
    return res.status(403).render("pug", { title: e, message: "Unable to login" })
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
